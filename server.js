const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const Feedback = require('./models/feedback.js');  // Use PascalCase for model naming convention
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Atlas connected...'))
  .catch((err) => console.log(err));

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();  // Corrected model reference
    res.json(feedbacks);  // Return found feedback documents
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/feedback', async (req, res) => {
  const newFeedback = new Feedback({   // Use 'newFeedback' for the instance
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
    rating: req.body.rating,
  });

  try {
    const savedFeedback = await newFeedback.save();
    res.status(201).json(savedFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
