const asyncHandler = require("express-async-handler");
const OpenAI = require('openai');
const dotenv = require('dotenv');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define your ChatGPT Function
async function callChatGPTWithFunctions(userMessage) {
  let messages = [{
    role: "system",
    content: "Perform function requests for the user",
  }, {
    role: "user",
    content: userMessage,
  }];

  function helloWorld(appendString){
    let hello = "Hello World! " + appendString
    return hello
  }

  // Step 1: Call ChatGPT with the function name
  let chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
    language: "zh", // Set the language to Chinese
    function_definitions: [{
      name: "helloWorld",
      description: "Prints hello world with the string passed to it",
      parameters: {
        type: "object",
        properties: {
          appendString: {
            type: "string",
            description: "The string to append to the hello world message",
          },
        },
        require: ["appendString"],
      }
    }],
    function_calls: "auto",
  });

  let wantsToUseFunction = chat.data.choices[0].reason == "function_call";

  // Step 2: Check if ChatGPT wants to use a function
  if (wantsToUseFunction) {
    // Step 3: Use ChatGPT arguments to call your function
    let functionCall = chat.data.choices[0].delta.function_call;
    let argumentObj = JSON.parse(functionCall.arguments);

    // Handle user messages dynamically based on the function call
    messages.push({
      role: "user",
      content: `Calling function ${functionCall.name} with arguments: ${JSON.stringify(argumentObj)}`,
    });

    let content = "";
    if (functionCall.name === "helloWorld") {
      content = helloWorld(argumentObj.appendString);
    } else if (functionCall.name === "scraper") {
      content = await scraper(argumentObj.keyword);
    } else if (functionCall.name === "getTimeOfDay") {
      content = getTimeOfDay();
    }

    messages.push(chat.data.choices[0].delta);
    messages.push({
      role: "function",
      name: functionCall.name,
      content,
    });
  }

  // Step 4: Call ChatGPT again with the function response
  let step4response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
    language: "zh", // Set the language to Chinese
  });
  console.log(step4response.data.choices[0]);
}

