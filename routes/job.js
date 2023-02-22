const router = require('express').Router();

const saraminRouter = require('./job/saramin');
const wantedRouter = require('./job/wanted');
const saraminDummyRouter = require('./job/dummysaramin');
const wantedDummyRouter = require('./job/dummyWanted');
router.use('/saramin', saraminRouter);
router.use('/wanted',wantedRouter);
router.use('/dummysaramin',saraminDummyRouter);
router.use('/dummywanted',wantedDummyRouter);

module.exports = router;