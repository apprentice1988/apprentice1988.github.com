---
layout: post
category: Angular-Js
---
AngularJs 重新定义了构建前端应用的方式。它填平了HTML和JS之间的沟壑。

#### AngularJS填平html和js的沟壑
不需要直接操纵DOM， 你只需要在DOM的metadata中进行标注，Angular帮助你操作。

AngularJS不依赖任何其他的框架，你甚至可以在non-AngularJS框架中建立AugularJS 应用。

虽然你从未接触过AngularJs，接下来的七个部分，会带你用AngularJS写app。

#### 最重要的事： 什么时候你需要AngularJS？
当你建立客户端单页app时， AngularJS是一个理想的*MV框架。他不是一个库，而是一个建立动态web页面的框架。 它专注于扩展HTML和提供动态数据binding，同时能和jQuery能很好的配合。

如果你在建立单页app， AngularJS是理想的选择。Gmail, Google Docs, Twitter, Facebook都注入了AngularJS 的特点。 游戏开发和其他过于操作DOM和需要流速度的应用就不适合AngularJS了。

#### 如何开始写app
通过这个教程，我们将建立一个NPR audio播放器，可以向我们展示现在的故事，在浏览器播放。 查看最后的demo, 请点击[这里](http://www.ng-newsletter.com/code/beginner_series/)

写AngularJS时，我们在展示的同事，写下动作和交互结果。
开始这么做的时候，一定会感到十分困惑，特别是你已经体验了其他的将JS和HTML分开的框架。
让我们看一下用AngularJS写的最简单的app

```html
<!doctype html>
<html ng-app>
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script>
  </head>
  <body>
    <div>
      <input type="text" ng-model="yourName" placeholder="Enter a name here">
      <h1>Hello, {{ yourName }}!</h1>
    </div>
  </body>
</html>
```
你可以在新的html文件中试试。
正如你所见，你得到了双向的数据关联
双向数据关联意味着你后端的数据改变了，就会把改变在你的view页面自动显现出来。
同样的，如果你改变了view的数据，你也自动的更新你的modal。
那么，这个应用中，我们做了什么呢？
	- ng-app
	- ng-modal="yourName"
	- {{yourName}}

首先，我们在`html`tag中用了`ng-app`， 没有这个tag，  AngularJS 将不会开始。
第二点， 我们告诉 AngularJS我们要建立双向数据关联的`yourName` model
最后， 我们告诉 AngularJS去展示`yourName`的数据

#### 建立你的应用
在这部分，我们讨论我们称作的`myApp`的应用。 你可以`git clone`我们的项目，也可以跟着介绍一步步做。 创建index.html文件，填入如下内容：

```html
<!doctype html>
<html ng-app="myApp">
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js"></script> 
		<script src="js/main.js"></script>
	</head>
	<body>
	</body>
</html>
```

然后创建叫做js的目录，在目录中创建main.js文件

```
mkdir js
touch js/main.js
```

我们在HTML页面中加载了 AngularJS 和我们将要写的main.js。 我们接下来要做的多部分都在main.js中完成。

#### angular.module
定义一个 AngularJS 应用， 我们首先需要定义	`angular.module`。一个Angular module是方法函数的一个简单的集合。当app “booted”时需要运行这个module。
下面，我们需要在`main.js`中定义这个module

```javascript
var app = angular.module("myApp",[]);
```

这一行创建了叫做“myApp”的module
现在，我们要实例化我们的“myApp”的module，告诉Angular，我们app赖以存在的DOM树。 在一个页面中实例化module，我们将用到`ng-app`目录，他会告诉 Angular我们希望让module own DOM树的某一部分。

我们可以通过简单的把我们的app名字做了index.html的参数去实例化我们自己的app（module）。

```html
<html ng-app="myApp"></html>
```

当我们刷新页面时，  Angular将引导`myApp`

我们可以在DOM任何元素上设置`ng-app`, 这些元素是 Angular启动的地方。

```html
<h2>I am not inside an AngularJS app</h2>
<div ng-app="embeddedApp">
	<h3>Inside an AngularJs app</h3>
</div>
```

对于整个页面都需要 AngularJS的app，我们可以把`ng-app`放在html元素上。

一点我们定义了我们的应用，我们可以开始应用的其他部分了。我们将使用`$scope`，它是 AngularJS最重要的概念之一。 我们将在第2到第7部分深入解释它。

到目前为止，我们搭起了 Angular app基本的结构。
[项目github](https://github.com/auser/ng-newsletter-beginner-series)
。
为了本地化我们的repo，保证你安装了git， clone我们的项目，切换到`part`分支

```
git clone https://github.com/auser/ng-newsletter-beginner-series.git
git checkout -b part1
```