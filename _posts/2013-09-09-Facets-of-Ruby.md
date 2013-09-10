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





