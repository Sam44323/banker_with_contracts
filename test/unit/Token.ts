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
  });

  it("Checks the admin of the token contract", async () => {
    expect(await token.owner()).to.equal(owner.address);
  });

  it("Minting the slab token to recipient", async () => {
    await token.connect(owner).mint(recipient.address);
    expect(
      parseInt((await token.balanceOf(recipient.address)).toString())
    ).to.equal(1000 * 10 ** 18);
  });

  it("Checking the ownership transfer method", async () => {
    await token.connect(owner).transferOwnership(recipient.address);
    expect(await token.owner()).to.equal(recipient.address);
  });
});
