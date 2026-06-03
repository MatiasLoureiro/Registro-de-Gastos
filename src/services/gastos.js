import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export async function obtenerGastos() {
  const response = await api.get('/gastos');
  return response.data;
}

export async function obtenerCategorias() {
  const response = await api.get('/categorias');
  return response.data;
}

export async function crearGasto(gasto) {
  const response = await api.post('/gastos', gasto);
  return response.data;
}

export async function eliminarGasto(id) {
  const response = await api.delete(`/gastos/${id}`);
  return response.data;
}
