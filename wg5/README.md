# WebGIS

--------------------------------------------------------------------------
## 开发配置
```shell
npm config set registry http://192.168.15.7:4873/
npm install -g asws typescript@rc typings gulp
npm install
typings install
```

## Setup IDE

### 1. WebStorm

In File -> Settings -> Languages & Frameworks -> TypeScript,
Check on "Enable TypeScript Compiler" and "Use tsconfig.json".

Set compiler version to "lib" folder under the globally install typescript npm module folder
(i.e. C:\Users\<user>\AppData\Roaming\npm\node_modules\typescript\lib).

## Run
```
asws --port <port>
```
Browse http://localhost:<port>/


## 开发约定

1. 文件夹名,使用Camel
    * 例如 User Manager 使用 userManager

2. 类名,Pascal
    * 例如 User Manager 使用 UserManager

3. 类成员:
    1. public的,使用Camel
    2. private,protected,使用Camel后接"_"
        * 例如 User Manager 使用 userManager_


## 配置文件

### 1. 引入其它配置文件

```javascript

// config-base.js
define({
    values: {
        base1: 1,
        base2: 2,
        base3: 3
    }
})

// values.js 
define({
    base2: 20,
    value1: 11,
    value2: 12,
})

// config.js
define({
    $includes: {
        'config-base': null,
        'values': 'values'
    },
    values: {
        base3: 300,
        value2: 112,
        foo: 101,
        bar: 102
    }
})
```

引入 config-base.js 和 values.js 两个配置文件，
其中 values.js 文件的配置项将与 values 节合并,
最终 config.js 输出的配置为

```
define({
    values: {
        base1: 1,
        base2: 20,
        base3: 300,
        value1: 11,
        value2: 112     
    }
})
```

### 2. 集合操作

#### 1. 字典操作

```javascript

// config-base.js
define({
    something: {
        foo1: 1,
        foo2: 2,
        foo3: 3,
        bars: {
            bar1: 10,
            bar2: 20
        }
    }
})

// config.js
define({
    $includes: {
        'config-base': null
    },
    something: {
        foo2: $.remove(),
        foo3: 300,
        foo4: 400,
        bars: {
            bar1: $.remove(),
            bar3: 3000
        } 
    }
})

// 结果
define({
    something: {
        foo1: 1,
        foo3: 300,
        foo4: 400,
        bars: {
            bar2: 20,
            bar3: 3000
        }
    }
})
```

#### 2. 数组操作

```javascript

// config-base.js
define({
    something: [1, 2, 3, 4, {a:1}]
})

// config.js
define({
    $includes: {
        'config-base': null
    },
    something: $.erase([1,2]) // [1, 4, {a:1}]
                .before(2, [7,8]) // [1, 4, 7, 8, {a:1}]
                .after(1, [9]) // [1, 4, 9, 7, 8, {a:1}, 9]
                .after(-1, [6]) // [1, 4, 7, 8, {a:1}, 6]
                .merge(4, {b:2}) // [1, 4, 7, 8, {a:1, b:2}, 6]
                .clear() // []
})

```



### 3. 表达式

表达式的计算发生在以上包含和集合操作之后

#### 1. 引用表达式

* 引用字段 $.ref(fullFieldName)
* 引用 values 下的字段 $.val(fullFieldName)

```javascript
define({
    values: {
        foo: 1,
        bar: 2,
        foos1: $.ref(['values', 'foo']), // 1
        foos2: $.ref('values.foo'), // 1
        bars: $.val('bar') // 2
    }
})
```

#### 2. 计算表达式

* $.calc([input0, input1, input2...], function(arg0, arg1, arg2...))
* $.calc(function())

其中 input0...inputN 可以是常量也可以是其它表达式，
$.calc 的返回值为其 function 参数的返回值

* $.format(template, arg0, arg1....)

对 calc 方法的封闭，用于字符串拼接/格式化的快捷方法，
template 中目前支持三种占位符, ${field}相当于$.val，
$${field}相当于$.ref，$#{N}用于引用 arg0...argN。

```javascript
define({
    values: {
        foo: 1,
        bar: 2,
        bars1: $.calc([$.ref('values.foo'), $.val('bar'), 3], function(foo, bar, x){
            return foo + bar + x; // 1 + 2 + 3
        }),
        bars2: $.format("foo: ${foo}, bar: $${values.bar}, x: $#{0}", 3) // foo: 1, bar: 2, x:3
    }
})
```

#### 3. 动作表达式

动作表达式用于声明一个动作，用于在指定插件上执行一个方法。
需要动态加载并调用其它插件时，必须先在配置中声明动作，
并在代码中通过动作来实现， 以便于依赖追踪。

* $.action(pluginName, methodName, [arg0, arg1, arg2....])

```javascript

define({
    menus: [
        {title: '绘制线段', icon: 'si-plot', action: $.action('plot', 'start', ['line'])},
        {title: '停止绘制', icon: 'si-close', action: $.action('plot', 'stop')}
    ]
})

// somewhere in the code
plugins.execute(menuItem.action);

```
