import {generateHtml} from "./htmlGenerator";
import * as fs from "fs";
import path from "path";
import {exampleMeta} from "./meta";

(async function () {
    const distDir = "dist"
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir);
    }
    const html = await generateHtml()
    fs.writeFileSync(path.join(distDir, "index.html"), html, 'utf8')
    fs.writeFileSync(path.join(distDir, "meta"), JSON.stringify(exampleMeta), 'utf8')
})()
