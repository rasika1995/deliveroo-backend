import DishCategory from '../models/dish-category.model';
import { PaginationOptions } from '../types/pagination-options';

export async function getDishCategoriesByResturant(
  restaurantId: number,
  options: PaginationOptions,
) {
  try {
    const { limit = 10, page = 1 } = options;
    const offset = (page - 1) * limit;
    return await DishCategory.findAndCountAll({
      where: { restaurantId },
      attributes: ['id', 'name', 'restaurant_id', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']],
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error('Error fetching dish-categories:', error);
    throw new Error('Internal server error');
  }
}

export async function getDishCategoryById(restaurantId: number, id: number) {
  try {
    return DishCategory.findOne({
      where: { restaurantId, id },
    });
  } catch (error) {
    console.error('Error fetching dish-category:', error);
    throw new Error('Internal server error');
  }
}

export async function createDishCategory(restaurantId: number, name: string) {
  try {
    return DishCategory.create({
      name,
      restaurant_id: restaurantId,
    });
  } catch (error) {
    console.error('Error creating dish-category:', error);
    throw new Error('Internal server error');
  }
}

export async function updateDishCategory(
  restaurantId: number,
  id: number,
  name: string,
) {
  try {
    const dishCategory = await DishCategory.findOne({
      where: { restaurantId, id },
    });

    if (!dishCategory) {
      return null;
    }
    dishCategory.name = name;
    await dishCategory.save();
    return dishCategory;
  } catch (error) {
    console.error('Error updating dish-category:', error);
    throw new Error('Internal server error');
  }
}

export async function deleteDishCategory(restaurantId: number, id: number) {
  try {
    const dishCategory = await DishCategory.findOne({
      where: { restaurantId, id },
    });
    if (dishCategory) {
      await dishCategory.destroy();
    }
  } catch (error) {
    console.error('Error deleting dish-category:', error);
    throw new Error('Internal server error');
  }
}
