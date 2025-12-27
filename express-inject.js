const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const STATIC_DIR = __dirname; // Serve files from the root directory 
const SCRIPT_TAG = '<script src="/a/inject.js"></script>';

/* Serve the injected script (you can modify it)
app.get("/a/inject.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.send("console.log('Injected script loaded');");
  });
*/

// Middleware to intercept HTML responses and inject script
app.use((req, res, next) => {
    if (req.path.endsWith(".html")) {
      const filePath = path.join(STATIC_DIR, req.path);
      
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          res.status(404).send("Not Found");
          return;
        }
        
        const injectedHtml = data.replace(/<\/body>/, `${SCRIPT_TAG}</body>`);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(injectedHtml);
      });
    } else {
      next();
    }
  });
  


// Serve static files normally (excluding .html, since it's already handled)
app.use(
    express.static(STATIC_DIR, {
      extensions: ["html"],
    })
  );

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
