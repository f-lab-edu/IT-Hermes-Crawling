const router = require('express').Router();

const naverRouter = require('./news/naver');
const codingworldRouter = require('./news/codingworld');
const yozmRouter = require('./news/yozm');

router.use('/naver',naverRouter);
router.use('/codingworld',codingworldRouter);
router.use('/yozm',yozmRouter);

module.exports = router;