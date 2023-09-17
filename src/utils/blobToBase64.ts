// unused for now.

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("unknown error.");
      }
    };
    reader.readAsDataURL(blob);
  });
};
export default blobToBase64;
