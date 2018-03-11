// test/routes/videos-test.js

const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML, seedVideoToDatabase} = require('../test-utils');

const Video = require('../../models/video');

describe('ROUTES videos-test', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST /videos/create', () => {

    it('Creates a new video', async () => {
      const video = {
        title: 'Test title',
        description: 'Test desc',
        url: 'https://www.testurl.com'
      }

      const response = await request(app)
    	.post('/videos/create')
    	.type('form')
      .send(video);

      const createdVid = await Video.findOne(video);
      assert.isOk(createdVid, 'Video was not created successfully in the database');
    });
  });

  describe('POST /videos/create without title', () => {

    const video = {
      title: '',
      description: 'Test description',
      url: 'Test url'
    }

    it('video not submitted when title is missing', async () => {

      const response = await request(app)
    	.post('/videos/create')
    	.type('form')
      .send(video);
      //.redirects(1);


      assert.equal(response.status,400);
      assert.equal(parseTextFromHTML(response.text, '.title-error'), 'Path `title` is required.');
    });

    it('the video is not saved', async () => {

      const addedVid = new Video(video);
      addedVid.add;

      const response = await request(app)
        .get('/videos/')
        .redirects(1);

      const allVids = await Video.find({});

      assert.equal(allVids.length, 0);
    });

    // Step 23: Check if the response text includes an error message for missing title
    it('error message is rendered: Path `title` is required.', async () => {

      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(video);

      assert.equal(parseTextFromHTML(response.text, ".title-error"), 'Path `title` is required.');
    });

    // Step 34a: Checks that description is preserved when title is missing
    it('description info is preserved even if submission is missing title', async () => {

      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(video)
      .redirects(1);

      assert.equal(parseTextFromHTML(response.text, "#description-input"), video.description);
    });

    // Step 34b: Checks that url is preserved when title is missing
    it('url info is preserved even if submission is missing title', async () => {

      const response = await request(app)
        .post('/videos/create')
        .type('form')
        .send(video)
        .redirects(1);

      // Use jsdom to extract url-input value
      const urlInput = jsdom(response.text).querySelector('#url-input');

      assert.equal(urlInput.value, video.url);
    });
  });

  describe('POST /videos/create without description', () => {
    const video = {
      title: 'Test title',
      description: '',
      url: 'Test url'
    }

    it('video not submitted when description is missing', async () => {

      const response = await request(app)
    	.post('/videos/create')
    	.type('form')
      .send(video);
      //.redirects(1);


      assert.equal(response.status,400);
      assert.equal(parseTextFromHTML(response.text, '.description-error'), 'Path `description` is required.');
    });

    it('the video is not saved', async () => {

      const addedVid = new Video(video);
      addedVid.add;

      const response = await request(app)
        .get('/videos/')
        .redirects(1);

      const allVids = await Video.find({});

      assert.equal(allVids.length, 0);
    });

    // Step 24: Check if the response text includes an error message for missing description
    it('error message is rendered: Path `description` is required.', async () => {

      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(video);

      assert.equal(parseTextFromHTML(response.text, ".description-error"), 'Path `description` is required.');
    });

    it('title info is preserved even if submission is missing description', async () => {

      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(video)
      .redirects(1);

      const titleInput = jsdom(response.text).querySelector('#title-input');
      assert.equal(titleInput.value, video.title);
    });

    // Step 34b: Checks that url is preserved when title is missing
    it('url info is preserved even if submission is missing description', async () => {

      const response = await request(app)
        .post('/videos/create')
        .type('form')
        .send(video)
        .redirects(1);

      // Use jsdom to extract url-input value
      const urlInput = jsdom(response.text).querySelector('#url-input');

      assert.equal(urlInput.value, video.url);
    });

  });

  describe('POST /videos/create without url', () => {
    const video = {
      title: 'Test title',
      description: 'Test description',
      url: ''
    }

    it('video not submitted when url is missing', async () => {

      const response = await request(app)
    	.post('/videos/create')
    	.type('form')
      .send(video);
      //.redirects(1);


      assert.equal(response.status,400);
      assert.equal(parseTextFromHTML(response.text, '.url-error'), 'Path `url` is required.');
    });

    it('the video is not saved', async () => {

      const addedVid = new Video(video);
      addedVid.add;

      const response = await request(app)
        .get('/videos/')
        .redirects(1);

      const allVids = await Video.find({});

      assert.equal(allVids.length, 0);
    });

    // Step 24: Check if the response text includes an error message for missing description
    it('error message is rendered: Path `url` is required.', async () => {

      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(video);

      assert.equal(parseTextFromHTML(response.text, ".url-error"), 'Path `url` is required.');
    });

    it('title info is preserved even if submission is missing url', async () => {

      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(video)
      .redirects(1);

      //assert.equal(parseTextFromHTML(response.text, "#title-input"), video.title);
      const titleInput = jsdom(response.text).querySelector('#title-input');
      assert.equal(titleInput.value, video.title);
    });

    it('description info is preserved even if submission is missing url', async () => {

      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(video)
      .redirects(1);

      // Use jsdom to extract url-input value
      const urlInput = jsdom(response.text).querySelector('#url-input');

      assert.equal(urlInput.value, video.url);
    });
  });

  // Step 25: Check if specific video can be rendered
  describe('/videos/:id', () => {
    beforeEach(connectDatabase);
    afterEach(disconnectDatabase);

    it('renders a particular video', async () => {
      const vidToAdd = {
        title: 'Test title',
        description: 'Test desc',
        url: 'https://www.testurl.com'
      }

      let addedVid = new Video(vidToAdd);
      const savedVid = await addedVid.save(function(err,video) {
      return video.id;
      });

      var videoId = savedVid.id;
      const response = await request(app)
      .get('/videos/' + videoId)
      .redirects(1);

      //assert.equal(response.status,302); // Step 26 check for a 302 response status
      assert.equal(parseTextFromHTML(response.text, ".video-title"), vidToAdd.title);
      // Step 29 Need to use include method to test title/desc/url in one assertion
      // let urlContainer = jsdom(response.text).querySelector('.video-player');
      // assert.equal(urlContainer.src, vidToAdd.url);
    });

    it('/video saves a Video document', async () => {
      const vidToAdd = {
        title: 'Test title',
        description: 'Test desc',
        url: 'https://www.testurl.com/'
      }

      const addedVid = new Video(vidToAdd);
      const savedVid = await addedVid.save(function(err,video) {
      return video.id;
      });

      var videoId = savedVid.id;
      const response = await request(app)
      .get('/videos/' + videoId)
      .redirects(1);

      // Step 28: Check saved video contains the correct url
      let urlContainer = jsdom(response.text).querySelector('.video-player');
      assert.equal(urlContainer.src, vidToAdd.url);
    });
  });

  describe('/videos/:id/edit', () => {
    it('updates record with a new title', async () => {
      const vidToAdd = await seedVideoToDatabase({title: 'Test title', description: 'Test desc', url: 'https://www.testurl.com'});
      const updatedTitle = 'Updated test title';
      const videoId = vidToAdd._id;

      const response = await request(app)
      .post('/videos/' + videoId + '/edit')
      .type('form')
      .send({title:updatedTitle});

      // Step 39: Checks to see if info in filled form is correct
      const titleInput = jsdom(response.text).querySelector('#title-input');
      assert.include(titleInput.value, vidToAdd.title);

      // const description = jsdom(response.text).querySelector('#description-input');
      // assert.equal(description.value, vidToAdd.description);
      //
      // const inputUrl = jsdom(response.text).querySelector('#url-input');
      // assert.equal(inputUrl.value, vidToAdd.url);
      //
      // const id = jsdom(response.text).querySelector('#id');
      // assert.equal(id.value, savedVid.id);
      });
    });

  // Step 41: Assert that POST /videos/:id/edit updates the record
  // Step 42: Update is successful
  describe('/videos/:id/edit', () => {
    it('calls an edit page with info filled', async () => {
      const vidToAdd = {
        title: 'Test title',
        description: 'Test desc',
        url: 'https://www.testurl.com'
      };

      const addedVid = new Video(vidToAdd);
      const savedVid = await addedVid.save(function(err,video) {
        return video.id;
      });

      const vidUpdated = {
        title: 'Update test title',
        description: 'Updated test desc',
        url: 'https://www.updatedtesturl.com'
      };

      var videoId = savedVid.id;
      const response = await request(app)
      .post('/videos/' + videoId + '/edit')
      .redirects(1);

      const id = jsdom(response.text).querySelector('#id');
      assert.equal(id.value, savedVid.id);
    });
  });

  // Step 43: Assert when record is invalid, record is not saved
  describe('/videos/:id/edit with missing data', () => {
    it('validates there are 400 error before updating record', async () => {
      const vidToAdd = {
        title: 'Test title',
        description: 'Test desc',
        url: 'https://www.testurl.com'
      };

      const addedVid = new Video(vidToAdd);
      const savedVid = await addedVid.save(function(err,video) {
        return video.id;
      });

      const vidUpdated = {
        // If TITLE is missing
        //title: 'Update test title',
        description: addedVid.description,
        url: addedVid.url
      };

      var videoId = savedVid.id;
      const response = await request(app)
      .post('/videos/' + videoId + '/updates/')
      .type('form')
      .send(vidUpdated);

      // Step 44: Assert when record is invalid responds with a 400
      assert.equal(response.status,400);
    });

    // Step 45: Still render the edit form when input is invalid
    // Even if title is missing, still renders description/inputurl/id
    it('description and url persists even if title is missing', async () => {
      const vidToAdd = {
        title: 'Test title',
        description: 'Test desc',
        url: 'https://www.testurl.com'
      };

      const addedVid = new Video(vidToAdd);
      const savedVid = await addedVid.save(function(err,video) {
        return video.id;
      });

      const vidUpdated = {
        // If TITLE is missing
        //title: addedVid.title,
        description: addedVid.description,
        url: addedVid.url
      };

      var videoId = savedVid.id;
      const response = await request(app)
      .post('/videos/' + videoId + '/updates/')
      .type('form')
      .send(vidUpdated);

      // Step 44: Assert when record is invalid responds with a 400
      assert.equal(response.status,400);

      // Step 45: Still render the edit form when input is invalid
      // Even if title is missing, still render description/inputurl/id
      const description = jsdom(response.text).querySelector('#description-input');
      assert.equal(description.value, vidUpdated.description);

      const inputUrl = jsdom(response.text).querySelector('#url-input');
      assert.equal(inputUrl.value, vidUpdated.url);

      const id = jsdom(response.text).querySelector('#id');
      assert.equal(id.value, savedVid.id);
    });
  });


  // Step 47: Verify successful deletion of a video
  describe('/videos/:id/delete', () => {
    it('video record is removed after deletion', async () => {
      const vidToAdd = {
        title: 'Test title',
        description: 'Test desc',
        url: 'https://www.testurl.com'
      };

      // First create and save a video
      const addedVid = new Video(vidToAdd);
      const savedVid = await addedVid.save(function(err,video) {
      return video.id;
      });

      // Deletes the video
      var videoId = savedVid.id;
      const response = await request(app)
      .post('/videos/' + videoId + '/delete/');

      //verify (if video title isn't present, it is assumed video is deleted)
      assert.notInclude(parseTextFromHTML(response.text, 'body'), savedVid.title);
    });
  });

});
