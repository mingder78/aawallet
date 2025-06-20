import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { localhost } from 'viem/chains'
import abiFactory from '../artifacts/contracts/AbstractAccountFactory.sol/AbstractAccountFactory.json'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const client = createWalletClient({
    chain: localhost,
    transport: http(),
  })
  const deployer = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)

  const factory = await client.deployContract({
    abi: abiFactory.abi,
    bytecode: abiFactory.bytecode,
    account: deployer,
  })
  console.log('Factory deployed at:', factory)
}

main()

