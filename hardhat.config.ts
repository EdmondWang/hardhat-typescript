import { HardhatUserConfig } from 'hardhat/config';
import { config as envConfig } from '@chainlink/env-enc';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import './tasks';

envConfig();

const PRIVATE_KEY_1: string = process.env.PRIVATE_KEY_1 as string;
const PRIVATE_KEY_2: string = process.env.PRIVATE_KEY_2 as string;
const SEPOLIA_URL: string = process.env.SEPOLIA_URL as string;
const ETHERSCAN_API_TOKEN: string = process.env.ETHERSCAN_API_TOKEN as string;

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY_1, PRIVATE_KEY_2],
      chainId: 11155111, // The network identifier to sepolia testnet
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_TOKEN,
    },
  },
  namedAccounts: {
    firstAccount: {
      default: 0, // index of in the array of "networks.sepolia.accounts"
    },
    secondAccount: {
      default: 1,
    },
  },
};

export default config;
