/* eslint-disable no-unused-expressions */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Banking, Token } from "../../typechain";

describe("Banking.sol test", () => {
  let banking: Banking,
    token: Token,
    owner: SignerWithAddress,
    userA: SignerWithAddress,
    userB: SignerWithAddress,
    userC: SignerWithAddress;

  beforeEach(async () => {
    [owner, userA, userB, userC] = await ethers.getSigners();

    token = await (await ethers.getContractFactory("Token"))
      .connect(owner)
      .deploy();

    await token.deployed();

    banking = await (await ethers.getContractFactory("Banking"))
      .connect(owner)
      .deploy(token.address);

    await banking.deployed();
  });

  describe("Util functions for banking", () => {
    it("User should not be blacklisted", async () => {
      expect(await banking.isBlacklisted(userA.address)).to.be.false;
    });

    it("User should be blacklisted", async () => {
      await banking.addToBlacklist(userA.address);
      expect(await banking.isBlacklisted(userA.address)).to.be.true;
    });

    it("Admin should be the deployer", async () => {
      expect(await banking.owner()).to.be.equal(owner.address);
    });

    it("Transfer of ownership should change the deployer from the admin", async () => {
      await banking.transferOwnership(userA.address);
      expect(await banking.owner()).to.be.equal(userA.address);
      expect(await banking.owner()).to.be.not.equal(owner.address);
    });

    it("Balance should be 0", async () => {
      try {
        await banking.userBalance(userA.address);
      } catch (err) {
        expect(err).to.exist;
      }
    });

    it("Total-reward received should be 0", async () => {
      const reward = await banking.totalRewardReceived(userA.address);

      expect(reward).to.be.equal(0);
    });
  });

  describe("Transaction method testing", () => {
    it("A blacklisted address should not be able to deposit", async () => {
      await banking.addToBlacklist(userA.address);
      try {
        await banking.connect(userA).depositTokens(100 * 10 ** 18);
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });
});