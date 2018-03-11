// test/features/user-updating-video-test.js

const {assert} = require('chai');

const {video, submitVid} = require('../test-utils');

// Step 38: Editing a video
describe('User updating video changes the values',()=>{
  describe('submit a new video on /videos/create page',() =>{
    it('can click an #edit button',()=>{

      browser.url('/videos/create');

      submitVid();

      browser.click('#edit');
    });
  });

  describe('User can create a video and get to the edit page for the video',() =>{
    it('user can get to the update/edit video page',()=>{

      const newTitle = 'Edited test url';
      browser.url('/videos/create');

      submitVid();

      browser.click('#edit');

      // Step 38 part 4: Fill the form with new title value, and submit
      browser.setValue('#title-input',newTitle);
      browser.click('#submit-button');

      // Verify title is now newTitle, not title anymore
      assert.include(browser.getText('.video-title'),newTitle);
    });

    // Step 40: User updating video does not create an additional video
    it('old title of an existing video is not present after updating',()=>{

      const newTitle = 'Edited test url';
      browser.url('/videos/create');

      submitVid();

      browser.click('#edit');

      browser.setValue('#title-input',newTitle);
      browser.click('#submit-button');

      // Verify old title no longer exists on page
      assert.notInclude(browser.getText('.video-title'),video.title, 'old video title still present after update');
    });
  });
});
