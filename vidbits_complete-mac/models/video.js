// routes/videos.js

const {mongoose} = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    // Step 29: Adding url path to schema
    url: {
      type: String,
      required: true
    },

  })
);

module.exports = Video;
