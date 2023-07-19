import express from 'express';
import * as restaurantController from './controllers/restaurant.controller';
import * as dishCategoryController from './controllers/dish-category.controller';
import * as dishController from './controllers/dish.controller';
import * as dishRatingController from './controllers/dish-rating.controller';
import * as orderController from './controllers/order.controller';
import * as userController from './controllers/user.controller';
import sequelize from './db-config/mysql';

const publicRouter = express.Router(); 
const authRouter = express.Router();

publicRouter.get('/', (req, res) => {
  res.send('Hello, Deliveroo-backend!');
});

// Routes to handle google authentication in serverSide
publicRouter.get('/createAuthLink', userController.creteAuthLink);
publicRouter.get('/handleGoogleRedirect', userController.handleGoogleRedirect);
publicRouter.post('/getValidToken', userController.getValidToken);

// Normal Signup and Login flow
publicRouter.post('/signUpOrLogin', userController.signUpOrLogin);

// Test endpoint for checking MySQL connection
publicRouter.get('/test-connection', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('MySQL connection successful');
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    res.status(500).send('MySQL connection failed');
  }
});

//Sample protected routes
authRouter.get('/protected', (req, res) => {
  res.send('Hello, Protected route!');
});

// routes to perform CRUD opertions on Resturant table
authRouter.get('/restaurants', restaurantController.getAllRestaurants);
authRouter.post('/restaurants', restaurantController.createRestaurant);
authRouter.put('/restaurants/:id', restaurantController.updateRestaurant);
authRouter.delete('/restaurants/:id', restaurantController.deleteRestaurant);

// routes to perform CRUD opertions on DishCategory table
authRouter.get(
  '/restaurants/:restaurantId/dish-categories',
  dishCategoryController.getDishCategoriesByResturant,
);
authRouter.get(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.getDishCategoryById,
);
authRouter.post(
  '/restaurants/:restaurantId/dish-categories',
  dishCategoryController.createDishCategory,
);
authRouter.put(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.updateDishCategory,
);
authRouter.delete(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.deleteDishCategory,
);

// routes to perform CRUD opertions on Dish table
authRouter.get(
  '/dishes/categories/:categoryId/restaurants/:restaurantId',
  dishController.getDishesByCategoryAndRestaurant,
);
authRouter.get('/dishes/:id', dishController.getDishById);
authRouter.post('/dishes/', dishController.createDish);
authRouter.put('/dishes/:id', dishController.updateDish);
authRouter.delete('/dishes/:id', dishController.deleteDish);

// routes to perform CRUD opertions on DishRating table
authRouter.get(
  '/dishes/:dishId/dish-ratings',
  dishRatingController.getAllDishRatingsForDish,
);
authRouter.get('/dish-ratings/:id', dishRatingController.getDishRatingById);
authRouter.post('/dish-ratings', dishRatingController.createDishRating);
authRouter.put('/dish-ratings/:id', dishRatingController.updateDishRating);
authRouter.delete('/dish-ratings/:id', dishRatingController.deleteDishRating);

// routes to create, view, manage and change the status of orders
authRouter.post('/restaurants/:restaurantId/orders', orderController.createOrder);
authRouter.get('/orders/:id', orderController.getOrderById);
authRouter.put('/orders/:id', orderController.updateOrder);
authRouter.put('/orders/:id/status', orderController.updateOrderStatus);

// authRouter.use(publicRouter);

export { authRouter, publicRouter} ;
