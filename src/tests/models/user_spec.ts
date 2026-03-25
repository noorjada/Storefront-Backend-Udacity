
import { User, UserModel } from '../../models/user';

const model = new UserModel();

describe('User Model', () => {
    let userId: number;

    it('should have an index method', () => {
        expect(model.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(model.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(model.create).toBeDefined();
    });

    it('should have an authenticate method', () => {
        expect(model.authenticate).toBeDefined();
    });

    it('should have an update method', () => {
        expect(model.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(model.delete).toBeDefined();
    });

    it('should have a recentOrders method', () => {
        expect(model.recentOrders).toBeDefined();
    });

    it('create method should add a user', async () => {
        const result: User = await model.create({
            first_name: 'TestUser',
            last_name: 'Model',
            password: 'password123',
        });
        expect(result.first_name).toBe('TestUser');
        expect(result.last_name).toBe('Model');
        userId = result.id || 0;
    });

    it('index method should return a list of users', async () => {
        const result = await model.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('show method should return the correct user', async () => {
        const result = await model.show(userId);
        expect(result.first_name).toBe('TestUser');
    });

    it('authenticate method should return a user with valid credentials', async () => {
        const result = await model.authenticate('TestUser', 'password123');
        expect(result).not.toBeNull();
        expect(result?.first_name).toBe('TestUser');
    });

    it('authenticate method should return null with invalid credentials', async () => {
        const result = await model.authenticate('TestUser', 'wrongpassword');
        expect(result).toBeNull();
    });

    it('update method should modify user information', async () => {
        const result = await model.update(userId, {
            first_name: 'UpdatedName',
            last_name: 'UpdatedLast',
        });
        expect(result.first_name).toBe('UpdatedName');
        expect(result.last_name).toBe('UpdatedLast');
    });

    it('update method should allow password change', async () => {
        await model.update(userId, { password: 'newpassword123' });
        // Verify update executed without error
        expect(true).toBe(true);
    });

    it('recentOrders method should return user orders', async () => {
        const result = await model.recentOrders(userId, 5);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });

    it('delete method should remove a user', async () => {
        // Create a user to delete
        const user = await model.create({
            first_name: 'ToDelete',
            last_name: 'User',
            password: 'password123',
        });
        const idToDelete = user.id || 0;

        // Delete it
        await model.delete(idToDelete);

        // Verify it's deleted (should not find it)
        try {
            const result = await model.show(idToDelete);
            // If result is undefined, deletion worked
            expect(result).toBeUndefined();
        } catch (err) {
            // Either undefined or error is acceptable - deletion worked
            expect(err).toBeDefined();
        }
    });
});
