const RawSource = require("webpack-core/lib/RawSource")

function EntrypointAssetsPlugin(options) {
    options = options || {}
    this.filename = options.filename || "entrypoints.json"
    this.mappings = Object.assign({
        "js": /\.js$/,
        "map": /\.map$/,
        "css": /\.css$/
    }, options.mappings)
    this.removeDuplicateChunks = !!options.removeDuplicateChunks
}

EntrypointAssetsPlugin.prototype.apply = function(compiler) {
    const filename = this.filename
    const mappings = this.mappings
    const removeDuplicateChunks = this.removeDuplicateChunks
    compiler.plugin("emit", function(compilation, callback) {
        const publicPath = compilation.mainTemplate.getPublicPath({
            hash: compilation.hash
        });
        const entrypoints = {}
        Object.keys(compilation.entrypoints).forEach(name => {
            const ep = compilation.entrypoints[name]
            const chunks = removeDuplicateChunks ? ep.chunks.filter((chunk, pos, self) => self.indexOf(chunk) === pos) : ep.chunks
            const assets = chunks
                .reduce((array, c) => array.concat(c.files || []), [])
                .map(asset => publicPath + asset)
            entrypoints[name] = {}
            Object.keys(mappings).forEach(mapping => {
                const regex = mappings[mapping]
                entrypoints[name][mapping] = assets.filter(asset => regex.test(asset))
            })
        });
        compilation.assets[filename] = new RawSource(JSON.stringify(entrypoints))
        callback();
    });
};

module.exports = EntrypointAssetsPlugin