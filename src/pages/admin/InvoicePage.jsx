export default function InvoicePage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="bg-black text-white p-5 text-center">
          <h1 className="text-xl font-black">
            Dream Mode
          </h1>

          <p className="text-xs opacity-80 mt-1">
            Invoice / Money Receipt
          </p>
        </div>

        {/* Customer */}
        <div className="p-5 border-b">
          <h2 className="font-bold mb-2">
            Customer Information
          </h2>

          <p>Name : Customer Name</p>
          <p>Phone : 01XXXXXXXXX</p>
          <p>Order : #000000</p>
        </div>

        {/* Products */}
        <div className="p-5 border-b">
          <h2 className="font-bold mb-3">
            Products
          </h2>

          <div className="flex justify-between text-sm mb-2">
            <span>T-Shirt</span>
            <span>৳1200</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Qty ×1</span>
            <span>৳1200</span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-5 space-y-2">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>৳1200</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>৳80</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-black text-lg">
            <span>Total</span>
            <span>৳1280</span>
          </div>

        </div>

      </div>
    </div>
  );
}
