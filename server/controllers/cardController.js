const fs = require('fs');
const path = require('path');
const asyncHandler = require("express-async-handler");
const Card = require("../models/cardSchema");
// const { Configuration, OpenAIApi } = require('openai');

// const Contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access public

const getCards = asyncHandler(async (req, res) => {
  const cards = await Card.find();
  const activeCards = cards.filter(({ timestamp }) => {
    const cardDate = new Date(timestamp);
    const today = new Date();

    if(cardDate <= today) {
      return true;
    }
    return false;
  });

  const inactiveCards = cards.filter(({ timestamp }) => {
    const cardDate = new Date(timestamp);
    const today = new Date();

    if(cardDate > today) {
      return true;
    }
    return false;
  });
  // res.status(200).json({ message: 'Cards sent!' });
  res.status(200).json({ activeCards, inactiveCards });
});

const addCard = asyncHandler(async (req, res) => {
  const { han, pinyin, eng } = req.body;
  console.log(han, pinyin,  eng);

  const card = await Card.create({...req.body})
  res.status(200).json({ cardData: card })
});

const editCard = asyncHandler(async (req, res) => {
  // console.log(req.body);
  let card = await Card.findOne({ _id: req.body._id });

  card.timestamp = req.body.timestamp;
  card.done = req.body.done;
  
  card.save();

  res.json({ message: `I editd a card` })
});

const deleteCard = asyncHandler(async (req, res) => {
  await Card.findOneAndDelete({ _id: req.params._id })
  res.status(200).json({ message: `I deleted a card ${req.params._id}` });
});

const uploadFile = asyncHandler(async (req, res) => {
  
});

module.exports = { getCards, addCard, editCard, deleteCard, uploadFile };