// test/models/video-test.js

const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

describe('MODELS', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('video title', () => {
    // Step 33: Check if Video#title is a string
    it('has a title that is a string', () => {
      const titleAsNonString = 1;
      const video = new Video({title: titleAsNonString});

      assert.strictEqual(video.title, titleAsNonString.toString());
    });

    it('title is required', () => {
      // setup
      const video = new Video({});
      video.validateSync();
      //verify
      assert.strictEqual(video.errors.title.message, 'Path `title` is required.');
    });
  });

  describe('video description', () => {
    it('has a description that is a string', () => {
      const descAsNonString = 1;
      const video = new Video({description: descAsNonString});

      assert.strictEqual(video.description, descAsNonString.toString());
    });

    it('description is required', () => {

      const video = new Video({});
      video.validateSync();

      assert.strictEqual(video.errors.description.message, 'Path `description` is required.');
    });
  });

  // Step 36: Model requires a url field
  describe('video url', () => {
    it('has an url that is a string', () => {
      const urlAsNonString = 1;
      const video = new Video({url: urlAsNonString});

      assert.strictEqual(video.url, urlAsNonString.toString());
    });

    it('url is required', () => {

      const video = new Video({title: 'Test title', description: 'Test description'});
      video.validateSync();

      assert.strictEqual(video.errors.url.message, 'Path `url` is required.');
    });
  });


});
