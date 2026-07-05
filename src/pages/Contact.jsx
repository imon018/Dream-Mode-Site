import { siteConfig } from "../config/siteConfig";
default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <h1 className="text-4xl font-bold">
        Contact Us
      </h1>

      <div className="mt-6 space-y-2">
  <p>
    <strong>Phone:</strong> {siteConfig.phone}
  </p>

  <p>
    <strong>Email:</strong> {siteConfig.email}
  </p>

  <a
    href={siteConfig.facebook}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    Visit our Facebook Page
  </a>
</div>

      <form className="mt-8 space-y-4">

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Your Name"
        />

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Email"
        />

        <textarea
          className="w-full border rounded-lg p-3"
          rows="5"
          placeholder="Message"
        />

        <button className="bg-primary text-white px-6 py-3 rounded-lg">
          Send Message
        </button>

      </form>

    </div>
  );
}
