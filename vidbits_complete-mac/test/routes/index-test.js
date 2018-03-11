// test/routes/index-test.js

const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const Video = require('../../models/video');
const app = require('../../app');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const {parseTextFromHTML} = require('../test-utils');

describe('ROUTES index-test', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('Create a video', () => {
    it('submitted video can be rendered', async () => {

      const newVid = {
        title: 'Test Vid',
        description: 'Test description',
        url: 'Test url'
      }

      // Submits new video
      const response = await request(app)
      .post('/videos/create')
      .type('form')
      .send(newVid)
      .redirects(1);

      // Check for newly added video
      assert.equal(parseTextFromHTML(response.text, '.video-title'), newVid.title);
    });
  });
});
