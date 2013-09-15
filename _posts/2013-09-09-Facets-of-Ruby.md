---
layout: post
category: Programming Ruby 1.9 & 2.0
---
这篇文章是我学习《Programming Ruby 1.9 & 2.0》的学习笔记，这本书每一章分的比较细，所以我抛弃了一章一文的想法，改用更加灵活的方法，也许一篇文章只有一章内容，也许一篇文章涵盖了四五章的内容。
自己翻译的能力比较欠缺，就当自己记性差，用烂笔头记一下。

####第一章：Getting Started

####第二章： Ruby new
以前的编程书籍都是现讲类似integers,strings等基本的语法点，在条件表述之前将表达式，再然后，大概在七八章的地方开始讲类。我们发现这个路数多少有点枯燥。
我们设计这本书时，有一个伟大的计划。我们想从上而下的讲解这门语言，从类和对象开始，以琐碎的小的语法细节结束。但是这样面临的问题就是，没有基本的语法支撑，很难展开类，对象的讲解。所以就产生了这一章。我们用最快的方法过一遍Ruby的基本语法。好为下面的讲解打下些基础。

#####2.1 Ruby是一门面向对象语言

#####2.2 一些基本的Ruby语法

#####2.3 Arrays and Hashes
有的时候，因为引号，逗号，创建数组有点痛苦。幸运的是，Ruby有一个简写， `%w`:

```ruby
a = ['ant','bee','cat','dog','elk']
a[0]  # => "ant"
a[3]  # => "dog"
# this is the same:
a = %w{ant bee cat dog elk}
a[0]  # => "ant"
a[3]  # => "dog"
```
#####2.4 Symbols

#####2.5 Control Structures

#####2.6 Regular Expressions
`=~`返回匹配部分开始的位置，`.match`返回MatchData。如果是用匹配作为条件，前者更合适一些，返回结果为nil，即为无匹配对象。

```ruby
line = gets
if line =~ /Perl|Python/
	puts "Scripting language mentioned: #{line}"
end
```
 #####2.7 Blocks and Iterators

 #####2.8 Reading and 'Riting

 #####2.9 Command-Line Arguments

 #####2.10 Onward and Upward

####第三章：类，对象和变量

######p 与 puts
当对一个对象调用`puts`时，puts方法会调用`to_s`将对象转换为string显示出来

```ruby
class BookInStock
	def initialize(isbn,price)
		@isbn = isbn
		@price = price
	end
end

b1 = BookInStock.new("isbn1",3)
puts b1
```

结果输出：

```ruby
#<BookInStock:0x007fb424847468>
```

我们如果改变`to_s`方法，输出结果将相应改变

```ruby
class BookInStock
	def initialize(isbn,price)
		@isbn = isbn
		@price = price
	end

	def to_s
		"ISBN: #{@isbn}, price: #{@price}"
	end
end

b1 = BookInStock.new("isbn1",3)
puts b1
```

输出结果：

```
ISBN： isbn1, price： 3.0
```

#####3.1 对象和属性
我们将一个浮点小数a转换成百分数时，我们习惯使用`Integer(a * 1000 + 0.5)`,为什么要加0.5呢？因为浮点小数不会特别准确的显示，比如`33.8 × 100`， 输出的结果是3379.9999999999995，使用`Integer`方法，会去尾变成3379.在`Integer`方法前加上0.5,保证我们生成最准确的结果。这个例子也告诉我们为什么金融计算中更想使用BigDecimal而不是float。

#####3.2 Classes Working with Other Classes
Ruby有两个加载外部文件的方法，`require`和`require_relative`. 如果我们加载的文件与引用文件在同一个目录下，那么可以使用`require_relative`.

#####3.3 Access Control
```ruby
class MuClass

	def method1
	end

protected
	def method2
	end

private
	def method3
	end

public
	def method4
	end
end
```
 
也可写作

```ruby
class MyClass
	def method1
	end
	def method2
	end
	# ... and so on

	public :method1, :method4
	protected :method2
	private :method3
end
```

######3.4 Variables
变量是对象吗？ 在Ruby，不是！它只是对象的引用。善于使用`.dup`.
为了防止一个特别的对象被改动，可以使用`.freeze`

```ruby
person1 = "Tim"
person2 = person1
person1.freeze
person2[0] = "J"
```
会报错：

```
		from prog.rb:4:in `<main>`
prog.rb:4:in `[]=`: can't modify forzen String (RuntimeError)
```


