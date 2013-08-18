---
layout: archive
---

{% for post in site.posts %}
#<span class="blog-title">[{{ post.title }}]({{ post.url }})</span> <time>{{ post.date | date: '%Y-%m-%d'}}</time>
*****
{% endfor %}


