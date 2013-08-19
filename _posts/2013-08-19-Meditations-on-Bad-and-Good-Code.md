---
layout: post
category: Ruby
---
在这个练习中，目标是先要产生一些不良的代码，然后一边解释为什么这样改，一边慢慢的完善它。我一般会从一个非常简单的问题开始，然后加上一些怪异的部分，确保它执行起来比较糟糕。

确保写出糟糕的代码，而又不需要较劲脑汁想出比它应该的样子差的代码的方式就是削减一些Ruby关键的组织工具。

####把井字游戏作为一个单独的过程去执行
我选择了[井字游戏](http://en.wikipedia.org/wiki/Tic-Tac-Toe)作为我们要关注的实例，因为它只需要一些简单的规则，而且适合有基本编程技巧的人。

实时上，如果你忽略了游戏结束的条件和错误处理，你可以用几行代码，很简单的写出这个两人游戏。

```ruby
board = [[nil,nil,nil],
				 [nil,nil,nil],
				 [nil,nil,nil]]

players = [:X, :O].cycle

loop do 
	current_player = players.next
	puts board.map {|row| row.map{|e| e || " "}.join("|")}.join("\n")
	print "\n>>"
	row, col = gets.split.map {|e| e.to_i}
	puts
	board[row][col] = current_play
end
```
但是，魔鬼在细节中。 为了得到一个完整的可以玩的游戏，你需要一些基本的错误判断保证你不会超出棋谱的边界，也会放到对方棋子上面。你也需要判断什么时候某人胜出，或者游戏打平。然后这些看上去不需要太多的工作，在下面的代码中你将看到我们增加了一点复杂度。

```ruby
board   = [[nil,nil,nil],
           [nil,nil,nil],
           [nil,nil,nil]]

left_diagonal  = [[0,0],[1,1],[2,2]]
right_diagonal = [[2,0],[1,1],[0,2]]

players = [:X, :O].cycle

current_player = players.next

loop do
  puts board.map { |row| row.map { |e| e || " " }.join("|") }.join("\n")
  print "\n>> "
  row, col = gets.split.map { |e| e.to_i }
  puts

  begin
    cell_contents = board.fetch(row).fetch(col)
  rescue IndexError
    puts "Out of bounds, try another position"
    next
  end

  if cell_contents
    puts "Cell occupied, try another position"
    next
  end

  board[row][col] = current_player

  lines = []

  [left_diagonal, right_diagonal].each do |line|
    lines << line if line.include?([row,col])
  end

  lines << (0..2).map { |c1| [row, c1] }
  lines << (0..2).map { |r1| [r1, col] }

  win = lines.any? do |line|
    line.all? { |row,col| board[row][col] == current_player }
  end

  if win
    puts "#{current_player} wins!"
    exit
  end

  if board.flatten.compact.length == 9
    puts "It's a draw!"
    exit
  end

  current_player = players.next
end
```
尽管相对简短了一些，你需要通读一边整个脚本，真正理解每一步的操作。当然，这个脚本不是凭空而出的，存在一个思考的迈路得出整个脚本。如果好奇，你可以跟着[这个思想导图](https://gist.github.com/sandal/24ef3c8209877c1946bb)一步一步研究这段代码。希望这个思想导图注解能给你一点对于真个项目的感觉。

####接下来呢？
你可以自己放在github中，没改一处，在commit中明确标出改动的理由。
我也会讲一下我改动的每一步及其原因。我也将总结一些从这些技术中获得的经验，希望你能有所收获。


