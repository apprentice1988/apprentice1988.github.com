---
layout: post
category: Ruby
---
在你的测试中，如果你使用`send`方法去测试私有方法，那基本可以肯定你做错了。大部分的私有方法倾向于如下几类，没有一种需要`send`去测试的：
- 一个方法没有自己的行为（例如一个helper function）
- 只应该对当前事物公开的方法
- 设计有瑕疵需要私有的方法

看一下下面的三个对象，试着去和我们的三类去匹配。

```ruby
class Book
	def initialize(name)
		@name = name
	end

	def available_for_purchase?
		copies_remaining > 0
	end

	private 

	def copies_remaining
		Inventory.count(:book,@name)
	end
end

module Inventory
	extend self

	def count(item_type,name)
		item_class(item_type).find_by_name(name).quantity
	end

	def receive(item_type,name, quantity)
		item_class(item).create(name,quantity)
	end

	private

	def item_class(item_type)
		case item_type
		when :book
			InStockBook
		when :video
			InStockVideo
		end
	end
end

class InStockBook
	def self.titles
		@titles ||= {}
	end

	def self.find_by_name(name)
		titles[name]
	end

	def self.create(name,quantity)
		titles[name]  = new(name,quantity)
	end

	def initialize(name, quantity)
		@title = name
		@quantity = quantity
	end

	attr_reader :title, :quantity

	def isbn
		@isbn ||= isbn_form_service
	end

	private

	def isbn_from_service
		isbn_service_connect

		isbn = @isbn_service.find_isbn_for(@title)

		isbn_service_disconnect

		return isbn
	end

	def isbn_service_connect
		@isbn_service = IsbnService.new
		@isbn_service.connect
	end

	def isbn_service_disconnect
		@isbn_service.disconnect
	end
end
```

如果你猜`Inventory` 是那个不具有外部行为的私有方法，恭喜你答对了。 `Inventory#item_class`的唯一目的就是使`Inventory#count`和`Inventory#receive`方法更容易读，所以，没必要浪费时间写如下测试方法。
```ruby
def test_item_class
	assert_equal InStockBook, Inventory.send(:item_class, :book)
end
```
当提供测试公开接口的时候，可以间接涵盖了`Inventory#item_class`方法。

```ruby
def test_stocking_a_book
	Inventory.receive(:book, "Ruby Best Practices", 100)
	assert_equal 100, Inventory.count(:book, "Ruby Best Practices")
end
```
因为间接的测试一个私有方法，将产生相同和直接测试私有方法相同的代码覆盖范围，所以如果`Inventory#item_class`出错，你将同样会收到报错。然后，专注于测试外部接口，也会使测试更间接，更易于维护。如果一个用户想通过`Inventory#receive`添加书籍，他们不需要了解`InStockBook`,所以可以把它视为执行细节。改变`Inventory#item_class`的定义，甚至直接删除它，都不需要更改这些test，只要你维护对象公开API。

现在我们看完了测试`Inventory`的方法，剩下`Book`和`InStockBook`还没有去讨论。 因为`Book`的问题更显而易见，我们先来处理它。

Book 执行了一个方法`available_for_purchase?`, 这个方法依赖私有方法`copies_remaining`去运行。下面的代码展示了一个比较糟糕的测试。

```ruby
def test_copies_remaining
	book = Book.new("Ruby Best Practices")
	Inventory.receive(book.name, 10)

	assert_equal book.send(:copies_remaining) 10
end
```
测试糟糕的原因是我们依赖`send`去调用私有方法。我们前面的例子的理论是私有方法不需要测试因为他们没有外部行为。但是， `Book#copies_remaining`好像我们真的需要使用它。设想一个电子商务网站的前端页面，很容易视觉化一个物件是否有库存的信息，还有有多少商品可以购买。

经验告诉我们，如果一个方法提供了可感知的行为，我们最好将其变成公开方法。下面的测试代码对我们更自然一些：

```ruby
def test_copies_remaining
	book = Book.new("Ruby Best Practices")
	Inventory.receive(book.name, 10)

	assert_equal book.copies_remaining, 10
end
```
目前为止， 我们看了两个极端情况： 私有方法处理的很正确，我们不需要特意的去测试它，另一个是把私有方法公开以便于我们的测试。 下面我们将验证介于两者之间的另一种情况。

让我们思考一下，如何测试`InStockBook#isbn`

```ruby
class InstockBook

	# .. omitted

	def isbn
		@isbn ||= isbn_form_service
	end
end
```

一种方法是模仿调用`isbn_from_service`,如下：

```ruby
def test_retreive_isbn
	book = InstockBook.new("Ruby Best Practices", 10)
	book.expects(:isbn_form_service).once.returns("978-0-596-52300-8")

	# Verify caching by calling isbn twice but expectin only one service
	#call to be made
	2.times {assert equal "978-0-596-52300-8", @book.isbn}
end
```

通过模仿调用`isbn_from_service`, 我们可以绕开下面的代码，不测试他们。

```ruby
def isbn_from_service
  isbn_service_connect

  isbn = @isbn_service.find_isbn_for(@title)

  isbn_service_disconnect

  return isbn
end

def isbn_service_connect
  @isbn_service = IsbnService.new
  @isbn_service.connect
end

def isbn_service_disconnect
  @isbn_service.disconnect
end
```
把这些方法在`InStockBook`中公开没有道理，但是我们也不能说他们都是可以忽略的执行细节。这种情况下，特别的再设计是很有必要的，把这些方法转换为`IsbnService`类是说的通的。

```ruby
class IsbnService
	def self.find_isbn_for(title)
		service = new

		service.connect
		isbn = service.find_isbn_for(title) #delegate to instance
		service.disconnect

		return isbn
	end

	# ..other functionality
end
```
现在这些方法可以很容易的被测试了，我们不需要跳过`InStockBook`的逻辑。 我们只要重写我们的`InStockBook#isbn`方法，让它引入新的类

```ruby
class InStockBook
	# .. other features omitted

	def isbn
		@isbn ||= IsbnService.find_isbn_for(@title)
	end
end
```
更新	`isbn`测试只需要一点改动去适应我们的改动：

```ruby
def test_retreive_isbn
	book = InstockBook.new("Ruby Best Practices", 10)

	IsbnService.expects(:find_isbn_for).with(book.title).once.return("978-0-596-52300-8")
	
	# Verify caching by calling isbn twice but expecting only one service
  # call to be made
  2.times { assert_equal "978-0-596-52300-8", @book.isbn }
 end
 ```
现在，当看到`InStockBook`的测试时， 我们解决了两难的局面，我们现在可以在避免测试私有方法的情况下不牺牲测试的简洁和覆盖范围。