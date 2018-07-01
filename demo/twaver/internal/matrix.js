var $Matrix = _twaver.Matrix = function (m11, m12, m21, m22, offsetX, offsetY) {
    this.setMatrix(m11, m12, m21, m22, offsetX, offsetY);
};
$Matrix.identity = function () {
    return new $Matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
};
$Matrix.prototype.setMatrix = function (m11, m12, m21, m22, offsetX, offsetY) {
    this._m11 = m11;
    this._m12 = m12;
    this._m21 = m21;
    this._m22 = m22;
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this._type = 0;

    if ((this._m21 != 0.0) || (this._m12 != 0.0)) {
        this._type = 4;
    } else {
        if ((this._m11 != 1.0) || (this._m22 != 1.0)) {
            this._type = 2;
        }
        if ((this._offsetX != 0.0) || (this._offsetY != 0.0)) {
            this._type |= 1;
        }
        if ((this._type & (2 | 1)) == 0) {
            this._type = 0;
        }
    }
};
$Matrix.prototype.transform = function () {
    var point;
    if (arguments.length === 2) {
        point = { x: arguments[0], y: arguments[1] };
    } else {
        point = arguments[0];
    }
    if (!point || !_twaver.num(point.x) || !_twaver.num(point.y)) {
        throw "arguments should contain x, y";
    }
    switch (this._type) {
        //TRANSFORM_IS_IDENTITY    
        case 0:
            return { x: point.x, y: point.y };
            //TRANSFORM_IS_TRANSLATION
        case 1:
            return { x: this._offsetX + point.x, y: this._offsetY + point.y };
            //TRANSFORM_IS_SCALING
        case 2:
            return { x: point.x * this._m11, y: point.y * this._m22 };
            //TRANSFORM_IS_TRANSLATION && TRANSFORM_IS_SCALING
        case 3:
            return { x: point.x * this._m11 + this._offsetX, y: point.y * this._m22 + this._offsetY };
    }
    //TRANSFORM_IS_UNKNOWN
    return { x: this._m11 * point.x + point.y * this._m21 + this._offsetX, y: this._m22 * point.y + point.x * this._m12 + this._offsetY };
};
$Matrix.prototype.translate = function (translateX, translateY) {
    this.multiply(new $Matrix(1.0, 0, 0, 1.0, translateX, translateY));
};
$Matrix.prototype.scale = function (scaleX, scaleY) {
    this.multiply(new $Matrix(scaleX, 0, 0, scaleY, 0.0, 0.0));
};
$Matrix.prototype.rotate = function (angle, centerX, centerY) {
    angle = angle * Math.PI / 180;
    var num2 = Math.sin(angle);
    var num = Math.cos(angle);
    var offsetX = (centerX * (1.0 - num)) + (centerY * num2);
    var offsetY = (centerY * (1.0 - num)) - (centerX * num2);
    this.multiply(new $Matrix(num, num2, -num2, num, offsetX, offsetY));
};
$Matrix.prototype.skew = function (skewX, skewY) {
    this.multiply(new $Matrix(1.0, Math.tan(skewY * Math.PI / 180), Math.tan(skewX * Math.PI / 180), 1.0, 0.0, 0.0));
};
$Matrix.prototype.multiply = function (matrix) {
    var matrix1 = this;
    var matrix2 = matrix;
    var types2 = matrix1._type;
    var types = matrix2._type;
    if (types != 0)
    {
        if (types2 == 0)
        {
            matrix1.setMatrix(matrix2._m11, matrix2._m12, matrix2._m21, matrix2._m22, matrix2._offsetX, matrix2._offsetY);
        }
        else if (types == 1)
        {
            matrix1._offsetX += matrix2._offsetX;
            matrix1._offsetY += matrix2._offsetY;
            if (types2 != 4)
            {
                matrix1._type |= 1;
            }
        }
        else if (types2 == 1)
        {
            var num3 = matrix1._offsetX;
            var num2 = matrix1._offsetY;
            matrix1.setMatrix(matrix2._m11, matrix2._m12, matrix2._m21, matrix2._m22, matrix2._offsetX, matrix2._offsetY);
            matrix1._offsetX = ((num3 * matrix2._m11) + (num2 * matrix2._m21)) + matrix2._offsetX;
            matrix1._offsetY = ((num3 * matrix2._m12) + (num2 * matrix2._m22)) + matrix2._offsetY;
            if (types == 4)
            {
                matrix1._type = 4;
            }
            else
            {
                matrix1._type = 2 | 1;
            }
        }
        else
        {
            switch (((types2 << 4) | types))
            {
                case 0x22:
                    matrix1._m11 *= matrix2._m11;
                    matrix1._m22 *= matrix2._m22;
                    return;

                case 0x23:
                    matrix1._m11 *= matrix2._m11;
                    matrix1._m22 *= matrix2._m22;
                    matrix1._offsetX = matrix2._offsetX;
                    matrix1._offsetY = matrix2._offsetY;
                    matrix1._type = 2 | 1;
                    return;

                case 0x24:
                case 0x34:
                case 0x42:
                case 0x43:
                case 0x44:
                    matrix1.setMatrix((matrix1._m11 * matrix2._m11) + (matrix1._m12 * matrix2._m21), (matrix1._m11 * matrix2._m12) + (matrix1._m12 * matrix2._m22), (matrix1._m21 * matrix2._m11) + (matrix1._m22 * matrix2._m21), (matrix1._m21 * matrix2._m12) + (matrix1._m22 * matrix2._m22), ((matrix1._offsetX * matrix2._m11) + (matrix1._offsetY * matrix2._m21)) + matrix2._offsetX, ((matrix1._offsetX * matrix2._m12) + (matrix1._offsetY * matrix2._m22)) + matrix2._offsetY);
                    return;

                case 50:
                    matrix1._m11 *= matrix2._m11;
                    matrix1._m22 *= matrix2._m22;
                    matrix1._offsetX *= matrix2._m11;
                    matrix1._offsetY *= matrix2._m22;
                    return;

                case 0x33:
                    matrix1._m11 *= matrix2._m11;
                    matrix1._m22 *= matrix2._m22;
                    matrix1._offsetX = (matrix2._m11 * matrix1._offsetX) + matrix2._offsetX;
                    matrix1._offsetY = (matrix2._m22 * matrix1._offsetY) + matrix2._offsetY;
                    return;
                default: 
                    console.log("Matrix multiply hit an invalid case: " + combinedType); 
                    break;
            }
        }
    }
};
