import { Request, Response } from 'express'
import * as dishCategoryService from '../services/dish-category.service'
import { validateRequest } from '../common-utils/schema-validation'
import { PaginationOptions } from '../types/pagination-options'

// Define the validation schema for the request body
const dishCategorySchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
}

export async function getAll(req: Request, res: Response) {
  try {
    const { restaurantId } = req.params
    const paginationOptions: PaginationOptions = req.query
    const dishCategories = await dishCategoryService.getAllDishCategories(
      parseInt(restaurantId, 10),
      paginationOptions,
    )
    res.json(dishCategories)
  } catch (error) {
    console.error('Error fetching dish categories:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const { restaurantId, id } = req.params
    const dishCategory = await dishCategoryService.getDishCategoryById(
      parseInt(restaurantId, 10),
      parseInt(id, 10),
    )

    if (!dishCategory) {
      return res.status(404).json({ error: 'Dish category not found' })
    }

    res.json(dishCategory)
  } catch (error) {
    console.error('Error fetching dish category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { restaurantId } = req.params
    const { name } = req.body
    // Validate the request body against the schema
    const validationErrors = validateRequest(dishCategorySchema, req.body)
    if (validationErrors) {
      console.log(validationErrors)
      return res.status(400).json({ errors: validationErrors })
    }

    const createdDishCategory = await dishCategoryService.createDishCategory(
      parseInt(restaurantId, 10),
      name,
    )

    res.status(201).json(createdDishCategory)
  } catch (error) {
    console.error('Error creating dish category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { restaurantId, id } = req.params
    const { name } = req.body

    // Validate the request body against the schema
    const validationErrors = validateRequest(dishCategorySchema, req.body)
    if (validationErrors) {
      return res.status(400).json({ errors: validationErrors })
    }
    const updatedDishCategory = await dishCategoryService.updateDishCategory(
      parseInt(restaurantId, 10),
      parseInt(id, 10),
      name,
    )

    res.json(updatedDishCategory)
  } catch (error) {
    console.error('Error updating dish category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function remove(req: Request, res: Response) {
  const { restaurantId, id } = req.params

  try {
    await dishCategoryService.deleteDishCategory(
      parseInt(restaurantId, 10),
      parseInt(id, 10),
    )
    res.status(204).send('Dish category deleted successfully')
  } catch (error) {
    console.error('Error deleting dish category:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
