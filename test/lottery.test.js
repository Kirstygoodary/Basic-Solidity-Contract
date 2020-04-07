const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3') //constructor
const web3 = new Web3(ganache.provider())

const { interface, bytecode } = require('../compile')

let lottery
let accounts

beforeEach(async () => {
  accounts = await web3.eth.getAccounts()
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Lottery Contract', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address)
  })
  it('adds a new address to the players array', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') }) // web3 has a method which can convert ether to wei
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] })
    assert.equal(accounts[0], players[0])
    assert.equal(1, players.length)
  })
  it('adds addresses for multiple players', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') }) // enter method invoked three times for three entered players
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('2', 'ether') })
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei('3', 'ether') })
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] })
    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])
    assert.equal(3, players.length)
  })
  it('ensures that the appropriate amount of ether is sent in order to enter', async () => {
    try {
      // try / catch will automatically catch any errors. Good for testing errors / error handling
      await lottery.methods.enter().send({ from: accounts[0], value: '0' })
      assert(false) // if no error with line 53, assert(false) will be read and the test will fail
    } catch (err) {
      assert(err) // assert(err) is fine to use for errors. If there is an error, assert(false) is skipped and the catch block is read.
    }
  })
  it('only the manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner.send({ from: accounts[1] })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })
  it('sends money to the winner and resets the players array', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') })
    const initialBalance = await web3.eth.getBalance(accounts[0]) // function that returns the balance in wei. Should have 1 ether less
    await lottery.methods.pickWinner().send({ from: accounts[0] }) // accounts[0] should have 1 ether more
    const finalBalance = await web3.eth.getBalance(accounts[0]) // finalBalance should have slightly less than 1 ether due to the cost of the transaction
    const difference = finalBalance - initialBalance
    assert(difference > web3.utils.toWei('0.8', 'ether'))
  })
})
