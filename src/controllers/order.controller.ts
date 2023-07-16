import { Request, Response } from 'express';
import Orders from '../models/order.model';
import OrderItem from '../models/order-items.model';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';
import sequelize from '../db-config/mysql';
import { Transaction } from 'sequelize';
import * as orderService from '../services/order.service';
import * as orderItemService from '../services/order-item.service';

export async function placeOrder(req: Request, res: Response) {
  let transaction: Transaction | null = null;
  try {
    const { restaurant_id, status, customer_name, customer_email, orderItems } =
      req.body;

    // Start the transaction
    transaction = await sequelize.transaction();

    const order = await orderService.createOrder(
      { restaurant_id, status, customer_name, customer_email },
      transaction,
    );

    // Create the order items
    const items = await Promise.all(
      orderItems.map(async (item: Partial<OrderItem>) => {
        const orderItem = await orderItemService.createOrderItem(
          { ...item, order_id: order.id },
          transaction,
        );
        return orderItem;
      }),
    );

    // Commit the transaction
    await transaction.commit();

    // Calculate the total amount for the order
    const totalAmount = items.reduce(
      (sum: number, item: OrderItem) => sum + item.quantity * item.price,
      0,
    );

    const orderRes = {
      ...order.dataValues,
      total_amount: totalAmount,
      orderItems: items,
    };

    sendResponse(res, 201, 'Your Order created successfully', orderRes);
  } catch (error) {
    // Handle any error and rollback the transaction if necessary
    console.error(error);
    if (transaction) {
      await transaction.rollback();
    }
    // Send an error response
    sendError(res, 500, 'An error occurred while creating the order.');
  }
}
