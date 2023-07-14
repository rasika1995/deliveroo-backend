import Restaurant from '../models/restaurant';

export async function getAllRestaurants(): Promise<Restaurant[]> {
  try {
    const restaurants = await Restaurant.findAll({
      attributes: ['id', 'name', 'description', 'address', 'city', 'state', 'postal_code', 'phone', 'website', 'created_at', 'updated_at'],
    })
    return restaurants;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw new Error('Internal server error');
  }
}

export async function createRestaurant(restaurantData: Partial<Restaurant>): Promise<Restaurant> {
  try {
    const restaurant = await Restaurant.create(restaurantData);
    return restaurant;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw new Error('Internal server error');
  }
}

export async function updateRestaurant(id: number, restaurantData: Partial<Restaurant>): Promise<void> {
  try {
    const [rowsUpdated] = await Restaurant.update(restaurantData, {
      where: { id },
    });
    if (rowsUpdated === 0) {
      throw new Error('Restaurant not found');
    }
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw new Error('Internal server error');
  }
}

export async function deleteRestaurant(id: number): Promise<void> {
  try {
    const rowsDeleted = await Restaurant.destroy({
      where: { id },
    });
    if (rowsDeleted === 0) {
      throw new Error('Restaurant not found');
    }
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw new Error('Internal server error');
  }
}
