---
layout: post
category: Angular-Js
---

Chrome应用是内嵌在web浏览器中，目地是实现原生应用体验的应用。因为他们是依靠浏览器运行的，可以使用ML5,javascript，css3编写，还能实现真正web应用所不能实现的原生似的性能。

Chrome应用可以使用Chrome API和服务，向用户提供一个类似总和桌面的体验。

Chrome app和 web app另一个有趣的区别是，前者通常由本地载入，所以他们可以立马显示出来，而不用等待通过网络下载所有的元素。这就大大的提高了性能和用户体验。

在这篇文章中，我们将看一下如何使用Angular创建一个高级的Chrome 应用。我们将做一个chrome应用currently的翻版。

![currently](/css/images/currently.png)

我们将创建一个翻版应用，起名 "Presently":

![presently](/css/images/presently.png)

#### 理解Chrome 应用
让我们深入的看一下，Chrome应用是如何工作的，我们怎么开始创建我们自己的应用。
所有的Chrome应用都有三个核心文件：

##### manifest.json

这个`manifest.json`文件表述了应用到基本信息，例如名字，描述，版本已经我们如何启动我们的应用。

##### A background script

该文件设置了我们的应用对于系统层级时间的相应，例如用户安装启动我们的应用等。

##### A view

大部分的Chrome应用都有一个view文件。这个文件是选择性的，但是通常应用都使会使用的。

#### 架构 Presently
但是我们打算创建presently时，我们需要考虑应用的架构。这会帮助我们了解如何创建应用，什么时候开始写代码等问题。

像Currently， Presently是一个“new tab”应用。这意味着每次打开新tab页，都会自动启动该应用。

Presently有两个主要的试图：

##### 主页
这个页面显示了当前的时间和天气。除此之外还有几个象征天气的图标。

##### 设置页面
这个页面将帮助我们设计地点。

为了支持主页，我们需要显示正确样式的日期和时间，并且需要通过一个远程的API服务获取天气信息。

创建设计页面，我们将整合一个远程的API服务去自动为输入框推荐最合适的地点。

最后，我们将使用基本的本地储存（session储存）去将我们的设置存放在应用中。

#### 创建骨架
我们将创建如下文件结构：

![tree](/css/images/tree.png)

我们将我们的css文件都放在`css/`目录下，特定的字体放在`font/`目录下，js文件都放在`js/`内。主要的js内容在`js/app.js`内编写。我们的html文件`tab.html`将直接放在根目录下。

> 有很多很好用的工具可以帮助我们启动Chrome应用，例如yeoman

在我们开始设置Chrome extension时，我们需要获取一些依赖。

我们将过去最新版的angular.min.js，及其angular-route.min.js，存放在`js/vendor/`目录下。

最后，我们使用bootstrap3架构我们的样式表，所以我们需要将`bootstrap.min.css`放在`css/`目录下。

> 在生产环境下，对于多个开发者合作开发的项目，使用Bower去管理依赖会更加高效。尽管我们要生成一个newtab应用，保持应用的轻量化依然很重要。

##### manifest.json
我们每一个Chrome应用，都需要设置`manifest.json`文件。
我们的`manifest.json`需要描述我们的应用是newtab类型，并描述我们的`content_security_policy`(描述我们的应用能做什么，不能做什么的策略)和backgroud script（Chrome需要）

```json
{
	"minifest_version": 2,
	"name": "Presently",
	"description": "A currently clone",
	"version": "0.1",
	"permissions":[
		"http://api.wunderground.com/api/",
		"http://autocomplete.wunderground.com/api"
	],
	"background": {
	  "scripts": ["js/verdor/angular.min.js"]
	},
	"content_security_pocicy": "script-src 'self'; object-src 'self'",
	"chrome_url_overrides" : {
		"newtab" : "tab.html"
	}
}
```

##### tab.html
我们应用的主要html文件是`tab.html`.我们打开新tab时，这个文件将被加载。

我们将在`tab.html`文件中设置基本的angular应用。

```html
<!doctype html>
<html data-ng-app="myApp" data-ng-csp="">
	<head>
		<meta charset="UTF-8">
		<title>Presently</title>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/main.css">
	</head>
	<body>
		<div class="container">
		</div>
		<script src="./js/vendor/angular.min.js"></script>
		<script src="./js/vendor/angular-route.min.js"></script>
		<script src="./js/app.js"></script>
	</body>
</html>
```
这是同其他所有angular应用一样的基本结构，除了一个地方： `data-ng-csp=""`。
这个`ngCSp`目录将使Content Security Policy(or CSP)支持我们的angular应用。因为Chrome组织浏览器使用`eval`或者`function(string)`生成的应用，但是angular为了速度，选择了使用`function(string)`生成应用。`ngCsp`将使angular执行所有的这些表达。

这种兼容性损失一些性能，尽管执行操作慢了很多，但是避免了抛出很多安全错误。

同时CSP禁止js文件内联样式表，所以我们需要手动载入`angular-csp.css`文件。该文件可以在[http://code.angularjs.org/snapshot/angular-csp.css](http://code.angularjs.org/snapshot/angular-csp.css)找到。

最后，`ngCsp`必须放在我们angular应用的根元素

```
<html ng-app ng-csp>
```

>没有`ng-csp`,我们的Chrome应用不会执行，将会抛出一个安全错误。如果看到一个安全错误被抛出，你要确保检查一下根元素是否有该指令。

#### 在Chrome中加载该应用
下一步，我们将应用加载到Chrome，使我们可以通过浏览器监视我们的开发过程。为了在Chrome加载应用，进入`chrome：//extensions/`。

点击"Load unpackged extension..."并且找到应用的根目录。

![load_unpacked](/css/images/load_unpacked.png)

一旦加载成功，我们打开新tab，会看到一个空的应用，还有一个错误，我们之后会修复它。

![first_run](/css/images/first_run.png)

> 任何时候更新了manifest.json文件，都需要在`chrome://extensions`中点击`Reload`链接

#### 主要的模块
我们全部的angular应用都将放在`js/app.js`文件中。对于我们应用的生产环境，我们可能希望将功能分拆入多个文件中，或者使用例如`grunt`的工具为我们压缩整个他们。

我们的应用成为 `myApp`，所以我们用这个名字创建一个angular模块：

```javascript
angular.module('myApp',[])
```

#### 创建主页

我们一起来创建应用的主页部分。在这一部分，我们将应用的部件放在一起从而使整个应用运行正常。下一部分我们配置多路由应用。

##### 创建时钟

Presently应用主要特性是有一个比较大的时钟在应用的正上方，并且每一秒钟都在更新。使用angular，我们可以比较简单的配置该特性。

首先我们开始创建一个`MainCtrl`负责管理我们的主屏幕。 在`MainCtrl`控制器中，我们将设置一个计时器每一秒更新一次本地变量。

```javascript
angular.module('myApp',[])
.controller('MainCtrl', function($scope,$timeout) {
	// Build the data object
	$scope.data = {};

	// Updata function
	var updateTime = function() {
		$scope.data.raw = new Date();
		$timeout(updateTime, 1000);
	}

	// Kick off the update function
	updateTime();
});
```

每一秒钟，我们`MainCtrl`都是可见的，`updateTime()` 函数被执行更新`$scope.data.raw`,我们的页面也将随之被更新。

为了看到加载的页面，我们需要将数据绑定到文件中。我们使用一般的`{{}}`插入符号绑定数据：

```html
<div class="container">
	<div ng-controller="MainCtrl">
		{{ data.raw }}
	</div>
</div>
```