var $render = {
    _string: function (value, div, view, innerText) {
        var text = view._stringPool.get();
        text.style.whiteSpace = 'nowrap';
        text.style.verticalAlign = 'middle';
        text.style.padding = '0px 2px';
        _twaver.setText(text, value, innerText);
        text.setAttribute('title', value);
        div.appendChild(text);
    },
    _boolean: function (value, div, view) {
        var checkBox = view._booleanPool.get();
        if (div._editInfo) {
            checkBox._editInfo = div._editInfo;
            delete div._editInfo;
            checkBox.disabled = false;
        } else {
            checkBox.disabled = true;
        }
        checkBox.keepDefault = true;
        checkBox.type = 'checkbox';
        checkBox.style.margin = '0px 2px';
        checkBox.style.verticalAlign = 'middle';
        checkBox.checked = value;
        div.appendChild(checkBox);
        if (div.style.textAlign === '') {
            div.style.textAlign = 'center';
        }
    },
    _color: function (value, div, view) {
        var color = view._colorPool.get();
        color.style.width = '100%';
        color.style.height = '100%';
        color.style.backgroundColor = value;
        color.setAttribute('title', value);
        div.appendChild(color);
    },
    render: function (type, value, div, view, innerText) {
        if (value == null) {
            return;
        }
        var func = $render['_' + type];
        if (func) {
            func(value, div, view, innerText);
        } else {
            if (typeof value === 'boolean') {
                $render._boolean(value, div, view, innerText);
            } else {
                $render._string(value, div, view, innerText);
            }
        }
    }
};
_twaver.render = $render;
