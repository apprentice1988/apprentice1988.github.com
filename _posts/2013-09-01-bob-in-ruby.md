---
layout: post
category: exercism
---
[exercism](exercism.io)是一个通过互相帮助，不断优化几个小练习代码的方式规范大家写代码的习惯，提高大家的代码质量的网站。在这里推荐给大家。
bob是exercism项目中ruby语言的第一个练习。练习说明：
>Bob is a lackadaisical teenager. In conversation, his responses are very limited.
>Bob answers 'Sure.' if you ask him a question.
>He answers 'Woah, chill out!' if you yell at him (ALL CAPS).
>He says 'Fine. Be that way!' if you address him without actually saying anything.
>He answers 'Whatever.' to anything else.
练习的任务是要通过自己写代码通过test，test文件如下：

```ruby
require 'minitest/autorun'

begin
  require_relative 'bob'
rescue LoadError => e
  eval("\"#{DATA.read}\n\"").split("\n.\n").each_with_index do |s,i|
    if i > 0
      puts "\t--- press a key to continue ---"
      gets
    end
    puts "\n\n", s, "\n\n\n"
  end
  exit!
end

class TeenagerTest < MiniTest::Unit::TestCase
  attr_reader :teenager

  def setup
    @teenager = ::Bob.new
  end

  def test_stating_something
    assert_equal 'Whatever.', teenager.hey('Tom-ay-to, tom-aaaah-to.')
  end

  def test_shouting
    assert_equal 'Woah, chill out!', teenager.hey('WATCH OUT!')
  end

  def test_asking_a_question
    assert_equal 'Sure.', teenager.hey('Does this cryogenic chamber make me look fat?')
  end

  def test_asking_a_numeric_question
    assert_equal 'Sure.', teenager.hey('You are, what, like 15?')
  end

  def test_talking_forcefully
    assert_equal 'Whatever.', teenager.hey("Let's go make out behind the gym!")
  end

  def test_using_acronyms_in_regular_speech
    assert_equal 'Whatever.', teenager.hey("It's OK if you don't want to go to the DMV.")
  end

  def test_forceful_questions
    assert_equal 'Woah, chill out!', teenager.hey('WHAT THE HELL WERE YOU THINKING?')
  end

  def test_shouting_numbers
    assert_equal 'Woah, chill out!', teenager.hey('1, 2, 3 GO!')
  end

  def test_shouting_with_special_characters
    assert_equal 'Woah, chill out!', teenager.hey('ZOMG THE %^*@#$(*^ ZOMBIES ARE COMING!!11!!1!')
  end

  def test_shouting_with_no_exclamation_mark
    assert_equal 'Woah, chill out!', teenager.hey('I HATE YOU')
  end

  def test_statement_containing_question_mark
    assert_equal 'Whatever.', teenager.hey('Ending with ? means a question.')
  end

  def test_prattling_on
    assert_equal 'Sure.', teenager.hey("Wait! Hang on. Are you going to be OK?")
  end

  def test_silence
    assert_equal 'Fine. Be that way!', teenager.hey('')
  end

  def test_prolonged_silence
    assert_equal 'Fine. Be that way!', teenager.hey('    ')
  end
end
```
这篇博文记录我八次提交代码的内容及其rubist朋友给我的nitpicks，借此帮助我梳理一下代码优化的过程。

#####第一次提交

```ruby
class Bob
  def hey(word)
    case word
    when "Tom-ay-to, tom-aaaah-to." , "Let's go make out behind the gym!" , "It's OK if you don't want to go to the DMV." , 'Ending with ? means a question.'
      "Whatever."
    when "WATCH OUT!" , 'WHAT THE HELL WERE YOU THINKING?' , '1, 2, 3 GO!' , 'ZOMG THE %^*@#$(*^ ZOMBIES ARE COMING!!11!!1!' , 'I HATE YOU'
        "Woah, chill out!"
    when "Wait! Hang on. Are you going to be OK?" , "Does this cryogenic chamber make me look fat?" ,"You are, what, like 15?"
        "Sure."
    when  '' , '    '
        'Fine. Be that way!'
    end
  end
end
```
此次提交的nitpicks：
>You're passing the tests, I suppose, but not really the intent of the  test suite. They descrite Bob as responding "Whatever." to anything, but your Bob will respond `nil` to most things.
>Can you capture the intent of the different cases better?
这才意识到自己为了通过test写的代码，而忽略了对于事物本事Bob的特质分析。


