const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { interface, bytecode } = require("./compile");

const provider = new HDWalletProvider(
  "weird camp kangaroo agent worry young exotic valid labor problem cycle census",
  "https://rinkeby.infura.io/v3/067ff9bc69b648509759a2e25e9f305d"
);

const web3 = new Web3(provider); // wallet provider

const deploy = async () => {
  const accounts = await web3.eth.getAccounts(); //getting account addresses

  const result = await new web3.eth.Contract(JSON.parse(interface)) // accessing the Contract property in web3. Passing through the ABI and JSON.parsed it
    .deploy({ data: bytecode, arguments: ["Hi there!"] })
    .send({ gas: "1000000", from: accounts[0] });
  console.log("contract deployed to", result.options.address);
};
deploy();
