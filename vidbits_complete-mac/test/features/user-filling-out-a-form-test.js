// test/features/user-filling-out-a-form-test.js

const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const {video, submitVid} = require('../test-utils');

describe('FEATURES', () => {
  describe('video container', () => {
    it('should be empty on initial visit', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    });

    it('"Save a video" text is found on videos/create.html', () => {
      browser.url('/');
      browser.click('#create-video');
      assert.equal(browser.getText('#create-video-h1'),'Save a video');
    });

    it('user can fill out "Title" in the form', () => {
      browser.url('/videos/create');

      submitVid();

      assert.include(browser.getText('body'), video.title);
    });

    it('user can fill out "Description" in the form', () => {
      browser.url('/videos/create');

      submitVid();

      assert.include(browser.getText('body'), video.description);
    });

    // Step 37: Adding url parameter in requests
    it('user can fill out "Url" in the form', () => {

      browser.url('/videos/create');

      submitVid();

      assert.include(browser.getText('body'), video.url);
    });

  });
});
