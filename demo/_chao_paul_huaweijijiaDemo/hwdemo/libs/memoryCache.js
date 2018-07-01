var memoryCache = {
    cacheName: 'memoryCache',
    className: 'Default',
    getMemoryCache: function (key) {
        key = key || this.cacheName;
        var cache = localStorage.getItem(key)
        if (cache) {
            cache = JSON.parse(cache);
        } else {
            cache = {};
            this.setMemoryCache(cache, key);
        }
        return cache;
    },
    setMemoryCache: function (cache, key) {

        cache = cache || [];
        key = key || this.cacheName;
        var str = JSON.stringify(cache);
        localStorage.setItem(key, str)
    },
    equals: function (instance, where) {


        if (!instance || !where)
            return false;
        for (var p in where) {
            if (!instance[p]) {
                return false;
            }
            var type1 = typeof where[p];
            var type2 = typeof  instance[p];
            if (type1 == 'object' && type2 == 'object') {
                return this.equals(instance[p], where[p])
            } else if (type1 == 'object') {
                return false;
            } else if (type2 == 'object') {
                return false;
            } else if (instance[p] != where[p]) {
                return false;
            }
        }
        return true;
    },
    ext: function (dest, src) {
        for (var p in src) {
            if (!dest[p]) {
                dest[p] = src[p];
                continue;
            }
            var type1 = typeof src[p];
            var type2 = typeof  dest[p];
            if (type1 == 'object' && type2 == 'object') {
                if(src[p] instanceof Array && dest[p] instanceof Array){
                    dest[p] = src[p]
                }else{
                    this.ext(dest[p], src[p])
                }

            } else {
                dest[p] = src[p];
            }
        }
    },
    clear: function (className, key) {

        var result = [];
        key = key || this.cacheName;
        if (className) {
            var cache = this.getMemoryCache(key);
            result = cache[className];
            cache[className] = [];
            this.setMemoryCache(cache, key)
        } else {
            var cache = {};
            this.setMemoryCache(cache, key)
        }
        return result || [];
    },
    insert: function (instance, className, cache) {

        className = className || this.className;
        cache = cache || this.getMemoryCache();
        if (!cache[className]) {
            cache[className] = [];
        }
        cache[className].push(instance);
        this.setMemoryCache(cache);
        return this.query(instance, className, cache);
    },
    insertBatch: function (instances, className, cache) {

        className = className || this.className;
        cache = cache || this.getMemoryCache();
        if (!cache[className]) {
            cache[className] = [];
        }
        cache[className] = cache[className].concat(instances);
        this.setMemoryCache(cache);
        return instances;
    },
    query: function (where, className, cache) {

        var self = this;
        className = className || this.className;
        cache = cache || this.getMemoryCache();
        if (!cache[className]) {
            return []
        }

        var classArray = cache[className];
        if (JSON.stringify(where) == '{}') {
            return classArray;
        }
        var result = [];
        classArray.forEach(function (instance) {
            if (self.equals(instance, where)) {
                result.push(instance);
            }
        });
        return result;
    },

    queryFirst: function (where, className, cache) {

        className = className || this.className;
        cache = cache || this.getMemoryCache();
        var result = this.query(where, className, cache);
        if (result && result.length > 0) {
            return result[0];
        }
        return null;
    },
    update: function (where, update, className, cache) {
        if (!update) {
            return;
        }
        var self = this;
        className = className || this.className;
        cache = cache || this.getMemoryCache();

        var result = this.query(where, className, cache);
        if (!result || result.length == 0) {
            return 0;
        }
        var classArray = cache[className];
        result.forEach(function (instance) {
            self.ext(instance, update);
        });
        this.setMemoryCache(cache);
        return result;
    },
    delete: function (where, className, cache) {

        className = className || this.className;
        cache = cache || this.getMemoryCache();
        var result = this.query(where, className, cache);
        if (!result || result.length == 0) {
            return 0;
        }
        var classArray = cache[className];
        result.forEach(function (instance) {
            var index = classArray.indexOf(instance);
            classArray.splice(index, 1)
        });
        this.setMemoryCache(cache);
        return result;
    },
    updateOrInsert: function (where, update, className, cache) {

        className = className || this.className;
        cache = cache || this.getMemoryCache();
        var result = this.queryFirst(where, className);
        if (!result) {
            memoryCache.insert(where, className);
        }
        memoryCache.update(where, update, className);
    }
}