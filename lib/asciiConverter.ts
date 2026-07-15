const ASCII_CHARS = "@%#•?+;-. ";

export function imageDataToAscii(imageData: ImageData, invert = false): string {
    const { data, width: imgWidth, height: imgHeight } = imageData;
    let ascii = "";

    for (let y = 0; y < imgHeight; y++) {
        for (let x = 0; x < imgWidth; x++) {
            const offset = (y * imgWidth + x) * 4; // 4 = R,G,B,A per pixel
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];

            // luminance formula
            const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            let charIndex = Math.floor(
                (brightness / 255) * (ASCII_CHARS.length - 1)
            );
            if (invert) charIndex = ASCII_CHARS.length - 1 - charIndex;
            ascii += ASCII_CHARS[charIndex];
        }
        ascii += "\n";
    }

    return ascii;
}

export function getResizedImageData(
    img: HTMLImageElement,
    targetWidth: number
): ImageData {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const aspectRatio = img.height / img.width;
    // 0.55 compensates for characters being taller than they are wide
    const targetHeight = Math.floor(targetWidth * aspectRatio * 0.55);

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return ctx.getImageData(0, 0, targetWidth, targetHeight);
}