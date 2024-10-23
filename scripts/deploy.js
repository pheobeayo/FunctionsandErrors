// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const [owner, sender, reciever] = await hre.ethers.getSigners();


  const myWallet = await hre.ethers.getContractFactory("myWallet");
  const mywallet = await myWallet.deploy();
  await mywallet.deployed();


  console.log(`Contract deployed to ${mywallet.address}` );

  //intercat with the contract
  let mywalletContract = await (await ethers.getContractFactory("myWallet")).attach(mywallet.address)
  // let mywalletContract = await ethers.getContractFactory("myWallet").attach();

  //deposit [deposit 5 ethers]
  const deposit = await mywalletContract.connect(sender).deposit({value: ethers.utils.parseEther("5.0")});
  await deposit.wait();
  console.log("Deposited 5 ethers", deposit);

  //check balance
  const balance = await mywalletContract.connect(owner).checkBalance();
  console.log("Balance", ethers.utils.formatEther(balance));

  //send money [send 2 ethers]
  const sendEther = await mywalletContract.connect(owner).sendEther(reciever.address, ethers.utils.parseEther("2.0"));
  await sendEther.wait();
  console.log("Sent 2 ether", sendEther);

  //check balance
  const balanceafter = await mywalletContract.checkBalance();
  console.log("Balance After Transfer", ethers.utils.formatEther(balanceafter));
  
  //amountSent
  const amountSent = await mywalletContract.connect(sender).amountSent(sender.address);
  console.log("Amount sent so far the wallet", ethers.utils.formatEther(amountSent));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
