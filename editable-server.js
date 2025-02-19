const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Add logging to verify middleware execution
app.use((req, res, next) => {
    console.log('Middleware triggered for path:', req.path);
    
    const originalSend = res.send;
    res.send = function (body) {
        console.log('res.send called');
        
        if (typeof body === 'string') {
            console.log('Body is string, has </body>?', body.includes('</body>'));
        }
        
        if (typeof body === 'string' && body.includes('</body>')) {
            console.log('Injecting editing script');
            const editingScript = `
                <script>
                    // Wait for document to be fully loaded
                    document.addEventListener('DOMContentLoaded', () => {
                        console.log('DOM Content Loaded'); // Browser console log
                        // Listen for Ctrl+Q
                        document.addEventListener('keydown', function(e) {
                            console.log('Key pressed:', e.key); // Browser console log
                            if (e.ctrlKey && e.key === 'q') {
                                e.preventDefault();
                                makePageEditable();
                            }
                        });
                    });

                    function makePageEditable() {
                        console.log('Making page editable'); // Browser console log
                        document.body.contentEditable = 'true';
                        document.designMode = 'on';
                        
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
                        console.log('Saving changes'); // Browser console log
                        const currentPath = window.location.pathname;
                        
                        const saveButton = document.getElementById('saveButton');
                        saveButton.remove();
                        
                        const content = document.documentElement.outerHTML;
                        
                        document.body.contentEditable = 'false';
                        document.designMode = 'off';

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

app.post('/save', (req, res) => {
    console.log('Save endpoint hit:', req.body.path);
    const filePath = path.join(__dirname, req.body.path + '.html');
    
    fs.writeFile(filePath, req.body.content, 'utf8', (err) => {
        if (err) {
            console.error('Save error:', err);
            res.json({ success: false, error: err.message });
        } else {
            console.log('Save successful');
            res.json({ success: true });
        }
    });
});

// Make sure this comes AFTER the middleware
app.get('*', (req, res) => {
    console.log('Get route hit:', req.path);
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