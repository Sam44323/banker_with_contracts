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

    banking = await (await ethers.getContractFactory("Banking"))
      .connect(owner)
      .deploy(token.address);
  });
});
