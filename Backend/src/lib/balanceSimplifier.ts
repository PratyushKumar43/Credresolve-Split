export interface Balance {
  userId: string
  userName: string
  netBalance: number // Positive = owed to user, Negative = user owes
}

export interface SimplifiedTransaction {
  from: string
  fromName: string
  to: string
  toName: string
  amount: number
}

export function simplifyBalances(balances: Balance[]): SimplifiedTransaction[] {
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter(b => b.netBalance > 0)
    .sort((a, b) => b.netBalance - a.netBalance)
  
  const debtors = balances
    .filter(b => b.netBalance < 0)
    .map(b => ({ ...b, netBalance: Math.abs(b.netBalance) }))
    .sort((a, b) => b.netBalance - a.netBalance)

  const transactions: SimplifiedTransaction[] = []
  let creditorIndex = 0
  let debtorIndex = 0

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex]
    const debtor = debtors[debtorIndex]

    const amount = Math.min(creditor.netBalance, debtor.netBalance)

    transactions.push({
      from: debtor.userId,
      fromName: debtor.userName,
      to: creditor.userId,
      toName: creditor.userName,
      amount: parseFloat(amount.toFixed(2))
    })

    creditor.netBalance -= amount
    debtor.netBalance -= amount

    if (creditor.netBalance === 0) creditorIndex++
    if (debtor.netBalance === 0) debtorIndex++
  }

  return transactions
}



