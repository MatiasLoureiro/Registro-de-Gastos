import { useState } from 'react';
import { crearGasto } from './services/gastos.js';

export default function GastoForm({ categorias = [], onGastoCreado }) {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!descripcion || !monto || !fecha || !categoria) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const nuevo = {
      descripcion: descripcion.trim(),
      monto: parseFloat(monto),
      fecha,
      categoriaId: isNaN(Number(categoria)) ? categoria : Number(categoria)
    };

    try {
      setSubmitting(true);
      const creado = await crearGasto(nuevo);
      setDescripcion('');
      setMonto('');
      setFecha('');
      setCategoria('');
      if (onGastoCreado) onGastoCreado(creado);
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el gasto. Revisa la conexión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="gasto-form" onSubmit={handleSubmit}>
      <h2>Nuevo Gasto</h2>

      <label>
        Descripción
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción del gasto"
        />
      </label>

      <label>
        Monto
        <input
          type="number"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="0.00"
        />
      </label>

      <label>
        Fecha
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </label>

      <label>
        Categoría
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">-- Selecciona categoría --</option>
          {categorias.map((c) => (
            <option key={c.id ?? c._id ?? c.nombre} value={c.id ?? c._id ?? c.nombre}>
              {c.nombre ?? c.name ?? c.label ?? c.titulo ?? c.title}
            </option>
          ))}
        </select>
      </label>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : 'Agregar Gasto'}
      </button>
    </form>
  );
}
