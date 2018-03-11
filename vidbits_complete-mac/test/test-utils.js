// test/test-utils.js

const {jsdom} = require('jsdom');
const Video = require('../models/video');

// Create and return a sample Video object
const buildVideoObject = (options = {}) => {
  const title = options.title || 'Test title';
  const description = options.description || 'Test desc';
  const url = options.url || 'Test url';

  return {title, description, url};
};

// Add a sample Video object to mongodb
const seedVideoToDatabase = async (options = {}) => {
  const video = await Video.create(buildVideoObject(options));
  return video;
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const generateRandomUrl = (domain) => `http://${domain}/${Math.random()}`;

vidUrl = generateRandomUrl();

const video = {
  title: 'Test title',
  description: 'Test desc',
  url: vidUrl
}

const submitVid = () => {
  browser.setValue('#title-input', video.title);
  browser.setValue('#description-input', video.description);
  browser.setValue('#url-input', video.url);
  browser.click('#submit-button');
}

module.exports = {
  buildVideoObject,
  seedVideoToDatabase,
  parseTextFromHTML,
  generateRandomUrl,
  video,
  submitVid,
};
