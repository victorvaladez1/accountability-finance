import dayjs from "dayjs";

export function generateCashGraph(transactions, accounts) {
  const cashAccounts = accounts.filter(
    (a) => a.type === "Checking" || a.type === "Savings"
  );

  const initialBalances = {};
  cashAccounts.forEach((acc) => {
    initialBalances[acc._id] = acc.balance;
  });

  const cashAccountIds = cashAccounts.map((a) => a._id);

  const relevantTx = transactions
    .filter((tx) => tx.account && cashAccountIds.includes(tx.account._id))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  let runningBalances = { ...initialBalances };
  const dailyMap = new Map();

  relevantTx.forEach((tx) => {
    const dateKey = dayjs(tx.date).format("YYYY-MM-DD");
    const sign = tx.type === "Expense" ? -1 : 1;

    runningBalances[tx.account._id] += sign * tx.amount;

    const totalCash = Object.values(runningBalances).reduce((a, b) => a + b, 0);
    dailyMap.set(dateKey, { date: dateKey, totalCash });
  });

  return Array.from(dailyMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
}
