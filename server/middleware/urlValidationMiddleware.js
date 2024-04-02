const { isValidUrl } = require('../utils');

// Middleware to check if URL is valid
async function checkUrl(req, res, next) {
  const url = req.body.url; // Assuming URL is passed in the request body

  try {
    // Perform asynchronous operation to validate URL
    const isValid = await validateUrlAsync(url);

    if (!isValid) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    // If URL is valid, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Error validating URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Example asynchronous function to validate URL
async function validateUrlAsync(url) {
  // Example asynchronous operation (e.g., querying a database or making an HTTP request)
  // For demonstration purposes, we'll just simulate an asynchronous delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // You can implement your own validation logic here
  // For simplicity, we'll just check if the URL starts with 'http://' or 'https://'
  return isValidUrl(url);
}

module.exports = { checkUrl };
