export const exampleMeta = {
    title: "systemjs-root-page",
    assets: {
        "@example": "/test/example.js"
    },
    external: {
        "@other": "/test/microAssets.json"
    }
}
export type Meta = typeof exampleMeta