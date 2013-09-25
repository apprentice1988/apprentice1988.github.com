---
layout: post
category: Programming Ruby
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

###### Enumerators-External Iterators
我们上面讲到了Ruby的内置迭代器，`.each`,`find`,`collect`。尽管他们功能强大，但必须认识到他们的局限性。第一个局限性是你需要将一个迭代器仅仅视为对象，比如你将一个迭代器作为参数传给一个方法，该方法需要得到迭代器返回的每一个结果。另一个问题是你很难并行处理两个迭代集合。
幸运的是Ruby带有内置的`Enumerator`类，可以执行外部迭代器。你可以调用`to_enum`在一个数组或者哈希对象上：

```ruby
a = [1,3,"cat"]
b = { dog: "canine", fox: "vulpine"}

#create Enumerators
enum_a = a.to_enum
enum_h = b.to_enum

enum_a.next    #=> 1
enum_h.next    #=> [:dog, "canine"]
enum_a.next    #=> 3
enum_h.next    #=> [:fox, "vulpine"]
```

大部分的内置迭代器如果不带block，也会返回一个Enumerator对象：

```ruby
a = [1,3,"cat"]
enum_a = a.each   #create an Enumerator using an internal iterator

enum_a.next   #=>1
enum_a.next   #=>3
```

Ruby有一个只重复调用代码块的方法，`loop`。特别的是，当某些条件出现时，代码块会停止这个`loop`方法。当使用一个Enumerator对象时，`loop`方法就变得比较聪明了——block中一个Enumerator对象将所有内在元素执行完的时候，会停止`loop`。如下：

```ruby
short_enum = [1,2,3].to_enum
long_enum = ("a".."z").to_enum

loop do 
	puts "#{short_enum.next} - #{long_enum.next}"
end
```
结果如下：

```
1 - a
2 - b
3 - c
```

###### Enumerators Are Objects
枚举符可以通过正常的执行代码将其转为一个对象。这就使得我们写代码时可以通过使用枚举符实现一般`loop`难以实现的功能。
比如，在Enumerator 的module中定义了`each_with_index`方法。 它会调用主类的`each`方法，并返回一个连续的index值。

```ruby
result = []
['a','b','c'].each_with_index {|item,index| result << [item,index]}
result   #=> [["a", 0], ["b", 1],["c", 2]]
```
但是如果你想要迭代并且得到一个index值，但是又想使用一个不同于each的方法怎么办？比如，你可能希望迭代一个字符串中的每一个字符。在String类中没有内置`each_char_with_index`方法。
这个时候Enumerator就派上了用场。 字符串的`each_char`方法如果你不后置代码块，会返回一个enumerator对象，然后就可以在这个对象上调用`each_with_index`方法了。

```ruby
result = []
"cat".each_char.each_with_index {|item,index| result << [item, index]}
result   #=> [["c", 0], ["a", 1],["t", 2]]
```

实事上，Matz给了我们一个`with_index`方法 ，使代码可读性更好。

```ruby
result = []
"cat".each_char.with_index {|item,index| result << [item, index]}
result   #=> [["c", 0], ["a", 1],["t", 2]]
```

当然，我们也可以明确地先生成一个Enumerator对象，然后在该对象上使用迭代。

```ruby
enum = "cat".enum_for(:each_char)
enum.to_a   #=> ["c","a","t"]
```

如果我们要生成一个enumerator对象作为参数参与迭代，可以使用`enum_for`方法。

```ruby
enum_in_threes = (1..10).enum_for(:each_slice,3)
enum_in_threes.to_a   #=> [[1,2,3],[4,5,6],[7,8,9],[10]]
```

###### Enumerators are Generators and Filters

###### Lazy Enumerators in Ruby 2
正如从存在的集合生成枚举符，你也可以创建一个枚举符，然后将代码块传给它。当枚举符对象需要提供一个最新的值给你的项目时，可以使用代码块中的代码。但是代码块中的代码不是从上到下的执行，而是和你项目中的其他代码并行执行。从上开始执行，到产生了一个数值停止。当需要下一个值时，执行重新开始。这就是你可以通过枚举符生成无限的结果。

