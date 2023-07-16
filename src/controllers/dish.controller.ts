import { Request, Response } from 'express';
import * as dishService from '../services/dish.service';
import { validateRequest } from '../common-utils/schema-validation';
import { PaginationOptions } from '../types/pagination-options';

const createDishSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    restaurant_id: { type: 'number' },
    category_id: { type: 'number' },
    description: { type: 'string', nullable: true },
    price: { type: 'number', minimum: 0 },
  },
  required: ['name', 'price', 'restaurant_id', 'category_id'],
  additionalProperties: false,
};

const updateDishSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    description: { type: 'string', nullable: true },
    price: { type: 'number', minimum: 0 },
  },
  required: [],
  additionalProperties: false,
};

export async function getDishesByCategoryAndRestaurant(
  req: Request,
  res: Response,
) {
  try {
    const categoryId = Number(req.params.categoryId);
    const restaurantId = Number(req.params.restaurantId);
    const paginationOptions: PaginationOptions = req.query;

    const dishes = await dishService.getDishesByCategoryAndRestaurant(
      categoryId,
      restaurantId,
      paginationOptions,
    );
    res.json(dishes);
  } catch (error) {
    console.error('Error getting dishes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getDishById(req: Request, res: Response) {
  try {
    const dishId = Number(req.params.id);
    const dish = await dishService.getDishById(dishId);
    if (!dish) {
      res.status(404).json({ message: 'Dish not found' });
      return;
    }
    res.json(dish);
  } catch (error) {
    console.error('Error getting dish:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function createDish(req: Request, res: Response) {
  try {
    // Validate the request body against the schema
    const validationErrors = validateRequest(createDishSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }
    const dishData = req.body;
    const dish = await dishService.createDish(dishData);
    res.status(201).json(dish);
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateDish(req: Request, res: Response) {
  try {
    // Validate the request body against the schema
    const validationErrors = validateRequest(updateDishSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }
    const dishId = Number(req.params.id);
    const dishData = req.body;
    const updatedDish = await dishService.updateDish(dishId, dishData);
    if (!updatedDish) {
      res.status(404).json({ message: 'Dish not found' });
      return;
    }
    res.json(updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function deleteDish(req: Request, res: Response) {
  try {
    const dishId = Number(req.params.id);
    await dishService.deleteDish(dishId);
    res.status(204).json({ message: 'Dish deleted' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
