# shell 编程 （入门）

## Hello Word

- `#!/bin/bash` 必须放在第一行
- `#!` 是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行，即使用哪一种 Shell
- 扩展名并不影响脚本执行，但为了见名知意就，脚本的文件扩展名为 `.sh`，

```shell
#!/bin/bash
echo "Hello World !"
```

```shell
chmod +x ./test.sh  # 使脚本具有执行权限
./test.sh  # 执行脚本
# 或者
sh ./test.sh
```

## 变量

- **变量名和等号之间不能有空格**
- 命名只能使用英文字母，数字和下划线，首个字符不能以数字开头
- 中间不能有空格，可以使用下划线（\_）
- 不能使用标点符号
- 不能使用 bash 里的关键字

```shell
# 正确的变量
RUNOOB
LD_LIBRARY_PATH
_var
var2

# 无效的变量
?var
user*name

# 变量使用
your_name="qinjx"
echo $your_name
echo ${your_name}

# 只读变量，只读变量的值不能被改变
myUrl="http://www.w3cschool.cc"
readonly myUrl
myUrl="http://www.runoob.com" # /bin/sh: NAME: This variable is read only.

# 删除变量
myUrl="http://www.runoob.com"
unset myUrl
echo $myUrl
```

## 字符串

```shell
# 单引号
# 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的
# 单引号字串中不能出现单引号（对单引号使用转义符后也不行）
str1='this is a string'

# 双引号
# 双引号里可以有变量
# 双引号里可以出现转义字符
str2="Hello, I know you are \"$your_name\"! \n"

# 字符串拼接
your_name="qinjx"
greeting="hello, "$your_name" !"
greeting_1="hello, ${your_name} !"
echo $greeting $greeting_1

# 获取字符串长度
string="abcd"
echo ${#string} # 输出 4

# 提取字符串
string="runoob is a great site"
echo ${string:1:4} # 输出 unoo

# 字符串查找
string="runoob is a great company"
echo `expr index "$string" is`  # 输出 8
```

### 变量类型

- `局部变量` : 局部变量在脚本或命令中定义，仅在当前 shell 实例中有效，其他 shell 启动的程序不能访问局部变量。
- `环境变量` : 所有的程序，包括 shell 启动的程序，都能访问环境变量，有些程序需要环境变量来保证其正常运行。必要的时候 shell 脚本也可以定义环境变量。
- `shell变量` : shell 变量是由 shell 程序设置的特殊变量。shell 变量中有一部分是环境变量，有一部分是局部变量，这些变量保证了 shell 的正常运行

## 数组

> 数组中可以存放多个值。Bash Shell 只支持一维数组（不支持多维数组），初始化时不需要定义数组大小（与 PHP 类似）。与大部分编程语言类似，数组元素的下标由 0 开始。Shell 数组用括号来表示，元素用"空格"符号分割开，语法格式如下：`array_name=(value1 ... valuen)`

```shell
# 数组定义
my_array=(A B "C" D)
# 或者
array_name[0]=value0
array_name[1]=value1
array_name[2]=value2

# 数组读取
# ${array_name[index]}
echo "第一个元素为: ${my_array[0]}"
echo "第二个元素为: ${my_array[1]}"
echo "第三个元素为: ${my_array[2]}"
echo "第四个元素为: ${my_array[3]}"

# 获取所有元素
echo "数组的元素为: ${my_array[*]}"
echo "数组的元素为: ${my_array[@]}"

# 获取数组长度
echo "数组元素个数为: ${#my_array[*]}"
echo "数组元素个数为: ${#my_array[@]}"
```

## 注释

```shell
# 单行注释
# shell 里没有多行注释，因此要达到多行注释的效果，除了一行一行加 # 号。或者可以把这一段要注释的代码用一对花括号括起来，定义成一个函数，没有地方调用这个函数，这块代码就不会执行，达到了和注释一样的效果

:<<EOF
注释内容...
注释内容...
注释内容...
EOF

:<<'
注释内容...
注释内容...
注释内容...
'

:<<!
注释内容...
注释内容...
注释内容...
!
```

## 运算符

- 算数运算符
  - `+` : 加法
  - `-` : 减法
  - `*` : 乘法
  - `/` : 除法
  - `%` : 取余
  - `=` : 赋值
  - `==` : 相等
  - `!=` : 不相等
- 关系运算符
  - `-eq` : 检测两个数是否相等
  - `-ne` : 检测两个数是否不相等
  - `-gt` : 检测左边的数是否大于右边的
  - `-lt` : 检测左边的数是否小于右边的
  - `-ge` : 检测左边的数是否大于等于右边的
  - `-le` : 检测左边的数是否小于等于右边的
