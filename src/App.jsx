import { useEffect, useState } from 'react';
import { obtenerGastos, obtenerCategorias, eliminarGasto } from './services/gastos.js';
import GastoForm from './GastoForm.jsx';
import GastoList from './GastoList.jsx';
import Resumen from './Resumen.jsx';

function App() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    async function cargarDatos() {
      setLoading(true);
      setError(null);
      try {
        const [gastosData, categoriasData] = await Promise.all([
          obtenerGastos(),
          obtenerCategorias()
        ]);
        setGastos(gastosData);
        setCategorias(categoriasData);
      } catch (err) {
        setError('No se pudieron cargar los datos. Revisa la conexión con el backend.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
  }, []);

  const gastosFiltrados = categoriaFiltro && categoriaFiltro !== ''
    ? gastos.filter((g) => String(g.categoria) === String(categoriaFiltro))
    : gastos;

  return (
    <div className="app-container">
      <header>
        <h1>Registro de Gastos</h1>
        <p>Base del proyecto lista. Conexión inicial a json-server y axios preparada.</p>
      </header>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <section className="main-section">
          <div className="form-card">
            <GastoForm
              categorias={categorias}
              onGastoCreado={(gasto) => setGastos((prev) => [gasto, ...prev])}
            />
          </div>

          <div className="gastos-card">
            <div className="gastos-header">
              <h2>Gastos</h2>
              <div className="gastos-controls">
                <label>
                  Filtrar por categoría:{' '}
                  <select value={categoriaFiltro} onChange={(e) => setCategoriaFiltro(e.target.value)}>
                    <option value="">Todas</option>
                    {categorias.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {loading ? (
              <div className="loading">Cargando gastos...</div>
            ) : (
              <>
                <GastoList
                  gastos={gastosFiltrados}
                  onEliminar={async (id) => {
                    try {
                      await eliminarGasto(id);
                      setGastos((prev) => prev.filter((g) => g.id !== id));
                    } catch (err) {
                      console.error('Error eliminando gasto', err);
                      setError('No se pudo eliminar el gasto. Intenta nuevamente.');
                    }
                  }}
                />

                <Resumen gastos={gastosFiltrados} />
              </>
            )}
          </div>

          <div className="debug-card">
            <h2>Categorías</h2>
            <pre>{JSON.stringify(categorias, null, 2)}</pre>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
