const router = require('express').Router();

const saraminRouter = require('./job/saramin');

router.use('/saramin', saraminRouter);

module.exports = router;