import express from 'express';
import { gastos } from '../data/gastos.js';
import { categorias } from '../data/categorias.js';

const router = express.Router();

function obtenerCategoriaPorId(id) {
  return categorias.find((cat) => cat.id === String(id));
}

function obtenerCategoriaPorNombre(nombre) {
  return categorias.find((cat) => cat.nombre.toLowerCase() === String(nombre).toLowerCase());
}

const categoriaPorDefecto = categorias.find((cat) => cat.nombre === 'Otro') || categorias[0];

router.get('/', (req, res) => {
  const { categoriaId, categoria } = req.query;

  if (categoriaId) {
    return res.json(gastos.filter((gasto) => gasto.categoriaId === String(categoriaId)));
  }

  if (categoria) {
    const categoriaEncontrada = obtenerCategoriaPorNombre(categoria);
    const categoriaIdEncontrada = categoriaEncontrada ? categoriaEncontrada.id : null;
    if (categoriaIdEncontrada) {
      return res.json(gastos.filter((gasto) => gasto.categoriaId === categoriaIdEncontrada));
    }
  }

  return res.json(gastos);
});

router.get('/resumen', (req, res) => {
  const resumen = gastos.reduce(
    (acc, gasto) => {
      const categoria = obtenerCategoriaPorId(gasto.categoriaId) || categoriaPorDefecto;
      const categoriaResumen = acc.porCategoria.find((item) => item.categoriaId === gasto.categoriaId);

      if (categoriaResumen) {
        categoriaResumen.total += gasto.monto;
        categoriaResumen.count += 1;
      } else {
        acc.porCategoria.push({
          categoriaId: gasto.categoriaId,
          categoria: categoria.nombre,
          total: gasto.monto,
          count: 1
        });
      }

      acc.total += gasto.monto;
      acc.count += 1;
      return acc;
    },
    { total: 0, count: 0, porCategoria: [] }
  );

  res.json(resumen);
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
  const { descripcion, monto, categoriaId, fecha } = req.body;

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

  const categoriaValida = obtenerCategoriaPorId(categoriaId);
  const fechaValida = fecha && String(fecha).trim() ? String(fecha).trim() : new Date().toISOString().slice(0, 10);

  const nuevoGasto = {
    id: Date.now().toString(),
    descripcion: descripcion.toString().trim(),
    monto: montoNumber,
    categoriaId: categoriaValida ? categoriaValida.id : categoriaPorDefecto.id,
    fecha: fechaValida
  };

  gastos.push(nuevoGasto);
  return res.status(201).json(nuevoGasto);
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { descripcion, monto, categoriaId, fecha } = req.body;
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

  const categoriaValida = obtenerCategoriaPorId(categoriaId);

  gasto.descripcion = descripcion.toString().trim();
  gasto.monto = montoNumber;
  gasto.categoriaId = categoriaValida ? categoriaValida.id : categoriaPorDefecto.id;
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
