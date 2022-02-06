import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Token } from "../../typechain";

describe("Testing the BKR Token", () => {
  let token: Token, owner: SignerWithAddress, recipient: SignerWithAddress;

  beforeEach(async () => {
    [owner, recipient] = await ethers.getSigners();
    const TokenFactory = ethers.getContractFactory("Token");
    token = await (await TokenFactory).connect(owner).deploy();

    await token.connect(owner).mint(owner.address, 1000);
  });

  it("Checks the admin of the token contract", async () => {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("user-to-user transaction test with BKR", async () => {
    await token.connect(owner).transfer(recipient.address, 100);
    expect(
      parseInt((await token.balanceOf(recipient.address)).toString())
    ).to.equal(100);
  });

  it("Checks invalid minting when function called other than the admin", async () => {
    await expect(
      token.connect(recipient).mint(recipient.address, 100)
    ).to.be.revertedWith("Admin can call this function!");
  });

  it("The the minter value should be 1100 after initial minter and owner token transfer for 1000", async () => {
    expect(await token.tokensMinted()).to.be.equal(1100);
  });

  it("Checking the ownership transfer method", async () => {
    await token.connect(owner).transferOwnership(recipient.address);
    expect(await token.owner()).to.equal(recipient.address);
  });
});
