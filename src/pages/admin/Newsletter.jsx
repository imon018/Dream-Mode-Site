import { useState } from "react";

import { getSubscriberEmails } from "../../services/newsletterService";

import {
  successToast,
  errorToast,
} from "../../components/ui/Toast";

export default function Newsletter() {

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadSubscribers() {

    try {

      setLoading(true);

      const emails = await getSubscriberEmails();

      if (emails.length === 0) {

        errorToast("No subscribers found.");

        return;

      }

      await navigator.clipboard.writeText(
        emails.join(", ")
      );

      successToast(
        `${emails.length} subscriber emails copied.`
      );

    } catch (error) {

      console.log(error);

      errorToast("Failed to load subscribers.");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="p-6">

      <h1 className="text-3xl font-black text-blue-900 mb-8">
        Newsletter
      </h1>

      <div className="bg-white rounded-3xl shadow-xl p-8">

        <div className="mb-5">

          <label className="font-semibold">
            Subject
          </label>

          <input
            type="text"
            value={subject}
            onChange={(e)=>setSubject(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mt-2"
            placeholder="Newsletter Subject"
          />

        </div>

        <div className="mb-6">

          <label className="font-semibold">
            Message
          </label>

          <textarea
            rows="10"
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mt-2"
            placeholder="Write your newsletter..."
          />

        </div>

        <button
          onClick={loadSubscribers}
          disabled={loading}
          className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold"
        >
          {
            loading
            ? "Loading..."
            : "Copy All Subscriber Emails"
          }
        </button>

      </div>

    </div>

  );

}
