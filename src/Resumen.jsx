export default function Resumen({ gastos }) {
  if (!gastos) gastos = [];

  const total = gastos.reduce((sum, g) => sum + Number(g.monto || 0), 0);
  const mayor = gastos.reduce((max, g) => {
    const m = Number(g.monto || 0);
    return m > max.monto ? { ...g, monto: m } : max;
  }, { monto: -Infinity });

  return (
    <div className="resumen-card">
      <h3>Resumen</h3>
      <div className="resumen-row">
        <strong>Total gastado:</strong>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="resumen-row">
        <strong>Mayor gasto:</strong>
        <span>{mayor && mayor.monto !== -Infinity ? `${mayor.descripcion} — $${Number(mayor.monto).toFixed(2)}` : '—'}</span>
      </div>
    </div>
  );
}
