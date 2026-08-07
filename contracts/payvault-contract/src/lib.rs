#![no_std]
use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, Address, Env,
};

const DAY_IN_LEDGERS: u32 = 17_280;
const BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const BUMP_THRESHOLD: u32 = BUMP_AMOUNT - DAY_IN_LEDGERS;

/// Rate of yield generation per ledger sequence (100 stroops per 1M stroops deposited per ledger)
const YIELD_RATE_PER_LEDGER: i128 = 10; 
const YIELD_PRECISION: i128 = 1_000_000;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InsufficientBalance = 1,
    NegativeAmount = 2,
    ArithmeticError = 3,
}

#[contracttype]
#[derive(Clone)]
enum DataKey {
    Principal(Address),
    LastTouchLedger(Address),
    TotalYield(Address),
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VaultState {
    pub principal: i128,
    pub accrued_yield: i128,
    pub total_harvested: i128,
    pub last_touch_ledger: u32,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VaultDeposit {
    #[topic]
    pub merchant: Address,
    pub amount: i128,
    pub ledger: u32,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VaultWithdrawal {
    #[topic]
    pub merchant: Address,
    pub amount: i128,
    pub ledger: u32,
}

#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct YieldHarvested {
    #[topic]
    pub merchant: Address,
    pub amount: i128,
    pub ledger: u32,
}

#[contract]
pub struct PayVaultContract;

#[contractimpl]
impl PayVaultContract {
    /// Deposit funds into the merchant register vault
    pub fn deposit(env: Env, merchant: Address, amount: i128) -> Result<VaultState, Error> {
        merchant.require_auth();
        if amount <= 0 {
            return Err(Error::NegativeAmount);
        }

        let current_ledger = env.ledger().sequence();
        let mut state = Self::get_state(env.clone(), merchant.clone());

        // Update principal with accrued yield before adding new deposit
        let accrued = state.accrued_yield;
        state.principal = state.principal.checked_add(accrued).ok_or(Error::ArithmeticError)?;
        state.total_harvested = state.total_harvested.checked_add(accrued).ok_or(Error::ArithmeticError)?;

        // Add new deposit amount
        state.principal = state.principal.checked_add(amount).ok_or(Error::ArithmeticError)?;
        state.last_touch_ledger = current_ledger;

        let storage = env.storage().persistent();
        storage.set(&DataKey::Principal(merchant.clone()), &state.principal);
        storage.set(&DataKey::LastTouchLedger(merchant.clone()), &current_ledger);
        storage.set(&DataKey::TotalYield(merchant.clone()), &state.total_harvested);

        // Bump TTL to keep record active
        storage.bump(&DataKey::Principal(merchant.clone()), BUMP_THRESHOLD, BUMP_AMOUNT);
        storage.bump(&DataKey::LastTouchLedger(merchant.clone()), BUMP_THRESHOLD, BUMP_AMOUNT);
        storage.bump(&DataKey::TotalYield(merchant.clone()), BUMP_THRESHOLD, BUMP_AMOUNT);

        env.events().publish(
            (env.clone(), VaultDeposit { merchant: merchant.clone(), amount, ledger: current_ledger }),
            amount,
        );

        Ok(VaultState {
            principal: state.principal,
            accrued_yield: 0,
            total_harvested: state.total_harvested,
            last_touch_ledger: current_ledger,
        })
    }

    /// Withdraw funds (principal + harvested yield) from the vault
    pub fn withdraw(env: Env, merchant: Address, amount: i128) -> Result<VaultState, Error> {
        merchant.require_auth();
        if amount <= 0 {
            return Err(Error::NegativeAmount);
        }

        let current_ledger = env.ledger().sequence();
        let mut state = Self::get_state(env.clone(), merchant.clone());

        // Apply accrued yield first
        let accrued = state.accrued_yield;
        state.principal = state.principal.checked_add(accrued).ok_or(Error::ArithmeticError)?;
        state.total_harvested = state.total_harvested.checked_add(accrued).ok_or(Error::ArithmeticError)?;

        if state.principal < amount {
            return Err(Error::InsufficientBalance);
        }

        state.principal = state.principal.checked_sub(amount).ok_or(Error::ArithmeticError)?;
        state.last_touch_ledger = current_ledger;

        let storage = env.storage().persistent();
        storage.set(&DataKey::Principal(merchant.clone()), &state.principal);
        storage.set(&DataKey::LastTouchLedger(merchant.clone()), &current_ledger);
        storage.set(&DataKey::TotalYield(merchant.clone()), &state.total_harvested);

        env.events().publish(
            (env.clone(), VaultWithdrawal { merchant: merchant.clone(), amount, ledger: current_ledger }),
            amount,
        );

        Ok(VaultState {
            principal: state.principal,
            accrued_yield: 0,
            total_harvested: state.total_harvested,
            last_touch_ledger: current_ledger,
        })
    }

    /// Harvest accrued yield without withdrawing main principal
    pub fn harvest(env: Env, merchant: Address) -> Result<VaultState, Error> {
        merchant.require_auth();
        let current_ledger = env.ledger().sequence();
        let mut state = Self::get_state(env.clone(), merchant.clone());
        let accrued = state.accrued_yield;

        if accrued > 0 {
            state.principal = state.principal.checked_add(accrued).ok_or(Error::ArithmeticError)?;
            state.total_harvested = state.total_harvested.checked_add(accrued).ok_or(Error::ArithmeticError)?;
            state.last_touch_ledger = current_ledger;

            let storage = env.storage().persistent();
            storage.set(&DataKey::Principal(merchant.clone()), &state.principal);
            storage.set(&DataKey::LastTouchLedger(merchant.clone()), &current_ledger);
            storage.set(&DataKey::TotalYield(merchant.clone()), &state.total_harvested);

            env.events().publish(
                (env.clone(), YieldHarvested { merchant: merchant.clone(), amount: accrued, ledger: current_ledger }),
                accrued,
            );
        }

        Ok(VaultState {
            principal: state.principal,
            accrued_yield: 0,
            total_harvested: state.total_harvested,
            last_touch_ledger: current_ledger,
        })
    }

    /// Read full vault state for a merchant
    pub fn get_state(env: Env, merchant: Address) -> VaultState {
        let storage = env.storage().persistent();
        let principal: i128 = storage.get(&DataKey::Principal(merchant.clone())).unwrap_or(0i128);
        let last_touch: u32 = storage.get(&DataKey::LastTouchLedger(merchant.clone())).unwrap_or(env.ledger().sequence());
        let total_harvested: i128 = storage.get(&DataKey::TotalYield(merchant.clone())).unwrap_or(0i128);

        let current_ledger = env.ledger().sequence();
        let mut accrued_yield = 0i128;

        if current_ledger > last_touch && principal > 0 {
            let diff = (current_ledger - last_touch) as i128;
            accrued_yield = (principal * diff * YIELD_RATE_PER_LEDGER) / YIELD_PRECISION;
        }

        VaultState {
            principal,
            accrued_yield,
            total_harvested,
            last_touch_ledger: last_touch,
        }
    }
}
