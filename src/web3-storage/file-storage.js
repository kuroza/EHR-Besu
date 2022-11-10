import { Web3Storage, getFilesFromPath } from "web3.storage";

function getAccessToken() {
	return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJCODA1Nzk2ZDM0QTI2NTkyYTRmQTk4RGQxNzAwZTdGMkZhNDk4ODYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjIwMDg1MTkwODksIm5hbWUiOiJlaHItYmVzdSJ9.Lc710Rz1i0eg1SiPNW7ZB1MV6eWVK5ZzgAaoMZRvhsI";
}

function makeStorageClient() {
	return new Web3Storage({ token: getAccessToken() });
}

async function getFiles(path) {
	const files = await getFilesFromPath(path);
	return files;
}

async function storeFiles(files) {
	const client = makeStorageClient();
	const cid = await client.put(files);
	console.log(cid);
}

async function main() {
	let files = await getFiles(`../pyUmbral/encrypted_files`);
	await storeFiles(files);
}

main();
