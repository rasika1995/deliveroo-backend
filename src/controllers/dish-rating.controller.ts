import { Request, Response } from 'express';
import DishRating from '../models/dish-rating.model';
import * as dishRatingService from '../services/dish-rating.service';
import { PaginationOptions } from '../types/pagination-options';
import { validateRequest } from '../common-utils/schema-validation';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';

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
    sendResponse(res, 200, 'Dish ratings retrived successfully', dishRatings);
  } catch (error) {
    console.error('Error getting dish ratings for dish:', error);
    sendError(res, 500);
  }
}

export async function getDishRatingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const dishRating = await dishRatingService.getDishRatingById(Number(id));
    if (!dishRating) {
      return sendError(res, 404, 'Dish rating not found');
    }
    sendResponse(res, 200, 'Dish rating retrived successfully', dishRating);
  } catch (error) {
    console.error('Error getting dish rating:', error);
    sendError(res, 500);
  }
}

export async function createDishRating(req: Request, res: Response) {
  try {
    // Validate the request body against the schema

    console.log(req)
    const validationErrors = validateRequest(createDishRatingSchema, req.body);
    if (validationErrors) {
      return sendError(res, 400, JSON.stringify(validationErrors));
    }
    const dishRating = await dishRatingService.createDishRating(req.body);
    sendResponse(res, 201, 'Dish rating created successfully', dishRating);
  } catch (error) {
    console.log(error)
    console.error('Error creating dish rating:', error);
    sendError(res, 500);
  }
}

export async function updateDishRating(req: Request, res: Response) {
  try {
    // Validate the request body against the schema
    const validationErrors = validateRequest(updateDishRatingSchema, req.body);
    if (validationErrors) {
      return sendError(res, 400, JSON.stringify(validationErrors));
    }
    const { id } = req.params;
    const updatedDishRating = await dishRatingService.updateDishRating(
      Number(id),
      req.body,
    );
    if (!updatedDishRating) {
      return sendError(res, 404, 'Dish rating not found');
    }
    sendResponse(
      res,
      200,
      'Dish rating updated successfully',
      updatedDishRating,
    );
  } catch (error) {
    console.error('Error updating dish rating:', error);
    sendError(res, 500);
  }
}

export async function deleteDishRating(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;
    await dishRatingService.deleteDishRating(Number(id));
    sendResponse(res, 204, 'Dish rating deleted');
  } catch (error) {
    console.error('Error deleting dish rating:', error);
    sendError(res, 500);
  }
}
