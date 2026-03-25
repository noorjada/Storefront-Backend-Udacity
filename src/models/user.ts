
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import client from '../database';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = Number(process.env.SALT_ROUNDS);

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserModel {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const result = await conn.query('SELECT id, first_name, last_name FROM users');
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const result = await conn.query('SELECT id, first_name, last_name FROM users WHERE id=$1', [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find user ${id}: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect();
      const hash = bcrypt.hashSync(u.password + pepper, saltRounds);
      const sql = 'INSERT INTO users (first_name, last_name, password) VALUES ($1,$2,$3) RETURNING *';
      const result = await conn.query(sql, [u.first_name, u.last_name, hash]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create user: ${err}`);
    }
  }

  async authenticate(firstName: string, password: string): Promise<User | null> {
    try {
      const conn = await client.connect();
      const result = await conn.query('SELECT * FROM users WHERE first_name=$1', [firstName]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(`Cannot authenticate user: ${err}`);
    }
  }

  async update(id: number, u: Partial<User>): Promise<User> {
    try {
      const conn = await client.connect();
      let sql = 'UPDATE users SET ';
      const updates: string[] = [];
      const values: unknown[] = [];
      let paramCount = 1;

      if (u.first_name !== undefined) {
        updates.push(`first_name=$${paramCount++}`);
        values.push(u.first_name);
      }
      if (u.last_name !== undefined) {
        updates.push(`last_name=$${paramCount++}`);
        values.push(u.last_name);
      }
      if (u.password !== undefined) {
        const hash = bcrypt.hashSync(u.password + pepper, saltRounds);
        updates.push(`password=$${paramCount++}`);
        values.push(hash);
      }

      sql += updates.join(', ');
      sql += ` WHERE id=$${paramCount} RETURNING id, first_name, last_name`;
      values.push(id);

      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot update user ${id}: ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await client.connect();
      await conn.query('DELETE FROM users WHERE id=$1', [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot delete user ${id}: ${err}`);
    }
  }

  async recentOrders(userId: number, limit: number = 5): Promise<unknown[]> {
    try {
      const conn = await client.connect();
      const sql = `
        SELECT o.id, o.status, o.created_at,
          json_agg(json_build_object('id', p.id, 'name', p.name, 'price', p.price, 'quantity', oi.quantity)) as products
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC
        LIMIT $2
      `;
      const result = await conn.query(sql, [userId, limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get recent orders for user ${userId}: ${err}`);
    }
  }
}
