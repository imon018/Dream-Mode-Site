export async function sendOrderToSteadfast(order) {
  const response = await fetch("/api/steadfast/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      invoice: order.id,

      recipient_name: order.customerName,

      recipient_phone: order.phone,

      recipient_address:
        `${order.address}, ${order.thana || ""}, ${order.district || ""}`,

      cod_amount:
        order.paymentStatus === "Paid" ? 0 : Number(order.total),

      note: order.notes || "",

      item_description:
        order.items
          ?.map(item => item.name)
          .join(", "),

      total_lot:
        order.items?.reduce(
          (sum, item) =>
            sum + (item.quantity || 1),
          0
        ),

      delivery_type: 0,
    }),
  });

  return await response.json();
}
