export default async function handler(req, res) {
  try {
    const loginForm = new FormData();

    loginForm.append(
      "email",
      process.env.COURRIERFAST_EMAIL
    );

    loginForm.append(
      "password",
      process.env.COURRIERFAST_PASSWORD
    );

    const loginResponse = await fetch(
      "https://courrierfast.com/api/merchant/login",
      {
        method: "POST",
        body: loginForm,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const loginData = await loginResponse.json();

    console.log("Courrierfast login:", loginResponse.status, loginData);

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
      message: "Courrierfast login successful",
      merchant: loginData?.merchant || null,
    });

  } catch (err) {
    console.error("Courrierfast test error:", err);

    return res.status(500).json({
      connected: false,
      step: "server",
      message: err.message,
    });
  }
}
