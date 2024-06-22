// Select all div elements with data-loader attribute
var divs = document.querySelectorAll('[data-loader]');

// Iterate through each div and update the data-loader attribute
divs.forEach(function(div) {
    // Get the current data-loader attribute value
    var oldValue = div.getAttribute('data-loader');

    // Replace the variable with the new value
    var newValue = oldValue.replace('variable', variable);

    // Set the updated data-loader attribute value
    div.setAttribute('data-loader', newValue);
});

// Define the variable from the parentlink meta tag
var parentLinkMeta = document.querySelector('meta[name="parentlink"]');
var parentLink = parentLinkMeta ? parentLinkMeta.getAttribute('content') : null;

if (parentLink) {
    // Construct the URL for the additional content
    var linkParts = parentLink.split('/');
    var lastPart = linkParts.pop();
    var additionalContentUrl = linkParts.join('/') + '/' + lastPart + '-about.html';

    // Fetch and inject the additional content
    fetch(additionalContentUrl)
        .then(response => response.text())
        .then(data => {
            document.getElementById('additional-content').innerHTML = data;
        })
        .catch(error => console.error('Error loading additional content:', error));
}

var url;
var id;
var j = 1;

$(document).ready(function () {
    $('div[data-loader]').each(function() {
        url = $(this).attr("data-loader");
        id = $(this).attr("id");
        var tmp_j = j++;
        $.get(url, function(data) {
            $(data).insertAfter($('#' + tmp_j));
        });
    });
});
