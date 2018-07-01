var proxy = {

    isMemory: true,

    clear: function (className, callback) {

        if (this.isMemory) {
            var result = memoryCache.clear(className);
            callback && callback(result);
        } else {
            serverCache.clear(className, callback);
        }
    },
    insert: function (instance, className, callback) {
        if (this.isMemory) {
            var cache = memoryCache.getMemoryCache();
            var result = memoryCache.insert(instance, className, cache);
            callback && callback(result);
        } else {
            serverCache.insert(instance, className, callback);
        }
    },
    insertBatch: function (instances, className, callback) {
        if (this.isMemory) {
            var cache = memoryCache.getMemoryCache();
            var result = memoryCache.insertBatch(instances, className, cache);
            callback && callback(result);
        } else {
            serverCache.insertBatch(instances, className, callback);
        }
    },
    query: function (where, className, callback) {
        if (this.isMemory) {
            var cache = memoryCache.getMemoryCache();
            var result = memoryCache.query(where, className, cache);
            callback && callback(result);
        } else {
            serverCache.query(where, className, callback);
        }
    },
    queryFirst: function (where, className, callback) {
        if (this.isMemory) {
            var cache = memoryCache.getMemoryCache();
            var result = memoryCache.queryFirst(where, className, cache);
            callback && callback(result);
        } else {
            serverCache.queryFirst(where, className, callback);
        }
    },
    update: function (where, update, className, callback) {
        if (this.isMemory) {
            var cache = memoryCache.getMemoryCache();
            var result = memoryCache.update(where, update, className, cache);
            callback && callback(result);
        } else {
            serverCache.update(where, update, className, callback);
        }
    },
    delete: function (where, className, callback) {
        if (this.isMemory) {
            var cache = memoryCache.getMemoryCache();
            var result = memoryCache.delete(where, className, cache);
            callback && callback(result);
        } else {
            serverCache.delete(where, className, callback);
        }
    },
    updateOrInsert: function (where, update, className, callback) {
        if (this.isMemory) {
            var cache = memoryCache.getMemoryCache();
            var result = memoryCache.updateOrInsert(where, update, className, cache);
            callback && callback(result);
        } else {
            serverCache.updateOrInsert(where, update, className, callback);
        }
    },
}