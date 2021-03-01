function connect_to_database_with_body(request, data= {}) {
    data["ref_site"] = window.location.pathname;
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.send(JSON.stringify(data))
}

function connect_to_database_without_body(request) {
    request.send(null);
}

function send_fav_to_database(request, method) {
    request.open(method, '/check');
    const split_path = window.location.pathname.split('/');
    const file_name = split_path[split_path.length - 1];
    const data = {
        'site_name': file_name.split('.').slice(0, -1).join('.'),
    }
    connect_to_database_with_body(request, data);
}

document.addEventListener("DOMContentLoaded", function(event) {
    const star = document.getElementById("star_button");

    function post_fav_to_database() {
        const request = new XMLHttpRequest();
        function on_failed() {
            star.innerText = '\u2606';
            alert('Fehler beim Speichern des Favoriten. Fehlercode: ' + request.status.toString());
        }
        request.onerror = on_failed;
        request.onload = function on_added() {
            if (request.status < 300) {
                star.innerText = '\u2605';
            } else {
                on_failed();
            }
        }
        send_fav_to_database(request, 'POST');
    }

    function delete_fav_from_database() {
        const request = new XMLHttpRequest();
        function on_failed() {
            star.innerText = '\u2605';
            alert('Fehler beim Entfernen des Favoriten. Fehlercode: ' + request.status.toString());
        }
        request.onerror = on_failed;
        request.onload = function on_added() {
            if (request.status < 300) {
                star.innerText = '\u2606';
            } else {
                on_failed();
            }
        }
        send_fav_to_database(request, 'DELETE');
    }

    star.addEventListener("click", on_star_click);
    function on_star_click() {
        if (star.innerText === '\u2606') {
            star.innerText = '\u231B';
            post_fav_to_database();
        } else if (star.innerText === '\u2605') {
            star.innerText = '\u231B';
            delete_fav_from_database();
        }
    }
});
