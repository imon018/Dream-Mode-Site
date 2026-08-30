import { useState } from "react";

import PolicyLayout from "../components/PolicyLayout";

import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiSend,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

import {
  useSettings,
} from "../context/SettingsContext";

import {
  sendContactMessage,
  BD_PHONE_REGEX,
} from "../services/contactMessageService";

import {
  errorToast,
} from "../components/ui/Toast";



export default function Contact() {
  const { settings } = useSettings();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [phoneError, setPhoneError] = useState("");

  // "idle" | "sending" | "sent" — drives the button/inline feedback so
  // it's always clear whether the message actually went through.
  const [status, setStatus] = useState("idle");

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === "phone") setPhoneError("");
  };

  const submitHandler = async (e) => {

    e.preventDefault();

    if (!BD_PHONE_REGEX.test(form.phone.trim())) {
      setPhoneError(
        "Enter a valid number as 01XXXXXXXXX or +8801XXXXXXXXX"
      );
      return;
    }

    setStatus("sending");

    try {

      await sendContactMessage(form);

      setStatus("sent");
      setForm({ name: "", phone: "", subject: "", message: "" });

    } catch (error) {

      setStatus("idle");
      errorToast(error.message || "Failed to send message. Please try again.");

    }

  };


  return (

    <PolicyLayout

      title="Contact Us"

      description="We are always ready to help you with your shopping experience."

    >


      <div
        className="
        space-y-10
        "
      >



        <p>
          Have questions about products, orders, delivery or
          policies? Contact {settings.storeName || ""} support team and we
          will assist you as soon as possible.
        </p>





        {/* Contact Cards */}


        <div
          className="
          grid
          md:grid-cols-3
          gap-5
          "
        >



          <div
            className="
            bg-slate-50
            rounded-3xl
            p-6
            border
            border-slate-100
            "
          >

            <FiPhone
              className="
              text-amber-500
              text-3xl
              mb-4
              "
            />


            <h3
              className="
              font-bold
              text-blue-950
              "
            >
              Phone
            </h3>


            <p
              className="
              text-gray-600
              mt-2
              "
            >
              {settings.phone}
            </p>


          </div>






          <div
            className="
            bg-slate-50
            rounded-3xl
            p-6
            border
            border-slate-100
            "
          >

            <FiMail
              className="
              text-amber-500
              text-3xl
              mb-4
              "
            />


            <h3
              className="
              font-bold
              text-blue-950
              "
            >
              Email
            </h3>


            <p
              className="
              text-gray-600
              mt-2
              break-all
              "
            >
              {settings.email}
            </p>


          </div>







          <div
            className="
            bg-slate-50
            rounded-3xl
            p-6
            border
            border-slate-100
            "
          >

            <FiMapPin
              className="
              text-amber-500
              text-3xl
              mb-4
              "
            />


            <h3
              className="
              font-bold
              text-blue-950
              "
            >
              Location
            </h3>


            <p
              className="
              text-gray-600
              mt-2
              "
            >
              {settings.address}
            </p>


          </div>



        </div>








        {/* Social Buttons */}


        <div
          className="
          flex
          flex-wrap
          gap-4
          "
        >



          <a

            href={settings.facebook}

            target="_blank"

            rel="noopener noreferrer"

            className="
            inline-flex
            items-center
            gap-3
            px-6
            py-3
            rounded-full
            bg-blue-600
            text-white
            font-semibold
            hover:scale-105
            transition
            "

          >

            <FiFacebook />

            Facebook Page

          </a>






          <a

            href={`https://wa.me/${settings.whatsapp}`}

            target="_blank"

            rel="noopener noreferrer"

            className="
            inline-flex
            items-center
            gap-3
            px-6
            py-3
            rounded-full
            bg-amber-500
            text-black
            font-semibold
            hover:scale-105
            transition
            "

          >

            WhatsApp

          </a>



        </div>








        {/* Contact Form */}



        <div
          className="
          bg-slate-50
          rounded-[35px]
          p-6
          md:p-10
          "
        >


          <h2
            className="
            text-2xl
            md:text-3xl
            font-bold
            text-blue-950
            mb-6
            "
          >

            Send Us A Message

          </h2>





          <form

            onSubmit={submitHandler}

            className="
            space-y-5
            "

          >



            <input

              type="text"

              placeholder="Your Name"

              required

              value={form.name}

              onChange={updateField("name")}

              className="
              w-full
              rounded-2xl
              border
              border-slate-200
              px-5
              py-4
              outline-none
              focus:ring-2
              focus:ring-amber-500
              "

            />





            <div>

              <input

                type="tel"

                placeholder="Your Phone Number (01XXXXXXXXX)"

                required

                value={form.phone}

                onChange={updateField("phone")}

                className={`
                w-full
                rounded-2xl
                border
                px-5
                py-4
                outline-none
                focus:ring-2
                ${
                  phoneError
                    ? "border-red-300 focus:ring-red-400"
                    : "border-slate-200 focus:ring-amber-500"
                }
                `}

              />

              {phoneError && (
                <p className="text-red-500 text-sm mt-2 px-1">
                  {phoneError}
                </p>
              )}

            </div>






            <input

              type="text"

              placeholder="Subject"

              value={form.subject}

              onChange={updateField("subject")}

              className="
              w-full
              rounded-2xl
              border
              border-slate-200
              px-5
              py-4
              outline-none
              focus:ring-2
              focus:ring-amber-500
              "

            />






            <textarea

              rows="5"

              placeholder="Your Message"

              required

              value={form.message}

              onChange={updateField("message")}

              className="
              w-full
              rounded-2xl
              border
              border-slate-200
              px-5
              py-4
              outline-none
              focus:ring-2
              focus:ring-amber-500
              "

            />




            {status === "sent" && (
              <p
                className="
                flex
                items-center
                gap-2
                text-green-600
                font-semibold
                "
              >
                <FiCheckCircle />
                Your message has been sent. We will get back to you soon.
              </p>
            )}



            <button

              type="submit"

              disabled={status === "sending"}

              className="
              inline-flex
              items-center
              gap-3
              bg-blue-950
              text-white
              px-8
              py-4
              rounded-full
              font-bold
              hover:bg-blue-900
              transition
              disabled:opacity-60
              disabled:cursor-not-allowed
              "

            >

              {status === "sending" ? (
                <>
                  <FiLoader className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend />
                  Send Message
                </>
              )}


            </button>



          </form>



        </div>





      </div>



    </PolicyLayout>


  );

}
