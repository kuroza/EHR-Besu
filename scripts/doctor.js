const Web3 = require('web3');
const EHRSC = require('../build/contracts/EHRSC.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const wallet = require('../wallet.json');

const init = async () => {
    const provider = new HDWalletProvider(wallet.keys[1].privateKey, 'http://127.0.0.1:9545');

    const web3 = new Web3(provider);

    const id = await web3.eth.net.getId(); // get current network id
    const deployedNetwork = EHRSC.networks[id];
    const contract = new web3.eth.Contract(
        EHRSC.abi,
        deployedNetwork.address
    );

    let balance = await web3.eth.getBalance(wallet.keys[1].address);
    console.log(balance);

    await contract.methods.registerDoctor("Shameer")
        .send({
            from: wallet.keys[1].address,
        });

    let name = await contract.methods.getName(wallet.keys[1].address).call();
    console.log(name);
}

init();