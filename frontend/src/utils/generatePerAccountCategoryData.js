export function generatePerAccountCategoryData(transactions, accountId) {
    const filtered = transactions.filter(
      (tx) => tx.accountId === accountId && tx.type === "Expense"
    );
  
    const categoryMap = {};
  
    for (let tx of filtered) {
      if (!categoryMap[tx.category]) {
        categoryMap[tx.category] = 0;
      }
      categoryMap[tx.category] += tx.amount;
    }
  
    return Object.entries(categoryMap).map(([category, total]) => ({
      name: category,
      value: total,
    }));
  }
  