---
layout: post
category: web
summary: 我学用jekyll建个人博客的笔记
list: 1
---

[Jekyll](http://jekyllrb.com/)是一个用来生成静态HTML网页的文本转换引擎。相比与纯静态页面，它提供了：

1. 模板。
2. partial
3. 多种语言编写，然后转换成HTML
4. 访问site, post, tag, category等对象和变量
5. 使用[liquid](https://github.com/shopify/liquid/)作为处理引擎。提供基本的编程能力
   - 使用Filter操作字符串，数字和日期
   - 使用if/else, for等控制流程

## 目录结构


    ├── _config.yml
    ├── css/
    ├── index.html
    ├── _layouts/
    ├── _posts/
    ├── _includes/
    ├── README.md
    └── _site/


> 任何不以下划线开头的文件和目录都会被复制到生成的网站，默认为`_site`目录。


### 惯例和配置

`jekyll`是Rails里的一个Gem，也遵循着Rails的一个重要特征：__惯例由于配置__。`jekyll`有一些默认设置，例如：

- 模板文件放在`_layouts`目录下
- partial放在`_includes`目录下
- 博客文件放在`_posts`目录下
- jekyll最终生成的静态HTML文件会存放与`_site`目录下, 这个目录将会是用户直接访问的目录。
- post文件名采取`YYYY-MM-DD-title.ext`的形式，时间部分即是日志的发表时间，title是日志的标题。文件后缀用来判断是使用的标记语言，例如`md`就是markdown啦。

这些配置都可以在`_config.yml`或者通过命令行方式修改，详见 [jekyll 文档](http://jekyllrb.com/docs/configuration/)

### 文本流

pages & posts -> 处理嵌入的liquid代码 -> 将标记语言转换成HTML -> 嵌入layout和partial -> 存储到`_site/`目录 + 拷贝不以下划线开头的文件的`_site/`目录


> [github pages](http://pages.github.com/)是使用`jekyll`作为后台
> 引擎的个人博客或项目主页托管网站。它会自动进行这些步骤。所
> 以我们`_site`里文件就不用也同步到github上去了，他会自动生成的。


## 变量

前往[jekyll文档](http://jekyllrb.com/docs/variables/)查看可使用的变量

### site变量

**site.categories 和 site.tags**

`site.categories`是由category组成的数组。每个category也是一个数组，第一个元素是category名称，最后一个元素是所有属于这个category的post组成数组。

    {% raw %}
    {% for category in site.categories %}
    {{category[0]}} ({{category[1] | size}})
    或者
    {{category | first }}  ({{category | last | size }})
    {% endfor %}
    {% endraw %}

`site.tags`具有相同的结构。使用这两个数组，可以制作分类导航或标签云。

**site.posts**

由全部日志组成的数组。每个日志对象是一个page变量，可以使用page的方法

**site.categories.CATEGORY** 和 **site.categories.TAG**
分别表示一个类别或tag下的所有日志。注意可以使用这种形式:

    {% raw %}
    #获得当前日志第一个category下的所有日志
    site.categories.{{page.category | first }} 
    {% endraw %}

### page变量

- title, content, excerpt
- url, path
- categories, tags
- 通过YAML创建的变量

**next和previous方法**

获取下一篇或上一篇日志对象


## 使用liquid编程

[这里](http://wiki.shopify.com/Liquid)和[这里](https://github.com/shopify/liquid/wiki/liquid-for-designers)是两处内容很全的文档，是我经常要回头参考查询的地方。下面只列出我生疏但比较有用的内容。

### 两类标记
#### 输出标记（output markup）
输出标记会输出文本(如果被引用的变量存在)， 输出标记是用双花括号分隔，形式为
`{% raw %} {{ page.title }}{% endraw %}`。相当于Rails里的`<%= %>`。
#### 标签标记 (tag markup)
标签标记通常用于流程控制，变量赋值。形式为 `{% raw %}{% %} {% endraw %}`。 相当于erb里的 `<% %>`

### Filter
* 用 `|`来分隔方法，左边表达式的结果作为右边方法的第一个参数。这类似于bash里的管道操作符
* 如果方法有参数，放在方法名后，用冒号`:`分开，多个参数间用逗号分开。


> Output markup takes filters. Filters are simple methods. The first parameter is always the output of the left side of the filter. The return value of the filter will be the new left value when the next filter is run. When there are no more filters, the template will receive the resulting string.

    {% raw %}
    Hello {{ '*tobi*' | textilize | upcase }}
    Hello {{ 'now' | date: "%Y %h" }}
    {% endraw %}

### 流程控制

#### cycle
> 行为和Rails里的`ActionView::Helpers::TextHelper#cycle`相同

__cycle without name__
    
    {% raw %}
    {% cycle 'one', 'two', 'three' %}
    {% cycle 'one', 'two', 'three' %}
    {% cycle 'one', 'two', 'three' %}
    {% endraw %}
__named cycle__

    {% raw %}
    {% cycle 'group 1': 'one', 'two', 'three' %}
    {% cycle 'group 1': 'one', 'two', 'three' %}
    {% cycle 'group 2': 'one', 'two', 'three' %}
    {% cycle 'group 2': 'one', 'two', 'three' %}
    {% endraw %}

## 代码高亮
使用pygments，ubuntu下需安装python-pygments软件包

    sudo apt-get install python-pygments

在[这里](http://pygments.org/languages/)查看支持的语言列表

格式为：

    {% raw %}
    {% highlight ruby linenos %}
        def method
          puts "blabla"
        end
    {% endhighlight %}
    {% endraw %}
结果会成为：

{% highlight ruby linenos %}
    def method
      puts "blabla"
    end
{% endhighlight %}

## markdown
[Markdown 语法说明 (简体中文版) ](http://wowubuntu.com/markdown/)

## 应用例子

### 在日志列表中显示缩略图
在YAML front formatter中定义image变量，给赋值为一个图片的文件名
在日志列表中以`<img src="{% raw %}{{ page.image }}{% endraw %}" />`的形式引用这个图片。


## 链接

[用Jekyll构建静态网站](http://yanping.me/cn/blog/2011/12/15/building-static-sites-with-jekyll/)
