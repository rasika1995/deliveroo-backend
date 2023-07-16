import OrderItem from '../models/order-items.model';

export function calculateTotalAmount(orderItems: Array<OrderItem>) {
  const totalAmount = orderItems.reduce(
    (sum: number, item: OrderItem) => sum + item.quantity * item.price,
    0,
  );
  return totalAmount;
}
