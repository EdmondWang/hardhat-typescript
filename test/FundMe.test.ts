import { ethers, deployments, getNamedAccounts } from 'hardhat'; // Attention here ethers object is the one from hardhat
import { expect } from 'chai';
import { FundMe } from '../typechain-types/contracts/FundMe';
import { Address } from 'hardhat-deploy/types';

describe('test fundme contract', () => {
  let fundMe: FundMe;
  let firstAcct: Address;

  beforeEach(async () => {
    await deployments.fixture(['all']); // all is tag
    firstAcct = (await getNamedAccounts()).firstAccount;
    const fundMeDeployment = await deployments.get('FundMe');
    fundMe = await ethers.getContractAt('FundMe', fundMeDeployment.address);
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
    expect(await fundMe.dataFeed()).to.equal('0x694AA1769357215DE4FAC081bf1f309aDC325306');
  });
});
