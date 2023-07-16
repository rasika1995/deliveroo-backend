import express from 'express';
import * as restaurantController from './controllers/restaurant.controller';
import * as dishCategoryController from './controllers/dish-category.controller';
import * as dishController from './controllers/dish.controller';
import * as dishRatingController from './controllers/dish-rating.controller';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello, Deliveroo-backend!');
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

export default router;
