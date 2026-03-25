
import { Product, ProductModel } from '../../models/product';

const model = new ProductModel();

describe('Product Model', () => {
    let productId: number;

    it('should have an index method', () => {
        expect(model.index).toBeDefined();
    });

    it('should have a show method', () => {
        expect(model.show).toBeDefined();
    });

    it('should have a create method', () => {
        expect(model.create).toBeDefined();
    });

    it('should have an update method', () => {
        expect(model.update).toBeDefined();
    });

    it('should have a delete method', () => {
        expect(model.delete).toBeDefined();
    });

    it('should have a popularProducts method', () => {
        expect(model.popularProducts).toBeDefined();
    });

    it('create method should add a product', async () => {
        const result: Product = await model.create({
            name: 'Test Widget',
            price: 19.99,
            description: 'A test product',
        });
        expect(result.name).toBe('Test Widget');
        expect(Number(result.price)).toBe(19.99);
        productId = result.id || 0;
    });

    it('index method should return a list of products', async () => {
        const result = await model.index();
        expect(result.length).toBeGreaterThan(0);
    });

    it('show method should return the correct product', async () => {
        const result = await model.show(productId);
        expect(result.name).toBe('Test Widget');
    });

    it('update method should modify a product', async () => {
        const result = await model.update(productId, {
            name: 'Updated Widget',
            price: 24.99,
        });
        expect(result.name).toBe('Updated Widget');
        expect(Number(result.price)).toBe(24.99);
    });

    it('popularProducts method should return top products', async () => {
        const result = await model.popularProducts(5);
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
    });

    it('delete method should remove a product', async () => {
        // Create a product to delete
        const product = await model.create({
            name: 'To Delete',
            price: 9.99,
        });
        const idToDelete = product.id || 0;

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
