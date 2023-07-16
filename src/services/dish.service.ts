import Dish from '../models/dish.model';
import { PaginationOptions } from '../types/pagination-options';

export async function getDishesByCategoryAndRestaurant(
  categoryId: number,
  restaurantId: number,
  options: PaginationOptions,
) {
  try {
    const { limit = 10, page = 1 } = options;
    const offset = (page - 1) * limit;

    return Dish.findAll({
      where: {
        category_id: categoryId,
        restaurant_id: restaurantId,
      },
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error fetching dish:', error);
    throw new Error('Internal server error');
  }
}

export async function getDishById(id: number) {
  try {
    return Dish.findByPk(id);
  } catch (error) {
    console.error('Error fetching dish:', error);
    throw new Error('Internal server error');
  }
}

export async function createDish(dishData: Partial<Dish>) {
  try {
    return Dish.create(dishData);
  } catch (error) {
    console.error('Error creating dish:', error);
    throw new Error('Internal server error');
  }
}

export async function updateDish(id: number, dishData: Partial<Dish>) {
  try {
    const dish = await Dish.findByPk(id);
    if (!dish) {
      return null;
    }
    await dish.update(dishData);
    return dish;
  } catch (error) {
    console.error('Error updating dish:', error);
    throw new Error('Internal server error');
  }
}

export async function deleteDish(id: number) {
  try {
    const dish = await Dish.findByPk(id);
    if (dish) {
      await dish.destroy();
    }
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Internal server error');
  }
}
