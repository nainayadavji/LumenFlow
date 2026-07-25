import * as StellarSdk from '@stellar/stellar-sdk';
import { STELLAR_CONFIG } from '@/config/stellar';

export interface PollResults {
  yes: number;
  no: number;
}

export interface VoteCastEvent {
  voter: string;
  choice: boolean;
  yes: number;
  no: number;
  ledger: number;
}

const rpcServer = new StellarSdk.rpc.Server(STELLAR_CONFIG.rpcUrl);
const horizonServer = new StellarSdk.Horizon.Server(STELLAR_CONFIG.horizonUrl);

/**
 * Fetch the poll question from the smart contract.
 */
export async function fetchPollQuestion(): Promise<string> {
  try {
    const contract = new StellarSdk.Contract(STELLAR_CONFIG.pollContractId);
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0'),
      {
        fee: '100',
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      }
    )
      .addOperation(contract.call('get_question'))
      .setTimeout(30)
      .build();

    const sim = await rpcServer.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return StellarSdk.scValToNative(sim.result.retval) as string;
    }
  } catch (err) {
    console.warn('Simulation for get_question failed, falling back to default question:', err);
  }
  return 'Is Soroban the future of smart contracts on Stellar?';
}

/**
 * Fetch current poll results (Yes / No tallies) from smart contract.
 */
export async function fetchPollResults(): Promise<PollResults> {
  try {
    const contract = new StellarSdk.Contract(STELLAR_CONFIG.pollContractId);
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0'),
      {
        fee: '100',
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      }
    )
      .addOperation(contract.call('get_results'))
      .setTimeout(30)
      .build();

    const sim = await rpcServer.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      const native = StellarSdk.scValToNative(sim.result.retval);
      return {
        yes: Number(native.yes ?? 0),
        no: Number(native.no ?? 0),
      };
    }
  } catch (err) {
    console.warn('Failed to fetch poll results via RPC:', err);
  }
  return { yes: 0, no: 0 };
}

/**
 * Check if a voter address has already cast a vote.
 */
export async function checkHasVoted(voterAddress: string): Promise<boolean> {
  if (!voterAddress) return false;
  try {
    const contract = new StellarSdk.Contract(STELLAR_CONFIG.pollContractId);
    const voterScVal = new StellarSdk.Address(voterAddress).toScVal();
    const tx = new StellarSdk.TransactionBuilder(
      new StellarSdk.Account('GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF', '0'),
      {
        fee: '100',
        networkPassphrase: STELLAR_CONFIG.networkPassphrase,
      }
    )
      .addOperation(contract.call('has_voted', voterScVal))
      .setTimeout(30)
      .build();

    const sim = await rpcServer.simulateTransaction(tx);
    if (StellarSdk.rpc.Api.isSimulationSuccess(sim) && sim.result?.retval) {
      return Boolean(StellarSdk.scValToNative(sim.result.retval));
    }
  } catch (err) {
    console.warn('Failed to check has_voted:', err);
  }
  return false;
}

/**
 * Build unsigned vote transaction to be signed by the connected wallet.
 */
export async function buildVoteTransaction(voterAddress: string, choice: boolean): Promise<string> {
  let account: StellarSdk.Account;
  try {
    account = await rpcServer.getAccount(voterAddress);
  } catch {
    // If account not found in RPC, try horizon or construct basic account
    try {
      const hAcc = await horizonServer.loadAccount(voterAddress);
      account = new StellarSdk.Account(voterAddress, hAcc.sequenceNumber());
    } catch {
      throw new Error('Account unfunded or not found on Stellar Testnet. Please fund with Friendbot first.');
    }
  }

  const contract = new StellarSdk.Contract(STELLAR_CONFIG.pollContractId);
  const voterScVal = new StellarSdk.Address(voterAddress).toScVal();
  const choiceScVal = StellarSdk.nativeToScVal(choice, { type: 'bool' });

  const rawTx = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: STELLAR_CONFIG.networkPassphrase,
  })
    .addOperation(contract.call('vote', voterScVal, choiceScVal))
    .setTimeout(180)
    .build();

  // Prepare transaction (simulates footprint, auth, and fee limits)
  try {
    const preparedTx = await rpcServer.prepareTransaction(rawTx);
    return preparedTx.toXDR();
  } catch (prepErr) {
    const prepMsg = prepErr instanceof Error ? prepErr.message : String(prepErr);
    if (prepMsg.includes('Error(Contract, #2)') || prepMsg.includes('#2') || prepMsg.includes('AlreadyVoted')) {
      throw new Error('Already Voted: Your address has already cast a vote in this poll.');
    }
    throw prepErr;
  }
}

