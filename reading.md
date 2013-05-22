---
layout: default
title: 书单
---

<div class="right">
  <img src="http://img3.douban.com/favicon.ico" alt="">
  <a href="http://www.douban.com/people/28935831/">我的豆瓣</a>
</div>

## 想读

<ul id="wish">
</ul>

## 在读

<ul id="reading">
  <li>
    <a href="https://github.com/hadley/devtools/wiki">Advanced R development: making reusable code (in process)</a>
  </li>
</ul>

## 已读

<ul id="read">
  <li>
    <a href="http://book.douban.com/subject/6756090/">松本行弘的程序世界</a>
  </li>
</ul>
<script src="js/jquery-min.js" ype="text/javascript" ></script>
<script type="text/javascript" >
  var wish = function(data) {
    dbapi(data, $("#wish"));
  };
  var reading = function(data) {
    dbapi(data, $("#reading"));
  };
  var read = function(data) {
    dbapi(data, $("#read"));
  };
  var dbapi = function(data, obj){
    $.each(data.entry, function(i, book){
      var title = book["db:subject"].title["$t"]
      var link = book["db:subject"].link[1]["@href"]
      var imageLink = book["db:subject"].link[2]["@href"]
      var item = $("<li/>");
      $("<a/>").attr({"href":link}).text(title).appendTo(item);
      $(item).appendTo(obj)
    })
  }
</script>
<script src="http://api.douban.com/people/28935831/collection?cat=book&status=wish&alt=xd&callback=wish&apikey=06be6ee392351481143b4caab69f3d83" ype="text/javascript" ></script>
<script src="http://api.douban.com/people/28935831/collection?cat=book&status=reading&alt=xd&callback=reading&apikey=06be6ee392351481143b4caab69f3d83" ype="text/javascript" ></script>
<script src="http://api.douban.com/people/28935831/collection?cat=book&status=read&alt=xd&callback=read&apikey=06be6ee392351481143b4caab69f3d83" ype="text/javascript" ></script>
