import dayjs from "dayjs";

export function generatePerAccountCashGraphs(transactions, accounts) {

    const accountMap = {};

    accounts
    .filter((acc) => acc.type !== "Investment")
    .forEach((acc) => {
        accountMap[acc._id] = {
            accountId: acc._id,
            accountName: acc.name,
            snapshots: [],
        };
    });

    const txByAccount = {};

    transactions.forEach((tx) => {
        const accId = tx.account?._id || tx.account;
        if (!txByAccount[accId]) txByAccount[accId]= [];
        txByAccount[accId].push(tx);
    });

    Object.entries(txByAccount).forEach(([accId, txs]) => {
        let balance = accounts.find((a) => a._id === accId)?.balance || 0;
        
        const sorted = [...txs].sort((a, b) => new Date(b.date) - new Date(a.date));
        const snapshots = [];

        sorted.forEach((tx) => {
            const dateStr = dayjs(tx.date).format("YYYY-MM-DD");
            snapshots.unshift({
                timestamp: dateStr,
                value: balance,
            });
            
            if (tx.type == "Expense") {
                balance += tx.amount;
            } else {
                balance -= tx.amount;
            }
        });
        
        if (!snapshots.length || snapshots[0].value !== balance) {
            const nowStr = dayjs().format("YYYY-MM-DD");
            snapshots.unshift({ timestamp: nowStr, value: balance });
        }

        accountMap[accId].snapshots = snapshots;
    });

    return Object.values(accountMap);
}