---
layout: post
category: Rails
---
#### 什么是单表继承

简单的说，单表继承就是允许你在一个特定数据库表的基础上创建子类。使用一个单表，通过将一行数据投射到一个特定的对象，从而扩展了基础模型。

#### 如何使用rails创建单表继承

假设我们有一个电脑(computer)模型

```ruby
def Computer < ActiveRecord:Base
	# in app/models
	# Fields:
	#   String name
	#   String owner
	#   String manafacturer
	#   String color

	def default_browser
		"unknow!"
	end
end
```

现在我们想要区分Macs和Pcs。 如果我们分别创建不同的表，真的行不通，毕竟这两者都属于电脑，具有特别多的相同的列。于是，我们创建一个新列，type，可以告诉Rails，我们将在computer的基础上使用单表继承。让我看一下具体的model代码。

```ruby
class Computer < ActiveRecord:Base
	# in app/models
  # Fields:
  #   String name
  #   String owner
  #   String manafacturer
  #   String color
  #   String type

  def default_browser
    "unknown!"
  end 
end
```

```ruby
def Mac < Computer
	# in app/models
	# this is for Computers with type="Mac"
	before_save :set_color

	#假设所有的macs都是银色的
	def set_color
		self.color = "silver"
		self.manafacturer = "apple"
	end

	def default_browser
		"safari"
	end
end
```

```ruby
class PC < Computer
	# in app/models
	def default_brower
		"ie = .."
	end
end
```

任何时候Rails打开一个computer对象，它会去寻找对应该type的子类。例如，`type = "CoolComputer"`对应着model `CoolComputer < Computer`.

#### 如何使用STI模型

创建一个新的mac，可以如下：

```ruby
m = Mac.new
m.name = "kunal's mac"
m.owner = "kunal"
m.save
m # => #<Mac id: 1, name: "kunal's mac", owner: "kunal", manafacturer: "apple", color: "silver", type: "Mac", ...>
```

更酷的是ActiveRecord的查询。假设我们想找到所有的computers

```ruby
Computer.all # => [#<Mac id: 1, name: "kunal's mac", owner: "kunal", manafacturer: "apple", color: "silver", type: "Mac", ...>, #<Mac id: 2, name: "anuj's mac", owner: "anuj", manafacturer: "apple", color: "silver", type: "Mac", ...>, #<PC id: 3, name: "bob's pc", owner: "bob", manafacturer: "toshiba", color: "blue", type: "PC", ...>]
```
他能自动给你正确的结果。你可以通过`.type`,`is_a?`, `.class`方法去找出特定computer的类型。

```ruby
Computer.first.type == Mac #true
Computer.first.is_a? Mac #true
Computer.first.class == Mac #true
```

如何我们想查到所有的Mac，我们可以简单的使用`Mac.all`。

#### 特定的继承列
如果你想使用其他的列代替type使用STI，你可以在model的开始加入如下代码：

```ruby
set_inheritance_column "whatever_you_want"
```

注意，如果你有一个type列，可以使用改变继承列的方法关闭STI

#### 在Rails的组织
最后，我们来看一下STI在rails中的结构。所有的子类都应该在父类model的文件夹内。在models中创建agiel文件夹存放所有类型的电脑

>* app
>*   models
>*     computer.rb
>*     computers
>*       pc.rb
>*       mac.rb

Rails不会自动打开models中的子文件夹，所以我们要在config/application.rb中添加如下代码：

```ruby
# Load Subfolder Models
config.autoload_paths += Dir[Rails.root.join('app','models','{**}')]
```