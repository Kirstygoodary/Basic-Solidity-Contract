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
  })
})
