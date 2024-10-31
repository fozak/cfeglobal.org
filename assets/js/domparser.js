// Function to log the entire DOM structure of the page
function parseFullDOM() {
    // Get the entire document as a string
    const fullDOMString = document.documentElement.outerHTML;

    // Log the full DOM as a string
    console.log(fullDOMString);

    // Alternatively, if you want to process specific elements, you can do so
    // For example, getting all <div> elements
    const allDivs = document.querySelectorAll('div');
    allDivs.forEach((div, index) => {
        console.log(`Div ${index + 1}:`, div.innerHTML);
    });

    // If you want to retrieve all elements of a specific type, you can change 'div' to any other tag
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    parseFullDOM();
});