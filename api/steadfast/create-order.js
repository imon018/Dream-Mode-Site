export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://portal.packzy.com/api/v1/create_order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.STEADFAST_API_KEY,
          "Secret-Key": process.env.STEADFAST_SECRET_KEY,
        },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();

    console.log("Steadfast Response:", text);

    try {
      return res.status(response.status).json(JSON.parse(text));
    } catch {
      return res.status(response.status).json({
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
