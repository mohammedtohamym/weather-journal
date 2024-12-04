const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create express application
const app = express();
const port = 8000;

// Data storage object
let projectData = {};

// Middleware configuration
// Note: Use bodyParser methods correctly
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('website'));
app.use(cors());

// Routes for data retrieval and storage
app.get('/getAll', (req, res) => {
    res.send(projectData);
});

app.post('/postData', (req, res) => {
    projectData = req.body;
    res.send(projectData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});