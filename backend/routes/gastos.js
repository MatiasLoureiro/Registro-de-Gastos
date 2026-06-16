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
  const { descripcion, monto, categoria } = req.body;

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

  const nuevoGasto = {
    id: Date.now().toString(),
    descripcion: descripcion.toString().trim(),
    monto: montoNumber,
    categoria: categoriaValida || 'Otro',
    fecha: new Date().toISOString().slice(0, 10)
  };

  gastos.push(nuevoGasto);
  return res.status(201).json(nuevoGasto);
});

export default router;