/**
 * Submit signed transaction XDR to Soroban RPC and poll for completion.
 */
export async function submitVoteTransaction(signedXdr: string): Promise<{ hash: string; results?: PollResults }> {
  const transaction = StellarSdk.TransactionBuilder.fromXDR(
    signedXdr,
    STELLAR_CONFIG.networkPassphrase
  ) as StellarSdk.Transaction;

  const sendResponse = await rpcServer.sendTransaction(transaction);

  if (sendResponse.status === 'ERROR') {
    const errorStr = JSON.stringify(sendResponse.errorResult || sendResponse);
    if (errorStr.includes('AlreadyVoted') || errorStr.includes('Error(Contract, #2)') || errorStr.includes('#2')) {
      throw new Error('AlreadyVoted: You have already cast a vote in this poll.');
    }
    throw new Error(`Transaction rejected by network: ${sendResponse.errorResult || 'Unknown error'}`);
  }

  const hash = sendResponse.hash;

  // Poll for completion (retry loop)
  let attempts = 0;
  while (attempts < 15) {
    await new Promise((res) => setTimeout(res, 1000));
    attempts++;

    const statusResponse = await rpcServer.getTransaction(hash);

    if (statusResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.SUCCESS) {
      let results: PollResults | undefined;
      if (statusResponse.returnValue) {
        try {
          const native = StellarSdk.scValToNative(statusResponse.returnValue);
          results = {
            yes: Number(native.yes ?? 0),
            no: Number(native.no ?? 0),
          };
        } catch {
          // ignore parsing error if return shape differs
        }
      }
      return { hash, results };
    }

    if (statusResponse.status === StellarSdk.rpc.Api.GetTransactionStatus.FAILED) {
      const errDetail = JSON.stringify(statusResponse.resultXdr || '');
      if (errDetail.includes('AlreadyVoted') || errDetail.includes('#2')) {
        throw new Error('AlreadyVoted: You have already cast a vote in this poll.');
      }
      throw new Error(`Transaction execution failed on ledger ${statusResponse.latestLedger}`);
    }
  }

  throw new Error('Transaction submission timed out waiting for ledger confirmation.');
}

/**
 * Query recent VoteCast events from the contract via Soroban RPC.
 */
export async function fetchVoteEvents(): Promise<VoteCastEvent[]> {
  try {
    const latestLedgerResp = await rpcServer.getLatestLedger();
    const startLedger = Math.max(1, latestLedgerResp.sequence - 1000);

    const eventsResp = await rpcServer.getEvents({
      startLedger,
      filters: [
        {
          type: 'contract',
          contractIds: [STELLAR_CONFIG.pollContractId],
        },
      ],
      limit: 20,
    });

    const events: VoteCastEvent[] = [];
    for (const item of eventsResp.events || []) {
      try {
        const voterNative = StellarSdk.scValToNative(item.topic[1]);
        const valueNative = StellarSdk.scValToNative(item.value);
        events.push({
          voter: String(voterNative),
          choice: Boolean(valueNative.choice),
          yes: Number(valueNative.yes),
          no: Number(valueNative.no),
          ledger: item.ledger,
        });
      } catch {
        // Skip unparseable events
      }
    }
    return events;
  } catch (err) {
    console.warn('Failed to fetch contract events:', err);
    return [];
  }
}
