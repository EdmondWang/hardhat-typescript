import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const deployFunc: DeployFunction = async function ({ getNamedAccounts, deployments }: HardhatRuntimeEnvironment) {
  const firstAcct = (await getNamedAccounts()).firstAccount;
  const secondAcct = (await getNamedAccounts()).secondAccount;
  console.log('this is a deploy function');
  console.log(`First Account: ${firstAcct}`);
  console.log(`Second Account: ${secondAcct}`);

  const { deploy } = deployments;
  await deploy('FundMe', {
    from: firstAcct,
    args: [180],
    log: true,
  });
};

deployFunc.tags = ['all', 'fundMe'];

export default deployFunc;
