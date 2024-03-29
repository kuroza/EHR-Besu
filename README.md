# Blockchain-enabled Secure and Efficient Electronic Health Record Management System

## Pre-requisites:

- Linux environment or WSL2
- Install [Java JDK](https://www.oracle.com/java/technologies/javase-downloads.html)
- Download the Besu [packaged binaries](https://github.com/hyperledger/besu/releases)
- Install [Node.js](https://nodejs.org/en/download/)
- Install Truffle:

```
npm install -g truffle
```

- Install Ganache:

```
npm install -g ganache-cli
```

## To run the smart contract on a Ganache network using Truffle

Execute these commands to run the network and deploy the smart contract:

```
truffle develop
migrate --reset
```

Then run the tx.js script:

```
node scripts/tx.js
```

## To run the smart contract on a Hyperledger Besu network

Follow the steps to run the Hyperledger Besu network:

```
https://besu.hyperledger.org/en/stable/private-networks/tutorials/ibft/#3-generate-node-keys-and-a-genesis-file
```

Deploying a smart contract to a private network:

```
truffle migrate --reset --network besu
```

Then run the tx.js script:

```
node scripts/tx.js
```
