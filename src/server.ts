
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Welcome route
app.get('/', (_req, res) => {
  res.json({
    message: 'Storefront Backend API',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      products: '/products',
      orders: '/orders',
      docs: 'See REQUIREMENTS.md for full API documentation'
    }
  });
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(3000, () => console.log('Server running on port 3000'))
  .on('error', (err) => console.error('Server error:', err));

export default app;
