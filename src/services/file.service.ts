import { readFile } from "fs/promises";

const filename = "largeFile.csv";

async function brokenApp() {
    await readFile(filename, "utf8");
}

brokenApp();