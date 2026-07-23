#![no_std]
//! # Live Poll — Soroban smart contract
//!
//! A minimal, production-shaped on-chain poll for the Stellar network. The poll
//! asks a single Yes/No question (set once, at deploy time, via the contract
//! constructor) and stores every vote on-chain.
//!
//! ## Rules
//! - Every vote is authenticated: the voter must sign the transaction
//!   (`voter.require_auth()`), so nobody can vote on another account's behalf.
//! - One vote per address. A second attempt fails with [`Error::AlreadyVoted`],
//!   which the frontend surfaces as a friendly "you already voted" message.
//!
//! ## Events
//! On every successful vote the contract publishes a `("vote", voter)` event
//! carrying the voter's choice and the updated tallies. The web app subscribes
//! to these via the RPC `getEvents` endpoint and refreshes the UI automatically.

use soroban_sdk::{
    contract, contracterror, contractevent, contractimpl, contracttype, Address, Env, String,
};

/// ~1 day of ledgers at the ~5s close time used on Testnet/Mainnet.
const DAY_IN_LEDGERS: u32 = 17_280;
/// How far ahead we push the "time to live" of storage entries when we touch
/// them, and the threshold below which we bother to bump. Keeps the poll and
/// its votes alive without archival for ~30 days of inactivity.
const BUMP_AMOUNT: u32 = 30 * DAY_IN_LEDGERS;
const BUMP_THRESHOLD: u32 = BUMP_AMOUNT - DAY_IN_LEDGERS;

/// Event published on every successful vote.
///
/// The `#[contractevent]` macro derives a strongly-typed event whose topics are
/// `("vote_cast", voter)` — the event name (`vote_cast`) is the snake_case of
/// the struct name and `voter` is flagged as a `#[topic]`. Off-chain listeners
/// (the web UI) filter on the `vote_cast` topic to react to new votes.
#[contractevent]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VoteCast {
    /// The account that voted (indexed topic).
    #[topic]
    pub voter: Address,
    /// Their choice: `true` = Yes, `false` = No.
    pub choice: bool,
    /// Updated Yes tally after this vote.
    pub yes: u32,
    /// Updated No tally after this vote.
    pub no: u32,
}

/// Errors returned to callers. The integer discriminants are what the RPC and
/// the frontend see, so they are kept stable and meaningful.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    /// The poll instance has no stored question (should never happen once the
    /// constructor has run — present as a defensive guard for reads).
    NotInitialized = 1,
    /// This address has already cast a vote in this poll.
    AlreadyVoted = 2,
}

/// Keys for the contract's storage map.
#[contracttype]
#[derive(Clone)]
enum DataKey {
    /// The poll question — `String`, instance storage.
    Question,
    /// Running tally of Yes votes — `u32`, instance storage.
    YesVotes,
    /// Running tally of No votes — `u32`, instance storage.
    NoVotes,
    /// Per-voter record: `Ballot(address) -> bool` (their choice). The presence
    /// of the key means the address has voted. Persistent storage.
    Ballot(Address),
}

/// The current tallies, returned to the frontend as `{ yes, no }`.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PollResults {
    pub yes: u32,
    pub no: u32,
}

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    /// Constructor — runs exactly once, at deploy time. Stores the poll
    /// question and initialises both tallies to zero.
    ///
    /// Invoked by the CLI as:
    /// `stellar contract deploy ... -- --question "Your question?"`
    pub fn __constructor(env: Env, question: String) {
        let storage = env.storage().instance();
        storage.set(&DataKey::Question, &question);
        storage.set(&DataKey::YesVotes, &0u32);
        storage.set(&DataKey::NoVotes, &0u32);
        storage.extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);
    }

    /// Cast a vote. `choice` is `true` for Yes, `false` for No.
    ///
    /// Requires the voter's signature and rejects a second vote from the same
    /// address with [`Error::AlreadyVoted`]. On success, publishes a `vote`
    /// event and returns the updated tallies.
    pub fn vote(env: Env, voter: Address, choice: bool) -> Result<PollResults, Error> {
        // The voter must authorise this call — this is what makes the vote
        // trustworthy and ties it to a real Stellar account.
        voter.require_auth();

        let storage = env.storage();

        // Enforce one vote per address.
        let ballot_key = DataKey::Ballot(voter.clone());
        if storage.persistent().has(&ballot_key) {
            return Err(Error::AlreadyVoted);
        }

        // The instance must be initialised (constructor guarantees this).
        if !storage.instance().has(&DataKey::Question) {
            return Err(Error::NotInitialized);
        }

        // Record the ballot and update the matching tally.
        storage.persistent().set(&ballot_key, &choice);
        storage
            .persistent()
            .extend_ttl(&ballot_key, BUMP_THRESHOLD, BUMP_AMOUNT);

        let mut results = Self::read_results(&env);
        if choice {
            results.yes += 1;
            storage.instance().set(&DataKey::YesVotes, &results.yes);
        } else {
            results.no += 1;
            storage.instance().set(&DataKey::NoVotes, &results.no);
        }
        storage.instance().extend_ttl(BUMP_THRESHOLD, BUMP_AMOUNT);

        // Publish an event so off-chain listeners (the web UI) can react.
        // Topics: ("vote_cast", voter) — data: { choice, yes, no }.
        VoteCast {
            voter,
            choice,
            yes: results.yes,
            no: results.no,
        }
        .publish(&env);

        Ok(results)
    }

    /// Read the poll question.
    pub fn get_question(env: Env) -> Result<String, Error> {
        env.storage()
            .instance()
            .get(&DataKey::Question)
            .ok_or(Error::NotInitialized)
    }

    /// Read the current tallies as `{ yes, no }`.
    pub fn get_results(env: Env) -> PollResults {
        Self::read_results(&env)
    }

    /// Whether `voter` has already cast a vote in this poll.
    pub fn has_voted(env: Env, voter: Address) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Ballot(voter))
    }

    /// The choice `voter` made, or `None` if they have not voted yet.
    /// `Some(true)` = Yes, `Some(false)` = No.
    pub fn get_vote(env: Env, voter: Address) -> Option<bool> {
        env.storage().persistent().get(&DataKey::Ballot(voter))
    }

    /// Internal: load both tallies, defaulting to zero.
    fn read_results(env: &Env) -> PollResults {
        let storage = env.storage().instance();
        PollResults {
            yes: storage.get(&DataKey::YesVotes).unwrap_or(0),
            no: storage.get(&DataKey::NoVotes).unwrap_or(0),
        }
    }
}

mod test;
