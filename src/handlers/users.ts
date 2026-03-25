
import dotenv from 'dotenv';
import { Application, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAuthToken } from '../middleware/auth';
import { UserModel } from '../models/user';

dotenv.config();
const model = new UserModel();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await model.index();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await model.show(Number(req.params.id));
    const recentOrders = await model.recentOrders(Number(req.params.id), 5);
    res.json({ ...user, recentOrders });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await model.create(req.body);
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await model.authenticate(req.body.first_name, req.body.password);
    if (!user) {
      res.status(401).json('Incorrect credentials');
      return;
    }
    const token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await model.update(Number(req.params.id), req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    await model.delete(Number(req.params.id));
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
};

export default function userRoutes(app: Application): void {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.put('/users/:id', verifyAuthToken, update);
  app.delete('/users/:id', verifyAuthToken, destroy);
}
