import { Request, Response } from 'express';
import DishRating from '../models/dish-rating.model';
import * as dishRatingService from '../services/dish-rating.service';
import { PaginationOptions } from '../types/pagination-options';
import { validateRequest } from '../common-utils/schema-validation';

const createDishRatingSchema = {
  type: 'object',
  properties: {
    dish_id: { type: 'integer' },
    customer_name: { type: 'string' },
    rating: { type: 'integer' },
    comment: { type: 'string' },
  },
  required: ['dish_id', 'customer_name', 'rating'],
  additionalProperties: false,
};

const updateDishRatingSchema = {
  type: 'object',
  properties: {
    customer_name: { type: 'string' },
    rating: { type: 'integer' },
    comment: { type: 'string' },
  },
  additionalProperties: false,
};

export async function getAllDishRatingsForDish(req: Request, res: Response) {
  try {
    const { dishId } = req.params;
    const paginationOptions: PaginationOptions = req.query;
    const dishRatings = await dishRatingService.getAllDishRatingsForDish(
      Number(dishId),
      paginationOptions,
    );
    res.json(dishRatings);
  } catch (error) {
    console.error('Error getting dish ratings for dish:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getDishRatingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const dishRating = await dishRatingService.getDishRatingById(Number(id));

    if (!dishRating) {
      res.status(404).json({ error: 'Dish rating not found' });
      return;
    }

    res.json(dishRating);
  } catch (error) {
    console.error('Error getting dish rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createDishRating(req: Request, res: Response) {
  try {
    // Validate the request body against the schema
    const validationErrors = validateRequest(createDishRatingSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }
    const dishRatingData = req.body;
    const dishRating = await dishRatingService.createDishRating(dishRatingData);
    res.status(201).json(dishRating);
  } catch (error) {
    console.error('Error creating dish rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateDishRating(req: Request, res: Response) {
  try {
    // Validate the request body against the schema
    const validationErrors = validateRequest(updateDishRatingSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return res.status(400).json({ errors: validationErrors });
    }
    const { id } = req.params;
    const dishRatingData = req.body;
    const updatedDishRating = await dishRatingService.updateDishRating(
      Number(id),
      dishRatingData,
    );
    if (!updatedDishRating) {
      res.status(404).json({ error: 'Dish rating not found' });
      return;
    }
    res.json(updatedDishRating);
  } catch (error) {
    console.error('Error updating dish rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteDishRating(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    await dishRatingService.deleteDishRating(Number(id));
    res.status(204).json({ message: 'Dish rating deleted' });
  } catch (error) {
    console.error('Error deleting dish rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
