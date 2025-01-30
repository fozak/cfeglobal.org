const fs = require('fs');
const path = require('path');



// Function to remove <link rel="alternate"> tags from an HTML file
function removeAlternateLinkTags(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Use regex to match <link rel="alternate"> tags
        const regex = /<link[^>]*\brel=["']?alternate["']?[^>]*>/gi;

        // Replace matched tags with an empty string
        const newHtml = data.replace(regex, '');

        // Write the modified HTML back to the file
        fs.writeFile(filePath, newHtml, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${filePath}:`, err);
            } else {
                console.log(`Processed file: ${filePath}`);
            }
        });
    });
}

// Directory to scan for HTML files
const directoryPath = 'C:\\python\\cfeglobal.org\\partners';

// Read the directory and process each HTML file
fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error(`Error reading directory ${directoryPath}:`, err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        if (path.extname(file) === '.html') {
            removeAlternateLinkTags(filePath);
        }
    });
});