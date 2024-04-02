function isValidUrl(url) {
  // Check if the URL is defined and is a string
  if (typeof url !== "string") {
    return false;
  }

  // You can implement your own validation logic here
  // For simplicity, we'll just check if the URL starts with 'http://' or 'https://'
  return url.startsWith("http://") || url.startsWith("https://");
}

module.exports = { isValidUrl };