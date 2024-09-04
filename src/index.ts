import express from 'express';

import productRoutes from './routes/productRoutes';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productRoutes);

app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
});

export default app;