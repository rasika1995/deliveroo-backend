import { Request, Response } from 'express';
import * as dishCategoryService from '../services/dish-category.service';
import { validateRequest } from '../common-utils/schema-validation';
import { PaginationOptions } from '../types/pagination-options';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';

// Define the validation schema for the request body
const dishCategorySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    restaurant_id: { type: 'number' },
  },
  required: ['name', 'restaurant_id'],
};

export async function getDishCategoriesByResturant(
  req: Request,
  res: Response,
) {
  try {
    const { restaurantId } = req.params;
    const paginationOptions: PaginationOptions = req.query;
    const dishCategories =
      await dishCategoryService.getDishCategoriesByResturant(
        parseInt(restaurantId, 10),
        paginationOptions,
      );
    sendResponse(res, 200, 'Dish categories retrived successfully', dishCategories);
  } catch (error) {
    console.error('Error fetching dish categories:', error);
    sendError(res, 500);
  }
}

export async function getDishCategoryById(req: Request, res: Response) {
  try {
    const { restaurantId, id } = req.params;
    const dishCategory = await dishCategoryService.getDishCategoryById(
      parseInt(restaurantId, 10),
      parseInt(id, 10),
    );
    if (!dishCategory) {
      return sendError(res, 404, "Dish category not found");
    }
    sendResponse(res, 200, 'Dish category retrived successfully', dishCategory);
  } catch (error) {
    console.error('Error fetching dish category:', error);
    sendError(res, 500);
  }
}

export async function createDishCategory(req: Request, res: Response) {
  try {
    const { restaurantId } = req.params;
    const { name } = req.body;
    // Validate the request body against the schema
    const validationErrors = validateRequest(dishCategorySchema, req.body);
    if (validationErrors) {
      console.log(validationErrors);
      return sendError(res, 400, JSON.stringify(validationErrors));
    }

    const createdDishCategory = await dishCategoryService.createDishCategory(
      parseInt(restaurantId, 10),
      name,
    );
    sendResponse(
      res,
      201,
      'Dish-category created successfully',
      createdDishCategory,
    );
  } catch (error) {
    console.error('Error creating dish category:', error);
    sendError(res, 500);
  }
}

export async function updateDishCategory(req: Request, res: Response) {
  try {
    const { restaurantId, id } = req.params;
    const { name } = req.body;

    // Validate the request body against the schema
    const validationErrors = validateRequest(dishCategorySchema, req.body);
    if (validationErrors) {
      return sendError(res, 400, JSON.stringify(validationErrors));
    }
    const updatedDishCategory = await dishCategoryService.updateDishCategory(
      parseInt(restaurantId, 10),
      parseInt(id, 10),
      name,
    );
    sendResponse(res, 200, 'Dish category updated successfully', updatedDishCategory);
  } catch (error) {
    console.error('Error updating dish category:', error);
    sendError(res, 500);
  }
}

export async function deleteDishCategory(req: Request, res: Response) {
  const { restaurantId, id } = req.params;

  try {
    await dishCategoryService.deleteDishCategory(
      parseInt(restaurantId, 10),
      parseInt(id, 10),
    );
    sendResponse(res, 204, 'Dish category deleted successfully');
  } catch (error) {
    console.error('Error deleting dish category:', error);
    sendError(res, 500);
  }
}
