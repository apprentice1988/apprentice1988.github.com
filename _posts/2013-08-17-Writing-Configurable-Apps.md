---
layout: post
category: Practicing Ruby
---
ruby 开发者倾向于约定由于配置， 但是这并不意味着我们的应用是免配置的。如果你正在进行严格的软件开发，好像至少你的应用中的一部分会依赖一些配置数据。无论你是否需要储存一些数据库安全信息，一个API 的密钥，或者一些更加复杂的，知道如何去灵活的设置都是很重要的。

Ruby给我们可以让我们和配置数据打交道，并告诉我们在各种常用的情景下使用哪种技术最适合。
####错误的配置
配置数据时最糟糕的方式是把信息直接嵌入应用。下面一个简单的`sinatra`应用是一个很好的告诉我们不要去做什么的很好的例子。

```ruby
require "rubygems"
require "sinatra"
require "active_record"

class User < ActiveRecord::Base; end

configure do 
	ActiveRecord::Base.establish_connection(
		:adapter => "mysql",
		:host => "myhost", 
		:username=>"myuser", 
		:password => "mypass",
		:database => "samedatabase"
	)
end

get "/users" do 
	@users = User.all
	haml :user_index
end
```
上面的代码，在应用启动的时候建立了和数据库的链接，然后处理了一个很简单的操作，得到一个用户的列表，然后渲染一个`haml`模板。 在这个简单的应用中， 这个配置数据似乎没有什么不妥。 但是细想一下，很容易发现设计中的巨大的错误。

这样的代码首要的也是最明显的问题是安全，每一个看到源代码的人都要保证是值得信赖的，因为数据库信息直接嵌在里面。 现在，谁会接触到这个项目，有没有其他的系统可以限制进入生产环境可能不是一个事宜的话题，当然他很重要。

####YAML 基础的配置
通过简单的修改，我们可以把我们应用的配置移入一个`YAML`文件。和标准的rails 配置文件一样，我们很喜欢使用`database.yml`, 例如：
```
development:
	adapter: mysql
	database: mydatabase
	username: myuser
	password: mypass
	host: myhost
```

通过标准的YAML库，我们可以取出文件中的数据，转换为嵌到的哈希格式，如下：

```ruby
>> require "yaml"
=> true
>> YAML.load_file("config/database.yml")
=> {"development"=>{"username"=>"myuser", "adapter"=>"mysql", "database"=>"mydatabase", "host"=>"myhost", "password"=>"mypass"}}
```

如果我们比较我们最开始直接`establish_connection()`调用直接的配置哈希，很容易发现两者得到的结果一样，很容易改进原代码。

```ruby
require "rubygems"
require "yaml"
require "sinatra"
require "active_record"

class User < ActiveRecord::Base; end

configure do 
	database_config = YAML.load_file("config/database.yml")
	ActiveRecord::Base.establish_connection(database_config)
end

get "/users" do 
	@users = User.all
	haml :user_index
end
```
通过在应用的代码中删除配置数据，正确配置数据，我们做到了应用代码无论运行在哪都不需要更改的目的。