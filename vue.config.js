'use strict';
const path = require('path');
const apiMocker = require('mocker-api');
var px2rem = require('postcss-px2rem');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = process.env.VUE_APP_TITLE || ''; // 网页标题
const postcss = px2rem({ remUnit: 16 });

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    port: 8081,
    open: true,
    before(app) {
      apiMocker(app, path.resolve('./src/mocker/index.js'), {
        priority: 'mocker',
        proxy: {
          '/repos/(.*)': 'https://api.github.com/'
        },
        changeHost: true
      });
    },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_BASE,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: []
  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test
    // svg-icon
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk('single'),
      {
        from: path.resolve(__dirname, './public/robots.txt'), // 防爬虫文件
        to: './' // 到根目录下
      };
    });
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [postcss]
      }
    }
  }
};
