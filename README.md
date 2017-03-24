# entrypoint-assets-webpack-plugin

Exports a JSON file that maps entry names to public paths of chunks for an entry grouped by chunk file extensions.
```json
{
    "site": {
        "js": [
            "/public/common.js",
            "/public/site.js"
        ],
        "css": [
            "/public/common.css",
            "/public/site.css"
        ]
    },
    "admin": {
        "js": [
            "/public/common.js",
            "/public/admin.js"
        ],
        "css": [
            "/public/common.css",
            "/public/admin.css"
        ]
    }
}
```

This mapping can then be used to generate import assets in HTML by entry name not the asset names.


## Usage

Install via npm:

```shell
npm install entrypoint-assets-webpack-plugin
```

And then require and provide to webpack:

```javascript
const EntrypointAssetsPlugin = require('entrypoint-assets-webpack-plugin');

module.exports = {
    entry: {
        "site": "./site",
        "admin": "./admin"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            chunks: ["site", "admin"]
        }),
        new EntrypointAssetsPlugin()
    ]
};
```

### Options

#### `filename`
**Default**:`"entrypoints.json"`

Exported entrypoints filename.

#### `mappings`
**Default**:
```js
{
    "js": /\.js$/,
    "map": /\.map$/,
    "css": /\.css$/
}
```
Groups assets by regexp.