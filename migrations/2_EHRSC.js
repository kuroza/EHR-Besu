const EHRSC = artifacts.require("EHRSC");

module.exports = async function (deployer, _, accounts) {
	await deployer.deploy(EHRSC);
	await web3.eth.sendTransaction({
		from: accounts[0],
		to: '0x26a547C0e79D4989A0565cf0dE2901530495f4ca',
		value: web3.utils.toWei('1', 'ether')
	});

	await web3.eth.sendTransaction({
		from: accounts[0],
		to: '0xD03E208f2F0732aE4F3f12529C6B2182904046B0',
		value: web3.utils.toWei('1', 'ether')
	});
};