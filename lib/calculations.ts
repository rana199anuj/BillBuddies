export interface Member {
  id: string;
  name: string;
  whatsapp: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  paidBy: string; // member id
  splits: { memberId: string; amount: number }[];
}

export interface Settlement {
  from: Member;
  to: Member;
  amount: number;
}

export function calculateBalances(
  members: Member[],
  expenses: Expense[]
): { [memberId: string]: number } {
  const balances: { [memberId: string]: number } = {};

  // Initialize all balances to 0
  members.forEach((m) => (balances[m.id] = 0));

  expenses.forEach((expense) => {
    // The payer gets credit
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

    // Each person in splits owes their share
    expense.splits.forEach((split) => {
      balances[split.memberId] = (balances[split.memberId] || 0) - split.amount;
    });
  });

  return balances;
}

export function calculateSettlements(
  members: Member[],
  expenses: Expense[]
): Settlement[] {
  const balances = calculateBalances(members, expenses);
  const memberMap: { [id: string]: Member } = {};
  members.forEach((m) => (memberMap[m.id] = m));

  // Create arrays of debtors (negative balance) and creditors (positive balance)
  const debtors = Object.entries(balances)
    .filter(([, bal]) => bal < -0.01)
    .map(([id, bal]) => ({ id, amount: Math.abs(bal) }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.entries(balances)
    .filter(([, bal]) => bal > 0.01)
    .map(([id, bal]) => ({ id, amount: bal }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0.01) {
      settlements.push({
        from: memberMap[debtor.id],
        to: memberMap[creditor.id],
        amount: Math.round(amount * 100) / 100,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  return settlements;
}

export function generateWhatsAppMessage(
  settlement: Settlement,
  tripName: string
): string {
  return encodeURIComponent(
    `Hi ${settlement.from.name}! 👋\n\n` +
    `🧳 For our trip *"${tripName}"*, you owe *₹${settlement.amount.toFixed(2)}* to *${settlement.to.name}*.\n\n` +
    `Please settle up at your earliest convenience! 😊\n\n` +
    `💰 Powered by *BillBuddies*`
  );
}

export const EXPENSE_CATEGORIES = [
  { label: 'Food & Drinks', icon: '🍽️', color: '#FF6B6B' },
  { label: 'Transport', icon: '🚗', color: '#4ECDC4' },
  { label: 'Hotel', icon: '🏨', color: '#45B7D1' },
  { label: 'Entertainment', icon: '🎉', color: '#F7DC6F' },
  { label: 'Shopping', icon: '🛍️', color: '#A29BFE' },
  { label: 'Fuel', icon: '⛽', color: '#FD79A8' },
  { label: 'Medical', icon: '💊', color: '#74B9FF' },
  { label: 'Other', icon: '📦', color: '#B2BEC3' },
];
