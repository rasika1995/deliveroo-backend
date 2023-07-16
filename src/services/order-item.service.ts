import { Transaction } from 'sequelize';
import OrderItem from '../models/order-items.model';

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

export async function deleteOrderItemByOrderId(
  orderId: number,
  transaction: Transaction | null,
) {
  try {
    await OrderItem.destroy({ where: { order_id: orderId }, transaction });
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw new Error('Internal server error');
  }
}
