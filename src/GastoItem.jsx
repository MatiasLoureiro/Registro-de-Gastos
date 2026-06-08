export default function GastoItem({ gasto, onEliminar }) {
  const { id, descripcion, monto, fecha, categoria } = gasto;

  return (
    <div className="gasto-item">
      <div className="gasto-main">
        <div className="gasto-desc">{descripcion}</div>
        <div className="gasto-meta">
          <span className="gasto-monto">${monto}</span>
          <span className="gasto-fecha">{fecha}</span>
          <span className="gasto-categoria">{categoria}</span>
        </div>
      </div>
      <div className="gasto-actions">
        <button className="btn-eliminar" onClick={() => onEliminar(id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}
