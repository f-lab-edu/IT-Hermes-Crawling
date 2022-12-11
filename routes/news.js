const router = require('express').Router();

const naverRouter = require('./news/naver');
const codingworldRouter = require('./news/codingworld');

router.use('/naver',naverRouter);
router.use('/codingworld',codingworldRouter);

module.exports = router;