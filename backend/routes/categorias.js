import express from 'express';
import { categorias } from '../data/categorias.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(categorias);
});

export default router;
