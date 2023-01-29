export type NodeConfig = {
  additionalFee: { [key: string]: number },
  minimumFee: { [key: string]: number },
  gostCrypto: boolean,
  chainId: string,
}

export const WEST_DECIMALS = 1e8
export const WAVES_DECIMALS = 1e8

export type TransactionInfo = {
  senderPublicKey: string,
  amount: number,
  fee: number,
  type: number,
  version: number,
  attachment: string,
  sender: string,
  feeAssetId?: string,
  assetId?: string,
  recipient: string,
  id: string,
  timestamp: number,
  height: number,
}