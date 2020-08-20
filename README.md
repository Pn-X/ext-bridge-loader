# ext-bridge-loader
A webpack loader work with ExtJSBridge

## Installation

1. Run command

```
#Project# > npm install --save-dev ext-bridge-loader
```



2. Add ext-bridge-loader  to your webpack.config.js file

``` javascript
module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader:'ext-bridge-loader',
                    options:{
                        names:['ext','wx','dd']//default ['ext']
                    },
                }]
            }
        ]
}
```

