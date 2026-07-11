import emailjs from "@emailjs/browser";

const SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID;

const TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendNewsletterEmail({
  toEmail,
  subject,
  message,
}) {

  return emailjs.send(

    SERVICE_ID,

    TEMPLATE_ID,

    {
      to_email: toEmail,
      subject,
      message,
    },

    PUBLIC_KEY

  );

}

export async function sendBulkEmails({
  emails,
  subject,
  message,
  onProgress,
}) {

  let success = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i++) {

    try {

      await sendNewsletterEmail({

        toEmail: emails[i],

        subject,

        message,

      });

      success++;

    } catch (error) {

      console.error(error);

      failed++;

    }

    if (onProgress) {

      onProgress({
        current: i + 1,
        total: emails.length,
        success,
        failed,
      });

    }

    // Rate limit এড়ানোর জন্য সামান্য delay
    await new Promise(resolve =>
      setTimeout(resolve, 400)
    );

  }

  return {
    success,
    failed,
  };

}
