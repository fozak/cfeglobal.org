// assets/js/loader.js

(function() {
    const loaderScript = document.getElementById("loaderScript");

    if (loaderScript.getAttribute("run") === "true") {
        document.addEventListener("DOMContentLoaded", function() {
            const urlPath = window.location.pathname;
            const segments = urlPath.split('/');
            const currentPage = segments[segments.length - 1];

            const components = [
                '/components/header.html',
                `/components/hero-${currentPage}`,
                '/components/services-stats.html',
                '/components/faces.html',
                `/components/featured-${currentPage}`,
                '/components/services-types.html',
                '/components/portfolio.html',
                '/components/call-to-action.html',
                '/components/footer.html',
            ];

            // Create an array of fetch promises
            const fetchPromises = components.map((component, index) => {
                return fetch(component)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text().then(data => {
                            document.getElementById(index + 1).innerHTML = data; // Set the HTML content
                        });
                    });
            });

            // Wait for all fetch promises to resolve
            Promise.all(fetchPromises)
                .then(() => {
                    console.log("All components loaded successfully.");
                })
                .catch(error => console.error('Error loading component:', error));

            loaderScript.setAttribute("run", "false");
            console.log("The script has run and 'run' is now set to false.");
        });
    } else {
        console.log("The script will not run as 'run' is set to false.");
    }
})();

// loader js Add event listener to detect Ctrl+E key combination


document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault(); // Prevent default behavior of the key combination

        // Get the current page's HTML
        const currentHTML = document.documentElement.outerHTML;

        // Store the HTML in session storage
        sessionStorage.setItem('editContent', currentHTML);

        // Redirect to the edit page
        window.location.href = '/components/edit.html';
    }
});

 // Function to handle link clicks
 function handleLinkClick(event) {
    const link = event.currentTarget; // The clicked link
    const href = link.getAttribute('href'); // Get the href attribute
    
    // Regular expression to extract the first suburl
    const regex = /^\/([^/]+)\//; // Matches: /something/anything

    const match = href.match(regex);

    if (match && match.length > 1) {
        const firstSuburl = match[1]; // Extracted first suburl

        // Construct the desired URL (for demonstration purposes)
        const fallbackUrl = `/components/template-item-${firstSuburl}.html?${firstSuburl}`;

        // Redirect to the fallback URL
        window.location.href = fallbackUrl; 
        console.log(`Redirecting to: ${fallbackUrl}`);
    } else {
        console.log("No valid suburl found!");
    }
}

// Function to attach event listeners to links after a 2-second timeout
function attachLinkListeners() {
    const links = document.querySelectorAll('a[href^="/"][href*="/"]'); // Select all links that start with / and contain /
    links.forEach(link => {
        link.addEventListener('click', handleLinkClick); // Attach the click event handler
    });
    console.log("Event listeners attached after 2-second timeout.");
}

// Execute the link listener attachment after 2 seconds
setTimeout(attachLinkListeners, 2000);