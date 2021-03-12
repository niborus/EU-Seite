const NAME_DICT = {
    "index": "Startseite",
    "mitgliedstaaten": "Mitgliedsstaaten",
    "organe": "Organe der EU",
    "parteien": "Parteien",
    "quiz": "Quiz",
    "quiz-solutions": "Quiz (Lösungen)",
}

document.addEventListener("DOMContentLoaded", function(event) {
    function get_fav_from_database() {
        const request = new XMLHttpRequest();
        request.onload = function onload() {
            if ((request.status < 300) && (request.response.length > 0)) {
                let fav_new_inner_html = "";
                request.response.forEach(function (site_name) {
                    fav_new_inner_html += `<li><a href='${site_name}.html'>${NAME_DICT[site_name]}</a></li>`;
                })
                document.getElementById("fav_list").innerHTML = fav_new_inner_html;
            }
        }
        request.open('GET', '/favorite');
        request.responseType = 'json';
        request.send(null);
    }
    function get_most_from_database() {
        const request = new XMLHttpRequest();
        request.onload = function onload() {
            if ((request.status < 300) && (request.response.length > 0)) {
                let visited_new_inner_html = "";
                let most_visited = request.response;
                most_visited.sort((site1, site2) => { return site2['count'] - site1['count']; });
                most_visited.forEach(function (site) {
                    let site_name = site['site_name']
                    visited_new_inner_html += `<li><a href='${site_name}.html'>${NAME_DICT[site_name]}</a></li>`;
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
