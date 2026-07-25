#!/usr/bin/env bash
# ==============================================================================
# Soroban Smart Contract Deployment Script — Live Poll
# Network: Stellar Testnet
# ==============================================================================

set -euo pipefail

NETWORK="testnet"
QUESTION="Is Soroban the future of smart contracts on Stellar?"
CONTRACT_DIR="contracts/poll-contract"

echo "🚀 Starting Soroban contract build and deployment workflow..."

# 1. Build WASM contract
echo "📦 Building WASM binary..."
cd "$CONTRACT_DIR"
stellar contract build

# 2. Optimize WASM binary
echo "⚡ Optimizing WASM binary..."
stellar contract optimize \
  --wasm target/wasm32v1-none/release/poll_contract.wasm

# 3. Deploy contract to Testnet
echo "🌐 Deploying contract to Stellar Testnet..."
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/poll_contract.optimized.wasm \
  --source-account deployer \
  --network "$NETWORK" \
  --alias poll_contract \
  -- \
  --question "$QUESTION")

echo "✅ Contract Deployed Successfully!"
echo "📍 Contract ID: $CONTRACT_ID"
echo "🔗 Stellar Expert Explorer: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
