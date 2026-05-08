import { createReadStream, createWriteStream } from "fs";
import { readFile } from "fs/promises";
import { createInterface } from "readline/promises";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

const filename = "largeFile.csv";

async function brokenApp() {
    await readFile(filename, "utf8");
}

function readLargeFile(){
    const readStream = createReadStream(filename, {encoding: "utf8"})

    readStream.on("data", (chunk)=>{
        console.log(chunk);
    })
};

function transformaCsvLine(line:string){
    const parts = line.split(",");
    if (parts.length===3){
        parts[0] = parts[0].trim().toUpperCase(); //trim retira os espaços
        const alterationDate= new Date().toISOString();
        return[...parts, alterationDate].join(",")+"\n"; // os "..." pega o conteúdo do array e coloca dentro de outro array, nesse caso, o alterationDate é adicionado ao final do array

    }
    return line + "\n";
}

async function processCsvFile(inputfilepath: string, outputfilepath:string){
 try {
    const readStream = createReadStream(inputfilepath, {encoding:"utf8"})
    const writeStream = createWriteStream(outputfilepath, {encoding:"utf8"});
    const lineReader = createInterface({
        input: readStream
    })

    const transformStream = new Transform({
        objectMode: true,
        transform(chunk: string, enconding, callback){
         callback(null, transformaCsvLine(chunk));
         //console.log(transformaCsvLine(chunk));   
        }
    });

    pipeline(lineReader, transformStream, writeStream); } catch (error) {

 }
}

// brokenApp();

//readLargeFile();

processCsvFile(filename, "output.csv")