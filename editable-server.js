const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Add body parser middleware for handling POST requests
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Middleware to inject the editing JavaScript into all HTML files
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        // Only modify HTML responses
        if (typeof body === 'string' && body.includes('</body>')) {
            const editingScript = `
                <script>
                    // Listen for Ctrl+E
                    document.addEventListener('keydown', function(e) {
                        if (e.ctrlKey && e.key === 'e') {
                            e.preventDefault();
                            makePageEditable();
                        }
                    });

                    function makePageEditable() {
                        // Make the body editable
                        document.body.contentEditable = 'true';
                        document.designMode = 'on';  // Added for better compatibility
                        
                        // Create and add save button if it doesn't exist
                        if (!document.getElementById('saveButton')) {
                            const saveButton = document.createElement('button');
                            saveButton.id = 'saveButton';
                            saveButton.innerHTML = 'Save Changes';
                            saveButton.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;';
                            
                            saveButton.addEventListener('click', saveChanges);
                            document.body.appendChild(saveButton);
                        }
                    }

                    function saveChanges() {
                        const currentPath = window.location.pathname;
                        
                        // Remove the save button before getting HTML content
                        const saveButton = document.getElementById('saveButton');
                        saveButton.remove();
                        
                        // Get the HTML content
                        const content = document.documentElement.outerHTML;
                        
                        // Disable editing
                        document.body.contentEditable = 'false';
                        document.designMode = 'off';

                        // Send the content to the server
                        fetch('/save', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                path: currentPath,
                                content: content
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('Changes saved successfully!');
                            } else {
                                alert('Error saving changes: ' + data.error);
                            }
                        })
                        .catch(error => {
                            alert('Error saving changes: ' + error);
                        });
                    }
                </script>
            </body>`;
            
            body = body.replace('</body>', editingScript);
        }
        originalSend.call(this, body);
    };
    next();
});

// Handle saving changes
app.post('/save', (req, res) => {
    const filePath = path.join(__dirname, req.body.path + '.html');
    
    fs.writeFile(filePath, req.body.content, 'utf8', (err) => {
        if (err) {
            res.json({ success: false, error: err.message });
        } else {
            res.json({ success: true });
        }
    });
});

// Serve HTML files without extension
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path + '.html');
    
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('404: Page not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
