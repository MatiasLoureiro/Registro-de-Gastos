import { useEffect, useState } from 'react';
import { crearGasto, editarGasto } from './services/gastos.js';

export default function GastoForm({ categorias = [], gastoEditando, onGastoCreado, onGastoActualizado, onCancelarEdicion }) {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (gastoEditando) {
      setDescripcion(gastoEditando.descripcion || '');
      setMonto(String(gastoEditando.monto || ''));
      setFecha(gastoEditando.fecha || '');
      setCategoriaId(gastoEditando.categoriaId || '');
      setError(null);
    } else {
      setDescripcion('');
      setMonto('');
      setFecha('');
      setCategoriaId('');
      setError(null);
    }
  }, [gastoEditando]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!descripcion || !monto || !fecha || !categoriaId) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const gastoPayload = {
      descripcion: descripcion.trim(),
      monto: parseFloat(monto),
      fecha,
      categoriaId
    };

    try {
      setSubmitting(true);

      if (gastoEditando && gastoEditando.id) {
        const actualizado = await editarGasto(gastoEditando.id, gastoPayload);
        if (onGastoActualizado) onGastoActualizado(actualizado);
      } else {
        const creado = await crearGasto(gastoPayload);
        if (onGastoCreado) onGastoCreado(creado);
      }

      setDescripcion('');
      setMonto('');
      setFecha('');
      setCategoriaId('');
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el gasto. Revisa la conexión.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="gasto-form" onSubmit={handleSubmit}>
      <h2>{gastoEditando ? 'Editar Gasto' : 'Nuevo Gasto'}</h2>

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
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">-- Selecciona categoría --</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : gastoEditando ? 'Actualizar Gasto' : 'Agregar Gasto'}
        </button>
        {gastoEditando && (
          <button type="button" className="btn-secondary" onClick={onCancelarEdicion}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
