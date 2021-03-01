document.addEventListener("DOMContentLoaded", function(event) {
    function get_fav_from_database() {
        const request = new XMLHttpRequest();
        request.onload = function onload() {
            if (request.status < 300) {
                if (site_name() in request.response) {
                    // TODO: Create fav table
                }
            }
        }
        request.open('GET', '/favorites');
        request.responseType = 'json';
        request.send(null);
    }
    function get_most_from_database() {
        const request = new XMLHttpRequest();
        request.onload = function onload() {
            if (request.status < 300) {
                if (site_name() in request.response) {
                    // TODO: Create most visited sites table
                }
            }
        }
        request.open('GET', '/access-count');
        request.responseType = 'json';
        request.send(null);
    }
    get_fav_from_database();
    get_most_from_database();
});
