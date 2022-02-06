import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Token } from "../../typechain";

describe("Token.sol test for BKR", () => {
  let token: Token, owner: SignerWithAddress, recipient: SignerWithAddress;

  beforeEach(async () => {
    [owner, recipient] = await ethers.getSigners();
    const TokenFactory = ethers.getContractFactory("Token");
    token = await (await TokenFactory).connect(owner).deploy();
  });

  it("Checks the balance of the owner", async () => {
    expect(
      parseInt((await token.balanceOf(owner.address)).toString()) / 10 ** 18
    ).to.be.equal(100);
  });

  it("Checks the admin of the token contract", async () => {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("user-to-user transaction test with BKR", async () => {
    await token.connect(owner).transfer(recipient.address, 10);
    expect(
      parseInt((await token.balanceOf(recipient.address)).toString())
    ).to.equal(10);
  });

  it("Checks invalid minting when function called other than the admin", async () => {
    await expect(
      token.connect(recipient).mint(recipient.address, 100)
    ).to.be.revertedWith("Admin can call this function!");
  });

  it("The the minter value should be 100 after initial minter", async () => {
    expect(await token.tokensMinted()).to.be.equal(100);
  });

  it("Transaction reverted for value greater than max supply", async () => {
    try {
      await token.connect(owner).mint(recipient.address, 100_000);
    } catch (err) {
      // eslint-disable-next-line no-unused-expressions
      expect(err).to.exist;
    }
  });

  it("Checking the ownership transfer method", async () => {
    await token.connect(owner).transferOwnership(recipient.address);
    expect(await token.owner()).to.equal(recipient.address);
  });
});
