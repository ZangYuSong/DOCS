# webpack 入门和常用插件的使用

## 常用配置参数

```js
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: []
  },
  plugins: {},
  devtool: 'cheap-module-eval-source-map',
  devServer: {}
};
```

- `context` : **基础目录，绝对路径**，用于从配置中解析入口起点 (entry point) 和加载器 (loader)。
  **默认使用当前目录**，但是推荐在配置中传递一个值。这使得你的配置独立于 CWD(current working directory)。
- `entry` : 起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行。
- `output` : 位于对象最顶级键(key)，包括了一组选项，指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」
  - `filename` : 输出 bundle 的名称。`[name]`：入口名称；`[id]`：内部 chunk id；`[hash]`：动态生成唯一 hash 值；`[chunkhash]`：每个 chunk 内容的 hash；
  - `publicPath` : 指在 runtime(运行时) 或 loader(加载器载入时) 所创建的每个 URL 的前缀。
  - `path` : 输出文件的 **绝对路径**
- `resolve` : 配置 webpack 如何寻找模块对应的文件
  - `alias` : 配置别名把原来导入路径映射成一个新的导入路径
  - `extensions` : 在导入语句没带文件后缀时，webpack 会自动带上后缀去尝试访问文件是否存在。extensions 用于配置在尝试过程中用到的后缀列表。默认：`['.js', '.json']`
- `module.rules` : 配置对应文件的加载规则，即：使用哪种 loaders 去加载对应的文件
- `devtool` : 对打包的文件生成对应的 sourcemap
  - `eval` : 每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 //@ sourceURL.
  - `source-map` : 生成一个 SourceMap 文件.
  - `hidden-source-map` : 和 source-map 一样，但不会在 bundle 末尾追加注释.
  - `inline-source-map` : 生成一个 DataUrl 形式的 SourceMap 文件.
  - `eval-source-map` : 每个 module 会通过 eval()来执行，并且生成一个 DataUrl 形式的 SourceMap.
  - `cheap-source-map` : 生成一个没有列信息（column-mappings）的 SourceMaps 文件，不包含 loader 的 sourcemap（譬如 babel 的 sourcemap）
  - `cheap-module-source-map` : 生成一个没有列信息（column-mappings）的 SourceMaps 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的。
  - **webpack 不仅支持这 7 种，而且它们还是可以任意组合上面的 eval、inline、hidden 关键字**
  - 在 vue-cli 中，开发环境推荐：`cheap-module-eval-source-map`。生产环境推荐：`source-map`
- `plugins` : 拓展 webpack 功能
- `devServer` : 提供虚拟服务器，让我们进行开发和调试。需要安装对应插件 `webpack-dev-server`

