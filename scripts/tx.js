const Web3 = require("web3");
const EHRSC = require("../build/contracts/EHRSC.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const wallet = require("../wallet.json");

async function init() {
	const provider = new HDWalletProvider({
		privateKeys: wallet.privateKeys,
		providerOrUrl: "http://127.0.0.1:8545",
	});
	const web3 = new Web3(provider);
	const id = await web3.eth.net.getId(); // get current network id
	const deployedContract = EHRSC.networks[id];
	const contract = new web3.eth.Contract(EHRSC.abi, deployedContract.address);
	return contract;
}

async function initRegulatoryAgencyAdmin(contract, _from, _name) {
	await contract.methods.registerRegulatoryAgencyAdmin(_name).send({
		from: _from,
	});

	const adminName = await contract.methods.getName().call({
		from: _from,
	});
	console.log("Regulatory agency admin registered: " + adminName + "\n");
}

async function initPatient(contract, _from, _name) {
	await contract.methods.registerPatient(_name).send({
		from: _from,
	});

	const patientName = await contract.methods.getName().call({
		from: _from,
	});
	console.log("Patient registered: " + patientName + "\n");
}

async function checkPatientRequestCount(contract, _from) {
	const count = await contract.methods.checkPatientRequestCount().call({
		from: _from,
	});
	console.log("Patient request count: " + count + "\n");
}

async function initDoctor(contract, _from, _name) {
	await contract.methods.registerDoctor(_name).send({
		from: _from,
	});

	const doctorName = await contract.methods.getName().call({
		from: _from,
	});
	console.log("Doctor registered: " + doctorName + "\n");
}

async function requestDocuments(contract, _from, _to, _bundleNo) {
	await contract.methods.requestDocuments(_to, _bundleNo).send({
		from: _from,
	});
	console.log("Request document sent\n");
}

async function checkPatientRequest(contract, _from, _index) {
	const result = await contract.methods
		.checkPatientRequestAtIndex(_index)
		.call({
			from: _from,
		});
	console.log(result);
}

async function requestAppointment(
	contract,
	_from,
	_reason,
	_venue,
	_date,
	_time
) {
	await contract.methods
		.requestAppointment(_reason, _venue, _date, _time)
		.send({
			from: _from,
		});
	console.log("Appointment request sent\n");
}

async function verifyByOwner(contract, _from, _personAddress) {
	await contract.methods.verifyByOwner(_personAddress).send({
		from: _from,
	});
	console.log("Verification successful\n");
}

async function regulatoryAgencyAdminVerify(contract, _from, _personAddress) {
	await contract.methods.regulatoryAgencyAdminVerify(_personAddress).send({
		from: _from,
	});
	console.log("Verification successful\n");
}

async function main() {
	const contract = await init();
	console.log("Registering regulatory agency admin...");
	await initRegulatoryAgencyAdmin(
		contract,
		wallet.addresses[0],
		"RA Admin Carol"
	);

	console.log("Contract owner verifying regulatory agency admin...");
	await verifyByOwner(contract, wallet.addresses[0], wallet.addresses[0]);

	console.log("Registering patient...");
	await initPatient(contract, wallet.addresses[2], "Patient Bob");

	console.log("Registering doctor...");
	await initDoctor(contract, wallet.addresses[1], "Dr. Alice");

	console.log("Regulatory agency admin is verifying doctor...");
	await regulatoryAgencyAdminVerify(
		contract,
		wallet.addresses[0],
		wallet.addresses[1]
	);

	console.log("Regulatory agency admin is verifying patient...");
	await regulatoryAgencyAdminVerify(
		contract,
		wallet.addresses[0],
		wallet.addresses[2]
	);

	console.log("Patient is requesting appointment...");
	await requestAppointment(
		contract,
		wallet.addresses[2],
		"Arm pain",
		"RIPAS",
		0,
		0
	); // date and time

	console.log("Doctor is requesting documents...");
	await requestDocuments(
		contract,
		wallet.addresses[1],
		wallet.addresses[2],
		23
	);
}

main();
