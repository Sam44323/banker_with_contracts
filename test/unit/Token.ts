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

    console.log("Deployed the token");
  });

  it("Checks the admin of the token contract", async () => {
    expect(await token.owner()).to.equal(owner.address);
  });
});
