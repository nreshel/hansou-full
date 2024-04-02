const fs = require("fs");
const ytdl = require("ytdl-core");
const openai = require("openai");
const asyncHandler = require('express-async-handler')

// Load environment variables from a .env file.
require("dotenv").config();

const outputFilename = "output";

const transcribeVideo = asyncHandler(async (req, res) => {
  try {
    const { url } = await req.body;
    // Download audio in MP3 format from YouTube
    const audioFilename = await downloadAudio(url, outputFilename);

    // Transcribe audio and send the result as a text response
    const transcription = await transcribe(audioFilename, process.env.OPENAI_API_KEY);
    res.set('Content-Type', 'text/plain');
    res.send(transcription);
  } catch (error) {
    console.error("Main Error:", error);
    res.status(500).send("An error occurred during transcription");
  }
})

// Function to download YouTube audio in MP3 format
function downloadAudio(videoUrl, outputFilename) {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(videoUrl, {
      filter: "audioonly",
      quality: "highestaudio",
    });
    const outputStream = fs.createWriteStream(`${outputFilename}.mp3`);

    audioStream.pipe(outputStream);

    audioStream.on("end", () => {
      console.log("Audio downloaded successfully");
      resolve(`${outputFilename}.mp3`);
    });

    audioStream.on("error", (error) => {
      console.error("Error downloading audio:", error);
      reject(error);
    });
  });
}

// Function to transcribe audio
async function transcribe(filename, apiKey) {
  try {
    // Initialize the OpenAI client with the given API key.
    const openAiClient = new openai.OpenAI({ apiKey });

    // Send the audio file for transcription using the specified model.
    const transcription = await openAiClient.audio.transcriptions.create({
      file: fs.createReadStream(filename),
      model: "whisper-1",
    });

    console.log("Here is the transcription", transcription);

    // Delete the audio file after transcription
    fs.unlinkSync(filename);
    console.log(`Audio file ${filename} deleted successfully`);

    // Return the transcription text
    return transcription;
  } catch (error) {
    // Log any errors that occur during transcription.
    console.error("Error", error);
    throw error;
  }
}

module.exports = { transcribeVideo };
