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

  beforeEach(async () => {
    [owner, userA] = await ethers.getSigners();

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
    it("Balance of owner is available", async () => {
      expect(
        parseInt((await token.balanceOf(owner.address)).toString()) / 10 ** 18
      ).to.be.equal(100);
    });
    it("A blacklisted address should not be able to deposit", async () => {
      await banking.addToBlacklist(userA.address);
      try {
        await banking.connect(userA).depositTokens(30 * 10 ** 18);
      } catch (err) {
        expect(err).to.exist;
      }
    });

    it("A blacklisted user should not be able to withdraw", async () => {
      await banking.addToBlacklist(userA.address);
      try {
        await banking.connect(userA).withdrawTokens(30 * 10 ** 18);
      } catch (err) {
        expect(err).to.exist;
      }
    });

    it("User should be able to deposit", async () => {
      await token
        .connect(owner)
        .approve(userA.address, (30 * 10 ** 18).toString());
      await token
        .connect(owner)
        .transfer(userA.address, (30 * 10 ** 18).toString());
      await token
        .connect(userA)
        .approve(banking.address, (30 * 10 ** 18).toString());
      await banking.connect(userA).depositTokens(30);

      expect(await banking.userBalance(userA.address)).to.be.equal(30);
    });

    it("User should be able to withdraw", async () => {
      await token
        .connect(owner)
        .approve(userA.address, (30 * 10 ** 18).toString());
      await token
        .connect(owner)
        .transfer(userA.address, (30 * 10 ** 18).toString());
      await token
        .connect(userA)
        .approve(banking.address, (30 * 10 ** 18).toString());
      await banking.connect(userA).depositTokens(30);
      await banking.connect(userA).withdrawTokens(30);

      expect(
        parseInt((await token.balanceOf(userA.address)).toString()) / 10 ** 18
      ).to.be.equal(30);
    });

    it("User should get error if they have no balance to withdraw", async () => {
      try {
        await banking.connect(userA).withdrawTokens(30);
      } catch (err) {
        expect(err).to.exist;
      }
    });

    it("User should not be able to call the deposit function with less than 0 value", async () => {
      try {
        await token
          .connect(owner)
          .approve(userA.address, (30 * 10 ** 18).toString());
        await token
          .connect(owner)
          .transfer(userA.address, (30 * 10 ** 18).toString());
        await token
          .connect(userA)
          .approve(banking.address, (30 * 10 ** 18).toString());
        await banking.connect(userA).depositTokens(0);
      } catch (err) {
        expect(err).to.exist;
      }
    });
  });
});
