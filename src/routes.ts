import express from 'express'
import * as restaurantController from './controllers/restaurant.controller'
import * as dishCategoryController from './controllers/dish-category.controller'

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Hello, Deliveroo-backend!')
})

// routes to perform CRUD opertions on Resturant table
router.get('/restaurants', restaurantController.getAllRestaurants)
router.post('/restaurants', restaurantController.createRestaurant)
router.put('/restaurants/:id', restaurantController.updateRestaurant)
router.delete('/restaurants/:id', restaurantController.deleteRestaurant)

// routes to perform CRUD opertions on DishCategory table
router.get(
  '/restaurants/:restaurantId/dish-categories',
  dishCategoryController.getAll,
)
router.get(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.getOne,
)
router.post(
  '/restaurants/:restaurantId/dish-categories',
  dishCategoryController.create,
)
router.put(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.update,
)
router.delete(
  '/restaurants/:restaurantId/dish-categories/:id',
  dishCategoryController.remove,
)

export default router
