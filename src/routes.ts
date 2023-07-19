import express from 'express';
import * as restaurantController from './controllers/restaurant.controller';
import * as dishCategoryController from './controllers/dish-category.controller';
import * as dishController from './controllers/dish.controller';
import * as dishRatingController from './controllers/dish-rating.controller';
import * as orderController from './controllers/order.controller';
import * as userController from './controllers/user.controller';
import authenticationMiddleware from './middleware/auth-middleware';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, Deliveroo-backend!');
});

// Routes to handle google authentication in serverSide
router.post('/createAuthLink', userController.creteAuthLink);
router.get('/handleGoogleRedirect', userController.handleGoogleRedirect);
router.post('/getValidToken', userController.getValidToken);

// Normal Signup and Login flow
router.post('/signUpOrLogin', userController.signUpOrLogin);

// Apply the authentication middleware to protect all the routes below this line
router.use(authenticationMiddleware);

//Sample protected routes
router.get('/protected', (req, res) => {
  res.send('Hello, Protected route!');
});

// routes to perform CRUD opertions on Resturant table
router.get('/restaurants', restaurantController.getAllRestaurants);
router.post('/restaurants', restaurantController.createRestaurant);
router.put('/restaurants/:id', restaurantController.updateRestaurant);
router.delete('/restaurants/:id', restaurantController.deleteRestaurant);

// routes to perform CRUD opertions on DishCategory table
router.get(
  '/restaurants/:restaurantId/dish-categories',
  dishCategoryController.getDishCategoriesByResturant,
);
router.get(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.getDishCategoryById,
);
router.post(
  '/restaurants/:restaurantId/dish-categories',
  dishCategoryController.createDishCategory,
);
router.put(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.updateDishCategory,
);
router.delete(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.deleteDishCategory,
);

// routes to perform CRUD opertions on Dish table
router.get(
  '/dishes/categories/:categoryId/restaurants/:restaurantId',
  dishController.getDishesByCategoryAndRestaurant,
);
router.get('/dishes/:id', dishController.getDishById);
router.post('/dishes/', dishController.createDish);
router.put('/dishes/:id', dishController.updateDish);
router.delete('/dishes/:id', dishController.deleteDish);

// routes to perform CRUD opertions on DishRating table
router.get(
  '/dishes/:dishId/dish-ratings',
  dishRatingController.getAllDishRatingsForDish,
);
router.get('/dish-ratings/:id', dishRatingController.getDishRatingById);
router.post('/dish-ratings', dishRatingController.createDishRating);
router.put('/dish-ratings/:id', dishRatingController.updateDishRating);
router.delete('/dish-ratings/:id', dishRatingController.deleteDishRating);

// routes to create, view, manage and change the status of orders
router.post('/restaurants/:restaurantId/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrder);
router.put('/orders/:id/status', orderController.updateOrderStatus);

export default router;
