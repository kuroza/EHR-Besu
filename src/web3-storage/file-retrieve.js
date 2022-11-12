import { Web3Storage } from "web3.storage";

function getAccessToken() {
	return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJCODA1Nzk2ZDM0QTI2NTkyYTRmQTk4RGQxNzAwZTdGMkZhNDk4ODYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjIwMDg1MTkwODksIm5hbWUiOiJlaHItYmVzdSJ9.Lc710Rz1i0eg1SiPNW7ZB1MV6eWVK5ZzgAaoMZRvhsI";
}

function makeStorageClient() {
	return new Web3Storage({ token: getAccessToken() });
}

async function retrieveFiles(cid) {
	const client = makeStorageClient();
	const res = await client.get(cid);
	// console.log(`Got a response! [${res.status}] ${res.statusText}`);

	if (!res.ok) {
		throw new Error(`Failed to get ${cid} - [${res.status}] ${res.statusText}`);
	}

	const files = await res.files();
	try {
		for (const file of files) {
			console.log(file.cid);
		}
	} catch (error) {
		console.log(error);
	}
}

async function main() {
	await retrieveFiles(
		"bafybeiguqxvm4hemrzbbu3vsjzoumh33shvvn46lhir6bpfzh3foepjytu"
	);
}

main();
