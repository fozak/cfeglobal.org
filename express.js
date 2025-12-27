const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files from the root directory and all its subdirectories
app.use(express.static(path.join(__dirname)));

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Adjust to your main HTML file
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});