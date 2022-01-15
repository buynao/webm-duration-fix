"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var Tools = /** @class */ (function () {
    function Tools() {
    }
    /**
     * read variable length integer per
     * https://www.matroska.org/technical/specs/index.html#EBML_ex
     * @static
     * @param {Buffer} buffer containing input
     * @param {Number} [start=0] position in buffer
     * @returns {{length: Number, value: number}}  value / length object
     */
    Tools.readVint = function (buffer, start) {
        if (start === void 0) { start = 0; }
        var length = 8 - Math.floor(Math.log2(buffer[start]));
        if (length > 8) {
            var number = Tools.readHexString(buffer, start, start + length);
            throw new Error("Unrepresentable length: ".concat(length, " ").concat(number));
        }
        if (start + length > buffer.length) {
            return null;
        }
        var value = buffer[start] & ((1 << (8 - length)) - 1);
        for (var i = 1; i < length; i += 1) {
            if (i === 7) {
                if (value >= Math.pow(2, 8) && buffer[start + 7] > 0) {
                    return { length: length, value: -1 };
                }
            }
            value *= Math.pow(2, 8);
            value += buffer[start + i];
        }
        return { length: length, value: value };
    };
    /**
     * write variable length integer
     * @static
     * @param {Number} value to store into buffer
     * @returns {Buffer} containing the value
     */
    Tools.writeVint = function (value) {
        if (value < 0 || value > Math.pow(2, 53)) {
            throw new Error("Unrepresentable value: ".concat(value));
        }
        var length = 1;
        for (length = 1; length <= 8; length += 1) {
            if (value < Math.pow(2, (7 * length)) - 1) {
                break;
            }
        }
        var buffer = tools_1.Buffer.alloc(length);
        var val = value;
        for (var i = 1; i <= length; i += 1) {
            var b = val & 0xff;
            buffer[length - i] = b;
            val -= b;
            val /= Math.pow(2, 8);
        }
        buffer[0] |= 1 << (8 - length);
        return buffer;
    };
    /**
     * *
     * concatenate two arrays of bytes
     * @static
     * @param {Buffer} a1  First array
     * @param {Buffer} a2  Second array
     * @returns  {Buffer} concatenated arrays
     */
    Tools.concatenate = function (a1, a2) {
        // both null or undefined
        if (!a1 && !a2) {
            return tools_1.Buffer.from([]);
        }
        if (!a1 || a1.byteLength === 0) {
            return a2;
        }
        if (!a2 || a2.byteLength === 0) {
            return a1;
        }
        return tools_1.Buffer.from(__spreadArray(__spreadArray([], a1, true), a2, true));
    };
    /**
     * get a hex text string from Buff[start,end)
     * @param {Buffer} buff from which to read the string
     * @param {Number} [start=0] starting point (default 0)
     * @param {Number} [end=buff.byteLength] ending point (default the whole buffer)
     * @returns {string} the hex string
     */
    Tools.readHexString = function (buff, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = buff.byteLength; }
        return Array.from(buff.slice(start, end))
            .map(function (q) { return Number(q).toString(16); })
            .reduce(function (acc, current) { return "".concat(acc).concat(current.padStart(2, '0')); }, '');
    };
    /**
     * tries to read out a UTF-8 encoded string
     * @param  {Buffer} buff the buffer to attempt to read from
     * @return {string|null}      the decoded text, or null if unable to
     */
    Tools.readUtf8 = function (buff) {
        try {
            return tools_1.Buffer.from(buff).toString('utf8');
        }
        catch (exception) {
            return null;
        }
    };
    /**
     * get an unsigned number from a buffer
     * @param {Buffer} buff from which to read variable-length unsigned number
     * @returns {number|string} result (in hex for lengths > 6)
     */
    Tools.readUnsigned = function (buff) {
        var b = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        switch (buff.byteLength) {
            case 1:
                return b.getUint8(0);
            case 2:
                return b.getUint16(0);
            case 4:
                return b.getUint32(0);
            default:
                break;
        }
        if (buff.byteLength <= 6) {
            return buff.reduce(function (acc, current) { return acc * 256 + current; }, 0);
        }
        return Tools.readHexString(buff, 0, buff.byteLength);
    };
    /**
     * get an signed number from a buffer
     * @static
     * @param {Buffer} buff from which to read variable-length signed number
     * @returns {number} result
     */
    Tools.readSigned = function (buff) {
        var b = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        switch (buff.byteLength) {
            case 1:
                return b.getInt8(0);
            case 2:
                return b.getInt16(0);
            case 4:
                return b.getInt32(0);
            default:
                return NaN;
        }
    };
    /**
     * get an floating-point number from a buffer
     * @static
     * @param {Buffer} buff from which to read variable-length floating-point number
     * @returns {number} result
     */
    Tools.readFloat = function (buff) {
        var b = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        switch (buff.byteLength) {
            case 4:
                return b.getFloat32(0);
            case 8:
                return b.getFloat64(0);
            default:
                return NaN;
        }
    };
    /**
     * get a date from a buffer
     * @static
     * @param  {Buffer} buff from which to read the date
     * @return {Date}      result
     */
    Tools.readDate = function (buff) {
        var b = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        switch (buff.byteLength) {
            case 1:
                return new Date(b.getUint8(0));
            case 2:
                return new Date(b.getUint16(0));
            case 4:
                return new Date(b.getUint32(0));
            case 8:
                return new Date(Number.parseInt(Tools.readHexString(buff), 16));
            default:
                return new Date(0);
        }
    };
    /**
     * Reads the data from a tag
     * @static
     * @param  {TagData} tagObj The tag object to be read
     * @param  {Buffer} data Data to be transformed
     * @return {Tag} result
     */
    Tools.readDataFromTag = function (tagObj, data) {
        var type = tagObj.type, name = tagObj.name;
        var track = tagObj.track;
        var discardable = tagObj.discardable || false;
        var keyframe = tagObj.keyframe || false;
        var payload = null;
        var value;
        switch (type) {
            case 'u':
                value = Tools.readUnsigned(data);
                break;
            case 'f':
                value = Tools.readFloat(data);
                break;
            case 'i':
                value = Tools.readSigned(data);
                break;
            case 's':
                value = String.fromCharCode.apply(String, data);
                break;
            case '8':
                value = Tools.readUtf8(data);
                break;
            case 'd':
                value = Tools.readDate(data);
                break;
            default:
                break;
        }
        if (name === 'SimpleBlock' || name === 'Block') {
            var p = 0;
            var _a = Tools.readVint(data, p), length_1 = _a.length, trak = _a.value;
            p += length_1;
            track = trak;
            value = Tools.readSigned(data.subarray(p, p + 2));
            p += 2;
            if (name === 'SimpleBlock') {
                keyframe = Boolean(data[length_1 + 2] & 0x80);
                discardable = Boolean(data[length_1 + 2] & 0x01);
            }
            p += 1;
            payload = data.subarray(p);
        }
        return __assign(__assign({}, tagObj), { data: data, discardable: discardable, keyframe: keyframe, payload: payload, track: track, value: value });
    };
    return Tools;
}());
exports.default = Tools;
