import { task } from 'hardhat/config';
import { Addressable } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const WINDOW_SPAN = '300';

async function verifyFundMe(hre: HardhatRuntimeEnvironment, fundMeAddr: string | Addressable, args: string[]) {
  await hre.run('verify:verify', {
    address: fundMeAddr,
    constructorArguments: args,
  });
}

task('deployFundMe', 'deploy FundMe contract').setAction(async (taskArgs, hre) => {
  // create factory
  const fundMeFactory = await hre.ethers.getContractFactory('FundMe');
  console.log('contract deploying');

  // deploy contract via factory
  const fundMe = await fundMeFactory.deploy(WINDOW_SPAN); // 5 minutes

  // wait for verification, broadcast, into block chain
  await fundMe.waitForDeployment();
  console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`);

  // verify fundMe
  if (hre.network.config.chainId === 11155111 && process.env.ETHERSCAN_API_TOKEN) {
    console.log('Waiting for 5 confirmations');
    const deploymentTx = fundMe.deploymentTransaction();
    if (deploymentTx) {
      await deploymentTx.wait(5);
    } else {
      throw new Error('Deployment transaction is null.');
    }
    await verifyFundMe(hre, fundMe.target, [WINDOW_SPAN]);
  } else {
    console.log('verification skipped');
  }
});
