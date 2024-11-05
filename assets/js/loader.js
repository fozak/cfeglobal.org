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
        const baseUrl = window.location.href; // Get the full URL for comparison
        const segments = urlPath.split('/');
        const currentPage = segments[segments.length - 1]; // Extract the current page
    
        // Create and append the divs to the body
        const divIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        divIds.forEach(id => {
            const div = document.createElement('div');
            div.id = id;
            document.body.appendChild(div);
        });
    
        // Fetch the JSON data from the script tag
        const jsonData = JSON.parse(document.getElementById("data").textContent);
        console.log(jsonData);
    
        // Parse item-html once
        const itemHtml = jsonData['item-html'];
    
        let components = [];
        let heroHtml = ''; // Initialize heroHtml variable
    
        // Check if jsonData and title are valid
        if (jsonData && jsonData.title !== null && jsonData.title !== '') {
            if (baseUrl.includes('/programs')) {
                heroHtml = '/components/hero-programs.html'; // Set heroHtml for programs
                components = [
                    '/components/header.html',
                    // Conditional inclusion of itemHtml for programs
                    ...(itemHtml ? [itemHtml] : [heroHtml]), // Use itemHtml if it's not null or empty
                    '/components/programs-list.html',
                    '/components/services-stats.html',
                    '/components/faces.html',
                    '/components/featured-programs.html',
                    '/components/services-types.html',
                    '/components/portfolio.html',
                    '/components/footer.html',
                ];
            } 
            else if (baseUrl.includes('/people')) {
                heroHtml = '/components/hero-people.html'; // Set heroHtml for people
                components = [
                    '/components/header.html',
                    ...(itemHtml ? [itemHtml] : [heroHtml]), // Use itemHtml if it's not null or empty
                    '/components/people-list.html',
                    '/components/services-stats.html',
                    '/components/faces.html',
                    '/components/featured-people.html',
                    '/components/services-types.html',
                    '/components/portfolio.html',
                    '/components/footer.html',
                ];
            } 
            else if (baseUrl.includes('/blog')) {
                heroHtml = '/components/hero-blog.html'; // Set heroHtml for blog
                components = [
                    '/components/header.html',
                    ...(itemHtml ? [itemHtml] : [heroHtml]), // Use itemHtml if it's not null or empty
                    '/components/blog-posts.html',
                    '/components/services-stats.html',
                    '/components/faces.html',
                    '/components/featured-blog.html',
                    '/components/services-types.html',
                    '/components/portfolio.html',
                    '/components/footer.html',
                ];
            } 
            else if (baseUrl.includes('/partners')) {
                heroHtml = '/components/hero-partners.html'; // Set heroHtml for partners
                components = [
                    '/components/header.html',
                    ...(itemHtml ? [itemHtml] : [heroHtml]), // Use itemHtml if it's not null or empty
                    '/components/partners-list.html',
                    '/components/services-stats.html',
                    '/components/faces.html',
                    '/components/featured-partners.html',
                    '/components/services-types.html',
                    '/components/portfolio.html',
                    '/components/footer.html',
                ];
            } 
            else {
                // Default components if none of the above match
                components = [
                    '/components/header.html',
                    `/components/hero-${currentPage}.html`, // Use current page data
                    '/components/services-stats.html',
                    '/components/faces.html',
                    `/components/featured-${currentPage}.html`, // Use current page data
                    '/components/services-types.html',
                    '/components/portfolio.html',
                    '/components/call-to-action.html',
                    '/components/footer.html',
                ];
            }
        } else {
            // Fallback components if title is null or empty
            components = [
                '/components/header.html',
                '/components/hero-comingsoon.html', // Default to coming soon
                '/components/services-stats.html',
                '/components/faces.html',
                '/components/featured-people.html', // Default to featured people
                '/components/services-types.html',
                '/components/portfolio.html',
                '/components/call-to-action.html',
                '/components/footer.html',
            ];
        }
    
        // Load other components after handling the special case for partners
        const fetchPromises = components.map((component, index) => {
            // Check if the current component is itemHtml
            if (component === itemHtml) {
                document.getElementById(divIds[index]).innerHTML = itemHtml; // Set the HTML content directly
                return Promise.resolve(); // Resolve immediately since we set the content directly
            } 
            // Fetching heroHtml if itemHtml does not exist
            else if (component === heroHtml) {
                return fetch(heroHtml)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text().then(data => {
                            document.getElementById(divIds[index]).innerHTML = data; // Set the HTML content
                        });
                    });
            } else {
                return fetch(component)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text().then(data => {
                            document.getElementById(divIds[index]).innerHTML = data; // Set the HTML content
                        });
                    });
            }
        });
    
        // Wait for all fetch promises to resolve
        Promise.all(fetchPromises)
            .then(() => {
                console.log("All components loaded successfully.");
                populatePlaceholders();
            })
            .catch(error => console.error('Error loading component:', error));
    }
    
    // Loading data
    function populatePlaceholders() {
        // Fetch the JSON data from the script tag
        const jsonData = JSON.parse(document.getElementById("data").textContent);
        console.log(jsonData);
    
        // Check if the title in JSON data is present and not null before populating
        if (jsonData && jsonData.title !== null && jsonData.title !== '') {
            document.title = jsonData.title;
            console.log(document.title);
            document.querySelector('meta[name="description"]').setAttribute("content", jsonData.description || ''); // Fallback to empty string if description is undefined
            document.querySelector('meta[name="keywords"]').setAttribute("content", jsonData.keywords || ''); // Fallback to empty string if keywords is undefined
            document.querySelector('link[rel="canonical"]').setAttribute("href", `https://${jsonData.domain}/${jsonData.url}`);
            document.querySelector('script[type="application/ld+json"]').textContent = JSON.stringify(jsonData['ld-script']);
        } else {
            console.warn("Title is null or empty in JSON data. Placeholders not populated.");
        }
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

