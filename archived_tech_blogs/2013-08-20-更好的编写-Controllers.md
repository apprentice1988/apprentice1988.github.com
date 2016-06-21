---
layout: post
category: Rails
---
让我现在写一个代码实例：

```ruby
class User
	validates_uniqueness_of :username
end
```
```ruby
class RegistrationController < ApplicationController
	def create
		user = User.where(username: params[:username]).first
		user ||= User.new.tap do |new_user|
			new_user.username = params[:username]
			new_user.save!
		end
		render json: user
	end
end
```
这里我们只需要一个用户名来注册用户，如果用户已经存在，那我们就返回。 非常简单！但是这个逻辑不属于controller的范畴，没有办法做到不连接数据库，不使用大量的模型而直接去测试它。一个明显表示你正在错误操作的信号就是在你的specs中有`User.any_instance`。

首先进行如下改动：

```ruby
class User
	validates_uniqueness_of :username

	def self.register(username)
		user = User.where(username:username).first
		user || User.new.tap do |new_user|
			new_user.username = username
			new_user.save!
		end
	end
end
```
```ruby
class RegistrationController < ApplicationController
	def create
		user = User.register(params[:username])
		render json.user
	end
end
```
这样真的好多，你只需要`User.register`即可测试这个controller。
现在你大概可以停下了，如果你的应用不再增大，那这样的操作非常好。但是随着你的应用越来越大，你的`User`模型变得越来越大，这时候，你就需要对它进行处理了。

一个比较好的方式就是把大的模型拆开。

```ruby
class User
	validate_uniqueness_of :username
end
```
```ruby
class RegistrationService
	def register(username)
		user = User.where(username:username).first
		user ||= User.new.tap do |new_user|
			new_user.username = username
			new_user.save!
		end
	end
end
```
```ruby
class RegistrationController < ApplicationController
	before_filter :load_registration_service

	def create
		user = @registration_service.register(params[:username])
		render json: user
	end

	def load_registration_service(service = RegistrationService.new)
		@registration_service ||= service
	end
end
```
这个`registration service`只对和registration相关的数据进行操作。注意， 这个service可以转换成其他的使用Http协议的服务而不仅仅是数据库。