const assert = require("assert");
// module for making assertions on tests
const ganache = require("ganache-cli");
// local E test network
const Web3 = require("web3");
// Caps because it is a constructor. Used to create instances of the web3 library.
const provider = ganache.provider();
const web3 = new Web3(provider);
// creating an instance of Web3. Instructing it to connect to ganache.provider() for testing
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  // every function in web3 is assyncronous. Therefore it always returns a promise.
  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface)) // accessing the Contract property in web3. Passing through the ABI and JSON.parsed it
    .deploy({ data: bytecode, arguments: ["Hello"] }) // transaction object created. Arguments is the initialMessage function. Should be in an array incase there's multiple args
    .send({ from: accounts[0], gas: "1000000" }); // send actually deploys the contract. takes the address and gasStart
  inbox.setProvider(provider);
});

describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address); // ok confirms whether the value is defined or not. If true -> test passes
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call(); //referencing the message function in the methods object in the inbox object.
    assert.equal(message, "Hello");
  });
  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "bye");
  });
});
