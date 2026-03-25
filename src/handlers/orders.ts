
import { Application, Request, Response } from 'express';
import { verifyAuthToken } from '../middleware/auth';
import { OrderModel } from '../models/order';

const model = new OrderModel();

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await model.create(req.body);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

const currentOrderByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await model.currentOrderByUser(Number(req.params.userId));
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const completedOrdersByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await model.completedOrdersByUser(Number(req.params.userId));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const added = await model.addProduct(
      Number(req.params.id),
      req.body.product_id,
      req.body.quantity
    );
    res.json(added);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await model.update(Number(req.params.id), req.body.status);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    await model.delete(Number(req.params.id));
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export default function orderRoutes(app: Application): void {
  app.post('/orders', verifyAuthToken, create);
  app.get('/orders/current/:userId', verifyAuthToken, currentOrderByUser);
  app.get('/orders/completed/:userId', verifyAuthToken, completedOrdersByUser);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
  app.put('/orders/:id', verifyAuthToken, update);
  app.delete('/orders/:id', verifyAuthToken, destroy);
}
