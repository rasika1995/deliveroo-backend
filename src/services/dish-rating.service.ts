import DishRating from '../models/dish-rating.model';
import { PaginationOptions } from '../types/pagination-options';

export async function getAllDishRatingsForDish(
  dishId: number,
  options: PaginationOptions,
): Promise<DishRating[]> {
  try {
    const { limit = 10, page = 1 } = options;

    const offset = (page - 1) * limit;
    return await DishRating.findAll({
      where: { dish_id: dishId },
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error getting dish ratings for dish:', error);
    throw new Error('Internal server error');
  }
}

export async function getDishRatingById(
  id: number,
): Promise<DishRating | null> {
  try {
    return await DishRating.findByPk(id);
  } catch (error) {
    console.error('Error getting dish rating:', error);
    throw new Error(`${error}`);
  }
}

export async function createDishRating(
  dishRatingData: Partial<DishRating>,
): Promise<DishRating> {
  try {
    return await DishRating.create(dishRatingData);
  } catch (error) {
    console.error('Error creating dish rating:', error);
    throw new Error('Internal server error');
  }
}

export async function updateDishRating(
  id: number,
  dishRatingData: Partial<DishRating>,
): Promise<DishRating | null> {
  try {
    const dishRating = await DishRating.findByPk(id);
    if (dishRating) {
      await dishRating.update(dishRatingData);
      return dishRating;
    }
    return null;
  } catch (error) {
    console.error('Error updating dish rating:', error);
    throw new Error('Internal server error');
  }
}

export async function deleteDishRating(id: number): Promise<void> {
  try {
    const dishRating = await DishRating.findByPk(id);
    if (dishRating) {
      await dishRating.destroy();
    }
  } catch (error) {
    console.error('Error deleting dish rating:', error);
    throw new Error('Internal server error');
  }
}
