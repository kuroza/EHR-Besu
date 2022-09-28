import { Web3Storage } from "web3.storage";
const w3s = require("../web3storage.json");

function getAccessToken() {
	return w3s.token;
}

function makeStorageClient() {
	return new Web3Storage({ token: getAccessToken() });
}

async function retrieveFiles(cid) {
	const client = makeStorageClient();
	const res = await client.get(cid);
	console.log(`Got a response! [${res.status}] ${res.statusText}`);
	if (!res.ok) {
		throw new Error(`failed to get ${cid}`);
	}

	const files = await res.files();
	for (const file of files) {
		console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
	}
}
