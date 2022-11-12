const HDWalletProvider = require("@truffle/hdwallet-provider"); // HDWalletProvider
// import HDWalletProvider from "@truffle/hdwallet-provider";

const privateKeys = [
	"0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63",
	"0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3",
	"0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f",
];

// const hdWalletProvider = new HDWalletProvider(privateKeys, 'http://127.0.0.1:8545', 0, 3);

module.exports = {
	networks: {
		besu: {
			provider: function () {
				return new HDWalletProvider(privateKeys, "http://127.0.0.1:8545", 0, 3);
			},
			network_id: "*",
			gas: 4600000,
			// from: "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
			// gasLimit: 10000000000,
		},
		// development: {
		// 	host: "172.23.240.1", // Localhost (default: none)
		// 	port: 8545, // Standard Ethereum port (default: none)
		// 	network_id: "5777", // Any network (default: none)
		// },
		// Another network with more advanced options...
		// advanced: {
		// port: 8777,             // Custom port
		// network_id: 1342,       // Custom network
		// gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
		// gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
		// from: <address>,        // Account to send txs from (default: accounts[0])
		// websockets: true        // Enable EventEmitter interface for web3 (default: false)
		// },
		// Useful for deploying to a public network.
		// NB: It's important to wrap the provider as a function.
		// ropsten: {
		// provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
		// network_id: 3,       // Ropsten's id
		// gas: 5500000,        // Ropsten has a lower block limit than mainnet
		// confirmations: 2,    // # of confs to wait between deployments. (default: 0)
		// timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
		// skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
		// },
		// Useful for private networks
		// private: {
		// provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
		// network_id: 2111,   // This network is yours, in the cloud.
		// production: true    // Treats this network as if it was a public net. (default: false)
		// }
	},

	// Set default mocha options here, use special reporters etc.
	mocha: {
		// timeout: 100000
	},

	plugins: ["solidity-coverage"],

	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.0", // Fetch exact version from solc-bin (default: truffle's version)
			// docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
			settings: {
				// See the solidity docs for advice about optimization and evmVersion
				optimizer: {
					enabled: false,
					runs: 200,
				},
				evmVersion: "byzantium",
			},
		},
	},
};