- 布尔运算符
  - `!` : 非运算
  - `-o` : 或运算
  - `-a` : 与运算
- 逻辑运算符
  - `&&` : 逻辑的 `AND`
  - `||` : 逻辑的 `OR`
- 字符串运算符
  - `=` : 检测两个字符串是否相等
  - `!=` : 检测两个字符串是否相等
  - `-z` : 检测字符串长度是否为 0
  - `-n` : 检测字符串长度是否为 0
  - `str` : 检测字符串 str 是否为空
- 文件测试运算符
  - `-b file` : 检测文件是否是块设备文件
  - `-c file` : 检测文件是否是字符设备文件
  - `-d file` : 检测文件是否是目录
  - `-f file` : 检测文件是否是普通文件（既不是目录，也不是设备文件）
  - `-g file` : 检测文件是否设置了 SGID 位
  - `-k file` : 检测文件是否设置了粘着位(Sticky Bit)
  - `-p file` : 检测文件是否是有名管道
  - `-u file` : 检测文件是否设置了 SUID 位
  - `-r file` : 检测文件是否可读
  - `-w file` : 检测文件是否可写
  - `-x file` : 检测文件是否可执行
  - `-s file` : 检测文件是否为空（文件大小是否大于 0）
  - `-e file` : 检测文件（包括目录）是否存在

## 流程控制

### if else

```shell
# if
# if condition; then
# 	command1
# 	command2
# 	...
# 	commandN
# fi

# if else
# if condition; then
# 	command1
# 	command2
# 	...
# 	commandN
# else
# 	command
# fi

# if else-if else
# if condition1; then
# 	command1
# elif condition2; then
# 	command2
# else
# 	commandN
# fi

# 下实例判断两个变量是否相等
a=10
b=20
if [ $a == $b ]; then
	echo "a 等于 b"
elif [ $a -gt $b ]; then
	echo "a 大于 b"
elif [ $a -lt $b ]; then
	echo "a 小于 b"
else
	echo "没有符合的条件"
fi
```

### for

```shell
# for var in item1 item2 ... itemN; do
# 	command1
# 	command2
# 	...
# 	commandN
# done

for loop in 1 2 3 4 5; do
	echo "The value is: $loop"
done

for str in 'This is a string'; do
	echo $str
done
```

### while

```shell
# while
# 	condition; do
# 	command
# done

int=1
while
	(($int <= 5)); do
	echo $int
	let "int++"
done

echo '按下 <CTRL-D> 退出'
echo -n '输入你最喜欢的网站名: '
while
	read FILM; do
	echo "是的！$FILM 是一个好网站"
done
```

### until

```shell
# ntil 循环执行一系列命令直至条件为 true 时停止
# until 循环与 while 循环在处理方式上刚好相反
# until
# 	condition; do
# 	command
# done
a=0
until
	[ ! $a -lt 10 ]; do
	echo $a
	a=$(expr $a + 1)
done
```

### case

```shell
# case工作方式如下所示。取值后面必须为单词in，每一模式必须以右括号结束。取值可以为变量或常数。匹配发现取值符合某一模式后，其间所有命令开始执行直至 ;;。取值将检测匹配的每一个模式。一旦模式匹配，则执行完匹配模式相应命令后不再继续其他模式。如果无一匹配模式，使用星号 * 捕获该值，再执行后面的命令。
echo '输入 1 到 4 之间的数字:'
echo '你输入的数字为:'
read aNum
case $aNum in
1)
	echo '你选择了 1'
	;;
2)
	echo '你选择了 2'
	;;
3)
	echo '你选择了 3'
	;;
4)
	echo '你选择了 4'
	;;
*)
	echo '你没有输入 1 到 4 之间的数字'
	;;
esac
```

### break

```shell
# break 命令允许跳出所有循环。
# 每个case分支用右圆括号，用两个分号表示 break
while
	:; do
	echo -n "输入 1 到 5 之间的数字:"
	read aNum
	case $aNum in
	1 | 2 | 3 | 4 | 5)
		echo "你输入的数字为 $aNum!"
		;;
	*)
		echo "你输入的数字不是 1 到 5 之间的! 游戏结束"
		break
		;;
	esac
done
```

### continue

```shell
# continue 命令与 break 命令类似，只有一点差别，它不会跳出所有循环，仅仅跳出当前循环
while
	:; do
	echo -n "输入 1 到 5 之间的数字: "
	read aNum
	case $aNum in
	1 | 2 | 3 | 4 | 5)
		echo "你输入的数字为 $aNum!"
		;;
	*)
		echo "你输入的数字不是 1 到 5 之间的!"
		continue
		echo "游戏结束"
		;;
	esac
done
```

