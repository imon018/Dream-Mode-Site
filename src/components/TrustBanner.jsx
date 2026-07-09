export default function TrustBanner() {
  return (
    <section className="pb-20">

      <div className="container-box">

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-premium
            p-8
            md:p-10
          "
        >

          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div>
              <h3 className="font-bold">
                ✓ Secure Payments
              </h3>
            </div>

            <div>
              <h3 className="font-bold">
                ✓ Fast Delivery
              </h3>
            </div>

            <div>
              <h3 className="font-bold">
                ✓ Premium Quality
              </h3>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
