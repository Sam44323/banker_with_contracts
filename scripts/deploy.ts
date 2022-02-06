import { ethers } from "hardhat";

async function main() {
  const token = await (await ethers.getContractFactory("Token")).deploy();

  await token.deployed();
  console.log("Token deployed on: ", token.address);
  console.log("Admin of the contract is: ", await token.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
