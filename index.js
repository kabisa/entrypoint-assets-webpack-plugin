const RawSource = require("webpack-core/lib/RawSource")

function EntrypointAssetsPlugin(options) {
    options = options || {}
    this.filename = options.filename || "entrypoints.json"
    this.mappings = Object.assign({
        "js": /\.js$/,
        "map": /\.map$/,
        "css": /\.css$/
    }, options.mappings)
}

EntrypointAssetsPlugin.prototype.apply = function(compiler) {
    const filename = this.filename
    const mappings = this.mappings
    compiler.plugin("emit", function(compilation, callback) {
        const publicPath = compilation.mainTemplate.getPublicPath({
            hash: compilation.hash
        });
        const entrypoints = {}
        Object.keys(compilation.entrypoints).forEach(name => {
            const ep = compilation.entrypoints[name]
            const assets = ep.chunks
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