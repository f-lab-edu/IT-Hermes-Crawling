const router = require('express').Router();

const saraminRouter = require('./job/saramin');
const wantedRouter = require('./job/wanted');
const saraminDummyRouter = require('./job/dummysaramin');
router.use('/saramin', saraminRouter);
router.use('/wanted',wantedRouter);
router.use('/dummysaramin',saraminDummyRouter);

module.exports = router;