const processAiMessages = asyncHandler(async (req, res) => {
  const userMessage = req.body.message;

  console.log(userMessage);

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing message in the request body' });
  }

  try {
    await callChatGPTWithFunctions(userMessage);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const Stealth = require('puppeteer-extra-plugin-stealth');
const bodyParser = require('body-parser');
const getImageColors = require('get-image-colors');
const userAgent = require('user-agents');


let browser;
let page;

puppeteerExtra.use(Stealth());

// Start the Express server
// app.use(bodyParser.json());

const colorMapping = {
  'BLACK': '#000000',
  'GRAY': '#808080',
  'RED': '#FF0000',
  'GREEN': '#008000',
  'BLUE': '#0000FF',
  'YELLOW': '#FFFF00',
  // Add other color mappings as needed
};

// Function to convert color names to hex values
function getColorHex(colorName) {
  return colorMapping[colorName.toUpperCase()] || null;
}

const startScraper = asyncHandler(async (req, res) => {
  try {
    browser = await puppeteerExtra.launch({
      headless: false,
    });

    page = await browser.newPage();
    await page.goto('https://talkai.info/chat/');
    await page.setUserAgent(userAgent.random().toString());
    await page.waitForTimeout(2000); 
    res.status(200).send('Script started successfully.');
    const contentElement = await page.$('#content');
    const contentElemenChild = await page.$('#content div');
    console.log(contentElemenChild)
    if(!!contentElement && !!contentElemenChild) {
      await page.waitForSelector('#content');
      await page.waitForSelector('#content > :first-child');
  
      const cssPropertiesFirstDiv = await page.evaluate(() => {
        const contentDiv = document.querySelector('#content');
        const firstDiv = contentDiv.querySelector('div');
  
        if (firstDiv) {
          const computedStyle = window.getComputedStyle(firstDiv);
          const cssProperties = {};
  
          for (const prop of computedStyle) {
            cssProperties[prop] = computedStyle.getPropertyValue(prop);
          }
  
          return cssProperties;
        }
  
        return null;
      });
  
      // Extract URL from background-image CSS property of the first div
      const backgroundImageFirstDiv = cssPropertiesFirstDiv['background-image'];
      const imageUrlFirstDiv = extractUrl(backgroundImageFirstDiv);
  
      // Use get-image-colors to get the color palette for the first div
      const imageColorsFirstDiv = await getImageColors(imageUrlFirstDiv);
  
      console.log('Background Image URL of the first div:', imageUrlFirstDiv);
      console.log('Image Colors of the first div:', imageColorsFirstDiv.map(color => color.hex()));
  
      // Loop through the tags within the third p tag
      const tagsInThirdPTagOnclick = await page.evaluate(() => {
        const colorRegex = /(BLACK|GREY|GRAY|RED|GREEN|BLUE|YELLOW)/i;
  
        // Extract color words using the regular expression
        const thirdPTag = document.querySelector('#content > p:nth-child(3)');
        const tags = Array.from(thirdPTag.children).map((tag, tagIndex) => {
          console.log(tagIndex)
          if (window.getComputedStyle(tag).getPropertyValue('display') === 'none') return;
          const onclickAttribute = tag.getAttribute('onclick')
          const extractedColors = onclickAttribute.match(colorRegex);
          return {
            color: extractedColors ? extractedColors[0] : null,
            positionNumber: tagIndex
          };
        }).filter(tag => tag);
        return tags;
      });
  
      console.log(tagsInThirdPTagOnclick);
  
      const hexColors = tagsInThirdPTagOnclick.map(color => ({ color: getColorHex(color.color), positionNumber: color.positionNumber }));
  
      console.log(hexColors);
  
      // Find the index with the closest color using CIE76 color difference
      const closestColor = hexColors.reduce((closest, currentColor) => {
        const closestColorDifference = getColorDifference(closest.color, imageColorsFirstDiv[0].hex());
        const currentColorDifference = getColorDifference(currentColor.color, imageColorsFirstDiv[0].hex());
        return currentColorDifference < closestColorDifference ? currentColor : closest;
      }, hexColors[0]);
      
      if (closestColor) {
        console.log('Color with closest match:', closestColor);
      
        // Get the index of the tag in tagsInThirdPTag based on the positionNumber of the closest color match
        const tagIndexToClick = closestColor.positionNumber;
      
        if (tagIndexToClick !== undefined) {
          console.log(tagIndexToClick);
          // Click the tag using Puppeteer
          await page.click(`#content > p:nth-child(3) > :nth-child(${tagIndexToClick + 1})`);
        } else {
          console.error('Invalid tag index.');
        }
      } else {
        console.error('No valid color found.');
      }
    }

    await page.waitForSelector('div#consent-banner');

    const acceptButtonSelector = 'div#consent-banner a#accept-btn';

    // Wait for the accept button to be visible and clickable
    await page.waitForSelector(acceptButtonSelector, { visible: true, clickable: true });

    // Click the accept button using Puppeteer
    await page.click(acceptButtonSelector);

    console.log('Accept button clicked.');

  } catch (error) {
    console.error('Error starting script:', error);
    res.status(500).send('Error starting script.');
  }
});

// Function to calculate CIE76 color difference
function getColorDifference(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const deltaR = rgb2.r - rgb1.r;
  const deltaG = rgb2.g - rgb1.g;
  const deltaB = rgb2.b - rgb1.b;

  return Math.sqrt(deltaR * deltaR + deltaG * deltaG + deltaB * deltaB);
}

// Function to convert hex color to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

function extractUrl(cssValue) {
  const regex = /(?:\(['"]?)(.*?)(?:['"]?\))/;
  const match = regex.exec(cssValue);
  return match ? match[1] : null;
}

const communicateWithChatbot = asyncHandler(async (req, res) => {
  try {
    const userMessage = await req.body.message;
    const textareaSelector = 'textarea';
    await page.waitForSelector(textareaSelector);

    // Type into the textarea
    await page.type(textareaSelector, userMessage);

    // Press Enter
    await page.keyboard.press('Enter');

    const selector = 'div.chat__message.bot-message';
    // await delay(7500); // Wait for messages to load

    let initialMessage = await page.evaluate(() => {
      const messages = document.querySelectorAll('div.chat__message.bot-message');
      const lastMessage = messages[messages.length - 1];
      return lastMessage ? lastMessage.textContent.replace(/chatgptcopy/i, "") : '';
    });

    console.log(initialMessage);

    let currentMessage;

    // Set a maximum number of iterations to prevent infinite loop
    const maxIterations = 10;
    let iterations = 0;

    while(true) {
      await delay(2500); // Wait for 2500 milliseconds before checking again
      currentMessage = await page.evaluate(() => {
        const messages = document.querySelectorAll('div.chat__message.bot-message');
        const lastMessage = messages[messages.length - 1];
        return lastMessage ? lastMessage.textContent.replace(/chatgptcopy/i, "") : '';
      });


      // Add additional logging for debugging
      console.log(`Initial message ${initialMessage.length}: Current message - ${currentMessage.length}`);

      if(initialMessage.length === currentMessage.length) {
        break;
      }
      initialMessage = await page.evaluate(() => {
        const messages = document.querySelectorAll('div.chat__message.bot-message');
        const lastMessage = messages[messages.length - 1];
        return lastMessage ? lastMessage.textContent.replace(/chatgptcopy/i, "") : '';
      });
    }

    // do {
    //   currentMessage = await page.evaluate(() => {
    //     const messages = document.querySelectorAll('div.chat__message.bot-message');
    //     const lastMessage = messages[messages.length - 1];
    //     return lastMessage ? lastMessage.textContent.replace(/chatgptcopy/i, "") : '';
    //   });

    //   await delay(2500); // Wait for 2500 milliseconds before checking again

    //   // Add additional logging for debugging
    //   console.log(`Iteration ${iterations}: Current message - ${currentMessage}`);

    //   if(initialMessage.length !== currentMessage.length) {
    //     initialMessage = await page.evaluate(() => {
    //       const messages = document.querySelectorAll('div.chat__message.bot-message');
    //       const lastMessage = messages[messages.length - 1];
    //       return lastMessage ? lastMessage.textContent.replace(/chatgptcopy/i, "") : '';
    //     });
    //     continue;
    //   } else {
    //     break;
    //   }

    // } while (true); // Check if initial message matches current message

    console.log('Final message:', currentMessage);

    const allMessages = await page.evaluate(() => {
      const messages = document.querySelectorAll('div.chat__message.bot-message');
      return Array.from(messages).map(message => message.textContent.replace(/chatgptcopy/i, ""));
    });

    console.log(allMessages);

    res.status(200).json({ message: 'Message sent successfully!' });

  } catch(error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while communicating with the chatbot.' });
  }
});




function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const endScraper = asyncHandler(async (req, res) => {
  try {
    await browser.close();
    res.status(200).send('Script exited successfully.');
    // process.exit();
  } catch (error) {
    console.error('Error exiting script:', error);
    res.status(500).send('Error exiting script.');
  }
});

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// async function watchDivs() {
//   try {
//     while (true) {
//       // Your logic to find and record specific divs
//       const divs = await page.$$eval('YOUR_DIV_SELECTOR', divs => {
//         return divs.map(div => div.innerHTML);
//       });

//       // Send divs to the client using a GET request
//       if (divs.length > 0) {
//         await sendDivsToClient(divs);
//       }

//       // Wait for new divs to be added to the DOM
//       await page.waitForSelector('YOUR_NEW_DIV_SELECTOR', { timeout: 0 });
//     }
//   } catch (error) {
//     console.error('Error in watchDivs:', error);
//   }
// }

async function sendDivsToClient(divs) {
  // Your logic to send divs to the client using a GET request
  // Example using Axios:
  // axios.get('YOUR_SERVER_ENDPOINT', { params: { divs } });
  console.log('Divs sent to the client:', divs);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


module.exports = { startScraper, endScraper, communicateWithChatbot, processAiMessages }
