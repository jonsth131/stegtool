import { readImageData } from "./stegimage";

export function processFile(input: HTMLInputElement, preview: HTMLImageElement) {
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
