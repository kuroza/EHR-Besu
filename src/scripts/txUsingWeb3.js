import Web3 from "web3";
import EHRSC from "/mnt/c/Users/assid/Workspace/EHR-Besu/build/contracts/EHRSC.json" assert { type: "json" };
import HDWalletProvider from "@truffle/hdwallet-provider";
import wallet from "/mnt/c/Users/assid/Workspace/EHR-Besu/wallet.json" assert { type: "json" };

async function init() {
	const provider = new HDWalletProvider({
		privateKeys: wallet.privateKeys,
		providerOrUrl: "http://127.0.0.1:8545",
	});
	const web3 = new Web3(provider);
	const id = await web3.eth.net.getId();
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
	console.log(`Regulatory agency admin registered: ${adminName}\n`);
}

async function initPatient(contract, _from, _name) {
	await contract.methods.registerPatient(_name).send({
		from: _from,
	});

	const patientName = await contract.methods.getName().call({
		from: _from,
	});
	console.log(`Patient registered: ${patientName}\n`);
}

async function checkPatientRequestCount(contract, _from) {
	const count = await contract.methods.checkPatientRequestCount().call({
		from: _from,
	});
	console.log(`Patient request count: ${count}\n`);
}

async function initDoctor(contract, _from, _name) {
	await contract.methods.registerDoctor(_name).send({
		from: _from,
	});

	const doctorName = await contract.methods.getName().call({
		from: _from,
	});
	console.log(`Doctor registered: ${doctorName}\n`);
}

async function requestBundle(contract, _from, _to, _bundleCid) {
	await contract.methods.requestBundle(_to, _bundleCid).send({
		from: _from,
	});
	console.log("Request document sent\n");
}

async function checkPatientRequestAtIndex(contract, _from, _index) {
	const result = await contract.methods
		.checkPatientRequestAtIndex(_index)
		.call({
			from: _from,
		});
	console.log(result);
}

async function updateUploadedBundleInfo(
	contract,
	_from,
	_patientAddress,
	_bundleCid
) {
	await contract.methods
		.updateUploadedBundleInfo(_patientAddress, _bundleCid)
		.send({
			from: _from,
		});
	console.log("Successful\n");
}

async function verifyPatientBundleCid(
	contract,
	_from,
	_patientAddress,
	_bundleCid
) {
	const result = await contract.methods
		.getPatientBundleCid(_patientAddress)
		.call({
			from: _from,
		});

	result == _bundleCid
		? console.log(`Patient bundle CID matches!`)
		: console.log("Patient bundle CID DO NOT match!");
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

	// ! Generate key pairs

	// console.log("Doctor is requesting documents...");
	// await requestBundle(contract, wallet.addresses[1], wallet.addresses[2], bundleCid);

	let bundleCid = "bafybeigqetbgehrq34tnuv3i4ko7vrhbct6u22p7pwhb3av5xe2kgjafyy";

	console.log("Associating bundle CID with patient...");
	await updateUploadedBundleInfo(
		contract,
		wallet.addresses[1],
		wallet.addresses[2],
		bundleCid
	);

	console.log("Verifying bundle...");
	await verifyPatientBundleCid(
		contract,
		wallet.addresses[1],
		wallet.addresses[2],
		bundleCid
	);
}

main();
