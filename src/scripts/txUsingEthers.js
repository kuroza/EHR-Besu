import { ethers, Wallet } from "ethers";
import fs from "fs-extra";

const ownerAddress =
	"195d47852f3bbf9bd8eb66c7b1953c7774e4bd3f8093634c9c72c5450d86084d";
const raAddress =
	"0x4aa6ceb0f6b510002dfaf082c78993cb64a0e29f76c016ab930962a1d66ac50d";
const doctorAddress =
	"0x9e999543f1f1bf5b28fc8a47fbeb7b3fdbd6755474390292879fbaf2249d7a88";
const patientAddress =
	"0x9dd764904979ffd6ce48525364611ffc1a1ddef094b94f5344c07a45990e69e8";

async function init() {
	// const provider = new ethers.providers.JsonRpcProvider(
	// 	"http://172.17.128.1:8545"
	// );
	// const wallet = new ethers.Wallet(ownerAddress, provider);
	// const abi = fs.readFileSync(
	// 	"/mnt/c/Users/assid/Workspace/EHR-Besu/compile/contracts_EHRSC_sol_EHRSC.abi",
	// 	"utf8"
	// );
	// const binary = fs.readFileSync(
	// 	"/mnt/c/Users/assid/Workspace/EHR-Besu//compile/contracts_EHRSC_sol_EHRSC.bin",
	// 	"utf8"
	// );
	// const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
	// console.log("Deploying, please wait...\n");
	// const contract = await contractFactory.deploy();
	// await contract.deployTransaction.wait(1);
}

async function initRegulatoryAgencyAdmin(contract, _from, _name) {
	await contract.registerRegulatoryAgencyAdmin(_name);
	const adminName = await contract.getName();
	await adminName.wait();
	console.log(`Regulatory agency admin registered: ${adminName}\n`);
}

async function initPatient(contract, _from, _name) {
	await contract.registerPatient(_name, {
		gasPrice: ethers.utils.parseUnits("100", "gwei"),
		gasLimit: 1000000,
	});

	const patientName = await contract.getName();
	console.log(`Patient registered: ${patientName}\n`);
}

async function checkPatientRequestCount(contract, _from) {
	const count = await contract.checkPatientRequestCount();
	console.log(`Patient request count: ${count}\n`);
}

async function initDoctor(contract, _from, _name) {
	await contract.registerDoctor(_name);

	const doctorName = await contract.getName();
	console.log(`Doctor registered: ${doctorName}\n`);
}

async function uploadBundle(contract, _from, _patientAddress) {
	// check if patient exists?
	// only zipped files is allowed
	// run python code to encrypt bundle
	// PythonShell.run(
	// 	'pre.py'
	// );
	// write storage code: upload bundle to IPFS
	// get the bundle number from web3storage
	// save to contract: _from (the doctor's address) and patient's address (data owner), bundle hash no.
	await contract.uploadBundle(_patientAddress, "12345abcde"); // replace "12345abcde" with bundleNo
	console.log("Doctor uploaded bundle\n");
}

async function verifyBundle(contract, _patientAddress) {
	const bundleHash = await contract.verifyBundle(_patientAddress);
	console.log(`Patient's bundle hash: ${bundleHash}\n`);
}

async function requestBundle(contract, _from, _to, _bundleNo) {
	await contract.requestBundle(_to, _bundleNo);
	console.log("Request bundle sent\n");
}

async function checkPatientRequest(contract, _from, _index) {
	const result = await contract.checkPatientRequestAtIndex(_index);
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
	await contract.requestAppointment(_reason, _venue, _date, _time);
	console.log("Appointment request sent\n");
}

async function verifyByOwner(contract, _from, _personAddress) {
	await contract.verifyByOwner(_personAddress, {
		gasPrice: ethers.utils.parseUnits("100", "gwei"),
		gasLimit: 1000000,
	});
	console.log("Verification successful\n");
}

async function regulatoryAgencyAdminVerify(contract, _from, _personAddress) {
	await contract.regulatoryAgencyAdminVerify(_personAddress);
	console.log("Verification successful\n");
}

const INFURA_ID = "f16ab84056864c1aad01cd02f47d7400";
const address = "0x76436313b00782Be55832534FE9B7aA8898E33a6";

async function main() {
	const provider = new ethers.providers.JsonRpcProvider(
		`https://goerli.infura.io/v3/${INFURA_ID}`
	);

	const balance = await provider.getBalance(
		"0x73BCEb1Cd57C711feaC4224D062b0F6ff338501e"
	);
	console.log(`${ethers.utils.formatEther(balance)}`);

	// const wallet = new ethers.Wallet(address, provider);
	// const abi = fs.readFileSync(
	// 	"/mnt/c/Users/assid/Workspace/EHR-Besu/compile/contracts_EHRSC_sol_EHRSC.abi",
	// 	"utf8"
	// );
	// const binary = fs.readFileSync(
	// 	"/mnt/c/Users/assid/Workspace/EHR-Besu//compile/contracts_EHRSC_sol_EHRSC.bin",
	// 	"utf8"
	// );
	// const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
	// console.log("Deploying, please wait...\n");
	// const contract = await contractFactory.deploy();
	// await contract.deployTransaction.wait(1);

	// const contract = await init();

	console.log("Registering regulatory agency admin...");
	await initRegulatoryAgencyAdmin(contract, address, "RA Admin Carol");

	// console.log("Contract owner verifying regulatory agency admin...");
	// await verifyByOwner(contract, ownerAddress, ownerAddress);

	// console.log("Registering patient...");
	// await initPatient(contract, patientAddress, "Patient Bob");

	// console.log("Registering doctor...");
	// await initDoctor(contract, doctorAddress, "Dr. Alice");

	// console.log("Regulatory agency admin is verifying doctor...");
	// await regulatoryAgencyAdminVerify(contract, raAddress, doctorAddress);

	// console.log("Regulatory agency admin is verifying patient...");
	// await regulatoryAgencyAdminVerify(
	// 	contract,
	// 	"0x3c0367fb782478fb08ae405d63b1de806f5972703ff25f7eb85fa60f0cb4c663",
	// 	"0x83e9e31d03c558ec1d743fd2c27ae97957006bfa7c2907a0209ad4b6e6233b80"
	// );

	// console.log("Patient is requesting appointment...");
	// await requestAppointment(
	// 	contract,
	// 	wallet.addresses[2],
	// 	"Arm pain",
	// 	"RIPAS",
	// 	0,
	// 	0
	// ); // date and time

	// console.log("Doctor is requesting bundle...");
	// await requestBundle(contract, wallet.addresses[1], wallet.addresses[2], 23);

	// console.log("Doctor is uploading patient's bundle...");
	// await uploadBundle(
	// 	contract,
	// 	"0x5731774773d7992f0ff802c75381ee777fa96b01ff0cbe90f00dbf6e0da89c28",
	// 	"0x83e9e31d03c558ec1d743fd2c27ae97957006bfa7c2907a0209ad4b6e6233b80"
	// );

	// console.log("Verify patient's bundle hash...");
	// await verifyBundle(
	// 	contract,
	// 	"0x83e9e31d03c558ec1d743fd2c27ae97957006bfa7c2907a0209ad4b6e6233b80"
	// );
}

main();
