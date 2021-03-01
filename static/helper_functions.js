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
    data["ref_site"] = window.location.pathname;
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.send(JSON.stringify(data))
}

function connect_to_database_without_body(request) {
    request.send(null);
}
