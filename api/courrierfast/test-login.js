// =================================================
// Courrierfast কানেকশন টেস্ট — শুধু লগইন করে দেখে
//
// এটা শুধু client_id/client_secret দিয়ে লগইন করে টোকেন নিতে পারছে
// কিনা সেটা চেক করে — কোনো পার্সেল/অর্ডার তৈরি করে না। তাই এটা
// যতবার খুশি কল করা নিরাপদ, কোনো রিয়েল বুকিং হবে না।
//
// ব্যবহার: ডিপ্লয়ের পর ব্রাউজারে বা Postman-এ এই URL-এ GET করুন —
//   https://your-domain.com/api/courrierfast/test-login
// =================================================

export default async function handler(req, res) {
  try {
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
      return res.status(401).json({
        connected: false,
        message: loginData?.message || "লগইন ব্যর্থ — Client ID/Secret চেক করুন",
      });
    }

    return res.status(200).json({
      connected: true,
      message: "✅ Courrierfast-এর সাথে কানেকশন সফল হয়েছে!",
      merchant_name: loginData?.merchant?.name || "",
      merchant_id: loginData?.merchant?.m_id || "",
      company_name: loginData?.merchant?.company_name || "",
      service_area_charges: loginData?.service_area_charges || [],
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      connected: false,
      message: err.message,
    });
  }
}
