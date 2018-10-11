const accountBalance = [0, 100]
const transactionAmount = [0, 50, 99.9, 100, null]
const transactionFees = [0.1, 0, null]
const recipientAddress = ['3E6xt5L2trqTzwfsLvQAEXTpEc7BEBHMHf', '3E6xt5L2trqTzwfsLvQAEXTpEc7BEWrong', '3E6xt5L2trqTzwfsLvQAEXTpEc7BEBHMHfxWrong', null]
const senderAddress = ['33t8pzKbrMxmfPBjAEa1T5meuHjRvKDHyZ', '33t8pzKbrMxmfPBjAEa1T5meuHjRvKDHyZWrong' ,'33t8pzKbrMxmfPBjAEa1T5meuHjRvWrong', null]
const accountName = ['KnownAccount', 'UnknownAccount']
const




isRecipientValid(currency, recipient)
checkValidTransaction(account, transaction)
getFees(a, transaction)
getCurrency()



describe('Test Transaction', () => {
  beforeEach(importAccount(accountName, currency) => {

  })
  test('Test if Account and currency are valid', () => {

  })
  test('Test if transaction is valid', () => {

  })
})
