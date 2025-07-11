import { task } from 'hardhat/config';
import { FundMe } from '../typechain-types/contracts/FundMe';

task('interactFundMe', 'interact with FundMe contract')
  .addParam('addr', 'fundMe contract address')
  .setAction(async (taskArgs, hre) => {
    const fundMeFactory = await hre.ethers.getContractFactory('FundMe');
    const fundMe = fundMeFactory.attach(taskArgs.addr) as FundMe;
    const [firstAcct, secondAcct] = await hre.ethers.getSigners();

    console.log('First Account');
    console.log(firstAcct);
    console.log('Second Account');
    console.log(secondAcct);

    // fund contract with first accounts
    let fundTx = await fundMe.fund({ value: hre.ethers.parseEther('0.0005') });
    await fundTx.wait();
    let balanceOfContract = await hre.ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of the contract is ${balanceOfContract}`);

    // fund contract with second accounts
    fundTx = await fundMe.connect(secondAcct).fund({ value: hre.ethers.parseEther('0.001') });
    await fundTx.wait();
    balanceOfContract = await hre.ethers.provider.getBalance(fundMe.target);
    console.log(`Balance of the contract is ${balanceOfContract}`);

    // check mapping
    const firstAcctBalanceInFundMe = await fundMe.fundersToAmount(firstAcct.address);
    const secondAcctBalanceInFundMe = await fundMe.fundersToAmount(secondAcct.address);

    console.log(`Balance of first account ${firstAcct.address} is ${firstAcctBalanceInFundMe}`);
    console.log(`Balance of second account ${secondAcct.address} is ${secondAcctBalanceInFundMe}`);
  });
