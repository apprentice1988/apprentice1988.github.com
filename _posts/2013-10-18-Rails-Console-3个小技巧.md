---
layout: post
category: Rails
---
昨天浏览rails API文档，发现了几个以前不知道的rails console的小技巧，记录一下。

#### 获取app信息

在rails console中运行app，你将得到一个整合了session的实例，所以你可以像进行rails综合测试一样去使用它。

```ruby
>> app.class
=> ActionDispatch::Integration::Session
```

在你的app中可以生成请求：

```ruby
>> app.get "previews/1000"
=> 200

>> app.response.body
=> "Multimedia Design</option>\n<option value=\"203\">Museology/Museum Studies</option>\n<option value=\"401\">Music</option>\n......"
```

这些指示app的一两个方法，更多的方法可以查看`app.methods`.当然，也可以查看 [ActionDispatch::Integration::Session](http://api.rubyonrails.org/classes/ActionDispatch/Integration/Session.html)和 [ActionDispatch::Integration::RequestHelpers](http://api.rubyonrails.org/classes/ActionDispatch/Integration/RequestHelpers.html)获取更多的方法。

####关于helper
你可以使用helper得到一个配置了Rails helpers的console对话。当然，你也可以使用它创建HTML标签，或者任何你知道的rails 和helper方法。

```ruby
>> helper.truncate("Testing", length: 4)
=> "T..."

>> helper.link_to "Home", app.root_path
=> "<a href=\"/\">Home</a>"
```

我们进一步就可以很方便的在console中测试一下我们的helper方法了。例如一个helper方法如下：

```ruby
def title_tag(title=nil)
	if @project.present? && title.nil?
		content_tag :title, @project.name
	elsif @project.preset?
		content_tag :title, "#{@project.name}: #{title}"
	else
		content_tag :title, title
	end
end
```
我们可以使用老方法，`Object#instance_variable_set`,当然，这有点违背了面向对象编程的核心原则，但至少我们可以在console中试一下我们的helper方法了。

```ruby
>> helper.title_tag "Testing!"
=> "<title>Testing!</title>"

>> helper.instance_variable_set :@project, Project.first
=> #<Project id: 123344,...

>> helper.title_tag
=> "<title>With attachments!</title>"

>> helper.title_tag "Posts"
=> "<title>With assachments!: Post</title>"
```

处理一个接受参数的helper方法也不是很直接。但是，我们可以hack一下，毕竟我们在console中。假设我们有如下方法：

```ruby
def javascript_debugging_options
	if parans[:javascript_debugging] == "enabled"
		{debug: true,digest:false}
	else
		{}
	end
end
```

通常ActionView需要获取来自controller的ActionDispatch::Request去知道从controller中传入了那些参数。在这里，我们可以使用 `OpenStruct`来代替：

```ruby
helper.controller = OpenStruct.new(params: {})
=> #<OpenStruct params={}>

>> helper.javascript_debugging_options
=> {}

>> helper.controller = OpenStruct.new(params: {javascript_debugging: "enabled"})
=> #<OpenStruct params={:javascript_debugging => "enabled"}>

>> helper.javascript_debugging_options
=> {:debug=>true, :digest=>false}
```

#### 方法从哪来
迅速的知道一个特定方法的来源有时查看代码也需要话费一些时间。好的是Ruby可以告诉你方法的代码位置，试一下 `Method#source_location`:

```ruby
>> Project.instance_method(:trash).source_location
=> ["/Users/qrush/37s/apps/bcx/app/models/project.rb", 90]
```