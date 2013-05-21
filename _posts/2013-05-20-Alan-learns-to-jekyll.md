---
layout: post
category: web
summary: 我学用jekyll建个人博客的笔记
---

[Jekyll](http://jekyllrb.com/)是一个用来生成静态HTML网页的文本转换引擎。相比与纯静态页面，它做了：

1. 模板。 
2. partial
3. 多种语言编写，然后转换成HTML。
4. 提供了一些filter, 方便操作日期， 文本与数字
5. 有基本的控制结构，如if/else, case, for


### 目录结构

    ├── _config.yml
    ├── css/
    ├── index.html
    ├── _layouts/
    ├── _posts/
    ├── _includes/
    ├── README.md
    └── _site/

和Rails里惯例优于配置的习惯一样，jekyll也有一些默认设置，例如模板文件放在`_layouts`目录下，partial放在`_includes`目录下。博客文件放在`_posts`目录下。jekyll最终生成的静态HTML文件会存放与`_site`目录下, 这个目录将会是用户直接访问的目录。

这些配置都可以在`_config.yml`或者通过命令行方式修改，详见 [jekyll wiki](http://jekyllrb.com/docs/configuration/)

#### post文件名

文件名需是`YYYY-MM-DD-title.ext`的形式，时间会作为博客的发表时间，title也会是博客最后的标题。文件后缀用来判断所有的标记语言，例如`md`就是markdown啦。

### 文本流

`_posts`下的文件 -> 将标记语言转换成HTML -> 嵌入layout和partial -> 存储到`_site`目录

> [github pages](http://pages.github.com/)是使用`jekyll`作为后台
> 引擎的个人博客或项目主页托管网站。它会自动进行这些步骤。所
> 以我们`_site`里文件就不用也同步到github上去了，他会自动生成的。

## liquid

[这里](http://wiki.shopify.com/Liquid)和[这里](https://github.com/shopify/liquid/wiki/liquid-for-designers)是两处内容很全的文档。

### 关于变量

<http://jekyllrb.com/docs/variables/>

#### 几个常用变量的结构

**site.categories 和 site.tags**

由category组成的数组。每个category也是一个数组，第一个元素是category名称，最后一个元素是所有属于这个category的post组成数组。


    {% raw %}
    {% for category in site.categories %}
    {{category[0]}} ({{category[1] | size}})
    或者
    {{category | first }}  ({{category | last | size }})
    {% endfor %}
    {% endraw %}

**post.next和post.previous方法**

获取下一篇或上一篇日志对象

### markdown
[Markdown 语法说明 (简体中文版) ](http://wowubuntu.com/markdown/)

### 几个非常好的jekyll入门链接

[用Jekyll构建静态网站](http://yanping.me/cn/blog/2011/12/15/building-static-sites-with-jekyll/)
