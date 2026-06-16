import express from 'express';
import { gastos } from '../data/gastos.js';

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

export default router;
