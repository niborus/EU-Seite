document.addEventListener("DOMContentLoaded", function(event) {
    function get_fav_from_database() {
        const request = new XMLHttpRequest();
        request.onload = function onload() {
            if (request.status < 300) {
                let fav_new_inner_html = "";
                request.response.forEach(function (site) {
                    fav_new_inner_html += `<li><a href='${site['site_name']}.html'>${site['titel']}</a></li>`;
                })
                document.getElementById("fav_list").innerHTML = fav_new_inner_html;
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
                let visited_new_inner_html = "";
                let most_visited = request.response;
                most_visited.sort((site1, site2) => { return site2['called'] - site1['called']; });
                most_visited.forEach(function (site) {
                    visited_new_inner_html += `<li><a href='${site['site_name']}.html'>${site['titel']}</a></li>`;
                })
                document.getElementById("visited_list").innerHTML = visited_new_inner_html;
            }
        }
        request.open('GET', '/access-count');
        request.responseType = 'json';
        request.send(null);
    }
    get_fav_from_database();
    get_most_from_database();
});
