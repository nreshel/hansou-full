const fs = require('fs');
const path = require('path');
const asyncHandler = require("express-async-handler");
const Dictionary = require("../models/dictionarySchema")
// const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access public

const getFullDictionary = asyncHandler(async (req, res) => {
  const dictionary = await Dictionary.find();
  res.status(200).json({ dictionary: JSON.stringify(dictionary) });
})

const getDictionaryItem = asyncHandler(async (req, res) => {
  const searchStr = req.params.searchStr;
  const result = await Dictionary.find({ eng: { $regex: searchStr, $options: 'i' } });
  // const result = await Dictionary.find({ eng: searchStr });
  console.log("This will be for a dictionary elements");
  res.status(200).json({ result });
})

const sendDictionaryItems = asyncHandler(async (req, res) => {
  const filePath = path.resolve(__dirname, '../dictionary.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      throw new Error(err);
    }
  
    // Parse the JSON content
    const jsonArray = JSON.parse(data);

    // Iterate through each object in the array
    jsonArray.forEach(async (object, index) => {
      console.log(`Object ${index + 1}:`, object);
      const { han, eng, pinyin } = object;
      await Dictionary.create({
        han,
        eng,
        pinyin
      })
      
      // You can perform operations on each object here
    });

    res.status(200).json({ message: 'Successfully done!' })
  });
})

module.exports = { getFullDictionary, getDictionaryItem, sendDictionaryItems };