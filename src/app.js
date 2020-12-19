const express = require('express');
const app = express();

const path = require('path');

// settings 
app.set('port', process.env.PORT || 3000);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
module.exports = app;