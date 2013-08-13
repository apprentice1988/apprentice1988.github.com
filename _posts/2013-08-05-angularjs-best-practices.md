---
layout: post
category: Angular-Js
---
Hevery, 创建AngularJS的人，去年十二月份给了一个非常有意思的关于AngularJS best practice的presention。 可以通过[YouTube](http://www.youtube.com/watch?v=ZhfUv0spHCY)或者在[Google Docs](http://goo.gl/CD0Is)查看幻灯片。

## 目录结构
Angular建议你用一定的目录结构，既可以用[Augular-seed project](https://github.com/angular/angular-seed),也可以使用新的Yeoman工具。（建议使用Yeoman）。

约定优于配置-如果你使用rails，那么你将经常听到-尽管到目前我可以说这不是特别适用于Angular。例如，你依然需要手动的把你的controllers加入到一个index文件中。如果是“约定优于配置”的环境，那么我可以希望一个controller可以自动加载。

在任何情况下，坚持简单的约定都是好的，可以使开发者简单的去查看codebase，知道文件在什么环境下。默认的约定有：
-任何需要部署的文件应该在app目录中
-app外的所有文件都是为app开发的

## 依赖注入
依赖注入（DI）是内建在Angular里的，所以DI不管是很好的练习，也是必不可少的。当我们投入于单元测试的时候，DI将变的尤其重要-你可以使用DI去代替实际的依赖，模仿依赖去隔离行为。

我也不是100%确定，为什么我们需要DI。记住，DI不是可测试性的一个条件-例如，rails不含有DI，但是去能很好的被测试。在一个动态语言中使用DI是件古怪的事情，但是在任何情况-你都应该毫无疑问地在angular中使用DI。

## Hiding Flashes of Unstyled Content
当你的页面第一次加载时，在AngularJS被加载之前，你会看到Angular 的代码-大概是这个样子

{{Interpolation}}

为了解决这个问题，可以有几个方法。一个是使用”ng-cloak"-简单的创建一个style
```html
[ng-cloak] {display:none;}
```
我们通常将它加在body tag中，意味着只有Angular被加载，页面才会显现出来。这也意味着页面渲染之前存在一点延迟。
另一个可用的方法是’ng-bind', 用
```html
<p>Hello, <span ng-bind="user.name"/></p>
```
取代
```html
<p>Hello, {{user.name}}</p>
```
关于这个方法，比较简洁的方法是我们可以设置一个默认值在浏览器加载Angular之前去显现。
```html
<p>Hello, <span ng-bind="user.name">???<span /></p>
```
记住这只在你在建一个单页app(SPA)时候，第一个页面（代表性的为index.html)，这些才是必须的。

## 分离事务逻辑和展示逻辑
MVC思想之一是事务逻辑和展示逻辑的分离。Angular用控制器和服务的概念去实现它。

控制器应该包含view逻辑，而不应该真的引用DOM（引用DOM应该通过目录去完成）。控制器应该回答类似这样的问题：
-当用户点击这个按键时会发生什么
-从哪里得到展示的数据

另一方面，服务不应该包含view逻辑-服务应该包含独立于view的逻辑

比如，如果我们建一个管理email的app，我们应该可以删除一个email。 你甚至可能要在多个地方可以删除一个email-例如，在看一个单独的email，或者在email列表中。 所以，两个分离的控制器可以控制用户点击‘删除邮件’按键，但是这个删除邮件的逻辑应该实在存在于一个服务中。同样的，如果我们需要展示一列邮件或者一个单独的邮件，这是控制器的责任去想服务要数据。

Angular允许控制器通过scope 去和view去交互。这些可以很干净的分离，当然，也很容易把scope 弄的很混乱。考虑scope，有两个通用的方针：
-scope在views是只读的
-在controller中，scope是只写的

这些方针和在rails中和view交互的方式很相像-通过写到本地文件，可以把变量传到view中-然后rails神奇的链接进view-但是你很少在控制器的本地文件中去读这些变量。 在view中，你只能读到控制器定义的内容-处理使用事件，没有办法再返回控制器。

## More
这里，我只涉及了很少的一部分，我上面提到的展示涉及了部署，简化等。但是那些话题不只存在于Angular中，所以我没有涉及。一定要去看那个展示-绝对值得花时间去研究。
Happy coding.