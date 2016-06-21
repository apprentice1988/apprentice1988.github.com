---
layout: post
category: Piecemeal Ruby
---
首先，我们应该介绍一些关于Rake自身的一些背景知识。

####介绍
如果你去查看[https://github.com/jimweirich/rake](GitHub repository)，你会发现Rake被描述为：

>A make-like build utility for Ruby.

那么，除了你了解make，这个描述将没有多少对Rake加深了解的内容。[http://docs.rubyrake.org/tutorial/index.html](Rake turorial)中是这样描写Rake的：

> A build tool, written in Ruby, using Ruby as a build language.

好的，到目前为止，我们看到了'build'术语。如果你对Make没有太多的了解，你很可能不会对一个'build tool/utility'有特别深的了解。我相信[http://en.wikipedia.org/wiki/Rake_(software%3E)](Wikipedia article for Rake) 会更好的总结描述Rake：

> A software task management tool. It allows your to specify and describe dependencies as well as to group tasks in a namespace.

但是，现在我将模糊的一个术语'build tool'替换成了'task management tool'。现在，我们可以更具体的描述Rake：

* rake让你定义tasks
* tasks 可以依赖其他的任务
* tasks 如果需要可以被唯一的执行
* task 只被执行一次

然而，我们仍然需要对于任务下一个定义。因为你使用ruby定义任务，所以你的任务可以做你使用Ruby所能做到的事情。这就意味着在task中你可以实现相当对的事情。

#### Rakefile 格式
这里我们先介绍一点基础的，例如下面的例子：

```ruby
task "hello" do 
	puts "hello, world"
end
```

你应该把上述代码放在Rakefile.rb文件中。'task'方法是阐述任务的方法，将任务的名字作为参数传入，然后以block的方式描述task执行的动作。

```ruby
$ rake hello	
Hello, world
```

#### 全局任务
典型的做法是通过在放置于项目根目录的'Rakefile'文件中定义任务，每一个项目都定义了Rake任务。但是，这不是唯一可以定义Rake任务的地方;事实上，Rake可以使你定义全局任务，这样即使在没有'Rakefile'文件的目录中也可以执行任务。

- 第一部是创建'~/.rake'目录，放置任务定义的文件：

```
$ mkdir ~/.rake
```

- 接下来创建任务定义的文件，文件面不重要，但是一定要有'.rake'的扩展名:

```
toush ~/.rake/hello.rake
```

- 将任务添加在文件中：

```
$echo -e 'task "hello" do \n puts "hello, World"\nend' > ~/.rake/hello.rake
```

#### 有用的例子
有一个场景下面的代码可能会比较顺手：假设你正在Rails的一个特定的分支进行开发，该分支有migration的动作，你需要切换分支，但是其他分支该migration不适宜被执行。在这种场合你会怎么做？

当然，你需要决定在特定的分支时执行该migration，其他分支roll back migration：

```ruby
$ VERSION=<version> rake db:migrate:down
```

将如下代码写入文件：

```ruby
desc 'rolls back migrations in current branch not present in other'
task :rollback_branch_migrations, [:other_branch] do |t, args|
  load "#{Dir.pwd}/Rakefile"
 
  branch_migrations = BranchMigrations.new(args.other_branch)
 
  puts ['Rollback the following migrations', branch_migrations, 'y,n? ']
  next if %w[no n NO N].include?(STDIN.gets.chomp)
 
  migrate_task = Rake::Task['db:migrate:down']
 
  branch_migrations.each_version do |version|
    ENV['VERSION'] = version
    migrate_task.execute
  end
 
  puts 'Will probably need to discard changes to db/schema.rb'
end
 
class BranchMigrations
  def initialize other_branch
    @other_branch = other_branch
  end
 
  attr_reader :other_branch
 
  def each_version
    filenames.each do |filename|
      yield filename.split('_')[0]
    end
  end
 
  def filenames
    list.map { |migration_path| migration_path.match(%r{/(\d+.*)\z})[1] }
  end
 
  def list
    @list ||= begin
      list = %x{git diff #{other_branch} --name-only --diff-filter=A db/migrate/}
      list.split.reverse
    end
  end
 
  def to_ary; filenames end
end
```

接下来执行该任务：

```ruby
$ rake -g rollback_branch_migrations[master]
```
这里我们假设`master`为我们想要更改的分支。向Rake 任务传递参数，需要在外面套用中括号。

#### Task Prerequisites
任何的Rake任务都可以选择性的有一个或多个先决条件-也可以理解为依赖。伴随着任意其他的任务，一个条件任务再需要的时候只被执行一次。

让我们开始在我们的Rakefile中定一个两个任务：

```ruby
task 'one' do 
  puts 'one'
end

task 'two' do 
  puts 'two'
end
```

在shell中我们可以执行：

```
$ rake one
one
$ rake two
two
```

现在我们将任务'one'设置为'two'的先决任务：

```ruby
task 'one' do 
  puts 'one'
end

task 'two' => ['one'] do  
  puts 'two'
end
```

如果先决条件只有一个，可以省略`[]`。

#### File tasks
对于文件，Rake有特别的方法：`file`. 文件任务和一般的任务很相近。

```ruby
file 'foo.txt' do 
  touch 'foo.txt'
end
```
尽管文件任务是处理文件的，但是如果该文件不存在，已然会创建该文件。

执行任务：

```
$ rake foo.txt
touch foo.txt
$ ls
foo.txt
```

如果文件任务的先决条件是另一个文件，你不需要为这个先决文件创建一个专门的文件任务，只是使用该文件名就可以了，如下例子：

```ruby
$ ls
bar.txt
$ rake foo.txt
touch foo.txt
$ rake foo.txt # running file task again, but no output
$ ls
bar.txt foo.txt
```

#### 有用的例子
在rails应用中，有一些配置文件对于应用的执行很关键。但是因为这些文件包含了一些比较敏感的信息，我们选择将这些文件加入`.gitignore`,而是添加一个`.example`文件添加以下类似的信息数据，以让后来人知道需要设置的东西。这样，我们可以使用Rake去简化由`.example`文件生成配置文件的过程。

```ruby
file 'config/database.yml' => 'config/database.yml.example' do
  cp 'config/database.yml.example', 'config/database.yml'
end
```

可以简化代码为：

```ruby
file 'config/database.yml' => 'config/database.yml.example' do |task|
  cp task.prerequisites.first, task.name
end
```