twaver.controls.PropertySheetInteraction = function (propertySheet) {
    this.sheet = propertySheet;
    this.view = propertySheet._view;
    this.resizeDiv = propertySheet._resizeDiv;

    var self = this;
    this.view.addEventListener('mousedown', function (e) {
        if (e.button === 0) {
            self.handleMouseDown(e);
        }
    }, false);
    this.view.addEventListener('mousemove', function (e) {
        self.handleMouseMove(e);
    }, false);
};
_twaver.ext('twaver.controls.PropertySheetInteraction', Object, {
    minGap: 10,
    handleMouseDown: function (e) {
        if (e.target === this.sheet._currentEditor || e.target.parentNode === this.sheet._currentEditor) {
            return;
        }
        if (this.sheet.isFocusOnClick()) {
            twaver.Util.setFocus(this.view);
        }
        if (this.sheet._isValidating) {
            return;
        }
        if (e.target._expandData) {
            var name = e.target._expandData;
            if (this.sheet.isExpanded(name)) {
                this.sheet.collapse(name);
            } else {
                this.sheet.expand(name);
            }
        } else if (e.target === this.resizeDiv) {
            this.lastX = this.getX(e);
            $html.handle_mousedown(this, e);
        } else {
            if (this.sheet._currentEditor && !this.sheet._isCommitting) {
                this.sheet._isCommitting = true;
                this.sheet.commitEditValue(this.sheet._currentEditor._editInfo, this.sheet._currentEditor);
            }
            var newIndex = this.sheet.getRowIndexAt(e);
            this.sheet.updateCurrentRowIndex(newIndex);
        }
    },
    handleMouseMove: function (e) {
        if (this.lastX == null && !$html.target) {
            this.changeCursor(e);
            return;
        }
        if ($html.target !== this || this.lastX == null) {
            return;
        }
        var x = this.getX(e);
        if (this.stopLeft != null) {
            if (x < this.stopLeft) {
                return;
            } else {
                delete this.stopLeft;
            }
        }
        if (this.stopRight != null) {
            if (x > this.stopRight) {
                return;
            } else {
                delete this.stopRight;
            }
        }
        var w = this.sheet.getPropertyNameWidth() + (x - this.lastX);
        if (w < this.minGap) {
            w = this.minGap;
            this.stopLeft = x;
        }
        else if (w > this.sheet.getSumWidth() - this.minGap) {
            w = this.sheet.getSumWidth() - this.minGap;
            this.stopRight = x;
        }
        this.sheet.setPropertyNameWidth(w);
        this.lastX = x;
    },
    handleMouseUp: function (e) {
        if (e.button !== 0) {
            return;
        }
        this.view.style.cursor = 'default';
        delete this.stopLeft;
        delete this.stopRight;
        delete this.lastX;
    },
    changeCursor: function (e) {
        this.view.style.cursor = e.target === this.resizeDiv ? 'ew-resize' : 'default';
    },
    getX: function (e) {
        return e.clientX / this.sheet.getZoom();
    }
});
