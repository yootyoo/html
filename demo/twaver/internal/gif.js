var gifUtil = {
    bitsToNum: function (ba) {
        return ba.reduce(function (s, n) {
            return s * 2 + n;
        }, 0);
    },
    byteToBitArr: function (bite) {
        var a = [];
        for (var i = 7; i >= 0; i--) {
            a.push( !! (bite & (1 << i)));
        }
        return a;
    },
    lzwDecode: function (minCodeSize, data) {
        var pos = 0;
        var readCode = function (size) {
            var code = 0;
            for (var i = 0; i < size; i++) {
                if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                    code |= 1 << i;
                }
                pos++;
            }
            return code;
        };

        var output = [];

        var clearCode = 1 << minCodeSize;
        var eoiCode = clearCode + 1;

        var codeSize = minCodeSize + 1;

        var dict = [];

        var clear = function () {
            dict = [];
            codeSize = minCodeSize + 1;
            for (var i = 0; i < clearCode; i++) {
                dict[i] = [i];
            }
            dict[clearCode] = [];
            dict[eoiCode] = null;

        };

        var code;
        var last;

        while (true) {
            last = code;
            code = readCode(codeSize);

            if (code === clearCode) {
                clear();
                continue;
            }
            if (code === eoiCode) break;

            if (code < dict.length) {
                if (last !== clearCode) {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            }
            else {
                if (code !== dict.length) throw new Error('Invalid LZW code.');
                dict.push(dict[last].concat(dict[last][0]));
            }
            output.push.apply(output, dict[code]);

            if (dict.length === (1 << codeSize) && codeSize < 12) {
                codeSize++;
            }
        }
        return output;
    }
};
var _stream = function (data) {
    this.data = data;
    this.len = this.data.length;
    this.pos = 0;
};
_twaver.ext(_stream, Object, {
    readByte: function(){
        if (this.pos >= this.data.length) {
            throw new Error('Attempted to read past end of stream.');
        }
        return this.data.charCodeAt(this.pos++) & 0xFF;
    },
    readBytes: function (n) {
        var bytes = [];
        for (var i = 0; i < n; i++) {
            bytes.push(this.readByte());
        }
        return bytes;
    },
    read: function (n) {
        var s = '';
        for (var i = 0; i < n; i++) {
            s += String.fromCharCode(this.readByte());
        }
        return s;
    },
    readUnsigned: function () {
        var a = this.readBytes(2);
        return (a[1] << 8) + a[0];
    }
});
var _gif = function (_stream) {
    var hdr;
    var stream = _stream;
    var transparency = null;
    var delay = null;
    var disposalMethod = null;
    var disposalRestoreFromIdx = 0;
    var lastDisposalMethod = null;
    var frame = null;
    var lastImg = null;
    var playing = true;
    var forward = true;

    this.frames = [];
    this.size = {};
    var self = this;
    var rect = null;
    var tmpCanvas = document.createElement('canvas');
    this.loaded = false;
    var clear = function () {
        transparency = null;
        delay = null;
        lastDisposalMethod = disposalMethod;
        disposalMethod = null;
        frame = null;
    };
    this.doParse = function () {
        parseGIF(stream, handler);
    };

    var doHdr = function (_hdr) {
        hdr = _hdr;
        self.size.width = hdr.width;
        self.size.height = hdr.height;
    };

    var doGCE = function (gce) {
        pushFrame();
        clear();
        transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
        delay = gce.delayTime;
        disposalMethod = gce.disposalMethod;
    };

    var pushFrame = function () {
        if (!frame) return;
        self.frames.push({
            data: frame.getImageData(0, 0, hdr.width, hdr.height),
            delay: delay
        });
    };

    var doImg = function (img) {
        if (!frame) frame = tmpCanvas.getContext('2d');

        var currIdx = self.frames.length;

        var ct = img.lctFlag ? img.lct : hdr.gct;

        if (currIdx > 0) {
            if (lastDisposalMethod === 3) {
                frame.putImageData(self.frames[disposalRestoreFromIdx].data, 0, 0);
            } else {
                disposalRestoreFromIdx = currIdx - 1;
            }

            if (lastDisposalMethod === 2) {
                if(!lastImg) {
                    frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
                }
            }
        }
        var imgData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height);

        img.pixels.forEach(function (pixel, i) {
            if (pixel !== transparency) {
                imgData.data[i * 4 + 0] = ct[pixel][0];
                imgData.data[i * 4 + 1] = ct[pixel][1];
                imgData.data[i * 4 + 2] = ct[pixel][2];
                imgData.data[i * 4 + 3] = 255; // Opaque.
            }
        });
        frame.putImageData(imgData, img.leftPos, img.topPos);
        lastImg = img;
    };

    var doNothing = function () {};
    var withProgress = function (fn) {
        return function (block) {
            fn(block);
        };
    };


    var handler = {
        hdr: withProgress(doHdr),
        gce: withProgress(doGCE),
        com: withProgress(doNothing),
        app: {
            NETSCAPE: withProgress(doNothing)
        },
        img: withProgress(doImg),
        eof: function (block) {
            pushFrame();
            self.loaded = true;
        }
    };

};


