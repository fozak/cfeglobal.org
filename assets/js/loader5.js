// assets/js/loader.js
(function () {
    const loaderScript = document.getElementById("loaderScript");

    // Check if the script should run and if the <head> is not present
    if (loaderScript.getAttribute("run") === "true") {
        // Check if <head> already exists
        // Fetch the external head template

        (function () {
            var gtmId = 'G-VK4JWHDC1Z'; // Replace with your GTM ID
            var gtagScript = document.createElement('script');

            gtagScript.async = true;
            gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtmId;
            document.head.appendChild(gtagScript);

            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', gtmId);
        })();

        // Fetch the contents of the HTML file
        fetch('/components/template-head.html')
            .then(response => {
                // Check if the response is okay (status in the range 200-299)
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text(); // Get the response as text
            })
            .then(htmlContent => {
                // Prepend the entire HTML content directly to the <head>
                document.head.insertAdjacentHTML('afterbegin', htmlContent);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        // After the head is loaded, set 'run' to false
        loaderScript.setAttribute("run", "false");

        // Now load the other components
        loadComponents(); // Calling the function to load components
    } else { // Corrected placement of else
        console.log("The script will not run as 'run' is set to false.");
    }

    function loadComponents() {
        // This function will load the other components
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
            `/components/hero-${currentPage}.html`, // Added .html extension
            '/components/services-stats.html',
            '/components/faces.html',
            `/components/featured-${currentPage}.html`, // Added .html extension
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
            .catch(error => console.error('Error loading component:', error)); // Inside the correct context
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