## 常用 Loaders

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }
      ]
    },
    {
      test: /\.css$/,
      loader: 'css-loader',
      options: {
        modules: true
      }
    }
  ];
}
```

- 常用配置
- `test` : 通过正则的方式匹配对应的文件
- `use` : 数组的方式使用多个加载器
- `loader` : 加载器的名称
- `options` : 对应加载器的配置项，每个加载器都有自己的配置项
- `include` : 指定哪些文件需要加载
- `exclude` : 指定不要加载哪些文件
- `enforce` : 加载器的执行顺序，不设置为正常执行。可选值 `pre | post` 前 | 后。多个的时候默认数组从后向前

* 常用加载器
* `html-loader` : 将 HTML 文件导出编译为字符串，可供 js 识别的其中一个模块
* `css-loader` : 解析 css 文件中代码
* `style-loader` : 将 css 模块作为样式导出到 DOM 中
* `less-loader` : 加载和转义 less 文件
* `sass-loader` : 加载和转义 sass/scss 文件
* `postcss-loader` : 使用 postcss 加载和转义 css/sss 文件
* `url-loader` : 多数用于加载图片资源,超过文件大小显示则返回 data URL。内置了 `file-loader`，建议使用这个加载器用来加载一些静态文件，例如图片、字体文件等等
* `babel-loader` : 加载 ES6+ 代码后使用 Babel 转义为 ES5 后浏览器才能解析
* `typescript-loader` : 加载 Typescript 脚本文件
* `vue-loader` : 加载和转义 vue 组件
* `angualr2-template--loader` : 加载和转义 angular 组件
* `react-hot-loader` : 动态刷新和转义 react 组件中修改的部分，基于 webpack-dev-server 插件需先安装，然后在 webpack.config.js 中引用 react-hot-loader

## 常用插件

- `HtmlWebpackPlugin` : 是依据一个简单的模板，帮助生成最终的 Html5 文件，这个文件中自动引用了打包后的 JS 文件。每次编译都在文件名中插入一个不同的哈希值。[详细参考](https://www.npmjs.com/package/html-webpack-plugin)
  ```js
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true
  });
  ```
  - `filename` : 文件名
  - `template` : 对应的模板
  - `inject` : 打包文件插入的位置。`false`不插入，`true`插入尾部，`head`插入头部，`body`插入到 body 里
  - `favicon` : favicon 的路径
- `CopyWebpackPlugin` : 在 webpack 中拷贝文件和文件夹，一般用于将不需要打包的静态文件 copy 到我们最终打包的文件目录下
  ```js
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: path.resolve(__dirname, '../dist/static'),
      ignore: ['.*']
    }
  ]);
  ```
  - `from` : 源目录
  - `to` : 目标目录
  - `ignore` : 忽略拷贝指定的文件
- `webpack.HotModuleReplacementPlugin` : 开启 HMR，在应用程序运行时交换，添加或删除模块，而无需完全重新加载
- `webpack.NamedModulesPlugin` : 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
  作用：由于引入了一个新模块，使得打包过程中部分模块的模块 ID 发生了改变。而模块 ID 的改变，直接导致了包含这些模块的 chunk 内容改变，进而导致 chunkHash 的改变。因此需要找到一种和顺序无关的模块 ID 命名方式
- `webpack.HashedModuleIdsPlugin` : 该插件会根据模块的相对路径生成一个四位数的 hash 作为模块 id, 建议用于生产环境
- `webpack.NoEmitOnErrorsPlugin` : 跳过编译时出错的代码并记录，使编译后运行时的包不会发生错误。
- `webpack.DefinePlugin` : 允许你创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
- `webpack.optimize.ModuleConcatenationPlugin` : 启用作用域提升，作用是让代码文件更小、运行的更快
- `uglifyJsPlugin` : 用来对 js 文件进行压缩，从而减小 js 文件的大小，加速 load 速度。**该插件会拖慢构建的速度，所以建议在生产环境下开启**。
- `ExtractTextPlugin` : 主要是为了抽离 css 样式,防止将样式打包在 js 中引起页面样式加载错乱的现象
- `OptimizeCSSPlugin` : 压缩、混淆优化 css，解决 ExtractTextPlugin css 重复问题
- `webpack.optimize.CommonsChunkPlugin` : 用来提取第三方库和公共模块，避免首屏加载的 bundle 文件或者按需加载的 bundle 文件体积过大，从而导致加载时间过长。[详细用法请点击](https://segmentfault.com/a/1190000012828879)

## devServer 配置

- `hot` : 热模块更新作用。即修改模块后，保存会自动更新，页面不用刷新呈现最新的效果。和 webpack.HotModuleReplacementPlugin （HMR） 这个插件不是一样功能。HMR 这个插件是真正实现热模块更新的。而 devServer 里配置了 hot: true , webpack 会自动添加 HMR 插件。所以模块热更新最终还是 HMR 这个插件起的作用。
- `host` : 主机名，默认 `localhost`
- `prot` : 端口号，默认 8080
- `historyApiFallback` : 设置为 true 的时候，我们页面错误不会出现 404。当我们搭建 spa 应用时非常有用，它使用的是 HTML5 History Api，任意的跳转或 404 响应可以指向 index.html 页面。[详细参考](https://github.com/bripkens/connect-history-api-fallback)
- `compress` : true ，开启虚拟服务器时，为你的代码进行压缩。加快开发流程和优化的作用
- `contentBase` : 你要提供哪里的内容给虚拟服务器用。这里最好填 **绝对路径**
- `open` : true 时自动打开浏览器
- `overlay` : true ，在浏览器上全屏显示编译的 errors 或 warnings。默认 false
- `quiet` : true，则终端输出的只有初始启动信息。 webpack 的警告和错误是不输出到终端的
- `publicPath` : 配置了 publicPath 后， url = '主机名' + 'publicPath 配置的' +
  '原来的 url.path'。这个其实与 output.publicPath 用法大同小异。
  output.publicPath 是作用于 js, css, img 。而 devServer.publicPath 则作用于请求路径上的。
- `proxy` : 配置服务代理。[详细参考](https://webpack.js.org/configuration/dev-server/#devserver-proxy)
- `watchOptions` : 一组自定义的监听模式，用来监听文件是否被改动过。[详细参考](https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-)
