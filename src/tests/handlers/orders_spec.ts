
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Order Endpoints', () => {
    let token: string;
    let userId: number;
    let orderId: number;
    let productId: number;

    beforeAll(async () => {
        // Create a user and get JWT
        const userRes = await request.post('/users').send({
            first_name: 'OrderTester',
            last_name: 'User',
            password: 'password123',
        });
        token = userRes.body;

        // Decode token to get user id
        const payload = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );
        userId = payload.user.id;

        // Create a product
        const prodRes = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Order Endpoint Product',
                price: 15.0,
                description: 'Product for order tests',
            });
        productId = prodRes.body.id;
    });

    it('POST /orders should require auth token', async () => {
        const res = await request.post('/orders').send({
            user_id: userId,
            status: 'active',
        });
        expect(res.status).toBe(401);
    });

    it('POST /orders should create an order with valid token', async () => {
        const res = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                status: 'active',
            });
        expect(res.status).toBe(200);
        orderId = res.body.id;
        expect(res.body.status).toBe('active');
    });

    it('POST /orders/:id/products should add product to order', async () => {
        const res = await request
            .post(`/orders/${orderId}/products`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                product_id: productId,
                quantity: 2,
            });
        expect(res.status).toBe(200);
        expect(Number(res.body.quantity)).toBe(2);
    });

    it('POST /orders/:id/products should require auth token', async () => {
        const res = await request
            .post(`/orders/${orderId}/products`)
            .send({
                product_id: productId,
                quantity: 2,
            });
        expect(res.status).toBe(401);
    });

    it('GET /orders/current/:userId should return active order', async () => {
        const res = await request
            .get(`/orders/current/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('active');
    });

    it('GET /orders/current/:userId should require auth token', async () => {
        const res = await request.get(`/orders/current/${userId}`);
        expect(res.status).toBe(401);
    });

    it('GET /orders/completed/:userId should return completed orders', async () => {
        // Create a completed order
        await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                status: 'complete',
            });

        const res = await request
            .get(`/orders/completed/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /orders/completed/:userId should require auth token', async () => {
        const res = await request.get(`/orders/completed/${userId}`);
        expect(res.status).toBe(401);
    });

    it('PUT /orders/:id should require auth token', async () => {
        const res = await request
            .put(`/orders/${orderId}`)
            .send({ status: 'complete' });
        expect(res.status).toBe(401);
    });

    it('PUT /orders/:id should update order status with valid token', async () => {
        const res = await request
            .put(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'complete' });
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('complete');
    });

    it('DELETE /orders/:id should require auth token', async () => {
        const res = await request.delete(`/orders/${orderId}`);
        expect(res.status).toBe(401);
    });

    it('DELETE /orders/:id should delete order with valid token', async () => {
        // Create an order to delete
        const createRes = await request
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: userId,
                status: 'active',
            });
        const deleteId = createRes.body.id;

        const res = await request
            .delete(`/orders/${deleteId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain('deleted');
    });
});
