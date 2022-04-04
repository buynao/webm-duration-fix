"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ebml_1 = require("./ebml");
/**
 * based on ts-ebml and support large file，optimize memory usage during repair
 *
 * @param blob the blob you need to fix
 * @returns the blob that has been fixed
 *
 */
function fixWebmDuration(blob) {
    return __awaiter(this, void 0, void 0, function () {
        var decoder, reader, readstream, readerBlob, _a, done, value, elms, refinedMetadataBuf, refinedMetadataBlob, firstPartBlobWithoutMetadata, finalBlob;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!blob) {
                        throw Error('call to fixWebmDuration requires a blob');
                    }
                    decoder = new ebml_1.Decoder();
                    reader = new ebml_1.Reader();
                    readstream = blob.stream();
                    readerBlob = readstream.getReader();
                    _b.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, readerBlob.read()];
                case 2:
                    _a = _b.sent(), done = _a.done, value = _a.value;
                    if (done) {
                        reader.stop();
                        return [3 /*break*/, 3];
                    }
                    elms = decoder.decode(value);
                    // As browser upgrade webm meta attributes are gradually added,  
                    // so filter unknown type to bypass this issue.
                    elms = elms === null || elms === void 0 ? void 0 : elms.filter(function (elm) { return elm.type !== 'unknown'; });
                    elms.forEach(function (elm) {
                        reader.read(elm);
                    });
                    value = null;
                    return [3 /*break*/, 1];
                case 3:
                    refinedMetadataBuf = ebml_1.tools.makeMetadataSeekable(reader.metadatas, reader.duration, reader.cues);
                    refinedMetadataBlob = new Blob([refinedMetadataBuf], { type: blob.type });
                    firstPartBlobWithoutMetadata = blob.slice(reader.metadataSize);
                    finalBlob = new Blob([refinedMetadataBlob, firstPartBlobWithoutMetadata], { type: blob.type });
                    return [2 /*return*/, finalBlob];
            }
        });
    });
}
exports.default = fixWebmDuration;
