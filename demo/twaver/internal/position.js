var $position = {
    'topleft.topleft': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width,
            y: refRect.y - tarSize.height
        };
    },
    'topleft.topright': function (refRect, tarSize) {
        return {
            x: refRect.x,
            y: refRect.y - tarSize.height
        };
    },
    'top.top': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width / 2 - tarSize.width / 2,
            y: refRect.y - tarSize.height
        };
    },
    'topright.topleft': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width - tarSize.width,
            y: refRect.y - tarSize.height
        };
    },
    'topright.topright': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width,
            y: refRect.y - tarSize.height
        };
    },
    'topleft': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width / 2,
            y: refRect.y - tarSize.height / 2
        };
    },
    'top': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width / 2 + refRect.width / 2,
            y: refRect.y - tarSize.height / 2
        };
    },
    'topright': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width / 2 + refRect.width,
            y: refRect.y - tarSize.height / 2
        };
    },
    'topleft.bottomleft': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width,
            y: refRect.y
        };
    },
    'topleft.bottomright': function (refRect, tarSize) {
        return {
            x: refRect.x,
            y: refRect.y
        };
    },
    'top.bottom': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width / 2 - tarSize.width / 2,
            y: refRect.y
        };
    },
    'topright.bottomleft': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width + refRect.width,
            y: refRect.y
        };
    },
    'topright.bottomright': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width,
            y: refRect.y
        };
    },
    'left.left': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width,
            y: refRect.y + refRect.height / 2 - tarSize.height / 2
        };
    },
    'left': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width / 2,
            y: refRect.y + refRect.height / 2 - tarSize.height / 2
        };
    },
    'left.right': function (refRect, tarSize) {
        return {
            x: refRect.x,
            y: refRect.y + refRect.height / 2 - tarSize.height / 2
        };
    },
    'center': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width / 2 - tarSize.width / 2,
            y: refRect.y + refRect.height / 2 - tarSize.height / 2
        };
    },
    'right.left': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width - tarSize.width,
            y: refRect.y + refRect.height / 2 - tarSize.height / 2
        };
    },
    'right': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width - tarSize.width / 2,
            y: refRect.y + refRect.height / 2 - tarSize.height / 2
        };
    },
    'right.right': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width,
            y: refRect.y + refRect.height / 2 - tarSize.height / 2
        };
    },
    'bottomleft.topleft': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width,
            y: refRect.y + refRect.height - tarSize.height
        };
    },
    'bottomleft.topright': function (refRect, tarSize) {
        return {
            x: refRect.x,
            y: refRect.y + refRect.height - tarSize.height
        };
    },
    'bottom.top': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width / 2 - tarSize.width / 2,
            y: refRect.y + refRect.height - tarSize.height
        };
    },
    'bottomright.topleft': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width - tarSize.width,
            y: refRect.y + refRect.height - tarSize.height
        };
    },
    'bottomright.topright': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width,
            y: refRect.y + refRect.height - tarSize.height
        };
    },
    'bottomleft': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width / 2,
            y: refRect.y + refRect.height - tarSize.height / 2
        };
    },
    'bottom': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width / 2 - tarSize.width / 2,
            y: refRect.y + refRect.height - tarSize.height / 2
        };
    },
    'bottomright': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width - tarSize.width / 2,
            y: refRect.y + refRect.height - tarSize.height / 2
        };
    },
    'bottomleft.bottomleft': function (refRect, tarSize) {
        return {
            x: refRect.x - tarSize.width,
            y: refRect.y + refRect.height
        };
    },
    'bottomleft.bottomright': function (refRect, tarSize) {
        return {
            x: refRect.x,
            y: refRect.y + refRect.height
        };
    },
    'bottom.bottom': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width / 2 - tarSize.width / 2,
            y: refRect.y + refRect.height
        };
    },
    'bottomright.bottomleft': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width - tarSize.width,
            y: refRect.y + refRect.height
        };
    },
    'bottomright.bottomright': function (refRect, tarSize) {
        return {
            x: refRect.x + refRect.width,
            y: refRect.y + refRect.height
        };
    },
    get: function (position, refRect, tarSize) {
        if (!refRect) {
            throw "refRect can not be null";
        }
        if (!tarSize) {
            tarSize = { width: 0, height: 0 };
        }
        var func = $position[position];
        if (func) {
            return func(refRect, tarSize);
        }
        throw "Can not resolve '" + position + "' position";
    }
};
_twaver.position = $position;
