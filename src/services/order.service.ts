import { Transaction } from 'sequelize';
import Orders from '../models/order.model';
import OrderItem from '../models/order-items.model';

export async function createOrder(
  orderData: Partial<Orders>,
  transaction: Transaction | null,
) {
  try {
    const order = await Orders.create(orderData, { transaction });
    return order;
  } catch (error) {
    console.error('Error creating dish:', error);
    throw new Error('Internal server error');
  }
}

export async function getOrderWithItems(id: number) {
  try {
    return Orders.findOne({
      where: { id },
      include: { model: OrderItem, as: 'orderItems' },
    });
  } catch (error) {
    console.error('Error getting order with items:', error);
    throw new Error('Internal server error');
  }
}

export async function getOrderId(id: number) {
  try {
    return Orders.findByPk(id);
  } catch (error) {
    console.error('Error fetching dish:', error);
    throw new Error('Internal server error');
  }
}
