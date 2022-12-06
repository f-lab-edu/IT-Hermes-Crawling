const express = require('express');
const app = express();

const jobRouter = require('./routes/job');

const port = 3000;

app.use('/job', jobRouter);

app.listen(port, function() {
    console.log("start! server on port 3000")
});

