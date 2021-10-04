const Web3 = require('web3');
const EHRSC = require('../build/contracts/EHRSC.json');

const init = async () => {
    const web3 = new Web3('http://127.0.0.1:9545');

    const id = await web3.eth.net.getId(); // get current network id
    const deployedNetwork = EHRSC.networks[id];
    const contract = new web3.eth.Contract(
        EHRSC.abi,
        deployedNetwork.address
    );

    const addresses = await web3.eth.getAccounts();
    /* will be mined */
    const receipt = await contract.methods.registerPatient("Zakwan").send({
        from: addresses[0], // how to use the index 1's address?
        gas: 3000000
    });
    // let name = await contract.methods.getName().call();
    console.log(receipt);
}

init();