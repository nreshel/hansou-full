const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
// const errorHandler = require('./middleware/errorHandler');
const connectDb = require('./config/dbConnection');

connectDb();

const app = express();

const port = process.env.PORT || 3501;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}))
app.use(express.json());
app.use('/dictionary', require("./routes/chineseDictionaryRoute"));
app.use('/card', require("./routes/cardRoute"))
app.use('/chatbot', require('./routes/aiRoute'))

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});