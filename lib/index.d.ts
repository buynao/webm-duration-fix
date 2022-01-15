/**
 * based on ts-ebml and support large file，optimize memory usage during repair
 *
 * @param blob the blob you need to fix
 * @returns the blob that has been fixed
 *
 */
export default function fixWebmDuration(blob: Blob): Promise<Blob>;
