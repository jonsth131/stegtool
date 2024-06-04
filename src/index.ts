import { processFile } from "./preview";
import { clearContainer } from "./helpers";

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

