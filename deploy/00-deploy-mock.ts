import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { DECIMAL, developmentChains, INITIAL_ANSWER } from '../helper-hardhat-config';

const deployFunc: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  console.log('this is 00-deploy-mock function');

  if (developmentChains.includes(network.name)) {
    console.log('Deploying MockV3Aggregator...');
    const firstAcct = (await getNamedAccounts()).firstAccount;

    const { deploy } = deployments;
    await deploy('MockV3Aggregator', {
      from: firstAcct,
      args: [DECIMAL, INITIAL_ANSWER],
      log: true,
    });
  } else {
    console.log('MockV3Aggregator deployment skipped for non-development chain');
  }
};

deployFunc.tags = ['all', 'mock'];

export default deployFunc;
