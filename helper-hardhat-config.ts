export const DECIMAL = 8;
export const INITIAL_ANSWER = 250000000000; // 2500 USD, because of 8 decimals
export const LOCK_TIME = 180;
export const CONFIRMATIONS = 5;

/**
 * local vs hardhat
 */
export const developmentChains = ['hardhat', 'local'];

export const networkConfig: Record<number, Record<string, any>> = {
  11155111: {
    name: 'sepolia',
    ethUsdPriceFeed: '0x694AA1769357215DE4FAC081bf1f309aDC325306', // Sepolia ETH/USD price feed address
  },
};
