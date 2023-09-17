const dataURLToBlob = (dataurl: string) => {
  let arr = dataurl.split(",");
  if (arr !== null) {
    let mimeObj = arr[0].match(/:(.*?);/);
    if (mimeObj !== null) {
      let mime = mimeObj[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } else {
      throw Error("unexpected error.");
    }
  } else {
    throw Error("unexpected error.");
  }
};
export default dataURLToBlob;
