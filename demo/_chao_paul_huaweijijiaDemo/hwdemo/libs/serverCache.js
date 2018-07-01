var serverCache = {

    clear: function (className, callback) {

        api('clear', [className], callback);
    },
    insert: function (instance, className, callback) {
        api('insert', [instance, className], callback);
    },
    insertBatch: function (instances, className, callback) {
        api('insertBatch', [instances, className], callback);
    },
    query: function (where, className, callback) {
        api('query', [where, className], callback);
    },

    queryFirst: function (where, className, callback) {
        api('queryFirst', [where, className], callback);
    },
    update: function (where, update, className, callback) {
        api('update', [where, update, className], callback);
    },
    delete: function (where, className, callback) {
        api('delete', [where, className], callback);
    },
    updateOrInsert: function (where, update, className, callback) {
        api('updateOrInsert', [where, update, className], callback);
    },
}

function api(method, data, callback) {
    $.ajax({
        url: tools.baseUrl + '/model/' + method,
        contentType: 'application/json',
        method: 'post',
        data: JSON.stringify(data),
        success: callback,
        error: function (a, b, c) {
            console.log(a, b, c)
            alert(a.responseText);
        }
    });
}