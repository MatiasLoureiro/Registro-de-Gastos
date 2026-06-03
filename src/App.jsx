import { useEffect, useState } from 'react';
import { obtenerGastos, obtenerCategorias } from './services/gastos.js';

function App() {
  const [gastos, setGastos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [gastosData, categoriasData] = await Promise.all([
          obtenerGastos(),
          obtenerCategorias()
        ]);
        setGastos(gastosData);
        setCategorias(categoriasData);
      } catch (err) {
        setError('No se pudieron cargar los datos. Revisa la conexión con json-server.');
        console.error(err);
      }
    }

    cargarDatos();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Registro de Gastos</h1>
        <p>Base del proyecto lista. Conexión inicial a json-server y axios preparada.</p>
      </header>

      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <section className="debug-section">
          <div className="debug-card">
            <h2>Gastos</h2>
            <pre>{JSON.stringify(gastos, null, 2)}</pre>
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
