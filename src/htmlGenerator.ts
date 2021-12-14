import axios from 'axios'
import {minify} from "terser";

const htmlTemplate = (scripts: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<title></title>
<meta name='importmap-type' content='systemjs-importmap' />
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<script type="overridable-importmap" id="overridable-importmap">
{}
</script>
<script type="application/json" defer id="bundle">
${scripts}
</script>
<script>
(async function(){
    const meta = await fetch("/meta").then(r=>r.json())
    const overridableImportmapElement = document.getElementById("overridable-importmap")
    const imports = {...meta.assets}
    await Promise.all(
        Object
        .keys(meta.external)
        .map(key=>fetch(meta.external[key])
        .then(r=>r.json())
        .then(json=>{
            Object.keys(json).forEach(assetKey=>{
                imports[key+'/'+assetKey]=json[assetKey]
            })
        })))
    document.title = meta.title
    overridableImportmapElement.innerHTML = JSON.stringify({imports})
    const bundle = document.getElementById("bundle")
    const newBundle = document.createElement("script")
    const importCode = Object.keys(meta.assets).map(key=>'System.import("'+key+'")').join(';\\n')
    newBundle.innerHTML = bundle.innerHTML + importCode
    bundle.replaceWith(newBundle)
})()

</script>
</head>
<body>
</body>
<import-map-overrides-full
  show-when-local-storage="devtools"
  id=""
></import-map-overrides-full>
</html>`

const loadScript = async (url: string): Promise<string> =>
    (await axios.get(url)).data

const getDependencyScripts = async () => {
    const scriptUrls = [
        'https://cdn.jsdelivr.net/npm/import-map-overrides/dist/import-map-overrides.js',
        'https://unpkg.com/systemjs@6.11.0/dist/system.js',
        'https://unpkg.com/systemjs@6.11.0/dist/extras/amd.js',
        'https://unpkg.com/systemjs@6.11.0/dist/extras/named-exports.js',
        'https://unpkg.com/systemjs@6.11.0/dist/extras/use-default.js',
    ]
    const scripts = (await Promise.all(scriptUrls.map(loadScript))).join("\n")
    const {code} = await minify({code: scripts})
    return code!
}

export const generateHtml = async () => {
    const depScripts = await getDependencyScripts()
    return htmlTemplate(depScripts)
}