## 函数

- 可以带 function fun() 定义，也可以直接 fun() 定义，不带任何参数
- 参数返回，可以显示加：return 返回，如果不加，将以最后一条命令运行结果，作为返回值

```shell
# 无返回值
demoFun() {
	echo "这是我的第一个 shell 函数!"
}
echo "-----函数开始执行-----"
demoFun
echo "-----函数执行完毕-----"

# 有返回值
funWithReturn() {
	echo "这个函数会对输入的两个数字进行相加运算..."
	echo "输入第一个数字: "
	read aNum
	echo "输入第二个数字: "
	read anotherNum
	echo "两个数字分别为 $aNum 和 $anotherNum !"
	return $(($aNum + $anotherNum))
}
funWithReturn
echo "输入的两个数字之和为 $? !"

# 函数参数
funWithParam() {
	echo "第一个参数为 $1 !"
	echo "第二个参数为 $2 !"
	echo "第十个参数为 ${10} !"
	echo "第十一个参数为 ${11} !"
	echo "参数总数有 $# 个!"
	echo "作为一个字符串输出所有参数 $* !"
}
funWithParam 1 2 3 4 5 6 7 8 9 34 73
```

## 参数传递

- 使用与函数和执行脚本时候传递的参数
- `$n` 的形式来获取参数的值，当 `n>=10` 时，需要使用 `${n}` 来获取参数
- `$0` : 运行脚本的名称
- `$#` : 传递到脚本的参数个数
- `$*` : 以一个单字符串显示所有向脚本传递的参数
- `$$` : 脚本运行的当前进程 ID 号
- `$!` : 后台运行的最后一个进程的 ID 号
- `$@` : 与$\*相同，但是使用时加引号，并在引号中返回每个参数。
- `$-` : 显示 Shell 使用的当前选项，与 set 命令功能相同。
- `$?` : 显示最后命令的退出状态。0 表示没有错误，其他任何值表明有错误。

## `[]` 和 `[[]]` 的区别

- `[]` : `[`是一条命令， 与 `test` 等价，大多数 shell 都支持。在现代的大多数 sh 实现中，`[` 与 `test` 是内部(builtin)命令，换句话说执行 `[` 或 `test` 时不会调用 `/some/path/to/test` 这样的外部命令
- `[[]]` : `[[` 是关键字，它就比刚才说的 test 强大的多了。支持字符串的模式匹配（使用=~操作符时甚至支持 shell 的正则表达 式）。逻辑组合可以不使用 test 的 `-a -o` 而使用 `&& ||`。字符串比较时可以把右边的作为一个模式（这是右边的字符串不加双引号的情况下。如果右边的字符串加了双引号，则认为是一个文本字符串。），而不仅仅是一个字符串

## `()` 和 `(())` 的区别

- `()`
  - 命令组 : 括号中的命令将会新开一个子 shell 顺序执行，所以括号中的变量不能够被脚本余下的部分使用。括号中多个命令之间用分号隔开，最后一个命令可以没有分号，各命令和括号之间不必有空格。
  - 命令替换 : 等同于`cmd`，shell 扫描一遍命令行，发现了$(cmd)结构，便将$(cmd)中的 cmd 执行一次，得到其标准输出，再将此输出放到原来命令。有些 shell 不支持，如 tcsh。
  - 用于初始化数组 : 如：array=(a b c d)
- `(())`
  - 整数扩展。这种扩展计算是整数型的计算，不支持浮点型。((exp))结构扩展并计算一个算术表达式的值，如果表达式的结果为 0，那么返回的退出状态码为 1，或者 是"假"，而一个非零值的表达式所返回的退出状态码将为 0，或者是"true"。若是逻辑判断，表达式 exp 为真则为 1,假则为 0。
  - 只要括号中的运算符、表达式符合 C 语言运算规则，都可用在$((exp))中，甚至是三目运算符。作不同进位(如二进制、八进制、十六进制)运算时，输出结果全都自动转化成了十进制。如：echo $((16#5f)) 结果为 95 (16 进位转十进制)
  - 单纯用 `(())` 也可重定义变量值，比如 a=5; ((a++)) 可将 $a 重定义为 6
  - 常用于算术运算比较，双括号中的变量可以不使用$符号前缀。括号内支持多个表达式用逗号分开。 只要括号中的表达式符合 C 语言运算规则,比如可以直接使用 for((i=0;i<5;i++)), 如果不使用双括号, 则为 for i in `seq 0 4`或者 for i in {0..4}。再如可以直接使用 if (($i<5)), 如果不使用双括号, 则为 if [ $i -lt 5 ]。
