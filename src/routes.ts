import express from 'express';
import * as restaurantController from './controllers/restaurant-controller';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, Deliveroo-backend!');
});

router.get('/restaurants', restaurantController.getAllRestaurants);
router.post('/restaurants', restaurantController.createRestaurant);
router.put('/restaurants/:id', restaurantController.updateRestaurant);
router.delete('/restaurants/:id', restaurantController.deleteRestaurant);

export default router;