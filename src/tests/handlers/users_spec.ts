
import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('User Endpoints', () => {
    let token: string;
    let userId: number;

    it('POST /users should create a user and return a token', async () => {
        const res = await request.post('/users').send({
            first_name: 'EndpointTest',
            last_name: 'User',
            password: 'password123',
        });
        expect(res.status).toBe(200);
        token = res.body;
        expect(token).toBeDefined();
    });

    it('POST /users/authenticate should authenticate and return token', async () => {
        const res = await request.post('/users/authenticate').send({
            first_name: 'EndpointTest',
            password: 'password123',
        });
        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
    });

    it('GET /users should require auth token', async () => {
        const res = await request.get('/users');
        expect(res.status).toBe(401);
    });

    it('GET /users should return list with valid token', async () => {
        const res = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        userId = res.body[0].id;
    });

    it('GET /users/:id should return a user with valid token', async () => {
        const res = await request
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.first_name).toBeDefined();
        expect(res.body.recentOrders).toBeDefined();
    });

    it('PUT /users/:id should update user with valid token', async () => {
        const res = await request
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                first_name: 'UpdatedName',
                last_name: 'UpdatedLast',
            });
        expect(res.status).toBe(200);
        expect(res.body.first_name).toBe('UpdatedName');
    });

    it('PUT /users/:id should require auth token', async () => {
        const res = await request
            .put(`/users/${userId}`)
            .send({ first_name: 'Test' });
        expect(res.status).toBe(401);
    });

    it('DELETE /users/:id should delete user with valid token', async () => {
        // Create a new user to delete
        const createRes = await request.post('/users').send({
            first_name: 'ToDelete',
            last_name: 'User',
            password: 'password123',
        });
        const deleteToken = createRes.body;
        const userRes = await request
            .get('/users')
            .set('Authorization', `Bearer ${deleteToken}`);
        const userToDelete = userRes.body[0];

        const res = await request
            .delete(`/users/${userToDelete.id}`)
            .set('Authorization', `Bearer ${deleteToken}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toContain('deleted');
    });

    it('DELETE /users/:id should require auth token', async () => {
        const res = await request.delete(`/users/${userId}`);
        expect(res.status).toBe(401);
    });
});
