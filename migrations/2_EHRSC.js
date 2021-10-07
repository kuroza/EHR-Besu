const EHRSC = artifacts.require("EHRSC");

module.exports = async function (deployer) {
	await deployer.deploy(EHRSC);
};