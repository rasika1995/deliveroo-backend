import { Request, Response } from 'express';
import * as dishService from '../services/dish.service';
import { validateRequest } from '../common-utils/schema-validation';
import { PaginationOptions } from '../types/pagination-options';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';

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
    const { categoryId, restaurantId } = req.params;
    const paginationOptions: PaginationOptions = req.query;

    const dishes = await dishService.getDishesByCategoryAndRestaurant(
      Number(categoryId),
      Number(restaurantId),
      paginationOptions,
    );
    sendResponse(res, 200, 'Dishes retrived successfully', dishes);
  } catch (error) {
    console.error('Error getting dishes:', error);
    sendError(res, 500);
  }
}

export async function getDishById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const dish = await dishService.getDishById(Number(id));
    if (!dish) {
      return sendError(res, 404, 'Dish not found');
    }
    sendResponse(res, 200, 'Dish retrived successfully', dish);
  } catch (error) {
    console.error('Error getting dish:', error);
    sendError(res, 500);
  }
}

export async function createDish(req: Request, res: Response) {
  try {
    // Validate the request body against the schema
    const validationErrors = validateRequest(createDishSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return sendError(res, 400, JSON.stringify(validationErrors));
    }
    const dish = await dishService.createDish(req.body);
    sendResponse(res, 201, 'Dish created successfully', dish);
  } catch (error) {
    console.error('Error creating dish:', error);
    sendError(res, 500);
  }
}

export async function updateDish(req: Request, res: Response) {
  try {
    // Validate the request body against the schema
    const validationErrors = validateRequest(updateDishSchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return sendError(res, 400, JSON.stringify(validationErrors));
    }
    const { id } = req.params;
    const updatedDish = await dishService.updateDish(Number(id), req.body);
    if (!updatedDish) {
      return sendError(res, 404, 'Dish not found');
    }
    sendResponse(res, 200, 'Dish updated successfully', updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
    sendError(res, 500);
  }
}

export async function deleteDish(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await dishService.deleteDish(Number(id));
    sendResponse(res, 204, 'Dish deleted successfully');
  } catch (error) {
    console.error('Error deleting dish:', error);
    sendError(res, 500);
  }
}
