// =================================================
// Courrierfast পার্সেল তৈরি — সার্ভার-সাইড প্রক্সি
//
// দুটো ধাপ: প্রথমে client_id/client_secret দিয়ে merchant login করে
// টোকেন নেওয়া হয়, তারপর সেই টোকেন দিয়ে "create-quickly" API কল করে
// পার্সেল বুক করা হয়। CLIENT_ID/CLIENT_SECRET কখনো ব্রাউজারে পাঠানো
// হয় না — শুধু এই সার্ভারলেস ফাংশনের মধ্যে থাকে (env variable থেকে)।
// =================================================

export default async function handler(req, res) {
  try {
    // ধাপ ১: Merchant Login — access token নেওয়া
    const loginForm = new FormData();
    loginForm.append("client_id", process.env.COURRIERFAST_CLIENT_ID);
    loginForm.append(
      "client_secret",
      process.env.COURRIERFAST_CLIENT_SECRET
    );

    const loginResponse = await fetch(
      "https://courrierfast.com/api/merchant/login",
      {
        method: "POST",
        body: loginForm,
      }
    );

    const loginData = await loginResponse.json();

    if (!loginResponse.ok || !loginData?.token) {
      console.error("Courrierfast login failed:", loginData);

      return res.status(401).json({
        success: false,
        message: loginData?.message || "Courrierfast login failed",
      });
    }

    // ধাপ ২: পার্সেল তৈরি
    const {
      customer_name,
      customer_contact_number,
      customer_address,
      have_exchange,
      cod_amount,
    } = req.body || {};

    const parcelForm = new FormData();
    parcelForm.append("customer_name", customer_name || "");
    parcelForm.append(
      "customer_contact_number",
      customer_contact_number || ""
    );
    parcelForm.append("customer_address", customer_address || "");
    parcelForm.append("have_exchange", have_exchange || "no");
    parcelForm.append("cod_amount", String(cod_amount ?? 0));

    const parcelResponse = await fetch(
      "https://courrierfast.com/api/merchant/parcel/create-quickly",
      {
        method: "POST",
        headers: {
          Authorization: `bearer ${loginData.token}`,
          Accept: "application/json",
        },
        body: parcelForm,
      }
    );

    const text = await parcelResponse.text();

    console.log("Courrierfast Response:", text);

    try {
      const parsed = JSON.parse(text);

      // ভ্যালিডেশন এরর হলে ঠিক কী ডেটা পাঠানো হয়েছিল সেটাও রেসপন্সের
      // সাথে জুড়ে দেওয়া হচ্ছে — ফ্রন্টএন্ডে দেখেই বোঝা যাবে কোন
      // ফিল্ডে সমস্যা, সার্ভার লগ চেক করার দরকার পড়বে না।
      if (!parcelResponse.ok || parsed?.success === false) {
        parsed._sentPayload = {
          customer_name,
          customer_contact_number,
          customer_address,
          have_exchange: have_exchange || "no",
          cod_amount: cod_amount ?? 0,
        };
      }

      return res.status(parcelResponse.status).json(parsed);
    } catch {
      return res.status(parcelResponse.status).json({
        success: false,
        message: text,
      });
    }
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
