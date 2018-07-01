var $popup = {

    toolTipDiv: null,

    getToolTipDiv: function () {
        if (!$popup.toolTipDiv) {
            $popup.toolTipDiv = document.createElement('div');

            // init default style
            var D = $Defaults;
            var style = $popup.toolTipDiv.style;
            style.position = 'absolute';
            style.color = D.TOOLTIP_COLOR;
            style.background = D.TOOLTIP_BACKGROUND;
            style.fontSize = D.TOOLTIP_FONT_SIZE;
            style.padding = D.TOOLTIP_PADDING;
            style.border = D.TOOLTIP_BORDER;
            style.borderRadius = D.TOOLTIP_BORDER_RADIUS;
            style.boxShadow = D.TOOLTIP_BOX_SHADOW;
            style.zIndex = D.TOOLTIP_ZINDEX;
            if (style.setProperty) {
                style.setProperty('-webkit-box-shadow', D.TOOLTIP_BOX_SHADOW, null);
            }
        }
        return $popup.toolTipDiv;
    },

    isToolTipVisible: function () {
        return $popup.getToolTipDiv().parentNode ? true : false;
    },

    hideToolTip: function () {
        $popup._clearTimeout();
        $popup._clearDismiss();
        if (!$popup.isToolTipVisible()) {
            return;
        }
        var div = $popup.getToolTipDiv();
        if (div.parentNode) {
            div.parentNode.removeChild(div);
        }
    },

    showToolTip: function (eventOrPoint, innerHTML) {
        if (!eventOrPoint || !innerHTML) {
            $popup.hideToolTip();
            return;
        }

        if ($popup.isToolTipVisible() || $popup._reshow_timeout) {
            $popup._showToolTip(eventOrPoint, innerHTML);
        } else {
            $popup._clearTimeout();
            // $popup._show_timeout = setTimeout($popup._showToolTip, $Defaults.TOOLTIP_INITIAL_DELAY,eventOrPoint, innerHTML);
            $popup._show_timeout = setTimeout(function(){
                $popup._showToolTip(eventOrPoint, innerHTML);
            }, $Defaults.TOOLTIP_INITIAL_DELAY);
        }
    },
    _showToolTip: function (eventOrPoint, innerHTML) {
        var x, y, div;

        if (eventOrPoint.target) {
            x = eventOrPoint.clientX;
            y = eventOrPoint.clientY;
        } else {
            x = eventOrPoint.x;
            y = eventOrPoint.y;
        }
        div = $popup.getToolTipDiv();
        $html.clear(div);
        if (innerHTML instanceof Element) {
            div.appendChild(innerHTML);
        } else {
            div.innerHTML = innerHTML;
        }
        div.style.left = x + $Defaults.TOOLTIP_XOFFSET + 'px';
        div.style.top = y + $Defaults.TOOLTIP_YOFFSET + 'px';
        if (!div.parentNode) {
            document.body.appendChild(div);
        }
        $popup._clearDismiss();
        $popup._dismiss_timeout = setTimeout($popup.hideToolTip, $Defaults.TOOLTIP_DISMISS_DELAY);
        $popup._clearReshow();
        $popup._reshow_timeout = setTimeout($popup._clearReshow, $Defaults.TOOLTIP_RESHOW_DELAY);
    },
    _clearDismiss: function () {
        if ($popup._dismiss_timeout) {
            clearTimeout($popup._dismiss_timeout);
            $popup._dismiss_timeout = null;
        }
    },
    _clearReshow: function () {
        if ($popup._reshow_timeout) {
            clearTimeout($popup._reshow_timeout);
            $popup._reshow_timeout = null;
        }
    },
    _clearTimeout: function () {
        if ($popup._show_timeout) {
            clearTimeout($popup._show_timeout);
            $popup._show_timeout = null;
        }
    },
    resetToolTip: function () {
        $popup.hideToolTip();
        $popup.toolTipDiv = null;
    }
};
_twaver.popup = $popup;
