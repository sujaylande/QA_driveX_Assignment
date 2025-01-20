const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  textContent: { type: String, required: true },
  queryHistory: [
    {
      question: String,
      answer: String,
      context: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

module.exports = mongoose.model("Document", documentSchema);
