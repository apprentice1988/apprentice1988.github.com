---
layout: post
category: Ruby
---
我决定从一个最基本但是又至关重要的一个地方说起：查询方法的路径。我们一起通过简单的例子做一些简单的挖掘。

下面是一个简单的report 类，主要是执行一些基本的数据操作然后产生一些文本输出：

```ruby
class Report
	def initialize(ledger)
		@balance = ledger.inject(0) {|sum, (k,v)| sum + v}
		@credits, @debits = ledger.partition {|k,v|v > 0}
	end

	attr_reader :credits, :debits, :balance

	def formatted_output
		"Current Balance: #{balance}\n\n" + 
		"Credits:\n\n#{formatted_line_items(credits)}\n\n" + 
		"Debits:\n\n#{formatted_line_items(debits)}"
	end

	def formatted_line_items(items)
    items.map { |k, v| "#{k}: #{'%.2f' % v.abs}" }.join("\n")
  end
end
```

下面的例子将展示我们如何使用这个类

```ruby
ledger = [ ["Deposit Check #123", 500.15],
           ["Fancy Shoes",       -200.25],
           ["Fancy Hat",          -54.40],
           ["ATM Deposit",       1200.00],
           ["Kitteh Litteh",       -5.00] ]

report = Report.new(ledger)
puts report.formatted_output
```
你可以直接复制粘贴代码在本地执行，输出结果应该是：

```
Current Balance: 1440.5

Credits:

Deposit Check #123: 500.15
ATM Deposit: 1200.00

Debits:

Fancy Shoes: 200.25
Fancy Hat: 54.40
Kitteh Litteh: 5.00
```

尽管不是特别完好，但这个report是我们希望看到的主要内容。 你可能设想我们这些内容如何嵌到其他的report中，例如一个觉有header和footer的邮件。一个可行的办法是通过类继承，如下：

```ruby
require "date"

class EmailReport < Report
	def header
		"Dear Valued Customer,\n\n" + 
		"This report shows your account activity as of #{Date.today}\n"
	end

	def banner
		"\n.............................................................\n"
	end

	def formatted_output
		header + banner + super + banner + footer
	end

	def footer
		"\nWith Much Love, \nYour Faceless Banking Institution"
	end
end
```

我们只需要做一些小的改动使用我们新的类。

```ruby
ledger = [ ["Deposit Check #123", 500.15],
           ["Fancy Shoes",       -200.25],
           ["Fancy Hat",          -54.40],
           ["ATM Deposit",       1200.00],
           ["Kitteh Litteh",       -5.00] ]

report = EmailReport.new(ledger)
puts report.formatted_output
```

新的输出结果会如下：

```
Dear Valued Customer,

The following report shows your account activity as of 2010-11-09

............................................................
Current Balance: 1440.5

Credits:

Deposit Check #123: 500.15
ATM Deposit: 1200.00

Debits:

Fancy Shoes: 200.25
Fancy Hat: 54.40
Kitteh Litteh: 5.00
............................................................

With Much Love,
Your Faceless Banking Institution
```
回头看一下`EmailReport`的代码，很容易明白我们是如何产生新结果的。
下面来看一些`super`的继承顺序问题。通过下面的例子，可以体现`super`继承的“五步走”方法。

```ruby
module W
  def foo
    "- Mixed in method defined by W\n" + super
  end
end

module X
  def foo
    "- Mixed in method defined by X\n" + super
  end
end

module Y
  def foo
    "- Mixed in method defined by Y\n" + super
  end
end

module Z
  def foo
    "- Mixed in method defined by Z\n" + super
  end
end

class A
  def foo
    "- Instance method defined by A\n"
  end
end

class B < A
  include W
  include X

  def foo
    "- Instance method defined by B\n" + super
  end
end

object = B.new
object.extend(Y)
object.extend(Z)

def object.foo
  "- Method defined directly on an instance of B\n" + super
end

puts object.foo
```
当你运行代码时，我们看到如下的结果，它追踪了`super`调用的整个路径。

```
- Method defined directly on an instance of B
- Mixed in method defined by Z
- Mixed in method defined by Y
- Instance method defined by B
- Mixed in method defined by X
- Mixed in method defined by W
- Instance method defined by A
```
这就是前面说的“五步走”方法。 上面是对于Ruby方法查找路径的展示：
1. 在事物单例类中定义的方法（例如事物本身）
2. 单例类中混入的`module`以引入顺序的相反方法查找
3. 事物类中定义的方法
4. 事物类中引入的`module`顺序的相反顺序查找
5. 父类中定义的方法

## 什么时候使用普通类定义
下面的代码运行了简单的计时器，可以给文件写出时间戳，计算过去的事件。

```ruby
class Timer
  MissingTimestampError = Class.new(StandardError)

  def initialize(dir=Turbine::Application.config_dir)
    @file = "#{dir}/timestamp"
  end

  def write_timestamp
    File.open(@file,"w") {|f| f << Time.now.utc.to_s}
  end

  def timestamp
    raise MissingTimestampError unless running?
    Time.parse(File.read(@file)).localtime
  end

  def elapsed_time
    (Time.now.utc-timestamp.utc) / 60.0/60.0
  end

  def clear_timestamp
    FileUtils.rm_f(@file)
  end

  def running?
    File.exist?(@file)
  end
end
```
当考虑这是否是一个平淡无奇老旧的类定义的时候，我经常问我自己一些问题
1. 当我以后有其他需要的时候是不是可以容易的基于现有代码去定制调整?
2. 这些代码是不是能比较容易地被第三方代码扩展使用?
3. 这里面有没有常用的方法我可以提取出来在其他地方使用?

因为这个`Timer`类源自我自己的项目，所以我可以毫无疑问的回答上面的问题，这个代码不能满足上面的要求，这个类在以后的使用中不方便扩展。
。。。待续
