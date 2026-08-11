export default async function handler(req, res) {
  try {
    const clientId = process.env.COURRIERFAST_CLIENT_ID;
    const clientSecret = process.env.COURRIERFAST_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        connected: false,
        step: "environment",
        message: "Courrierfast Client ID/Secret পাওয়া যায়নি",
      });
    }

    // Try JSON request
    const loginResponse = await fetch(
      "https://courrierfast.com/api/merchant/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
        }),
      }
    );

    const text = await loginResponse.text();

    let loginData;

    try {
      loginData = JSON.parse(text);
    } catch {
      loginData = {
        raw_response: text,
      };
    }

    console.log("Courrierfast Login Status:", loginResponse.status);
    console.log("Courrierfast Login Response:", loginData);

    if (!loginResponse.ok || !loginData?.token) {
      return res.status(401).json({
        connected: false,
        step: "courrierfast_login",
        http_status: loginResponse.status,
        response: loginData,
      });
    }

    return res.status(200).json({
      connected: true,
      message: "Courrierfast-এর সাথে কানেকশন সফল হয়েছে!",
      merchant: loginData?.merchant || null,
    });
  } catch (err) {
    console.error("Courrierfast Test Error:", err);

    return res.status(500).json({
      connected: false,
      step: "server",
      message: err.message,
    });
  }
}
