const router = require('express').Router();

const naverRouter = require('./news/naver');

router.use('/naver',naverRouter);

module.exports = router;