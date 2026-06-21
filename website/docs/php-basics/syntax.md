# PHP 基础速成

这页只补答辩中会用到的 PHP 基础，不追求完整学习 PHP。

## 变量

PHP 变量以 `$` 开头：

```php
$name = '系统管理员';
$count = 3;
```

项目中常见变量：

```php
$data = $request->validate([...]);
$user = User::query()->where('email', $data['email'])->first();
```

## 数组

PHP 数组可以表示列表，也可以表示键值对：

```php
[
    'title' => '港口近岸水质巡检',
    'status' => '进行中',
]
```

Laravel 中经常用数组描述校验规则或写入数据。

## 函数和方法

```php
public function index(): JsonResponse
{
    return response()->json(...);
}
```

解释：

- `public`：公开方法，外部可以调用。
- `function index()`：方法名是 `index`。
- `: JsonResponse`：返回类型是 JSON 响应。

## if 判断

```php
if ($value > $max) {
    return true;
}
```

项目中检测异常判断就用了类似逻辑。

## 类 class

Laravel 中 Controller 和 Model 都是类：

```php
class TaskController extends Controller
{
    // 方法写在这里
}
```

## 命名空间 namespace

```php
namespace App\Http\Controllers;
```

命名空间用于组织代码，避免类名冲突。

## use 引入类

```php
use App\Models\Sample;
use Illuminate\Http\Request;
```

表示当前文件要使用这些类。

## 答辩够用总结

你不需要讲 PHP 所有语法，只要能说明：

- `$变量名` 表示变量。
- `class` 表示类。
- `function` 表示方法。
- `if` 用来判断。
- 数组用于存放字段和规则。
- Laravel 把路由、控制器、模型组织成固定结构。
