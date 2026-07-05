export function generateInvoice(order) {
  return {
    invoiceId: `INV-${Date.now()}`,
    orderId: order.id,
    customer: order.email,
    total: order.total,
    createdAt: new Date().toISOString()
  };
}
