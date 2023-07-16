import { Transaction } from 'sequelize';
import Dish from '../models/dish.model';
import OrderItem from '../models/order-items.model';

export async function getOrderId(id: number) {
  try {
    return Dish.findByPk(id);
  } catch (error) {
    console.error('Error fetching dish:', error);
    throw new Error('Internal server error');
  }
}

export async function createOrderItem(
  orderItemData: Partial<OrderItem>,
  transaction: Transaction | null,
) {
  try {
    return await OrderItem.create(orderItemData, { transaction });
  } catch (error) {
    console.error('Error creating dish:', error);
    throw new Error('Internal server error');
  }
}
