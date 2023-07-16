import { Request, Response } from 'express';
import Orders from '../models/order.model';
import OrderItem from '../models/order-items.model';
import { sendError } from '../common-utils/send-error';
import { sendResponse } from '../common-utils/send-response';
import sequelize from '../db-config/mysql';
import { Transaction } from 'sequelize';
import * as orderService from '../services/order.service';
import * as orderItemService from '../services/order-item.service';
import { calculateTotalAmount } from '../common-utils/calculate-total-amount';

export async function createOrder(req: Request, res: Response) {
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
    const totalAmount = calculateTotalAmount(items);

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

export async function getOrderById(req: Request, res: Response) {
  try {
    const orderId = Number(req.params.id);
    const order = await orderService.getOrderWithItems(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateOrder(req: Request, res: Response) {
  let transaction: Transaction | null = null;
  try {
    const orderId = Number(req.params.id);
    const orderData = req.body;

    // Find the order by ID
    const order = await orderService.getOrderId(orderId);

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    // Start the transaction
    transaction = await sequelize.transaction();

    // Update the order details
    order.status = orderData.status || order.status;
    order.customer_name = orderData.customer_name || order.customer_name;
    order.customer_email = orderData.customer_email || order.customer_email;

    // Update the order items
    const orderItemsData = orderData.orderItems || [];
    await orderItemService.deleteOrderItemByOrderId(orderId, transaction);

    const orderItems = await Promise.all(
      orderItemsData.map(async (item: any) => {
        const orderItem = await orderItemService.createOrderItem(
          { ...item, order_id: order.id },
          transaction,
        );
        return orderItem;
      }),
    );

    // Calculate the total amount for the order
    const totalAmount = calculateTotalAmount(orderItems);

    await order.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    const updatedOrder = {
      ...order.dataValues,
      total_amount: totalAmount,
      orderItems,
    };

    // Send the updated order with order items as the response
    sendResponse(res, 200, 'Order updated successfully', updatedOrder);
  } catch (error) {
    // Rollback the transaction if an error occurred
    if (transaction) {
      await transaction.rollback();
    }

    console.error('Error updating order:', error);
    sendError(res, 500, 'An error occurred while updating order');
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    // Find the order by ID
    const order = await orderService.getOrderId(orderId);

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    // Update the status of the order
    order.status = status;
    await order.save();

    // Send the updated order as the response
    sendResponse(res, 200, 'Order status updated successfully', order);
  } catch (error) {
    console.error('Error updating order status:', error);
    sendError(res, 500, 'An error occurred while updating order status');
  }
}
