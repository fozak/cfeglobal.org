const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const STATIC_DIR = path.join(__dirname, ""); // Change this to your static files directory
const SCRIPT_TAG = '<script src="/a/inject.js"></script>';

// Serve other static files normally
app.use(express.static(STATIC_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
    }
  }
}));

// Middleware to intercept HTML responses and inject script
app.get("*.html", (req, res) => {
  const filePath = path.join(STATIC_DIR, req.path);
  console.log(`Middleware: ${filePath}`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(404).send("Not Found");
      return;
    }
    
    const injectedHtml = data.replace(/<\/body>/, `${SCRIPT_TAG}</body>`);
    console.log(`I am injectdedHtml: ${injectedHtml}`);
    res.send(injectedHtml);
  });
});

// Serve the injected script (you can modify it)
app.get("/a/inject.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send("console.log('Injected script loaded');");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
