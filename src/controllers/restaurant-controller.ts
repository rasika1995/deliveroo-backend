// src/controllers/restaurantController.ts

import { Request, Response } from 'express';
import * as restaurantService from '../services/restaurant-service';
import Restaurant from '../models/restaurant';

export async function getAllRestaurants(req: Request, res: Response): Promise<void> {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const restaurantData = new Restaurant(req.body);
    const restaurant = await restaurantService.createRestaurant(restaurantData.dataValues);
    res.status(201).json(restaurant);
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const restaurantData = new Restaurant(req.body);
    await restaurantService.updateRestaurant(Number(id), restaurantData.dataValues);
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

export async function deleteRestaurant(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await restaurantService.deleteRestaurant(Number(id));
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting restaurant:', error);
    if (error.message === 'Restaurant not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
