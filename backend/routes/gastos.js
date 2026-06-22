import express from 'express';
import { gastos } from '../data/gastos.js';
import { categorias } from '../data/categorias.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { categoria } = req.query;

  if (categoria) {
    const filtro = gastos.filter((gasto) =>
      gasto.categoria.toLowerCase() === categoria.toLowerCase()
    );
    return res.json(filtro);
  }

  return res.json(gastos);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const gasto = gastos.find((gastoItem) => gastoItem.id === id);

  if (!gasto) {
    return res.status(404).json({ error: 'Gasto no encontrado' });
  }

  return res.json(gasto);
});

router.post('/', (req, res) => {
  const { descripcion, monto, categoria, fecha } = req.body;

  if (!descripcion || !descripcion.toString().trim()) {
    return res.status(400).json({ error: 'Descripcion es obligatoria' });
  }

  if (monto === undefined || monto === null || monto === '') {
    return res.status(400).json({ error: 'Monto es obligatorio' });
  }

  const montoNumber = Number(monto);
  if (Number.isNaN(montoNumber) || montoNumber <= 0) {
    return res.status(400).json({ error: 'Monto debe ser mayor a 0' });
  }

  const categoriaValida = categorias.find(
    (cat) => cat.toLowerCase() === String(categoria).toLowerCase()
  );

  const fechaValida = fecha && String(fecha).trim() ? String(fecha).trim() : new Date().toISOString().slice(0, 10);

  const nuevoGasto = {
    id: Date.now().toString(),
    descripcion: descripcion.toString().trim(),
    monto: montoNumber,
    categoria: categoriaValida || 'Otro',
    fecha: fechaValida
  };

  gastos.push(nuevoGasto);
  return res.status(201).json(nuevoGasto);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { descripcion, monto, categoria, fecha } = req.body;
  const gasto = gastos.find((gastoItem) => gastoItem.id === id);

  if (!gasto) {
    return res.status(404).json({ error: 'Gasto no encontrado' });
  }

  if (!descripcion || !descripcion.toString().trim()) {
    return res.status(400).json({ error: 'Descripcion es obligatoria' });
  }

  if (monto === undefined || monto === null || monto === '') {
    return res.status(400).json({ error: 'Monto es obligatorio' });
  }

  const montoNumber = Number(monto);
  if (Number.isNaN(montoNumber) || montoNumber <= 0) {
    return res.status(400).json({ error: 'Monto debe ser mayor a 0' });
  }

  const categoriaValida = categorias.find(
    (cat) => cat.toLowerCase() === String(categoria).toLowerCase()
  );

  gasto.descripcion = descripcion.toString().trim();
  gasto.monto = montoNumber;
  gasto.categoria = categoriaValida || 'Otro';
  gasto.fecha = fecha && String(fecha).trim() ? String(fecha).trim() : gasto.fecha;

  return res.json(gasto);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const index = gastos.findIndex((gastoItem) => gastoItem.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Gasto no encontrado' });
  }

  const eliminado = gastos.splice(index, 1)[0];
  return res.json({ message: 'Gasto eliminado correctamente', gasto: eliminado });
});

export default router;
