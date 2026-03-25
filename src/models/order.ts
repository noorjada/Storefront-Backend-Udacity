
import client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderModel {
  async create(o: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const result = await conn.query(
        'INSERT INTO orders (user_id, status) VALUES ($1,$2) RETURNING *',
        [o.user_id, o.status]
      );
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create order: ${err}`);
    }
  }

  async currentOrderByUser(userId: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const result = await conn.query(
        "SELECT * FROM orders WHERE user_id=$1 AND status='active' ORDER BY created_at DESC LIMIT 1",
        [userId]
      );
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot get current order for user ${userId}: ${err}`);
    }
  }

  async completedOrdersByUser(userId: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const result = await conn.query(
        "SELECT * FROM orders WHERE user_id=$1 AND status='complete'",
        [userId]
      );
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get completed orders for user ${userId}: ${err}`);
    }
  }

  async addProduct(orderId: number, productId: number, quantity: number): Promise<OrderProduct> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,(SELECT price FROM products WHERE id=$2)) RETURNING *';
      const result = await conn.query(sql, [orderId, productId, quantity]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot add product ${productId} to order ${orderId}: ${err}`);
    }
  }

  async update(id: number, status: string): Promise<Order> {
    try {
      const conn = await client.connect();
      const result = await conn.query(
        'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *',
        [status, id]
      );
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot update order ${id}: ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await client.connect();
      await conn.query('DELETE FROM orders WHERE id=$1', [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot delete order ${id}: ${err}`);
    }
  }
}
