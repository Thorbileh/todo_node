const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tododb',
    password: '',
    port: 5432,
})

const PORT = 3000;




app.listen(PORT, async (req, res) => {
    console.log(`Server is running on port ${PORT}`);
});
