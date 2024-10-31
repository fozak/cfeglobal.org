// Function to log all loaded <div> elements on the page
function parseFullDOM() {
    // Get all <div> elements in the document
    const allDivs = document.querySelectorAll('div');
    
    // Check if any <div> elements were found
    if (allDivs.length === 0) {
        console.log("No <div> elements found.");
        return;
    }

    // Log each <div> element's outer HTML
    allDivs.forEach((div, index) => {
        console.log(`Div ${index + 1}:`, div.outerHTML);
    });
}

// Wait for a specified amount of time (e.g., 2 seconds) before executing the function
setTimeout(() => {
    parseFullDOM();
}, 6000); // 6000 milliseconds = 2 seconds