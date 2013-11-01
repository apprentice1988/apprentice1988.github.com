---
layout: post
category: Rails
---
#### 1. 丰富模型，简化控制器

/app/controllers/tweets_controller.rb

```ruby
class TweetsController < ApplicationController
	def retweet
		tweet = Tweet.find(params[:id])

		if tweet.user == current_user
			flash[:notice] = "Sorry, you can't retweet your own tweets."
		elsif tweet.retweets.where(:user_id => current_user.id).present?
			flash[:notice] = "You already retweeted!"
		else
			t = Tweet.new
			t.status = "RT #{tweet.user.name}: #{tweet.status}"
			t.original_tweet = tweet
			t.user = current_user
			t.save
			flash[:notice] = "Successfully retweeted"
		end

		redirect_to tweet
	end
end
```
优化成：
/app/controllers/tweets_controller.rb

```ruby
class TweetsController < ApplicationController
	def retweet
		tweet = Tweet.find(params[:id])
		flash[:notice] = tweet.retweet_by(current_user)
		redirect_to tweet
	end
end
```

/app/models/tweet.rb

```ruby
class Tweet < ActiveRecord::Base
	def retweet_by(retweeter)
		if self.user == retweeter
			"Sorry, you can't retweet your own tweets"
		elsif self.retweets.where(:user_id => retweeter.id).present?
			"You already retweeted!"
		else
			...
			"Successfully retweeted"
		end
	end
end
```

#### 2. scope

Bad code:

/app/controllers/tweets_controller.rb

```ruby
def index
	@tweet = Tweet.find(
		:all,
		:conditions => {:user_id => current_user.id},
		:order => "created_at desc",
		:limit => 10
	)
	@trending = Topic.find(
		:all,
		:conditions => ["started_trending > ?",1.day.ago],
		:order => "mentions desc",
		:limit => 5
	)
	...
end
```

/app/controllers/tweets_controller.rb

```ruby
def index
	@tweets = Tweet.where(:user_id=>current_user.id).order("created_at desc").limit(10)

	@trending = Topic.where("started_trending > ?", 1.day.ago).order("mentions desc").limit(5)
	
	...
end

/app/controllers/tweets_controller.rb

```ruby
def index
  @tweets = current_user.tweets.order("created_at desc").limit(10)

  ...
end
```
使用`scope`

/app/controllers/tweets_controller.rb

```ruby
def index
	@tweets = current_user.tweets.recent.limit(10)
	...
end
```
/app/models/tweet.rb

```ruby
class Tweet < ActiveRecord::Base
	scope :recent, order("created_at desc")
	...
end
```
#####或者使用`default_scope`

/app/controllers/tweets_controller.rb

```ruby
def index
	@tweets = current_user.tweets.limit(10)
	...
end
```

/app/models/tweet.rb

```ruby
class Tweet < ActiveRecord::Base
	default_scope order('created_at desc')
	...
end
```
#####下面要特别指出`scope`中使用时间的方法

/app/controllers/tweets_controller.rb

```ruby
def index
	@trending = Topic.trending.limit(5)
	...
end
```

/app/models/topic.rb

```ruby
class Topic < ActiveRecord::Base
	scope :trending, where('started_trending > ?', 1.day.ago).order('mentions desc')
	...
end
```

在使用是你会发现，这个scope将只执行一次：
* `where('started_trending > ?','10-29-2013 19:03')
* `where('started_trending > ?','10-29-2013 19:03')
你会发现，每次执行都使截止到第一次运行scope的时间。解决办法是使用`lambda`.
/app/models/topic.rb

```ruby
class Topic < ActiveRecord::Base
	scope :trending, lambda {where("started_trending > ?", 1.day.ago).order('mentions desc')}
	...
end
```
#####`scope`中使用`limit`时，也要注意参数初始化。例如：

/app/controllers/tweets_controller.rb

```ruby
def index
	@trending = Topic.trending(5)
	...
end
```
/app/models/topic.rb

```ruby
class Topic < ActiveRecord::Base
	scope :trending, lambda {|num| where('started_trending > ?',1.day.ago).order('mentions desc').limit(num)}
	...
end
```
当执行`@trending = Topic.trending`是就会弹出错误：`WRONG NUMBER OR ARGS,0 FOR 1`.

如果如下进行参数初始化就会避免错误。

/app/models/topic.rb

```ruby
class Topic < ActiveRecord::Base
	scope :trending, lambda {|num = nil| where('started_trending > ?',1.day.ago).order('mentions desc').limit(num)}
	...
end
```
这样使用scope时无论是否带参数，都不会有错误。

##### 覆盖默认的scope

/app/models/tweet.rb

```ruby
class Tweet < ActiveRecord::Base
	default_scope order('created_at desc')
	...
end

如果我们继续使用如下方法，会发现实际结果并不是根据status排列的。

```ruby
@tweets = current_user.tweets.order(:status).limit(10)
```
你可以使用

```ruby
@tweets = current_user.tweets.unscoped.order(:status).limit(10)
```
得到想要的结果。

#### 3. filter
Bad code:
/app/controllers/tweets_controller.rb

```ruby
class TweetsController < ApplicationController
	before_filter :get_tweet, :only => [:edit, :update, :destroy]

	def edit
		...
	end

	def update
		...
	end

	def destroy
		...
	end

	private
	def get_tweet
		@tweet = Tweet.find(params[:id])
	end
end
```
要在action中保留参数，上面的代码执行的时候有错误。应该成

```ruby
class TweetsController < ApplicationController

	def edit
		@tweet = get_tweet(params[:id])
	end

	def update
		@tweet = get_tweet(params[:id])
	end

	def destroy
		@tweet = get_tweet(params[:id])
	end

	private
	def get_tweet tweet_id
		@tweet = Tweet.find(tweet_id)
	end
end
```

filter 主要应用于验证，登录，工具类。下面是常见情形：

/app/controllers/tweets_controller.rb

```ruby
class TweetController < ApplicationController
	before_filter :auto, :only =>[:edit,:update,:destroy] or :except =>[:index, :create]
```

在applicationcontroller中作为全局filter

```ruby
class ApplicationController < ActionController::Base
	before_filter :require_login
```

```ruby
class SessionsController < ApplicaitonController
	skip_before_filter :require_login, :only => [:new,:create]
```