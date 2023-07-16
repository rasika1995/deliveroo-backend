import Restaurant from '../models/restaurant.model';

export async function getAllRestaurants(): Promise<Restaurant[]> {
  try {
    return await Restaurant.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'address',
        'city',
        'state',
        'postal_code',
        'phone',
        'website',
        'created_at',
        'updated_at',
      ],
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error('Internal server error');
  }
}

export const getRestaurantById = async (
  id: number,
): Promise<Restaurant | null> => {
  try {
    return await Restaurant.findByPk(id);
  } catch (error) {
    console.error('Error getting restaurant:', error);
    throw new Error('Internal server error');
  }
};

export async function createRestaurant(
  restaurantData: Partial<Restaurant>,
): Promise<Restaurant> {
  try {
    const restaurant = await Restaurant.create(restaurantData);
    return restaurant;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw new Error('Internal server error');
  }
}

export async function updateRestaurant(
  id: number,
  restaurantData: Partial<Restaurant>,
): Promise<Restaurant | null> {
  try {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return null;
    }
    await restaurant.update(restaurantData);
    return restaurant;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw new Error('Internal server error');
  }
}

export async function deleteRestaurant(id: number): Promise<void> {
  try {
    const dish = await Restaurant.findByPk(id);
    if (dish) {
      await dish.destroy();
    }
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw new Error('Internal server error');
  }
}
