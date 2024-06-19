type BitPlaneMap = { [id: string]: ImageData[]; };

enum Channel {
    Red = 0,
    Green = 1,
    Blue = 2,
    Alpha = 3,
}

(function() {
    const inputelement = document.getElementById("file-input") as HTMLInputElement;
    if (!inputelement) {
        console.error("File input element not found");
        return;
    }

    inputelement.addEventListener("change", (e) => {
        e.preventDefault();
        const preview = document.getElementById("preview") as HTMLImageElement;
        if (!preview) {
            console.error("Preview element not found");
            return;
        }
        clearContainer("images");
        processFile(inputelement, preview);
    });
})();

function processFile(input: HTMLInputElement, preview: HTMLImageElement) {
    if (!input.files || !input.files[0]) {
        return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            preview.src = reader.result as string;
            readImageData(reader.result as string);
        },
        false,
    );

    if (file) {
        reader.readAsDataURL(file);
    }
}

function readImageData(image: string) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    const img = new Image();
    img.src = image;

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, img.width, img.height);
        canvas.remove();
        processImage(imageData);
    };
}


function processImage(imageData: ImageData) {
    const combinePlanes = (r: ImageData, g: ImageData, b: ImageData, a: ImageData): ImageData => {
        const result = new ImageData(r.width, r.height);

        for (let i = 0; i < r.data.length; i += 4) {
            result.data[i + Channel.Red] = r.data[i + Channel.Red];
            result.data[i + Channel.Green] = g.data[i + Channel.Green];
            result.data[i + Channel.Blue] = b.data[i + Channel.Blue];
            result.data[i + Channel.Alpha] = a.data[i + Channel.Alpha];
        }

        return result;
    }
    const data: BitPlaneMap = {};

    for (let i = 0; i < 4; i++) {
        const channelValue = i as Channel;
        const bitPlanes = processChannel(imageData, channelValue);
        for (const bitPlane of bitPlanes) {
            createImage(bitPlane);
        }
        data[i.toString()] = bitPlanes;
    }

    for (let i = 0; i < 8; i++) {
        const r = data[Channel.Red.toString()][i];
        const g = data[Channel.Green.toString()][i];
        const b = data[Channel.Blue.toString()][i];
        const a = data[Channel.Alpha.toString()][i];
        const combined = combinePlanes(r, g, b, a);
        createImage(combined);
    }
}

function processChannel(imageData: ImageData, channel: Channel): ImageData[] {
    const data = imageData.data;
    const result: ImageData[] = [];

    for (let i = 0; i < 8; i++) {
        const bitPlane = new ImageData(imageData.width, imageData.height);

        for (let j = 0; j < data.length; j += 4) {
            const newValue = extractBit(data[j + channel], i);
            bitPlane.data[j + channel] = newValue * 255;
            if (channel !== Channel.Alpha) {
                bitPlane.data[j + Channel.Alpha] = 255;
            }
        }

        result.push(bitPlane);
    }

    return result;
}

function extractBit(value: number, bit: number): number {
    return (value >> bit) & 1;
}

function createImage(image: ImageData) {
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

function clearContainer(target: string) {
    const container = document.getElementById(target);
    if (!container) {
        console.error("Container not found");
        return;
    }
    container.innerHTML = "";
    container.hidden = true;
}