#####第二次改动提交

```ruby
class Bob
  def hey(word)
    case word
    when "WATCH OUT!" , 'WHAT THE HELL WERE YOU THINKING?' , '1, 2, 3 GO!' , 'ZOMG THE %^*@#$(*^ ZOMBIES ARE COMING!!11!!1!' , 'I HATE YOU'
        "Woah, chill out!"
    when "Wait! Hang on. Are you going to be OK?" , "Does this cryogenic chamber make me look fat?" ,"You are, what, like 15?"
        "Sure."
    when  '' , '    '
        'Fine. Be that way!'
    else
      "Whatever."
    end
  end
end
```
nitpicks：
>Ok, now Bob is responding "Whatever." to most thinds. But if I ask him "Hey, Bob, are you Ok?", or some other question not listed, he'll answer "Whatever.".Same thing if I yell at him in ways not covered by the code. or if I give him a very lengty silent treatment.
>Can you get Bob to answer "Sure". to any question, "Woah,chill out!" to any screwaming, etc?
>You are also failing one of the tests as far as I can see:
`TeenagerTest#test_more_silence`.
好吧，我承认自己写代码觉悟低，第二次提交代码的时候还没有真正明白上一个nitpicks的意思，自己和test中的例子较上劲了。


#####第三次提交

```ruby
class Bob
  def hey(word)
    case 
    when word.strip.empty?
        'Fine. Be that way!'
    when word.match(/[a-z]/).nil?
        "Woah, chill out!"
    when !word.match(/[?]$/).nil?
        "Sure."
    else
      "Whatever."
    end
  end
end
```
nitpicks：
>Good. Now your implementation is much more general.
>The readme and tests talk about Bob in terms of how he reacts to questions, yelling, silence etc, but we don't see those concepts in the code. I think good code shows the "why", not just the "how".
>Why are you stripping and checking empty? Why are you looking for question marks at the end of a string? Can you give these conditions names that reveal what they are about?
这次终于有点进步了。这次提交的代码分析Bob的特质，从而是代码更具有普遍性。但是不足的地方是代码缺少可读性。很赞同我的老师的那句话，我认为好的代码不该体现出为什么是这样，而不只是如何执行。
  #####第四次提交

  ```ruby
  class Bob
  def hey(word)
    @word = word
    #a question usually end with ?
    def ask_a_question
        return @word.end_with?("?") ? true : false
    end

    #what you yell at him are all uppercased
    def yell
        return  @word.match(/[a-z]/).nil?? true : false
    end

    #you address him without actually anything, like "" and "  "
    def address_him_without_anything
        return @word.strip.empty?? true : false
    end

    case
    when address_him_without_anything
        'Fine. Be that way!'
    when yell
        "Woah, chill out!"
    when ask_a_question
        "Sure."
    else
      "Whatever."
    end
  end
end
```
nitpicks：
>Good names!
>You are defining methods inside a method. I think want to move those definitions out of `Bob#hey`.
>Also, in Ruby, you don't need explicit returns.
为了增加代码的可读性，我尝试着添加了comment。其实ruby语言本身的有点就是可读性强，所以如果用增加comment的方式才能让别人看明白这段代码，那真的有必要思考一下代码是不是有优化的空间。


#####第五次提交

