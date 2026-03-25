
import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  description?: string;
};

export class ProductModel {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const result = await conn.query('SELECT * FROM products');
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const result = await conn.query('SELECT * FROM products WHERE id=$1', [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find product ${id}: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = 'INSERT INTO products (name, price, description) VALUES ($1,$2,$3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.description]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot create product: ${err}`);
    }
  }

  async update(id: number, p: Partial<Product>): Promise<Product> {
    try {
      const conn = await client.connect();
      let sql = 'UPDATE products SET ';
      const updates: string[] = [];
      const values: unknown[] = [];
      let paramCount = 1;

      if (p.name !== undefined) {
        updates.push(`name=$${paramCount++}`);
        values.push(p.name);
      }
      if (p.price !== undefined) {
        updates.push(`price=$${paramCount++}`);
        values.push(p.price);
      }
      if (p.description !== undefined) {
        updates.push(`description=$${paramCount++}`);
        values.push(p.description);
      }

      sql += updates.join(', ');
      sql += ` WHERE id=$${paramCount} RETURNING *`;
      values.push(id);

      const result = await conn.query(sql, values);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot update product ${id}: ${err}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const conn = await client.connect();
      await conn.query('DELETE FROM products WHERE id=$1', [id]);
      conn.release();
    } catch (err) {
      throw new Error(`Cannot delete product ${id}: ${err}`);
    }
  }

  async popularProducts(limit: number = 5): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = `
        SELECT p.*, COUNT(oi.id) as order_count
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        GROUP BY p.id
        ORDER BY order_count DESC
        LIMIT $1
      `;
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get popular products: ${err}`);
    }
  }
}
