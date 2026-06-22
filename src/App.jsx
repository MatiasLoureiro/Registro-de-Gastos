import { useEffect, useState } from 'react';
import { obtenerGastos, obtenerCategorias, eliminarGasto, editarGasto } from './services/gastos.js';
import GastoForm from './GastoForm.jsx';
import GastoList from './GastoList.jsx';
import Resumen from './Resumen.jsx';

function App() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [gastoEditando, setGastoEditando] = useState(null);

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

  const gastosConCategoria = gastos.map((gasto) => {
    const categoria = categorias.find((cat) => String(cat.id) === String(gasto.categoriaId));
    return {
      ...gasto,
      categoria: categoria ? categoria.nombre : 'Otro'
    };
  });

  const gastosFiltrados = categoriaFiltro && categoriaFiltro !== ''
    ? gastosConCategoria.filter((g) => String(g.categoriaId) === String(categoriaFiltro))
    : gastosConCategoria;

  return (
    <div className="app-container">
      <header>
        <h1>Registro de Gastos</h1>
        <p>Gestión de gastos con categorías por ID y nombre de categoría cruzado.</p>
      </header>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <section className="main-section">
          <div className="form-card">
            <GastoForm
              categorias={categorias}
              gastoEditando={gastoEditando}
              onGastoCreado={(gasto) => setGastos((prev) => [gasto, ...prev])}
              onGastoActualizado={(gastoActualizado) => {
                setGastos((prev) => prev.map((g) => (g.id === gastoActualizado.id ? gastoActualizado : g)));
                setGastoEditando(null);
              }}
              onCancelarEdicion={() => setGastoEditando(null)}
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
                      <option key={c.id} value={c.id}>{c.nombre}</option>
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
                  onEditar={(gasto) => setGastoEditando(gasto)}
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
