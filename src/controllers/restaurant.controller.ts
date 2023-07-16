import { Request, Response } from 'express';
import * as restaurantService from '../services/restaurant.service';
import Restaurant from '../models/restaurant.model';
import { validateRequest } from '../common-utils/schema-validation';

const createRestaurantSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    address: { type: 'string', minLength: 1 },
    city: { type: 'string', minLength: 1 },
    state: { type: 'string', minLength: 1 },
    postal_code: { type: 'string', minLength: 1 },
    phone: { type: 'string', minLength: 1 },
    website: { type: 'string', format: 'uri', nullable: true },
  },
  required: ['name', 'address', 'city', 'state', 'postal_code', 'phone'],
  additionalProperties: false,
};

const updateRestaurantSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    address: { type: 'string', minLength: 1 },
    city: { type: 'string', minLength: 1 },
    state: { type: 'string', minLength: 1 },
    postal_code: { type: 'string', minLength: 1 },
    phone: { type: 'string', minLength: 1 },
    website: { type: 'string', format: 'uri', nullable: true },
  },
  required: [],
  additionalProperties: false,
};

export async function getAllRestaurants(req: Request, res: Response) {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createRestaurant(req: Request, res: Response) {
  try {
    const validationErrors = validateRequest(createRestaurantSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }
    const restaurantData = new Restaurant(req.body);
    const restaurant = await restaurantService.createRestaurant(
      restaurantData.dataValues,
    );
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateRestaurant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validationErrors = validateRequest(updateRestaurantSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }
    const restaurantData = new Restaurant(req.body);
    await restaurantService.updateRestaurant(
      Number(id),
      restaurantData.dataValues,
    );
    res.json({ message: 'Restaurant updated successfully' });
  } catch (error: any) {
    console.error('Error updating restaurant:', error);
    if (error.message === 'Restaurant not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export async function deleteRestaurant(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    await restaurantService.deleteRestaurant(Number(id));
    res.status(204).send({ message: 'Restaurant deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting restaurant:', error);
    if (error.message === 'Restaurant not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
