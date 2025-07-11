import { HardhatUserConfig } from 'hardhat/config';
import { config as envConfig } from '@chainlink/env-enc';
import '@nomicfoundation/hardhat-toolbox';
import './tasks';

envConfig();

const PRIVATE_KEY_1: string = process.env.PRIVATE_KEY_1 as string;
const PRIVATE_KEY_2: string = process.env.PRIVATE_KEY_2 as string;
const SEPOLIA_URL: string = process.env.SEPOLIA_URL as string;
const ETHERSCAN_API_TOKEN: string = process.env.ETHERSCAN_API_TOKEN as string;

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY_1, PRIVATE_KEY_2],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_TOKEN,
    },
  },
};

export default config;
