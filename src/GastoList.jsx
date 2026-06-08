import GastoItem from './GastoItem.jsx';

export default function GastoList({ gastos, onEliminar }) {
  if (!gastos || gastos.length === 0) {
    return (
      <div className="gasto-list empty">
        <p>No hay gastos para mostrar.</p>
      </div>
    );
  }

  return (
    <ul className="gasto-list">
      {gastos.map((gasto) => (
        <li key={gasto.id}>
          <GastoItem gasto={gasto} onEliminar={onEliminar} />
        </li>
      ))}
    </ul>
  );
}
