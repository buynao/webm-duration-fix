# webm-duration-fix
based on ts-ebml and support large file，optimize memory usage during repair

## Introduction
When we use webm video generated by getUserMedia, MediaRecorder and other APIs, we will find that the final webm is not able to drag the progress bar. Unless we use FFmpeg to convert webm to other format video files, or wait for the webm video to finish playing, then we can drag it.

Here is the community discussion [Issue 642012](https://bugs.chromium.org/p/chromium/issues/detail?id=642012)

## Install

```js
npm i webm-duration-fix -S
// or
yarn add webm-duration-fix 
```

## Usage

```typescript
import fixWebmDuration from 'webm-duration-fix';

const mimeType = 'video/webm\;codecs=vp9';
const blobSlice: BlobPart[] = [];

mediaRecorder = new MediaRecorder(stream, {
  mimeType
});

mediaRecorder.ondataavailable = (event: BlobEvent) => {
  blobSlice.push(event.data);
}

mediaRecorder.onstop = async () => {  
    // fix blob, support fix webm file larger than 2GB
    const fixBlob = await fixWebmDuration(new Blob([...blobSlice], { type: mimeType }));
    // to write locally, it is recommended to use fs.createWriteStream to reduce memory usage
    const fileWriteStream = fs.createWriteStream(inputPath);
    const blobReadstream = fixBlob.stream();
    const blobReader = blobReadstream.getReader();
  
    while (true) {
      let { done, value } = await blobReader.read();
      if (done) {
        console.log('write done.');
        fileWriteStream.close();
        break;
      }
      fileWriteStream.write(value);
      value = null;
    }
    blobSlice = [];
};
```

## features
- Compatible with node & browsers
- Fix oversized files with low memory usage
