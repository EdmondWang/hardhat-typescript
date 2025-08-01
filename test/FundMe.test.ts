import { ethers, deployments, getNamedAccounts } from 'hardhat'; // Attention here ethers object is the one from hardhat
import { expect } from 'chai';
import { FundMe } from '../typechain-types/contracts/FundMe';
import { Address } from 'hardhat-deploy/types';
import { mine, time } from '@nomicfoundation/hardhat-network-helpers';

describe('test fundme contract', () => {
  let fundMe: FundMe;
  let fundMeSecondAcct: FundMe;
  let firstAcct: Address;
  let secondAcct: Address;
  let mockV3Aggregator: any;

  beforeEach(async () => {
    await deployments.fixture(['all']); // all is tag
    firstAcct = (await getNamedAccounts()).firstAccount;
    secondAcct = (await getNamedAccounts()).secondAccount;
    const fundMeDeployment = await deployments.get('FundMe');
    fundMe = await ethers.getContractAt('FundMe', fundMeDeployment.address);
    fundMeSecondAcct = await ethers.getContract('FundMe', secondAcct);
    mockV3Aggregator = await deployments.get('MockV3Aggregator');
  });

  it('owner should be msg.sender', async () => {
    // !! Below deployment related code is no more needed after introduce the package "hardhat-deploy"
    // const fundMeFactory = await hre.ethers.getContractFactory('FundMe');
    // const fundMe = await fundMeFactory.deploy(180);
    await fundMe.waitForDeployment();
    // const [firstAcct] = await ethers.getSigners();
    expect(firstAcct).to.equal(await fundMe.owner());
  });

  it('data feed should be assigned correctly', async () => {
    // const fundMeFactory = await ethers.getContractFactory('FundMe');
    // const fundMe = (await fundMeFactory.deploy(180)) as unknown as FundMe;
    await fundMe.waitForDeployment();
    expect(await fundMe.dataFeed()).to.equal(mockV3Aggregator.address);
  });

  describe('fund', () => {
    it('should fund failed if value greater than minimum, but window is closed', async () => {
      // make sure the window is closed
      await time.increase(200);
      await mine();

      await expect(fundMe.fund({ value: ethers.parseEther('2') })).to.be.revertedWith('Window is closed');
    });

    it('should failed to fund if value is less then minimum value', async () => {
      await expect(fundMe.fund({ value: ethers.parseEther('0.0003') })).to.be.revertedWith('Send more ETH');
    });

    it('should fund with success', async () => {
      await fundMe.fund({ value: ethers.parseEther('0.0005') });
      const balance = await fundMe.fundersToAmount(firstAcct);
      expect(balance).to.equal(ethers.parseEther('0.0005'));
    });
  });

  describe('getFund', () => {
    it('should throw window is not closed', async () => {
      await fundMe.fund({ value: ethers.parseEther('0.0005') });
      await expect(fundMe.getFund()).to.be.revertedWith('Window is not closed');
    });

    it('should throw target not reached', async () => {
      await fundMe.fund({ value: ethers.parseEther('0.0005') });

      // make sure the window is closed
      await time.increase(200);
      await mine();

      await expect(fundMe.getFund()).to.be.revertedWith('Target is not reached');
    });

    it('should only owner to call', async () => {
      await fundMe.fund({ value: ethers.parseEther('0.004') });

      // make sure the window is closed
      await time.increase(200);
      await mine();

      await expect(fundMeSecondAcct.getFund()).to.be.revertedWith('this function can only be called by owner');
    });
  });
});
