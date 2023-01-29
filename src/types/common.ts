
export type Wallet = {
  phrase: string,
  address: string,
  keyPair: {
    publicKey: string,
    privateKey: string,
  },
}

export type MainWallets = {
  weMainWallet: Wallet,
  wavesMainWallet: Wallet,
}
