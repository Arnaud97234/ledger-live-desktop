import { libcoreValidAddress } from 'commands/libcoreValidAddress'

// const accountBalance = [0, 100]
// const transactionAmount = [0, 50, 99.9, 100, null]
// const transactionFees = [0.1, 0, null]
// const recipientAddress = ['3E6xt5L2trqTzwfsLvQAEXTpEc7BEBHMHf', '3E6xt5L2trqTzwfsLvQAEXTpEc7BEWrong', '3E6xt5L2trqTzwfsLvQAEXTpEc7BEBHMHfxWrong', null]
// const senderAddress = ['33t8pzKbrMxmfPBjAEa1T5meuHjRvKDHyZ', '33t8pzKbrMxmfPBjAEa1T5meuHjRvKDHyZWrong' ,'33t8pzKbrMxmfPBjAEa1T5meuHjRvWrong', null]
// const accountName = ['KnownAccount', 'UnknownAccount']

// isRecipientValid(currency, recipient)
// checkValidTransaction(account, transaction)
// getFees(a, transaction)
// getCurrency()

global.LEDGER_LIVE_SQLITE_PATH = '/tmp/ledger-live-test'

async function expectValidAddress(currencyId, address, expected) {
  const isValid = await libcoreValidAddress({ currencyId, address })
  if (isValid !== expected) {
    throw new Error(`${address} should be ${expected ? 'valid' : 'invalid'}`)
  }
}

describe('commands', () => {
  describe('libcoreValidAddress', () => {
    test('with valid address', async () => {
      await expectValidAddress('bitcoin', '3E6xt5L2trqTzwfsLvQAEXTpEc7BEBHMHf', true)
    })
    test('with invalid address', async () => {
      await expectValidAddress('bitcoin', '3E6xt5L2trqTzwfsLvQAEXTpEc7BEBHMHfWRONG', false)
      await expectValidAddress('litecoin', 'tatata', false)
    })
  })
})
