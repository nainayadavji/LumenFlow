#![cfg(test)]
//! Unit tests for the Live Poll contract, run with `cargo test`.
//!
//! These exercise the contract in-process against the Soroban test host — no
//! network required — and cover the full behaviour the frontend relies on:
//! initialisation, voting Yes/No, tallying, one-vote-per-address enforcement,
//! authorisation, and event emission.

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Events},
    Address, Env, Event, String,
};

/// Deploy a fresh poll with the given question and return the test env,
/// contract client, and the constructor argument for convenience.
fn setup<'a>(question: &str) -> (Env, PollContractClient<'a>) {
    let env = Env::default();
    let q = String::from_str(&env, question);
    // `deploy_v2` runs the contract's `__constructor` with the given args.
    let contract_id = env.register(PollContract, (q,));
    let client = PollContractClient::new(&env, &contract_id);
    (env, client)
}

#[test]
fn fresh_poll_has_question_and_zero_tallies() {
    let (env, client) = setup("Do you like Stellar?");

    assert_eq!(
        client.get_question(),
        String::from_str(&env, "Do you like Stellar?")
    );

    let results = client.get_results();
    assert_eq!(results.yes, 0);
    assert_eq!(results.no, 0);
}

#[test]
fn vote_yes_increments_yes_tally() {
    let (env, client) = setup("Yes or no?");
    let voter = Address::generate(&env);

    // `mock_all_auths` satisfies `require_auth()` for the generated address.
    env.mock_all_auths();
    let results = client.vote(&voter, &true);

    assert_eq!(results.yes, 1);
    assert_eq!(results.no, 0);
    assert!(client.has_voted(&voter));
    assert_eq!(client.get_vote(&voter), Some(true));
}

#[test]
fn vote_no_increments_no_tally() {
    let (env, client) = setup("Yes or no?");
    let voter = Address::generate(&env);

    env.mock_all_auths();
    let results = client.vote(&voter, &false);

    assert_eq!(results.yes, 0);
    assert_eq!(results.no, 1);
    assert_eq!(client.get_vote(&voter), Some(false));
}

#[test]
fn multiple_distinct_voters_are_all_counted() {
    let (env, client) = setup("Poll");
    env.mock_all_auths();

    let a = Address::generate(&env);
    let b = Address::generate(&env);
    let c = Address::generate(&env);

    client.vote(&a, &true);
    client.vote(&b, &true);
    client.vote(&c, &false);

    let results = client.get_results();
    assert_eq!(results.yes, 2);
    assert_eq!(results.no, 1);
}

#[test]
fn double_vote_is_rejected() {
    let (env, client) = setup("Poll");
    let voter = Address::generate(&env);
    env.mock_all_auths();

    client.vote(&voter, &true);

    // `try_vote` returns a Result instead of panicking, so we can assert on the
    // specific contract error.
    let second = client.try_vote(&voter, &false);
    assert_eq!(second, Err(Ok(Error::AlreadyVoted)));

    // Tally is unchanged and the original choice stands.
    let results = client.get_results();
    assert_eq!(results.yes, 1);
    assert_eq!(results.no, 0);
    assert_eq!(client.get_vote(&voter), Some(true));
}

#[test]
fn vote_requires_voter_authorization() {
    let (env, client) = setup("Poll");
    let voter = Address::generate(&env);

    // No `mock_all_auths()` here: the required `voter.require_auth()` has not
    // been authorised, so the invocation must fail.
    let result = client.try_vote(&voter, &true);
    assert!(result.is_err());
}

#[test]
fn vote_records_the_correct_authorization() {
    let (env, client) = setup("Poll");
    let voter = Address::generate(&env);
    env.mock_all_auths();

    client.vote(&voter, &true);

    // The most recent auth should be `voter` authorising this contract's
    // `vote` function with (voter, choice) args.
    let auths = env.auths();
    assert_eq!(auths.len(), 1);
    let (who, _invocation) = &auths[0];
    assert_eq!(who, &voter);
}

#[test]
fn vote_emits_event_with_choice_and_tallies() {
    let (env, client) = setup("Poll");
    let voter = Address::generate(&env);
    env.mock_all_auths();

    client.vote(&voter, &true);

    // The contract should have published exactly one event.
    let events = env.events().all();
    assert_eq!(events.events().len(), 1);

    // Compare against the strongly-typed `VoteCast` event in its XDR form.
    // Topics: ("vote_cast", voter) — data: { choice: true, yes: 1, no: 0 }.
    let expected = VoteCast {
        voter: voter.clone(),
        choice: true,
        yes: 1,
        no: 0,
    }
    .to_xdr(&env, &client.address);
    assert_eq!(events.events(), [expected]);
}
