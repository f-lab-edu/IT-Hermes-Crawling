const router = require('express').Router();

const saraminRouter = require('./job/saramin');
const wantedRouter = require('./job/wanted');

router.use('/saramin', saraminRouter);
router.use('/wanted',wantedRouter);

module.exports = router;