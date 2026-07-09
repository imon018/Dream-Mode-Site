export default function DeliveryInfo() {
  return (
    <section className="py-20">
      <div className="container-box">
        <div className="bg-primary text-white rounded-[30px] p-10 lg:p-16">

          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div>
              <h3 className="text-3xl mb-3">
                🚚
              </h3>

              <h4 className="font-semibold">
                Fast Delivery
              </h4>

              <p className="mt-2 text-white/80">
                Nationwide delivery available
              </p>
            </div>

            <div>
              <h3 className="text-3xl mb-3">
                🔄
              </h3>

              <h4 className="font-semibold">
                Easy Return
              </h4>

              <p className="mt-2 text-white/80">
                Hassle free return process
              </p>
            </div>

            <div>
              <h3 className="text-3xl mb-3">
                🛡️
              </h3>

              <h4 className="font-semibold">
                Secure Shopping
              </h4>

              <p className="mt-2 text-white/80">
                Trusted payment and checkout
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
