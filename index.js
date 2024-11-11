const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./pool.js');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));
const PORT = 3000;

app.listen(PORT, async (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});