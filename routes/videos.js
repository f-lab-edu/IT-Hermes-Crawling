const router = require('express').Router();

const youtubeRouter = require('./videos/youtube');

router.use('/youtube', youtubeRouter);

module.exports = router;