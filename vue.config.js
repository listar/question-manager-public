

const path = require('path')
const webpack = require('webpack')

const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );

function resolve (dir) {
    return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
    /*
      Vue-cli3:
      Crashed when using Webpack `import()` #2463
      https://github.com/vuejs/vue-cli/issues/2463

     */
    // pages: {
    //     index: {
    //         entry: 'src/main.js',
    //         chunks: ['chunk-vendors', 'chunk-common', 'index']
    //     }
    // },
    // configureWebpack: {
    //   plugins: [
    //     // Ignore all locale files of moment.js
    //     new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    //   ]
    // },

    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'));
            // .set('@views', resolve('src/views'))
            // .set('@layout', resolve('src/layout'))
            // .set('@static', resolve('src/static'))


        // const svgRule = config.module.rule('svg');
        // // 清除已有的所有 loader。
        // // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
        // svgRule.uses.clear();
        // 添加要替换的 loader
        // config.module
        //     .rule('svg')
        //     .test(/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/)
        //     .use('file-loader')
        //     .loader('raw-loader');
    },

    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */

                    /*
                    'primary-color': '#F5222D',
                    'link-color': '#F5222D',
                    'border-radius-base': '4px',
                    */
                },
                javascriptEnabled: true,
            },
            // Various modules in the CKEditor source code import .css files.
            // These files must be transpiled using PostCSS in order to load properly.
            postcss: styles.getPostCssConfig( {
                themeImporter: {
                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                },
                minify: true
            } )
        }
    },

    //
    transpileDependencies: [
        /ckeditor5-[^/\\]+[/\\]src[/\\].+\.js$/,
    ],

    configureWebpack: {
        plugins: [
            // CKEditor needs its own plugin to be built using webpack.
            new CKEditorWebpackPlugin( {
                // See https://ckeditor.com/docs/ckeditor5/latest/features/ui-language.html
                language: 'en'
            } )
        ]
    },

    lintOnSave: false
}