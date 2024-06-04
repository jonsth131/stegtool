import { createImage } from "./helpers";

export function readImageData(image: string) {
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

type BitPlaneMap = { [id: string]: ImageData[]; };

function processImage(imageData: ImageData) {
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

function combinePlanes(r: ImageData, g: ImageData, b: ImageData, a: ImageData): ImageData {
    const result = new ImageData(r.width, r.height);

    for (let i = 0; i < r.data.length; i += 4) {
        result.data[i + Channel.Red] = r.data[i + Channel.Red];
        result.data[i + Channel.Green] = g.data[i + Channel.Green];
        result.data[i + Channel.Blue] = b.data[i + Channel.Blue];
        result.data[i + Channel.Alpha] = a.data[i + Channel.Alpha];
    }

    return result;
}

enum Channel {
    Red = 0,
    Green = 1,
    Blue = 2,
    Alpha = 3,
}