```ruby
triangular_numbers = Enumerator.new do |yielder|
	number = 0
	count = 1
	loop do 
		number += count
		count  += 1
		yielder.yield number
	end
end

5.times { print triangular_numbers.next, " "}
puts
```

输出结果：

```
1 3 6 10 15
```

枚举符对象仍然是可以枚举的，意味着我们可以使用Enumerable的方法。

```ruby
triangular_numbers = Enumerator.new do |yielder|
	number = 0
	count = 1
	loop do 
		number += count
		count += 1
		yielder.yield number
	end
end

p trianguler_numbers.first(5)
```

输出结果：

```
[1,3,6,10,15]
```

...

###### Lazy Enumerators in Ruby2

###### Blocks for Transactions
除了作为迭代器的主体，block也可以用于定义一段代码，在一定的事务控制下去执行。例如，我经常打开一个文件，根据文件内容做一些事情，然后当结束的时候一定要关闭文件。尽管你可以使用常规的线性的代码去写这个功能，但是如果使用代码块会更加简单一些。

```ruby
class File
	def self.open_and_process(*args)
		f = File.open(*args)
		yield f
		f.close()
	end
end

File.open_and_process("testfile","r") do |file|
	while line = file.gets
		puts line
	end
end
```

输出结果是：

```
this is line one
this is line two
this is line three
and so on...
```

由Ruby直接支持的File类的文件管理自己生命周期的技术十分有用。如果`File.open`伴随着一个代码块，那么这个代码块将直接操作这个文件对象，代码块执行结束，文件被关闭。这就非常有趣了，因为这就意味这`File.open`有两个不同的行为方法。当伴随着代码块调用时，将执行代码块并关闭文件，如果不带代码块，直接返回文件对象。这种判断通过`block_given?`可以很容易判断，如果有代码块，将返回`true`，否则为`fault`。

```ruby
class File
	def self.my_open(*args)
		result = file = File.new(*args)
		if block_given?
			result = yield file
			file.close
		end
		result
	end
end
```

###### Blocks Can Be Objects
记得我们曾说过你可以将代码块看作一个暗在的参数传入某个方法吗？其实，你可以将这个参数变得更加明确。如果在方法中最后的参数以&作为前缀，Ruby会自动寻找代码块。代码块被转换成类Proc的一个对象，传递给参数。然后你可以将这些参数等同看成任何其他的参数。

下面是一个例子，我们在一个实例方法中创建了一个proc对象，将其存为一个实例变量。然后我们可以在第二个实例方法中调用这个proc。

```ruby
class ProcExample
	def pass_in_block(&action)
		@stored_proc = action
	end

	def use_proc(parameter)
		@stored_proc.call(parameter)
	end
end

eg = ProcExample.new
eg.pass_in_block {|param| puts "The parameter is #{param}"}
eg.use_proc(99)
```

输出结果：

```
The parameter is 00
```

许多程序员使用这种方法储存而后调用代码块——这是一种执行回调，分表等的好方法。但是你可以再进一步。如果可以通过使用&前缀参数将一个代码块转换为对象传递给方法，那么如果一个方法转换为一个Proc对象被`caller`调用又会如何你呢？

```ruby
def create_block_object(&block)
	block
end

bo = create_block_object {|param| puts "You called me wht #{param}"}

bo.call 99
bo.call "cat"
end
```

输出结果：

```
You call me with 99
You call me with cat
```

实事上，Ruby不止一个，而是用两种方法将代码块转换为对象。`lambda`和`Proc.new`都可以操作代码块，将其转换为Proc对象。两者的区别我们会在以后说明。

```ruby
bo = lambda {|param| puts "You called me with #{param}"}
bo.call 99
bo.call "cat"
```
输出结果：

```
You call me with 99
You call me with cat
```