---
layout: default
---
<div id="categories-number">
{% for category in site.categories %}
<span>{{category[0]}} - {{category[1] | size}}</span>
{% endfor %}
</div>

{%for category in site.categories%}
##<span class="category">{{category[0]}}</span>

{% for post in category[1] %}

<span class="post-title-in-category">[{{post.title}}]({{post.url}})</span>

{% endfor %}

{% endfor %}
<div class="footheight"></div>
