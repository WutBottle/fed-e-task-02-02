# fed-e-task-02-02
##1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。
* 首先解析shell与config中的配置项，用于激活webpack的加载项和插件  
* webpack的初始化，构建compiler对象
* 执行run():编译入口方法，compiler具体划分为两个对象：一个是存放输入输出相关配置信息和
编译器Parser对象；第二个是Watching，监听文件变化的一些处理方法
* run触发compile，接下来就是开始构建options中模块，构建compilation对象：该对象负责组织整个编译过程，包含每个构建环节所对应的方法
，对象内部保留了对compile对象的引用，并且存放所有的modules，chunks，生成的assets以及最后用来生成最后js的template
* compile中触发make事件并调用addEntry，找到入口js文件，进行下一步的模块绑定
* 解析入口js文件，通过对应的工厂方法创建模块，保存到compilation对象上，对module进行build
* module已经build完毕，此时开始处理依赖的module，异步的对依赖的module进行build，如果依赖中仍有依赖，则循环处理其依赖
* 调用seal方法封装，逐次对每个module和chunk进行整理，生成编译后的源码，合并，拆分。每一个chunk对应一个入口文件。开始处理最后生成的js
* 所有的module，chunk仍然保存的是通过一个个require()聚合起来的代码，需要通过Template产生最后带有_webpack_require()的格式，这里有两个template，一个是
处理入口文件的module(MainTemplate),一个是处理非首屏，需异步加载的module(ChunkTemplate)
* 在ModuleTemplate.render()方法里会有不同的dependencyTemplate，如CommonJs，AMD...
生成好的js保存在compilation.assets中
* 最后通过emitAssets将最终的js输出到output的path中
##2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。
* Loader是文件加载器,运行在NodeJS中，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中,将A文件进行编译形成B文件，这里操作的是文件，比如将A.scss或A.less转变为B.css，单纯的文件转换过程；
* Plugin则是在webpack运行的生命周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。  
###Loader开发思路：
1. 确定单一任务，loaders可以被链式调用，为每一步创建一个loader而非一个loader做所有事情
2. 创建module话的模块，即正常的模块，loader产出的module应该和遵循和普通的module一样的设计原则
3. 尽量表明该loader是否可以缓存，大部分loaders是Cacheable，所以应该标明是否Cacheable。只需要在loader里面调用即可
4. 不要在运行和模块之间保存状态
5. 标明依赖，如果该loader引用了其他资源（例如文件系统）， 必须声明它们。这些信息用来是缓存的loader失效并且重新编译它们
6. 解析依赖，很多语言都提供了一些规范来声明依赖，例如css中的 @import 和 url(...)。这些依赖应该被模块系统所解析
7. 抽离公共代码
8. 避免写入绝对路径
9. 使用peerDependencies来指明依赖的库
10. 可编程对象作为查询项，有些情况下，loader需要某些可编程的对象但是不能作为序列化的query
参数被方法解析。例如less-loader通过具体的less-plugin提供了这种可能。这种情况下，
loader应该允许扩展webpack的options对象去获得具体的option。为了避免名字冲突，基于loader的命名空间来命名是很必要的。
###Plugin开发思路：
plugin由以下组成:
* 一个 JavaScript 命名函数
* 在插件函数的 prototype 上定义一个 apply 方法
* 指定一个绑定到 webpack 自身的事件钩子
* 处理 webpack 内部实例的特定数据
* 功能完成后调用 webpack 提供的回调

Compiler 和 Compilation:
* compiler对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，
包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。
* compilation对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，
从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象
也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

src/plugin.js
```js
function HelloWorldPlugin(options) {
  // 使用 options 设置插件实例……
}

HelloWorldPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function(compilation/* 处理 webpack 内部实例的特定数据。*/, callback) {
    console.log('Hello World!');
    // 功能完成后调用 webpack 提供的回调。
    callback();
  });
};

module.exports = HelloWorldPlugin;
```
webpack.config.js
```js
var HelloWorldPlugin = require('hello-world');

var webpackConfig = {
  // ... 这里是其他配置 ...
  plugins: [
    new HelloWorldPlugin({options: true})
  ]
};
```
##老师关于代码中eslint的配置，我这边总是出现奇怪的问题，还是没解决，一直出现createRequire is not a function问题，所以eslint这边我就等着老师们的答案了。
