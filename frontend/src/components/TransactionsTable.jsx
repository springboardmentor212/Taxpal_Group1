export default function TransactionsTable({ rows = [] }) {
  if (!rows.length) {
    return <p className="muted">No transactions yet</p>;
  }

  return (
    <div className="card">
      <h3 className="card-title">Recent Transactions</h3>

      <table className="tx-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(tx => (
            <tr key={tx._id}>
              <td>
                {tx.date
                  ? new Date(tx.date).toLocaleDateString()
                  : "-"}
              </td>

              <td>{tx.description}</td>

              <td>{tx.category}</td>

              <td>₹{tx.amount}</td>

              <td>
                <span className={`pill ${tx.type}`}>
                  {tx.type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
