const salesData = [
  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
  { name: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
  { name: 'Sofia Davis', email: 'sofia.davis@email.com', amount: '+$39.00' },
];

const RecentSales = () => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ventas Recientes</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">Se realizaron 265 ventas este mes.</p>
      <div className="mt-6 space-y-4">
        {salesData.map((sale) => (
          <div key={sale.email} className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{sale.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{sale.email}</p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{sale.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSales;