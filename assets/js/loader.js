// assets/js/loader.js

(function() {
    // Assume 'this' refers to the global scope or window object
    const loaderScript = document.getElementById("loaderScript");

    // Check the custom 'run' attribute
    if (loaderScript.getAttribute("run") === "true") {
        // Step 1: Wait for the DOM to fully load
        document.addEventListener("DOMContentLoaded", function() {
            // Step 2: Get the current URL path
            const urlPath = window.location.pathname; // e.g., '/industries'
            
            // Step 3: Extract the last segment from the URL
            const segments = urlPath.split('/'); // Split the path by '/'
            const currentPage = segments[segments.length - 1]; // Get the last segment (e.g., 'industries')

            // Step 4: Use the extracted segment in the components array
            const components = [
                '../components/header.html',
                `../components/hero-${currentPage}.html`, // Dynamically include the correct hero component
                '../components/services-stats.html',
                '../components/faces.html',
                `../components/featured-${currentPage}.html`, // Dynamically use the page variable
                '../components/services-types.html',
                '../components/portfolio.html',
                '../components/call-to-action.html',
                '../components/footer.html',
            ];

            // Step 5: Load components dynamically
            components.forEach((component, index) => {
                fetch(component)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(data => {
                        document.getElementById(index + 1).innerHTML = data; // Set the HTML content
                    })
                    .catch(error => console.error('Error loading component:', error));
            });

            // Set 'run' to 'false' after the first execution
            loaderScript.setAttribute("run", "false");
            console.log("The script has run and 'run' is now set to false.");
        });

    } else {
        // If 'run' is not true, log that the script will not run
        console.log("The script will not run as 'run' is set to false.");
    }
})();