const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files from the root directory and all its subdirectories
app.use(express.static(path.join(__dirname)));

// Middleware to serve any HTML file without the .html extension
app.get('*', (req, res) => {
    // Construct the file path by adding .html to the requested URL
    const filePath = path.join(__dirname, req.path + '.html');

    // Check if the file exists
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            // If it exists, send the file
            res.sendFile(filePath);
        } else {
            // If it doesn't exist, send a 404 response
            res.status(404).send('404: Page not found');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});