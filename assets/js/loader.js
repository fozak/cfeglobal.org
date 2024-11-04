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

// Function to check if the suburl exists
function handleLinkClick(event) {
    const link = event.currentTarget; // The clicked link
    const href = link.getAttribute('href'); // Get the href attribute

    // Define the base path
    const basePath = '/domain/suburl/';

    // Check if the href starts with the base path
    if (href.startsWith(basePath)) {
        // Prevent the default navigation
        event.preventDefault();

        // Extract the suburl
        const suburl = href.replace(basePath, '').replace('.html', '');

        // Construct the fallback URL
        const fallbackUrl = `/components/template-item-${suburl}.html?${suburl}`;

        // Redirect to the fallback URL
        window.location.href = fallbackUrl; 
    }
}

// Attach event listeners to links with the specified base path after a timeout
setTimeout(() => {
    const links = document.querySelectorAll('a[href^="/domain/suburl/"]'); // Select links with the base path
    links.forEach(link => {
        link.addEventListener('click', handleLinkClick); // Attach the click event handler
    });
}, 2000); // 2000 milliseconds = 2 seconds
