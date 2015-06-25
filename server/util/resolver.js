// convert 1 level obj to normal obj
exports.resolveObject = function resolveObject (obj) {

    var result = {};

    for (var key in obj) {

        var subs = key.split('.');
        var temp = result;

        for (var i = 0; i < subs.length; i++) {

            var subkey = subs[i];
            if(i == subs.length - 1) {

                temp[subkey] = obj[key];
            }
            else {

                temp[subkey] = temp[subkey] || {};
                temp = temp[subkey];
            }
        }
    }

    return result;
};

// convert normal obj to 1 level obj
exports.resolveString = function resolveString (obj) {

    var result = {};
    return getResolvedObj("", obj, result);

    function getResolvedObj(suf, source, dest) {
        for (var key in source) {

            if(source.hasOwnProperty(key)) {

                var objKey = suf + key;
                var val = source[key];
                // if val is obj
                if(val.toString() === "[object Object]") {

                    getResolvedObj(objKey + ".", val, result);
                }
                else {

                    result[objKey] = val;
                }
            }
        }

        return dest;
    }
};
