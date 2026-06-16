import express from 'express';
import { gastos } from '../data/gastos.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(gastos);
});

export default router;
