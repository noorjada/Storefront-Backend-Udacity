
import { Application, Request, Response } from 'express';
import { verifyAuthToken } from '../middleware/auth';
import { ProductModel } from '../models/product';

const model = new ProductModel();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await model.index();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await model.show(Number(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await model.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await model.update(Number(req.params.id), req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    await model.delete(Number(req.params.id));
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const popular = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await model.popularProducts(5);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export default function productRoutes(app: Application): void {
  app.get('/products', index);
  app.get('/products/popular', popular);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.put('/products/:id', verifyAuthToken, update);
  app.delete('/products/:id', verifyAuthToken, destroy);
}
