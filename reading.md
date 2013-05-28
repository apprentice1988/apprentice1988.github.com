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

</ul>

## 已读

<ul id="read">
  <li>
    <a href="http://book.douban.com/subject/6756090/">松本行弘的程序世界</a>
  </li>
  <li>
    <a href="https://github.com/hadley/devtools/wiki">Advanced R development: making reusable code (in process)</a>
  </li>
</ul>


<script type="text/javascript" >
  var dbapi = function(data, obj){
    $.each(data.entry, function(i, book){
      var title = book["db:subject"].title["$t"]
      var link = book["db:subject"].link[1]["@href"]
      var imageLink = book["db:subject"].link[2]["@href"]
      var item = $("<li/>");
      $("<a/>").attr({"href":link}).text(title).appendTo(item);
      $(item).appendTo(obj)
    });
  }
  $(function(){
    $.ajaxSetup({
      type: "get",
      url: "http://api.douban.com/people/28935831/collection",
      async: false,
      dataType: "jsonp",
      jsonp: "callback",
      data: {
        apikey: "06be6ee392351481143b4caab69f3d83",
        cat: "book",
        alt: "xd"
      }
    });
    $.ajax({
      data: {status: "wish"},
      success: function(data){dbapi(data, $("#wish")) }
    });
    $.ajax({
      data: {status: "read"},
      success: function(data){dbapi(data, $("#read")) }
    });
    $.ajax({
      data: {status: "reading"},
      success: function(data){dbapi(data, $("#reading")) }
    });
  })
</script>
