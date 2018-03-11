// routes/videos.js

const router = require('express').Router();
const Video = require('../models/video');
// const request = require('supertest');
// const app = require('../app');

//////// .GET //////////

// Handler to render all videos
router.get("/", async (req, res, next) => {
    const videos = await Video.find({});
    res.render('videos/index', {videos});
});

// Handler to render all videos
// router.get('/videos', async (req,res,next) => {
//    const videos = await Video.find({});
//    res.render('videos/index', {videos});
// });
//
router.get('/create', (req,res,next) => {
  res.render('videos/create');
});

router.get('/:id', async (req,res,next) => {
  const id = req.params.id;
  const videos = await Video.findById(id);
  res.locals.title = videos.title;
  res.locals.description = videos.description;
  res.locals.url = videos.url;
  res.locals._id = req.params.id;
  res.render('videos/show');
})

// Step 25: Render a video by its ID
router.get('/show/:id', async (req, res, next) => {
  const id = req.params.id;
  const videos = await Video.findById(id);
  // The below commented method also works
  //const video = await Video.findOne({_id:id});

  res.locals.title = videos.title;
  res.locals.description = videos.description;
  res.locals.url = videos.url;
  res.locals._id = req.params.id;
  res.render('videos/show');
});

// Step 40: Redirecting GET /videos/:id/edit calls to videos/edit
router.get('/videos/:id/edit', async (req, res, next) => {
  const id = req.params.id;
  const videos = await Video.findById(id);

  res.render('videos/edit', {video});
});


////////// .POST //////////

router.post('/create', async (req,res,next) => {
  // Step 29: Added url to request body
  const {title, description, url} = req.body;

  // Step 29: Passing url when creating video instance
  const video = new Video({title,description,url});

  video.validateSync();

  // Step 33: use video.errors to handle invalid responses
  if (video.errors) {
    // render "videos/create" if the title field is empty
    res.status(400).render('videos/create', {video:video, "error":video.errors});
  }
  else {
    // Step 24: If title is present, video is saved to database
    const videos = await video.save();

    const vidIds = '/videos/' + videos._id;
    // Step 26: Redirect to the new video's show page
    res.redirect(302, vidIds);
  }
});

router.post('/:id/edit', async (req,res,next) => {
  const id = req.params.id;
  const videos = await Video.findById(id);
  res.locals.title = videos.title;
  res.locals.description = videos.description;
  res.locals.url = videos.url;
  res.locals.id = req.params.id;
  res.render('videos/edit');
});

// Step 39: Render videos/create when accessing /videos/:id/updates
// Step 41: POST request for videos/:id/updates to pass server test
router.post('/:id/updates', async (req, res, next) => {
  const id = req.params.id;
  //const video = await Video.findById(id);
  const {title, description, url} = req.body;

  const updatedVid = new Video({title,description,url});


  updatedVid.validateSync();

  // Step 43: validate there are no errors before updating record
  // if error, the data field becomes blank
  if (updatedVid.errors) {
    res.locals.title = title;
    res.locals.description = description;
    res.locals.url = url;
    res.locals.id = req.params.id;

    // Step 44: Respond with a 400 status if there are errors in update
    // Step 45: If 400 status, videos/edit for current video is rendered
    res.status(400).render('videos/edit', {updatedVid: updatedVid, "error": updatedVid.errors});
  }
  else {
    const videos = await Video.findById(id, function (err, videos) {
    if (err) return handleError(err);
    videos.title = title;
    videos.save(function (err, videos) {
    if (err) {
        const url = 'videos/' + id + '/update'
        res.status(400).render(url, {updatedVid: videos, "error": videos.errors});
        }
      })
    })
    res.locals.title = videos.title;
    res.locals.description = videos.description;
    res.locals.url = videos.url;
    res.locals._id = req.params.id;
    const url = '/videos/show/' + id;
    // res.redirect(302,'/videos/show/${id}');
    res.redirect(302,url);

  }
});


// Step 47: Handler for POST request to '/videos/:id/deletions'
router.post('/:id/deletions', async (req, res, next) => {
  const id = req.params.id;
  const video = await Video.findById(id);
  await Video.deleteOne(video);
  // Redirects to landing page after deletion
  res.redirect('/');
  return next;
});

module.exports = router;
