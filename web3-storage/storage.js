import { Web3Storage } from "web3.storage";
import { getFilesFromPath } from "web3.storage";
import { File } from "web3.storage";

function getAccessToken() {
	return process.env.WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
	return new Web3Storage({ token: getAccessToken() });
}

async function getFiles(path) {
	const files = await getFilesFromPath(path);
	console.log(`read ${files.length} file(s) from ${path}`);
	return files;
}

function makeFileObjects() {
	// You can create File objects from a Buffer of binary data
	// see: https://nodejs.org/api/buffer.html
	// Here we're just storing a JSON object, but you can store images,
	// audio, or whatever you want!
	const obj = { hello: "world" };
	const buffer = Buffer.from(JSON.stringify(obj));

	const files = [
		new File(["contents-of-file-1"], "plain-utf8.txt"),
		new File([buffer], "hello.json"),
	];

	return files;
}

async function storeFiles(files) {
	const client = makeStorageClient();
	const cid = await client.put(files);
	console.log("stored files with cid: ", cid);
	return cid;
}

async function storeWithProgress(files) {
	// show the root cid as soon as it's ready
	const onRootCidReady = (cid) => {
		console.log("uploading files with cid: ", cid);
	};

	// when each chunk is stored, update the percentage complete and display
	const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
	let uploaded = 0;

	const onStoredChunk = (size) => {
		uploaded += size;
		const pct = 100 * (uploaded / totalSize);
		console.log(`Uploading... ${pct.toFixed(2)}% complete`);
	};

	// makeStorageClient returns an authorized Web3.Storage client instance
	const client = makeStorageClient();

	// client.put will invoke our callbacks during the upload
	// and return the root cid when the upload completes
	return client.put(files, { onRootCidReady, onStoredChunk });
}