var parseGIF = function (st, handler) {
    handler || (handler = {});

    var parseCT = function (entries) {
        var ct = [];
        for (var i = 0; i < entries; i++) {
            ct.push(st.readBytes(3));
        }
        return ct;
    };

    var readSubBlocks = function () {
        var size, data;
        data = '';
        do {
            size = st.readByte();
            data += st.read(size);
        } while (size !== 0);
        return data;
    };

    var parseHeader = function () {
        var hdr = {};
        hdr.sig = st.read(3);
        hdr.ver = st.read(3);
        if (hdr.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
        hdr.width = st.readUnsigned();
        hdr.height = st.readUnsigned();

        var bits = gifUtil.byteToBitArr(st.readByte());
        hdr.gctFlag = bits.shift();
        hdr.colorRes = gifUtil.bitsToNum(bits.splice(0, 3));
        hdr.sorted = bits.shift();
        hdr.gctSize = gifUtil.bitsToNum(bits.splice(0, 3));

        hdr.bgColor = st.readByte();
        hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
        if (hdr.gctFlag) {
            hdr.gct = parseCT(1 << (hdr.gctSize + 1));
        }
        handler.hdr && handler.hdr(hdr);
    };

    var parseExt = function (block) {
        var parseGCExt = function (block) {
            var blockSize = st.readByte(); // Always 4
            var bits = gifUtil.byteToBitArr(st.readByte());
            block.reserved = bits.splice(0, 3); // Reserved; should be 000.
            block.disposalMethod = gifUtil.bitsToNum(bits.splice(0, 3));
            block.userInput = bits.shift();
            block.transparencyGiven = bits.shift();

            block.delayTime = st.readUnsigned();

            block.transparencyIndex = st.readByte();

            block.terminator = st.readByte();

            handler.gce && handler.gce(block);
        };

        var parseComExt = function (block) {
            block.comment = readSubBlocks();
            handler.com && handler.com(block);
        };

        var parsePTExt = function (block) {
            var blockSize = st.readByte(); // Always 12
            block.ptHeader = st.readBytes(12);
            block.ptData = readSubBlocks();
            handler.pte && handler.pte(block);
        };

        var parseAppExt = function (block) {
            var parseNetscapeExt = function (block) {
                var blockSize = st.readByte();
                block.unknown = st.readByte();
                block.iterations = st.readUnsigned();
                block.terminator = st.readByte();
                handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
            };

            var parseUnknownAppExt = function (block) {
                block.appData = readSubBlocks();
                // FIXME: This won't work if a handler wants to match on any identifier.
                handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
            };

            var blockSize = st.readByte();
            block.identifier = st.read(8);
            block.authCode = st.read(3);
            switch (block.identifier) {
                case 'NETSCAPE':
                    parseNetscapeExt(block);
                    break;
                default:
                    parseUnknownAppExt(block);
                    break;
            }
        };

        var parseUnknownExt = function (block) {
            block.data = readSubBlocks();
            handler.unknown && handler.unknown(block);
        };

        block.label = st.readByte();
        switch (block.label) {
            case 0xF9:
                block.extType = 'gce';
                parseGCExt(block);
                break;
            case 0xFE:
                block.extType = 'com';
                parseComExt(block);
                break;
            case 0x01:
                block.extType = 'pte';
                parsePTExt(block);
                break;
            case 0xFF:
                block.extType = 'app';
                parseAppExt(block);
                break;
            default:
                block.extType = 'unknown';
                parseUnknownExt(block);
                break;
        }
    };

    var parseImg = function (img) {
        var deinterlace = function (pixels, width) {
            var newPixels = new Array(pixels.length);
            var rows = pixels.length / width;
            var cpRow = function (toRow, fromRow) {
                var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
            };

            var offsets = [0, 4, 2, 1];
            var steps = [8, 8, 4, 2];

            var fromRow = 0;
            for (var pass = 0; pass < 4; pass++) {
                for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                    cpRow(toRow, fromRow)
                    fromRow++;
                }
            }

            return newPixels;
        };

        img.leftPos = st.readUnsigned();
        img.topPos = st.readUnsigned();
        img.width = st.readUnsigned();
        img.height = st.readUnsigned();

        var bits = gifUtil.byteToBitArr(st.readByte());
        img.lctFlag = bits.shift();
        img.interlaced = bits.shift();
        img.sorted = bits.shift();
        img.reserved = bits.splice(0, 2);
        img.lctSize = gifUtil.bitsToNum(bits.splice(0, 3));

        if (img.lctFlag) {
            img.lct = parseCT(1 << (img.lctSize + 1));
        }

        img.lzwMinCodeSize = st.readByte();

        var lzwData = readSubBlocks();

        img.pixels = gifUtil.lzwDecode(img.lzwMinCodeSize, lzwData);

        if (img.interlaced) { // Move
            img.pixels = deinterlace(img.pixels, img.width);
        }

        handler.img && handler.img(img);
    };

    var parseBlock = function () {
        var block = {};
        block.sentinel = st.readByte();

        switch (String.fromCharCode(block.sentinel)) { // For ease of matching
            case '!':
                block.type = 'ext';
                parseExt(block);
                break;
            case ',':
                block.type = 'img';
                parseImg(block);
                break;
            case ';':
                block.type = 'eof';
                handler.eof && handler.eof(block);
                break;
            default:
                throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
        }

        if (block.type !== 'eof') setTimeout(parseBlock, 0);
    };

    var parse = function () {
        parseHeader();
        setTimeout(parseBlock, 0);
    };

    parse();
};
var getGifFrame =  function(frames,size,i) {
    var tmpCanvas = document.createElement('canvas');
    setGifSize(tmpCanvas, size.width, size.height);
    tmpCanvas.getContext("2d").clearRect(0,0,size.width,size.height);
    tmpCanvas.getContext("2d").putImageData(frames[i].data, 0, 0);
    return tmpCanvas;
}
var setGifSize =  function(tpc, w, h) {
    tpc.width = w;
    tpc.height = h;
    tpc.style.width = w + 'px';
    tpc.style.height = h + 'px';
}




