#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, Env,
};

fn setup() -> (Env, PayVaultContractClient<'static>) {
    let env = Env::default();
    let contract_id = env.register(PayVaultContract, ());
    let client = PayVaultContractClient::new(&env, &contract_id);
    (env, client)
}

#[test]
fn test_initial_state() {
    let (env, client) = setup();
    let merchant = Address::generate(&env);

    let state = client.get_state(&merchant);
    assert_eq!(state.principal, 0);
    assert_eq!(state.accrued_yield, 0);
    assert_eq!(state.total_harvested, 0);
}

#[test]
fn test_deposit_and_withdraw() {
    let (env, client) = setup();
    let merchant = Address::generate(&env);
    env.mock_all_auths();

    // Deposit 10,000 stroops
    let state = client.deposit(&merchant, &10_000);
    assert_eq!(state.principal, 10_000);

    // Withdraw 4,000 stroops
    let state = client.withdraw(&merchant, &4_000);
    assert_eq!(state.principal, 6_000);
}
