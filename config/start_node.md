Node-1 (bootnode):
`cd config/IBFT-Network/Node-1`

```
besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all"
```

Node-2
`cd config/IBFT-Network/Node-2`

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://23a1b6295305fc6f2adbe28bb8ed7258658f3602c0d2a0f79b5d9be846ae22b4c827eff8e25c5d4db3a4c9f82301504b8c586629fbb8f281db5825b1e203f46a@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546
```

Node-3
`cd config/IBFT-Network/Node-3`

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://23a1b6295305fc6f2adbe28bb8ed7258658f3602c0d2a0f79b5d9be846ae22b4c827eff8e25c5d4db3a4c9f82301504b8c586629fbb8f281db5825b1e203f46a@127.0.0.1:30303 --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547
```

Node4
`cd config/IBFT-Network/Node-4`

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://23a1b6295305fc6f2adbe28bb8ed7258658f3602c0d2a0f79b5d9be846ae22b4c827eff8e25c5d4db3a4c9f82301504b8c586629fbb8f281db5825b1e203f46a@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548
```

---

Node-1 address
enode://23a1b6295305fc6f2adbe28bb8ed7258658f3602c0d2a0f79b5d9be846ae22b4c827eff8e25c5d4db3a4c9f82301504b8c586629fbb8f281db5825b1e203f46a@127.0.0.1:30303
