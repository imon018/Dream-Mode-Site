// =================================================
// Courrierfast পার্সেল পাঠানোর সার্ভিস (ফ্রন্টএন্ড)
//
// আসল client_id/client_secret এখানে নেই — শুধু আমাদের নিজের
// সার্ভারলেস প্রক্সি (/api/courrierfast/create-order) কল করা হয়,
// যেটা ব্যাকএন্ডে গিয়ে Courrierfast-এর সাথে লগইন করে পার্সেল বুক করে।
// =================================================

export async function sendOrderToCourrierfast(order) {
  const response = await fetch("/api/courrierfast/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      customer_name: order.customerName,

      customer_contact_number: order.phone,

      customer_address:
        `${order.address}, ${order.thana || ""}, ${order.district || ""}`,

      have_exchange: "no",

      // পেমেন্ট মেথড bKash/Nagad-এ আগে থেকেই পুরো টাকা পেইড হলে
      // (paymentStatus === "Paid") কিছুই কালেক্ট করতে হবে না।
      cod_amount:
        order.paymentStatus === "Paid" ? 0 : Number(order.total),
    }),
  });

  return await response.json();
}
