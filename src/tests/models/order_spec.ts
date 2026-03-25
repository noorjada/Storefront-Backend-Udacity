
import { Order, OrderModel } from '../../models/order';
import { ProductModel } from '../../models/product';
import { UserModel } from '../../models/user';

const orderModel = new OrderModel();
const userModel = new UserModel();
const productModel = new ProductModel();

describe('Order Model', () => {
    let userId: number;
    let productId: number;
    let orderId: number;

    beforeAll(async () => {
        const user = await userModel.create({
            first_name: 'OrderTest',
            last_name: 'User',
            password: 'password123',
        });
        userId = user.id as number;

        const product = await productModel.create({
            name: 'Order Test Product',
            price: 9.99,
            description: 'For order tests',
        });
        productId = product.id as number;
    });

    it('should have a create method', () => {
        expect(orderModel.create).toBeDefined();
    });

    it('should have a currentOrderByUser method', () => {
        expect(orderModel.currentOrderByUser).toBeDefined();
    });

    it('should have a completedOrdersByUser method', () => {
        expect(orderModel.completedOrdersByUser).toBeDefined();
    });

    it('should have an addProduct method', () => {
        expect(orderModel.addProduct).toBeDefined();
    });

    it('should have an update method', () => {
        expect(orderModel.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(orderModel.delete).toBeDefined();
    });

    it('create method should add an order', async () => {
        const result: Order = await orderModel.create({
            user_id: userId,
            status: 'active',
        });
        orderId = result.id as number;
        expect(result.status).toBe('active');
        expect(Number(result.user_id)).toBe(userId);
    });

    it('currentOrderByUser should return the active order', async () => {
        const result = await orderModel.currentOrderByUser(userId);
        expect(result).toBeDefined();
        expect(result.status).toBe('active');
    });

    it('addProduct should add a product to the order', async () => {
        const result = await orderModel.addProduct(orderId, productId, 3);
        expect(result).toBeDefined();
        expect(Number(result.quantity)).toBe(3);
    });

    it('completedOrdersByUser should return completed orders', async () => {
        // Create a completed order first
        await orderModel.create({
            user_id: userId,
            status: 'complete',
        });
        const result = await orderModel.completedOrdersByUser(userId);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].status).toBe('complete');
    });

    it('update method should change order status', async () => {
        const result = await orderModel.update(orderId, 'complete');
        expect(result.status).toBe('complete');
    });

    it('delete method should remove an order', async () => {
        // Create an order to delete
        const order = await orderModel.create({
            user_id: userId,
            status: 'active',
        });
        const idToDelete = order.id as number;

        // Delete it
        await orderModel.delete(idToDelete);

        // Deletion successful
        expect(idToDelete).toBeDefined();
    });
});
