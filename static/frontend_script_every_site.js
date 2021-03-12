function site_name() {
    if (window.location.pathname === '/') {
        return 'index';
    } else {
        const split_path = window.location.pathname.split('/');
        const file_name = split_path[split_path.length - 1];
        return file_name.split('.').slice(0, -1).join('.');
    }
}

function connect_to_database_with_body(request, data= {}) {
    data["site_name"] = site_name()
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.send(JSON.stringify(data))
}

function connect_to_database_without_body(request) {
    request.send(null);
}

function send_fav_to_database(request, method) {
    request.open(method, '/favorite');
    connect_to_database_with_body(request, {});
}

function create_comment_table_row(username, content, is_me=false) {
    let comment_username_me = "";
    if (is_me===true) {
        comment_username_me = " comment_username_me";
    }
    return '<tr><td><div class="comment_username' + comment_username_me + '">' + username + '</div>' +
        '<div class="comment_content">' + content + '</div></td></tr>';
}

function onCommentSubmit() {
    let data = {
        'username': document.getElementById('new_comment_username').value,
        'content': document.getElementById('new_comment_content').value
    };
    const req = new XMLHttpRequest();
    req.open('POST', '/comment');
    connect_to_database_with_body(req, data);

    document.getElementById("comment_table").innerHTML +=
        create_comment_table_row(data['username'], data['content'], true);
    document.getElementById('old_comment_field').hidden = false;
    document.getElementById('comment_reset_button').click();
}

document.addEventListener("DOMContentLoaded", function(event) {
    const star = document.getElementById("star_button");

    function get_fav_from_database() {
        const request = new XMLHttpRequest();
        request.onload = function onload() {
            if (request.status < 300) {
                if(request.response.includes(site_name())) {
                    star.innerText = '\u2605';
                }
            }
        }
        request.open('GET', '/favorite');
        request.responseType = 'json';
        connect_to_database_without_body(request);
    }
    get_fav_from_database();

    function post_access_count() {
        const request = new XMLHttpRequest();
        request.open('POST', '/access-count');
        connect_to_database_with_body(request, {});
    }
    post_access_count()

    function load_comments() {
        const request = new XMLHttpRequest();
        request.onload = function onload() {
            if ((request.status < 300) && (request.response.length > 0)) {
                let comment_table = document.getElementById('comment_table');
                request.response.forEach(function (comment) {
                    comment_table.innerHTML +=
                        create_comment_table_row(comment['username'], comment['content']);
                })
            }
        }
        request.open('GET', '/comment?site_name=' + site_name());
        request.responseType = 'json';
        connect_to_database_without_body(request);
    }
    load_comments();

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


    star.addEventListener("click", function on_star_click() {
        if (star.innerText === '\u2606') {
            star.innerText = '\u231B';
            post_fav_to_database();
        } else if (star.innerText === '\u2605') {
            star.innerText = '\u231B';
            delete_fav_from_database();
        }
    });
});
