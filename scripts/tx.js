const Web3 = require('web3');
const EHRSC = require('../build/contracts/EHRSC.json');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const wallet = require('../wallet.json');

async function init() {
    const provider = new HDWalletProvider({
        privateKeys: wallet.privateKeys,
        providerOrUrl: 'http://127.0.0.1:9545'
    });
    const web3 = new Web3(provider);
    const id = await web3.eth.net.getId(); // get current network id
    const deployedNetwork = EHRSC.networks[id];
    const contract = new web3.eth.Contract(
        EHRSC.abi,
        deployedNetwork.address
    );

    return contract;
}

async function initPatient(contract) {
    await contract.methods.registerPatient("Patient Bob").send({
        from: wallet.addresses[0],
    });
    
    let name = await contract.methods.getName().call({
        from: wallet.addresses[0],
    });
    console.log("Patient registered:", name);
}

async function checkPatientRequestCount(contract) {
    let count = await contract.methods.checkPatientRequestCount().call({
        from: wallet.addresses[0],
    });
    console.log("Patient request count:", count);    
}

async function initDoctor(contract) {
    await contract.methods.registerDoctor("Dr. Alice").send({
        from: wallet.addresses[1],
    });
    
    let name = await contract.methods.getName().call({
        from: wallet.addresses[1],
    });
    console.log("Doctor registered:", name);
}

async function requestDocuments(contract) {
    await contract.methods.requestDocuments(wallet.addresses[0], 23).send({
        from: wallet.addresses[1],
    });    
}

async function checkPatientRequest(contract) {
    const result = await contract.methods.checkPatientRequestAtIndex(0).call({
        from: wallet.addresses[0]
    });

    console.log("Patient request:", result);
}

async function requestAppointment(contract) {
    await contract.methods.requestAppointment("Arm pain").send({
        from: wallet.addresses[0]
    });

    console.log("Appointment request sent");
}

async function main() {
    const contract = await init();
    console.log("Registering patient ...");
    await initPatient(contract);
    console.log("Registering doctor ...");
    await initDoctor(contract);
    console.log("Requesting documents ...");
    await requestDocuments(contract);
    await checkPatientRequestCount(contract);
    await checkPatientRequest(contract);
    console.log("Requesting appointment ...");
    await requestAppointment(contract);
}

main();