
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('Product Endpoints', () => {
    let token: string;
    let productId: number;

    beforeAll(async () => {
        const res = await request.post('/users').send({
            first_name: 'ProductTester',
            last_name: 'User',
            password: 'password123',
        });
        token = res.body;
    });

    it('POST /products should require auth token', async () => {
        const res = await request.post('/products').send({
            name: 'Unauthorized Product',
            price: 10.0,
        });
        expect(res.status).toBe(401);
    });

    it('POST /products should create a product with valid token', async () => {
        const res = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Endpoint Widget',
                price: 29.99,
                description: 'A test product from endpoint',
            });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Endpoint Widget');
        productId = res.body.id;
    });

    it('GET /products should return a list of products', async () => {
        const res = await request.get('/products');
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('GET /products/:id should return a single product', async () => {
        const res = await request.get(`/products/${productId}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBeDefined();
    });

    it('GET /products/popular should return popular products', async () => {
        const res = await request.get('/products/popular');
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it('PUT /products/:id should require auth token', async () => {
        const res = await request
            .put(`/products/${productId}`)
            .send({ name: 'Updated Product' });
        expect(res.status).toBe(401);
    });

    it('PUT /products/:id should update product with valid token', async () => {
        const res = await request
            .put(`/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Widget',
                price: 39.99,
            });
        expect(res.status).toBe(200);
        expect(res.body.name).toBe('Updated Widget');
        expect(Number(res.body.price)).toBe(39.99);
    });

    it('DELETE /products/:id should require auth token', async () => {
        const res = await request.delete(`/products/${productId}`);
        expect(res.status).toBe(401);
    });

    it('DELETE /products/:id should delete product with valid token', async () => {
        // Create a product to delete
        const createRes = await request
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Product to Delete',
                price: 9.99,
            });
        const deleteId = createRes.body.id;

        const res = await request
            .delete(`/products/${deleteId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain('deleted');
    });
});
