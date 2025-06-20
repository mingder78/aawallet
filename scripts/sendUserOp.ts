import {
  createPublicClient,
  createWalletClient,
  http,
  encodeFunctionData,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { localhost } from 'viem/chains'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const publicClient = createPublicClient({ chain: localhost, transport: http() })
  const walletClient = createWalletClient({ chain: localhost, transport: http() })

  const owner = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`)
  const account = '0xYourAccountAddress'
  const entryPoint = '0xYourEntryPoint'

  const callData = encodeFunctionData({
    abi: [{ /* from AbstractAccount: execute(to,value,data) */ }],
    functionName: 'execute',
    args: ['0xRecipientAddr', 10n ** 16n, '0x'], // send 0.01 ETH
  })

  const userOp = {
    sender: account,
    nonce: 0n,
    initCode: '0x',
    callData,
    callGasLimit: 100_000n,
    verificationGasLimit: 100_000n,
    preVerificationGas: 21_000n,
    maxFeePerGas: 2_000_000_000n,
    maxPriorityFeePerGas: 1_500_000_000n,
    paymasterAndData: '0x',
    signature: '0x',
  }

  const userOpHash = await publicClient.request({
    method: 'eth_getUserOperationHash',
    params: [userOp, entryPoint],
  })

  userOp.signature = await walletClient.signMessage({
    account: owner,
    message: userOpHash as `0x${string}`,
  })

  const result = await publicClient.request({
    method: 'eth_sendUserOperation',
    params: [userOp, entryPoint],
  })

  console.log('UserOperation hash:', result)
}

main()

