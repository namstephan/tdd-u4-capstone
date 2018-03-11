// test/features/user-visiting-landing-page-test.js

const {assert} = require('chai');
const request = require('supertest');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const app = require('../../app');
const {video, submitVid} = require('../test-utils');

beforeEach(connectDatabase);
afterEach(disconnectDatabase);

describe('FEATURES', () => {

  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('landing page', () => {
    describe('when landing page is empty', () => {
      it('should be empty on initial visit', () => {
        browser.url('/');

        assert.equal(browser.getText('#videos-container'), '');
      });
    });

    describe('when landing page has videos', () => {
      it('videos are showing', () => {
        // Create a new video
        browser.url('/videos/create');

        submitVid();

        browser.url('/');
        assert.equal(browser.getText('.video-title'), video.title);
      });

      it('videos are showing in iframe', () => {
        // Create a new video
        browser.url('/videos/create');

        submitVid();

        browser.url('/videos');
        assert.isNotNull(browser.getHTML('<iframe>'));
      });

      // Step 31: Navigate to a video by clicking on title
      it('can navigate to a video', () => {
        // Create a new video
        browser.url('/videos/create');

        submitVid();

        browser.url('/');
        browser.click('.video-title');
        assert.isNotNull(browser.getHTML('<iframe>'));
      })
    });
  });

  describe('video create page', () => {
    it('"Save a video" text is found on video create page', () => {
      browser.url('/');
      browser.click('#create-video');
      assert.include(browser.getText('#create-video-h1'),'Save a video');
    });

    it('submit a new video and check if `title` is included in #videos-container', async () => {
      browser.url('/videos/create');

      submitVid();

      browser.url('/');

      // verify
      assert.equal(browser.getText('.video-title'), video.title);
    })
  });

});
