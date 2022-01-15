/// <reference types="node" />
export default class Tools {
    /**
     * read variable length integer per
     * https://www.matroska.org/technical/specs/index.html#EBML_ex
     * @static
     * @param {Buffer} buffer containing input
     * @param {Number} [start=0] position in buffer
     * @returns {{length: Number, value: number}}  value / length object
     */
    static readVint(buffer: any, start?: number): {
        length: number;
        value: number;
    } | null;
    /**
     * write variable length integer
     * @static
     * @param {Number} value to store into buffer
     * @returns {Buffer} containing the value
     */
    static writeVint(value: any): Buffer;
    /**
     * *
     * concatenate two arrays of bytes
     * @static
     * @param {Buffer} a1  First array
     * @param {Buffer} a2  Second array
     * @returns  {Buffer} concatenated arrays
     */
    static concatenate(a1: any, a2: any): any;
    /**
     * get a hex text string from Buff[start,end)
     * @param {Buffer} buff from which to read the string
     * @param {Number} [start=0] starting point (default 0)
     * @param {Number} [end=buff.byteLength] ending point (default the whole buffer)
     * @returns {string} the hex string
     */
    static readHexString(buff: any, start?: number, end?: any): string;
    /**
     * tries to read out a UTF-8 encoded string
     * @param  {Buffer} buff the buffer to attempt to read from
     * @return {string|null}      the decoded text, or null if unable to
     */
    static readUtf8(buff: any): string | null;
    /**
     * get an unsigned number from a buffer
     * @param {Buffer} buff from which to read variable-length unsigned number
     * @returns {number|string} result (in hex for lengths > 6)
     */
    static readUnsigned(buff: any): any;
    /**
     * get an signed number from a buffer
     * @static
     * @param {Buffer} buff from which to read variable-length signed number
     * @returns {number} result
     */
    static readSigned(buff: any): number;
    /**
     * get an floating-point number from a buffer
     * @static
     * @param {Buffer} buff from which to read variable-length floating-point number
     * @returns {number} result
     */
    static readFloat(buff: any): number;
    /**
     * get a date from a buffer
     * @static
     * @param  {Buffer} buff from which to read the date
     * @return {Date}      result
     */
    static readDate(buff: any): Date;
    /**
     * Reads the data from a tag
     * @static
     * @param  {TagData} tagObj The tag object to be read
     * @param  {Buffer} data Data to be transformed
     * @return {Tag} result
     */
    static readDataFromTag(tagObj: any, data: any): any;
}
