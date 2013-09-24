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

####第四章 Containers，Blocks and Iterators
#####4.1 Arrays
读写array

```ruby
a = [1,3,4,7,9]
a[2,2] #[start,count]   #=>[4,7]
a[1..3] #=>[3,4,7]
a[1,0] = [0,8] #=>[1,0,8,3,4,7,9]  [start,count to remove] 
a[2,2] = [2,4] #=>[1,0,2,4,4,7,9]
```

array的增减操作

```ruby
stack = []
stack.push "red"
stack.push "green"
stack #=>["red", "green"]
stack.unshift "blue"
stack #=> ["blue","red", "green"]
stack.pop #=>"green"
stack.shift #=>"blue"
stack #=>["red"]
```

#####4.2 Hashes

#####4.3 Blocks and Iterators
斐波那契方法

```ruby
def fib_up_to(max)
	i1, i2 = 1,1
	while i1 <= max
		yield i1
		i1, i2 = i2, i1+i2
	end
end

fib_up_to(1000) {|f|print f, " "}
```
结果是：
```
1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987
```

有的时候你想要记录你执行某个block的次数，那么`with_index`将变得十分有用。它会增加一个连续增长的数字跟在迭代返回值后边，然后同时传递给代码块：

```ruby
f = File.open("testfile")
f.each.with_index do |line,index|
	puts "Line #{index} is: #{line}"
end
f.close
```
结果：

```
Line 0 is: This is line one
Line 1 is: This is line two
Line 2 is: This is ...
```

关于迭代，下面将介绍另一个方法——`inject`. inject可以是你集聚递归一个集合。如下：

```ruby
[1,3,5,7].inject(0) {|sum,element| sum + element}  #=> 16
[1,3,5,7].inject(1） {|product, element| product * element})   #=> 105
```

`inject`是这样工作的： 第一次执行关联的代码块时， `sum`被设为 inject的参数，`element`设为集合的第一个元素。第二次及其以后的代码块执行，`sum`设为上次代码块执行返回的结果值，知道最后一次执行代码块，返回值为最后的	sum值。有一件事需要提醒：如果`inject`没有带参数，那么集合第一个元素将作为初始值，从第二个元素开始迭代。

上面的代码也可以写作：

```ruby
[1,3,5,7].inject {|sum,element| sum + element}  #=> 16
[1,3,5,7].inject {|product, element| product * element})   #=> 105
```

关于inject，还有一个神奇的技巧，我们可以将要调用在集合元素的方法名作为inject的参数。如下：

```ruby
[1,3,5,7].inject(:+)   #=>16
[1.3.5.7].inject(:*)    #=>105
```

之所以可以如上写代码，是因为加法和乘法是简单的数字方法，加上冒号是其变成相应的symbol。
