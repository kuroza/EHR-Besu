# EHR-Besu
---
## Blockchain-enabled Secure and Efficient Electronic Health Record Management System Using Hyperledger Besu, NuCypher, and IPFS.

### Pre-requisites:
Linux environment or WSL2
Install Java JDK[https://www.oracle.com/java/technologies/javase-downloads.html]
Download the Besu packaged binaries[https://github.com/hyperledger/besu/releases]
Install node.js
Install Truffle: `npm install truffle -g`
Install Ganache: `npm install -g ganache-cli`

### To run the smart contract on a Ganache network using Truffle
Open a console and write:
```
truffle develop
migrate --reset
```

Open a new console and write:
`node scripts/tx.js`

### To run the smart contract on a Besu network
Deploying a smart contract to a private network:
`truffle migrate --reset --network besu`
