---
layout: post
category: Piecemeal Ruby
---
大部分的Rubyists都知道，我们可以在`case`表达的`when`分支中使用字符，类，区间和正则表达：

```ruby
case something
when Array then ...
when 1..10 then ...
when /some_regexp/ then ...
end
```

假如你知道`case`依赖为条件判断提供设计的`===`，那么就可以把上面的代码转换为：

```ruby
case something
when Array === something then ...
when 1..100 === something then ...
when /some_regexp/ === something then ...
end 
```

也许也会有点惊奇的发现，`===`在Proc类中也有定义，用来创建procs和lambdas。将`===`及其右边的值作为参数，和直接调用`Proc#call`方法一样。

```ruby
is_even = ->(n) {n.even?}
is_even === 5   #=> false

#same as
is_even.call(5)
```

这就给了我们一个可能性，我们可能在when分支中使用procs或者lambdas。下面是一个琐碎的例子：

```ruby
def even?
	->(n) { n.even? }
end

def odd?
	->(n) {n.odd?}
end

case x
when even? then puts "even"
when odd? then puts "odd"
else puts "zero"
end
```

为了节省几行代码，也可以直接在行里用labdas表述：

```ruby
case x
when ->(n) {n.even?} then puts "even"
when ->(n) {n.odd?} then puts "odd"
else puts "zero"
end
```

如果用lambads携带一些附加的参数，可能会更好。看一下这个检查HTTP相应的例子：

```ruby
def response_code?(code)
	->(response) {response.code == code}
end

case response
when response_code?(200) then "ok"
when response_code?(404) then "Not found"
else "Unknown code"
end
```

怎么样，这样是不是很简练了？