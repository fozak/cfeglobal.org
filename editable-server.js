const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use((req, res, next) => {
    console.log('Middleware triggered for path:', req.path);
    
    const originalSend = res.send;
    res.send = function (body) {
        console.log('res.send called');
        
        if (typeof body === 'string') {
            console.log('Body is string, injecting script');
            
            const editingScript = `
                <script>
                    // Wait for 3 seconds before executing the script
                    setTimeout(() => {
                        console.log('Timeout reached, now executing the script');
                        
                        // Check if the DOM is already loaded
                        if (document.readyState === 'loading') {
                            document.addEventListener('DOMContentLoaded', initialize);
                        } else {
                            // DOM is already loaded
                            initialize();
                        }

                        function initialize() {
                            console.log('DOM Content Loaded');
                            document.addEventListener('keydown', function(e) {
                                console.log('Key pressed:', e.key);
                                if (e.ctrlKey && e.key === 'q') {
                                    console.log('Ctrl+Q pressed');
                                    e.preventDefault();
                                    makePageEditable();
                                }
                            });
                        }

                        function makePageEditable() {
                            console.log('Making page editable');
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
                            console.log('Saving changes');
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
                    }, 3000); // Delay of 3000 milliseconds
                </script>
            `;
            
            body = body + editingScript;
        }
        originalSend.call(this, body);
    };
    next();
});

app.post('/save', (req, res) => {
    console.log('Save endpoint hit:', req.body.path);
    // Add .html if not present
    const filePath = path.join(__dirname, 
        req.body.path.endsWith('.html') ? req.body.path : req.body.path + '.html'
    );
    
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

app.get('*', (req, res) => {
    console.log('Get route hit:', req.path);
    const filePath = path.join(__dirname, 
        req.path.endsWith('.html') ? req.path : req.path + '.html'
    );
    
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