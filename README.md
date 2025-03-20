# Solana Meme Token Minter - Setup and Usage Guide

## Overview

This application allows users to create Solana meme tokens with custom images uploaded to IPFS and provides functionality to remove mint and freeze authorities. The application charges a 0.1 SOL fee for token minting and a 0.05 SOL fee for authority removal.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Extract the code package to your desired location
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

### Configuration

1. **NFT.Storage API Key**:
   - Sign up for an account at [NFT.Storage](https://nft.storage)
   - Create an API key in your NFT.Storage dashboard
   - Open `src/components/token/TokenMintForm.tsx`
   - Replace `YOUR_NFT_STORAGE_API_KEY` with your actual API key:
     ```javascript
     const NFT_STORAGE_API_KEY = 'your_api_key_here';
     ```

2. **Fee Wallet Address**:
   - The fee wallet address is configured in `src/lib/solana/constants.ts`
   - It's already set to: `7hwrchSPCuBF6yGtFPx3f4g8Y5ymrkCPUoMDao39M4eZ`
   - You can change it to your own wallet address if needed

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
2. Open your browser and navigate to `http://localhost:3000`

### Building for Production

1. Build the application:
   ```bash
   npm run build
   # or
   pnpm build
   ```
2. Start the production server:
   ```bash
   npm start
   # or
   pnpm start
   ```

## Usage Instructions

### Connecting a Wallet

1. Click the "Select Wallet" button
2. Choose your preferred wallet provider
3. Approve the connection request in your wallet

### Creating a Meme Token

1. After connecting your wallet, select the "Create Token" tab
2. Fill in the token details:
   - **Token Name**: Enter a name for your token
   - **Token Symbol**: Enter a symbol for your token
   - **Decimals**: Set the number of decimal places (default is 9)
   - **Initial Supply**: Set the initial token supply
   - **Token Image**: Upload an image for your token (optional)
3. Click "Create Token"
4. Approve the transaction in your wallet (includes a 0.1 SOL fee)
5. Wait for the transaction to be confirmed
6. Once completed, you'll see the token mint address and IPFS metadata URL

### Removing Authority

1. After connecting your wallet, select the "Remove Authority" tab
2. Enter the token mint address for which you want to remove authorities
3. Click "Remove Authorities"
4. Approve the transaction in your wallet (includes a 0.05 SOL fee)
5. Wait for the transaction to be confirmed
6. Once completed, you'll see a success message

## Technical Details

### Project Structure

- `src/components/wallet/`: Wallet connection components
- `src/components/token/`: Token minting and authority removal components
- `src/lib/solana/`: Solana integration utilities
- `src/pages/`: Next.js pages
- `src/styles/`: CSS modules and global styles

### Key Features

1. **Wallet Integration**: Supports multiple Solana wallet providers
2. **IPFS Image Upload**: Uses NFT.Storage for decentralized image storage
3. **Token Minting**: Creates custom SPL tokens with specified parameters
4. **Authority Removal**: Removes mint and freeze authorities to make tokens immutable
5. **Fee Collection**: Automatically collects fees for minting and authority removal

### Customization

- **UI Styling**: Modify CSS modules in `src/styles/` and component-specific CSS files
- **Fee Amounts**: Adjust fee amounts in `src/lib/solana/constants.ts`
- **Supported Wallets**: Modify wallet adapters in `src/components/wallet/WalletContextProvider.tsx`

## Troubleshooting

- **Wallet Connection Issues**: Ensure your wallet is installed and configured for the correct Solana network
- **Transaction Failures**: Check that you have sufficient SOL balance for fees and gas
- **IPFS Upload Errors**: Verify your NFT.Storage API key is correct and has not expired
- **Build Errors**: Make sure all dependencies are installed correctly

## Dependencies

- Next.js: React framework
- @solana/web3.js: Solana JavaScript API
- @solana/wallet-adapter-*: Solana wallet connection utilities
- @solana/spl-token: Solana Program Library token utilities
- nft.storage: IPFS storage client for NFT metadata
