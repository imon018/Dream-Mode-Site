import PolicyFAQ from "../components/PolicyFAQ";


export default function FAQs() {


  const faqItems = [

    {
      question:
        "How can I place an order?",

      answer:
        "You can place an order by selecting your favorite product, adding it to your cart, and completing the checkout process."
    },


    {
      question:
        "How long does delivery take?",

      answer:
        "Inside Dhaka delivery usually takes 1-3 working days and outside Dhaka delivery usually takes 3-5 working days."
    },


    {
      question:
        "Do you provide return or exchange?",

      answer:
        "Yes, we provide return and exchange service according to our Return Policy. Please check our Return Policy page for details."
    },


    {
      question:
        "What payment methods do you accept?",

      answer:
        "We accept available payment methods shown during checkout."
    },


    {
      question:
        "How can I contact customer support?",

      answer:
        "You can contact us through our Contact Us page or available customer support channels."
    },


    {
      question:
        "Are product colors exactly the same as images?",

      answer:
        "We try our best to show accurate product images. However, slight color differences may occur due to screen settings."
    },


  ];



  return (

    <section
      className="
      min-h-screen
      bg-slate-50
      py-10
      md:py-20
      "
    >


      <div
        className="
        max-w-5xl
        mx-auto
        px-4
        sm:px-6
        "
      >


        <div
          className="
          bg-gradient-to-br
          from-slate-950
          via-blue-950
          to-slate-900
          rounded-[35px]
          p-6
          md:p-10
          shadow-2xl
          "
        >


          <h1
            className="
            text-3xl
            md:text-5xl
            font-bold
            text-amber-500
            "
          >
            Frequently Asked Questions
          </h1>



          <p
            className="
            mt-4
            text-slate-300
            "
          >
            Find answers to common questions about
            shopping, delivery, payment and services.
          </p>



          <div
            className="
            mt-8
            bg-white
            rounded-[30px]
            p-6
            md:p-10
            "
          >


            <PolicyFAQ
              items={faqItems}
            />


          </div>



        </div>



      </div>



    </section>

  );

}