```ruby
class Bob
  def hey(word)
    case
    when address_him_without_anything(word)
        'Fine. Be that way!'
    when yell(word)
        "Woah, chill out!"
    when ask_a_question(word)
        "Sure."
    else
      "Whatever."
    end
  end

  private 
  #a question usually end with ?
  def ask_a_question word
    word.end_with?("?") ? true : false
  end

  #what you yell at him are all uppercased
  def yell word
    word.match(/[a-z]/).nil?? true : false
  end

  #you address him without actually anything, like "" and "  "
  def address_him_without_anything word
    word.strip.empty?? true : false
  end
end
```
nitpicks:
>Some more nits:
>Your methods are used for their boolean value. Such predicate methods are commonly named with a question mark at the end, like so: yell?.
>You don't need the ternary if when all you do is `condition ? ture : false`.The condition is already truthy or falsy, so it can be returned directly.
>For yelling, have you lookat at `String#upcase`? I think it would be more expressive than the regex.
>A higher level nit:
>Your predicate methods are only concerned with the input word, not with the rest of Bob. Determining if some string is yelling, silent or a question is a responsibility that isn't necessarily related to Bob. To me, this indicates that there is room for another class. What do you think?
三个小技巧，第一预测判断类方法建议使用`？`结尾的方法名;第二是使用三元法返回bollean值;第三条就是我的水平比较低了，把这个方法忘记了。对于更高层次的建议，因为我的判断方法都是围绕`word`展开，所以考虑将这类方法放在更适合他的类中。

#####第六次提交
```ruby
class Bob
    def hey word
        case
        when WhatSay.is_without_anything?(word)
            'Fine. Be that way!'
        when WhatSay.is_yelling?(word)
            "Woah, chill out!"
        when WhatSay.is_a_question?(word)
            "Sure."
        else
          "Whatever."
        end
    end
end 

class WhatSay
    #a question usually end with ?
    def self.is_a_question? word
        word.end_with?("?")
    end

    #what you yell at him are all uppercased
    def self.is_yelling? word
        word.upcase == word
    end

    #you address him without actually anything, like "" and "  "
    def self.is_without_anything? word
        word.strip.empty?
    end
end
```
nitpicks：
>Hi again.
>Having the methods on WhatSay at the class level means that you have to keep passing word in on every call. You can let WhatSay hold on to word. Keep it in an instance variable set in during initialization, and create an instance of WhatSay in hey to use. I'm sure your code will look cleaner, and instances have a lot of flexibility if you ever have to refactor to make room for changes.
>Another minor nit: rubyists often feel that the question mark at the end of predicate methods are enough to mark them as such. The is_ prefix is redundant. Consider dropping it.
>I feel like you're getting close to done on this exercise – your code is much more expressive now. Would you consider dropping the comments? I don't think they add much anymore. The method name gives the why, and the method body is expressive enough to not need explaining.
`WhatSay`这个类，其实本质上就是围绕word的，所以word作为类的实例去处理会更加合适，而不是仅仅作为实例变量，这样无形中给类的实例增加了不必要的字段。

#####第七次提交
```ruby
class Bob
  def hey word
    @what_say = WhatSay.new(word)
    case
    when @what_say.without_anything?
        'Fine. Be that way!'
    when @what_say.yelling?
        "Woah, chill out!"
    when @what_say.question?
        "Sure."
    else
      "Whatever."
    end
  end
end 

class WhatSay
  def initialize(word)
      @word = word
  end

  def question?
      @word.end_with?("?")
  end

  def yelling?
      @word.upcase == @word
  end

  def without_anything?
      @word.strip.empty?
  end
end
```
nitpicks:
>teacher:You don't need `@what_say` to be an instance variable. A local var would have been fine.
>me:Sorry, I can't totally understand your nit. Do you think I'd better replace `@what_say`with`what_say`? If so, can you tell me why it's better? Thanks a lot
>teacher:Yes, that's exactly what I meant. If you assign to an instance variable, that becomes state on the object and hangs around after the method is done.Calling `Bob#hey` will change bob. A local variable doesn't carry that baggage.
你如果定义了一个实例变量，方法执行结束后，该boject还会存在。但是如果用一个local变量，当方法结束后，该变量空间会被收回。

#####第八次提交

```ruby
class Bob
  def hey word
    what_say = WhatSay.new(word)
    case
    when what_say.without_anything?
      'Fine. Be that way!'
    when what_say.yelling?
      "Woah, chill out!"
    when what_say.question?
      "Sure."
    else
      "Whatever."
    end
  end
end 

class WhatSay

  def initialize(word)
    @word = word
  end

  def question?
    @word.end_with?("?")
  end

  def yelling?
    @word.upcase == @word
  end

  def without_anything?
    @word.strip.empty?
  end
end
```