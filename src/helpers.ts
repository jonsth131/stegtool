export function createImage(image: ImageData) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = image.width;
    canvas.height = image.height;
    context.putImageData(image, 0, 0);
    const container = document.getElementById("images");
    if (!container) {
        console.error("Container not found");
        return;
    }
    container.appendChild(canvas);
    container.hidden = false;
}

export function clearContainer(target: string) {
    const container = document.getElementById(target);
    if (!container) {
        console.error("Container not found");
        return;
    }
    container.innerHTML = "";
    container.hidden = true;
}
