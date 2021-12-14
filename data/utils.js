const resizeImageData = require('resize-image-data')

function clamp(min, val, max) {
  return Math.max(min, Math.min(val, max))
}

function invlerp(start, end, amt) {
  amt = clamp(start, amt, end)
  let range = 0
  range = (end - start)
  if (range === 0) {
    return start
  }
  return (amt - start) / range
}

function normalizeImage(inputData, dataHeight, dataWidth, outputHeight = dataHeight, outputWidth = dataWidth) {
  let data = [...inputData]

  let height = dataHeight;
  let width = dataWidth;

  function crop(data) {
    // crop top
    let y;
    for (y = 0; y < height; y++) {
      const start = y * width;
      if (!/^0+$/.test(data.slice(start, start + width).join(""))) {
        break;
      }
    }
    height -= y;
    data = data.slice(width * y);
    data.push(...Array(y * width).fill(0))

    // crop left
    let newWidth = width;

    let left = width;
    for (y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[y * width + x] > 0) {
          left = Math.min(left, x);
          break;
        }
      }
    }
    newWidth -= left;

    let newData = [];
    for (y = 0; y < height; y++) {
      let start = y * width + left;
      newData.push(...data.slice(start, start + newWidth));
    }
    data = newData;
    width = newWidth;

    // crop right
    let right = 0
    for (y = 0; y < height; y++) {
      for (let x = width - 1; x >= 0; x--) {
        if (data[y * width + x] > 0) {
          right = Math.max(right, x);
          break;
        }
      }
    }
    // console.log(width, right)
    newWidth = right + 1;

    newData = [];
    for (y = 0; y < height; y++) {
      let start = y * width;
      newData.push(...data.slice(start, start + newWidth));
    }
    data = newData;
    width = newWidth;

    // crop bottom
    for (y = height - 1; y >= 0; y--) {
      const start = y * width;
      if (!/^0+$/.test(data.slice(start, start + width).join(""))) {
        y++
        break;
      }
    }
    data = data.slice(0, width * y);
    height = y;

    return data;
  }

  data = crop(data);

  function RGBtoArr(l)
  {
    l = Math.round((l) * 255)
    return [l,l,l, 1];
  }
  function flattenArray(arr)
  {
    return [].concat.apply([], arr);
  }
  var buf = Buffer.from(flattenArray(data.map(RGBtoArr)))

  const imgData = {
    data: buf,
    height,
    width
  }
  
  const img = resizeImageData(imgData, outputHeight, outputWidth)
  const imgSize = outputHeight * outputWidth * 4
  
  const newImg = []
  for (let i = 0; i < imgSize; i += 4) {
    newImg.push(invlerp(0.3,0.7,img.data[i]/255))
  }

  return newImg
}

exports.normalizeImage = normalizeImage