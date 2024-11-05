// assets/js/loader.js

(function() {
    const loaderScript = document.getElementById("loaderScript");

    if (loaderScript.getAttribute("run") === "true" && !document.head) {

        // loading head
        document.addEventListener("DOMContentLoaded", function() {
            // Fetch the external head template
            fetch('/components/template-head.html') // Update this path as necessary
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(headContent => {
                    // Create a temporary DOM element to parse the fetched content
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = headContent;

                    // Create a <head> element
                    const headElement = document.createElement('head');
                    headElement.innerHTML = tempDiv.innerHTML; // Set the fetched content as innerHTML

                    // Insert the <head> element into the document
                    document.documentElement.insertBefore(headElement, document.body);
                    console.log("The <head> section has been loaded successfully.");

                    // Optionally, load other components or scripts here, if necessary

                    loaderScript.setAttribute("run", "false");
                })
                .catch(error => {
                    console.error('Error loading head template:', error);
                });
        });


        document.addEventListener("DOMContentLoaded", function() {
            const urlPath = window.location.pathname;
            const segments = urlPath.split('/');
            const currentPage = segments[segments.length - 1];

            // Create and append the divs to the body
            const divIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
            divIds.forEach(id => {
                const div = document.createElement('div');
                div.id = id;
                document.body.appendChild(div);
            });

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
                            document.getElementById(divIds[index]).innerHTML = data; // Set the HTML content
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

 