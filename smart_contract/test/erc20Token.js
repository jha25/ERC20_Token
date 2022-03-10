/** @format */

const {
	expectRevert,
	time,
	expectEvent,
} = require("@openzeppelin/test-helpers")
const Token = artifacts.require("ERC20Token")

contract("ERC20Token", (accounts) => {
	let token
	const initialBalance = web3.utils.toBN(web3.utils.toWei("1"))
	console.log(initialBalance)

	beforeEach(async () => {
		token = await Token.new("My Token", "TKN", 18, initialBalance)
	})

	it("Should return the total supply", async () => {
		const supply = await token.totalSupply()
		console.log("Supply: ", supply)
		assert(supply.eq(initialBalance))
	})

	it("Should return correct balance", async () => {
		const balance = await token.balanceOf(accounts[0])
		console.log("Balance: ", balance)
		assert(balance.eq(initialBalance))
	})

	it("Should transfer token", async () => {
		const transfer = web3.utils.toBN(100)
		const receipt = await token.transfer(accounts[1], transfer)
		const balance1 = await token.balanceOf(accounts[0])
		const balance2 = await token.balanceOf(accounts[1])
		const initialBalance = web3.utils.toBN(web3.utils.toWei("1"))
		assert(balance1.eq(initialBalance.sub(transfer)))
		expectEvent(receipt, "Transfer", {
			from: accounts[0],
			to: accounts[1],
			tokens: transfer,
		})
	})

	it("Should not transfer token if balance too low", async () => {
		await expectRevert(
			token.transfer(accounts[1], web3.utils.toWei("10")),
			"Token balance too low",
		)
	})

	it("Should transfer token when approved", async () => {
		let allowance
		let receipt
		const _100 = web3.utils.toBN(100)

		allowance = await token.allowance(accounts[0], accounts[1])
		assert(allowance.isZero())

		receipt = await token.approve(accounts[1], _100)
		allowance = await token.allowance(accounts[0], accounts[1])
		assert(allowance.eq(100))
		expectEvent(receipt, "Approva", {
			tokenOwner: accounts[0],
			spender: accounts[1],
			tokens: _100,
		})

		receipt = await token.transferFrom(accounts[0], accounts[1], _100, {
			from: accounts[1],
		})
		allowance = await token.allowance(accounts[0], accounts[1])
		const balance1 = await token.balanceOf(accounts[0])
		const balance2 = await token.balanceOf(accounts[1])
		assert(balance1.eq(initialBalance.sub(_100)))
		assert(balance2.eq(_100))
		assert(allowance.isZero())
		expectEvent(receipt, "Transfer", {
			from: accounts[0],
			to: accounts[2],
			tokens: _100,
		})
	})

	it("Should not transfer token if not approvd", async () => {
		await expectRevert(
			token.transferFrom(accounts[0], accounts[1], 10),
			"Allowance too low",
		)
	})
})
