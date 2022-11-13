Node-1 (bootnode):

```
cd config/IBFT-Network/Node-1
```

```
besu --data-path=data --genesis-file=../genesis.json --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all"
```

Node-2

```
cd config/IBFT-Network/Node-2
```

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://4f76ed05a4741303bb9960438f62fdfe32c47934b94721e882cd609c93edd009cc88d0fc108b735cbe14d3c5eb6411ab8d18ba5d6c1f0999ae94c1683e013188@127.0.0.1:30303 --p2p-port=30304 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8546
```

Node-3

```
cd config/IBFT-Network/Node-3
```

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://4f76ed05a4741303bb9960438f62fdfe32c47934b94721e882cd609c93edd009cc88d0fc108b735cbe14d3c5eb6411ab8d18ba5d6c1f0999ae94c1683e013188@127.0.0.1:30303 --p2p-port=30305 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8547
```

Node4

```
cd config/IBFT-Network/Node-4
```

```
besu --data-path=data --genesis-file=../genesis.json --bootnodes=enode://4f76ed05a4741303bb9960438f62fdfe32c47934b94721e882cd609c93edd009cc88d0fc108b735cbe14d3c5eb6411ab8d18ba5d6c1f0999ae94c1683e013188@127.0.0.1:30303 --p2p-port=30306 --rpc-http-enabled --rpc-http-api=ETH,NET,IBFT --host-allowlist="*" --rpc-http-cors-origins="all" --rpc-http-port=8548
```

---

Node-1 address
enode://4f76ed05a4741303bb9960438f62fdfe32c47934b94721e882cd609c93edd009cc88d0fc108b735cbe14d3c5eb6411ab8d18ba5d6c1f0999ae94c1683e013188@127.0.0.1:30303
