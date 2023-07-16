import { Transaction } from 'sequelize';
import Dish from '../models/dish.model';
import Orders from '../models/order.model';

export async function getOrderId(id: number) {
  try {
    return Dish.findByPk(id);
  } catch (error) {
    console.error('Error fetching dish:', error);
    throw new Error('Internal server error');
  }
}

export async function createOrder(
  orderData: Partial<Orders>,
  transaction: Transaction | null,
) {
  try {
    console.log('TE', orderData);
    const order = await Orders.create(orderData, { transaction });
    return order;
  } catch (error) {
    console.error('Error creating dish:', error);
    throw new Error('Internal server error');
  }
}
