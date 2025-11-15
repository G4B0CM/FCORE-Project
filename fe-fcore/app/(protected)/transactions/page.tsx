// src/app/(protected)/transactions/page.tsx
export default function TransactionsPage() {
  const TransactionsTable = require('./components/TransactionsTable').default;
  return <TransactionsTable />;
}
