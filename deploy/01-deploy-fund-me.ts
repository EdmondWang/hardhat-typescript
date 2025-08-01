import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { developmentChains, networkConfig, LOCK_TIME, CONFIRMATIONS } from '../helper-hardhat-config';

const deployFunc: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
  run,
}: HardhatRuntimeEnvironment) {
  console.log('this is 01-deploy-fund-me function');

  const firstAcct = (await getNamedAccounts()).firstAccount;
  const secondAcct = (await getNamedAccounts()).secondAccount;
  console.log(`First Account: ${firstAcct}`);
  console.log(`Second Account: ${secondAcct}`);

  const { deploy } = deployments;

  let dataFeedAddr: string = '';
  let confirmations = 0;
  if (developmentChains.includes(network.name)) {
    dataFeedAddr = (await deployments.get('MockV3Aggregator')).address;
    confirmations = 0;
  } else {
    dataFeedAddr = networkConfig[network.config.chainId as number].ethUsdPriceFeed;
    confirmations = CONFIRMATIONS; // Wait for 5 block confirmation on sepolia testnet
  }

  const fundMe = await deploy('FundMe', {
    from: firstAcct,
    args: [LOCK_TIME, dataFeedAddr],
    log: true,
    waitConfirmations: confirmations,
  });

  console.log('network.config.chainId:', network.config.chainId);
  console.log('process.env.ETHERSCAN_API_TOKEN', process.env.ETHERSCAN_API_TOKEN);
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_TOKEN) {
    await run('verify:verify', {
      address: fundMe.address,
      constructorArguments: [LOCK_TIME, dataFeedAddr],
    });
  } else {
    console.log('Skipping verification on Etherscan for non-Sepolia network or missing API key');
  }
};

deployFunc.tags = ['all', 'fundMe'];

export default deployFunc;
