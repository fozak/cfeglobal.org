// Define the variable from the parentlink meta tag
var parentLinkMeta = document.querySelector('meta[name="parentlink"]');
var parentLink = parentLinkMeta ? parentLinkMeta.getAttribute('content') : null;

if (parentLink) {
    // Construct the URL for the additional content
    var linkParts = parentLink.split('/');
    var lastPart = linkParts.pop();
    var additionalContentUrl = linkParts.join('/') + '/' + lastPart + '-about.html';

    // Fetch the additional content
    fetch(additionalContentUrl)
        .then(response => response.text())
        .then(data => {
            // Append the fetched content to #additional-content
            var additionalContent = document.getElementById('additional-content');
            if (additionalContent) {
                additionalContent.innerHTML = data; // Replace content if needed, or use appendChild to add to the existing content
            } else {
                console.error('#additional-content element not found.');
            }
        })
        .catch(error => console.error('Error loading additional content:', error));
}

// Initialize variables for jQuery usage (if necessary)
var url;
var id;
var j = 1;

$(document).ready(function () {
    // Iterate through each div with data-loader attribute using jQuery
    $('div[data-loader]').each(function() {
        url = $(this).attr("data-loader");
        id = $(this).attr("id");
        var tmp_j = j++;
        // Perform AJAX GET request using jQuery
        $.get(url, function(data) {
            // Insert fetched data after the identified element
            $(data).insertAfter($('#' + tmp_j));
        });
    });
});

