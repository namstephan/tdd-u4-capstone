// test/features/user-deleting-video-test.js

const {assert} = require('chai');

const {video, submitVid} = require('../test-utils');

// Step 46: Assert that user deleting the video removes the video from list
describe('Deleting videos', () => {
  it('Deleting video removes video from list', () => {
    browser.url('/videos/create');

    submitVid();

    // First confirm video submission is successful
    assert.include(browser.getText('body'),video.title);

    // Deleting the video
    browser.click('#delete');

    // Verify that the deleted video no longer exists
    assert.notInclude(browser.getText('body'),video.title);
  });
});
