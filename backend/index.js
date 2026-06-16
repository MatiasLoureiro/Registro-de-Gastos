import express from 'express';
import morgan from 'morgan';
import categoriasRouter from './routes/categorias.js';
import gastosRouter from './routes/gastos.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/categorias', categoriasRouter);
app.use('/api/gastos', gastosRouter);

app.get('/', (req, res) => {
  res.send('Backend de gastos funcionando');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
