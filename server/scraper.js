const puppeteer = require('puppeteer');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    headless: "new" // use the new headless mode
  });

  // Open a new page
  const page = await browser.newPage();
  // a.ui-link.group.f-ui-1.inline-block.relative.ui-link--inherit
  // Navigate to the website
  const targetUrl = 'https://openai.com/';
  await page.goto(targetUrl);

  // Check if the page navigated to the expected URL
  const currentUrl = page.url();
  if (currentUrl === targetUrl) {
    console.log('Successfully navigated to the right web page.');
  } else {
    console.error('Failed to navigate to the right web page. Current URL:', currentUrl);
  }

  // Capture a screenshot (optional)
  await page.screenshot({ path: 'screenshot.png' });

  // Close the browser
  await browser.close();
})();
