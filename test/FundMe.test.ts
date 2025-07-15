import hre from 'hardhat';
import { expect } from 'chai';

describe('test fundme contract', () => {
  it('owner should be msg.sender', async () => {
    const fundMeFactory = await hre.ethers.getContractFactory('FundMe');
    const fundMe = await fundMeFactory.deploy(180);

    await fundMe.waitForDeployment();

    const [firstAcct] = await hre.ethers.getSigners();

    expect(firstAcct.address).to.equal(await fundMe.owner());
  });
});
