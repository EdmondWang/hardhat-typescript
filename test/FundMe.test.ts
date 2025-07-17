import hre from 'hardhat';
import { expect } from 'chai';
import { FundMe } from '../typechain-types/contracts/FundMe';

describe('test fundme contract', () => {
  it('owner should be msg.sender', async () => {
    const fundMeFactory = await hre.ethers.getContractFactory('FundMe');
    const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();

    const [firstAcct] = await hre.ethers.getSigners();
    expect(firstAcct.address).to.equal(await fundMe.owner());
  });

  it('data feed should be assigned correctly', async () => {
    const fundMeFactory = await hre.ethers.getContractFactory('FundMe');
    const fundMe = (await fundMeFactory.deploy(180)) as unknown as FundMe;
    await fundMe.waitForDeployment();
    expect(await fundMe.dataFeed());
  });
});
