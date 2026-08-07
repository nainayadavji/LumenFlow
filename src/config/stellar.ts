/**
 * Centralised network configuration.
 *
 * Values are read from Vite environment variables (see `.env.example`) with
 * sensible Testnet fallbacks so the app runs out of the box even without a
 * local `.env` file. This project is intentionally **Testnet only**.
 */

export const STELLAR_CONFIG = {
  horizonUrl:
    import.meta.env.VITE_HORIZON_URL ?? 'https://horizon-testnet.stellar.org',
  rpcUrl:
    import.meta.env.VITE_SOROBAN_RPC_URL ?? 'https://soroban-testnet.stellar.org',
  pollContractId:
    import.meta.env.VITE_POLL_CONTRACT_ID ?? 'CDZCTLFFN5SM6UC3Z46UPHV6BI2GYVJ65GCAOHNVSCMGBWX4GYD4UZXF',
  payvaultContractId:
    import.meta.env.VITE_PAYVAULT_CONTRACT_ID ?? 'CDJEGZUN4RVUKLMOS4OFTFQ44CEHKYKI44GG64DNOUZMO3MFVRZ4WKNF',
  networkPassphrase:
    import.meta.env.VITE_NETWORK_PASSPHRASE ??
    'Test SDF Network ; September 2015',
  explorerUrl:
    import.meta.env.VITE_EXPLORER_URL ??
    'https://stellar.expert/explorer/testnet',
  friendbotUrl:
    import.meta.env.VITE_FRIENDBOT_URL ?? 'https://friendbot.stellar.org',
} as const;

/** Human-friendly network label shown in the UI. */
export const NETWORK_LABEL = 'Stellar Testnet';

/** Build a Stellar Expert explorer link for a given transaction hash. */
export const explorerTxUrl = (hash: string): string =>
  `${STELLAR_CONFIG.explorerUrl}/tx/${hash}`;

/** Build a Stellar Expert explorer link for a given account address. */
export const explorerAccountUrl = (address: string): string =>
  `${STELLAR_CONFIG.explorerUrl}/account/${address}`;
