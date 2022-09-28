Node-1 (bootnode):
`cd config/IBFT-Network/Node-1`

```
besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all"
```

Node-2
`cd config/IBFT-Network/Node-2`

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://c07b9810f88456ee17321e43e60304a3c4adef92aa5aef8914c56ee2bfcfe2c9b824fa8cd3c74b47909cce42d58b136282ab03bc39dc490a715f19b33192a990@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546
```

Node-3
`cd config/IBFT-Network/Node-3`

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://c07b9810f88456ee17321e43e60304a3c4adef92aa5aef8914c56ee2bfcfe2c9b824fa8cd3c74b47909cce42d58b136282ab03bc39dc490a715f19b33192a990@127.0.0.1:30303 --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547
```

Node4
`cd config/IBFT-Network/Node-4`

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://c07b9810f88456ee17321e43e60304a3c4adef92aa5aef8914c56ee2bfcfe2c9b824fa8cd3c74b47909cce42d58b136282ab03bc39dc490a715f19b33192a990@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548
```

---

Node-1 address
enode://c07b9810f88456ee17321e43e60304a3c4adef92aa5aef8914c56ee2bfcfe2c9b824fa8cd3c74b47909cce42d58b136282ab03bc39dc490a715f19b33192a990@127.0.0.1:30303