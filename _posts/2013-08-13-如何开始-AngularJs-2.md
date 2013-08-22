---
layout: post
category: Angular-Js
---
#### 第二部分：Scopes
一个`$scope`是一个链接view到控制器的物件。 在MVC框架中，这`$scope`就扮演了Model。提供了一个运行在DOM元素中的执行文件。

尽管听起来有些复杂， 但是`$scope`只是一个javascript物件。因为控制器和页面都能获取`$scope`，所以它可以被用来作为纽带。`$scope`可以为我们提供数据和方法供我们在页面中使用，就像下面将看到的那样。

所有AngularJS 应用都有一个`$rootScope`。 这个`$rootScope`是一个最高级别的scope，包含`ng-app`目录。

在这个例子中， 我们运用了`$rootScope`。我们在`main.js`文件中为scope添加了一个`name`属性。通过把这个方法放入`app.run`方法中，我们可以保证它将先于应用的其他部分执行。 你可以把`run`方法想成angular应用的main方法。

```javascript
app.run(function($rootScope) {
	$rootScope.name = "Ari Lerner";
})
```
现在，我们可以在我们页面的任何地方，使用模板去引用这个属性：{{}}， 如下：

```
{{name}}
```
###