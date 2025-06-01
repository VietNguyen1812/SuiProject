# Sui Airdrop

Web application that checks airdrop eligibility and wallet status on Sui testnet. Allows users to connect to Sui wallet, view balance, transaction history, and detect suspicious activity in the wallet. Then when there is unusual activity, it will notify the user and ask them to create a new wallet and fill in the wallet address then Confirm. The project will automatically send the token reward to the new wallet.

- [React](https://react.dev/) as the UI framework
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [Vite](https://vitejs.dev/) for build tooling
- [Radix UI](https://www.radix-ui.com/) for pre-built UI components
- [ESLint](https://eslint.org/)
- [`@mysten/dapp-kit`](https://sdk.mystenlabs.com/dapp-kit) for connecting to
  wallets and loading data

## Requirements

- **Node.js**: Version 18 or higher ([Download Node.js](https://nodejs.org/)).
- **npm**: Comes with Node.js.

- **Vercel CLI**: To run locally and deploy ([Install Vercel CLI](#install)).

- **Sui Wallet**: Install Sui Wallet extension to connect to testnet.

- Browser: Chrome, Firefox, or Edge (MetaMask or Sui Wallet recommended).

## Starting your dApp

To install dependencies you can run

```bash
npm install
```

