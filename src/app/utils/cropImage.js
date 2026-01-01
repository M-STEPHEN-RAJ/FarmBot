export default function getCroppedImg(imageSrc, cropPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");

      const AVATAR_SIZE = 512;
      canvas.width = AVATAR_SIZE;
      canvas.height = AVATAR_SIZE;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        AVATAR_SIZE,
        AVATAR_SIZE
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Canvas is empty");
          resolve(blob);
        },
        "image/jpeg",
        0.75
      );
    };

    image.onerror = reject;
  });
}
