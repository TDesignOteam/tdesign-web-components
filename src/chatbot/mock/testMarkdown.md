# Markdown功能测试 (H1标题)

## 基础语法测试 (H2标题)

### 文字样式 (H3标题)

#### 文字样式 (H4标题)

##### 文字样式 (H5标题)

###### 文字样式 (H6标题)

**加粗文字**  
_斜体文字_  
~~删除线~~  
**_加粗且斜体_**  
行内代码: `console.log('Hello')`

### 代码块测试

```javascript
// JavaScript 代码块
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})

function greet(name) {
  console.log(`Hello, ${name}!`);
}
greet('Markdown');
```

```python
# Python 代码块
def hello():
    print("Markdown 示例")
```

```vue
<template #prefix>
  <div class="model-select">
    <t-tooltip v-model:visible="allowToolTip" content="切换模型" trigger="hover">
      <t-select
        v-model="selectValue"
        :options="selectOptions"
        value-type="object"
        @focus="allowToolTip = false"
      ></t-select>
    </t-tooltip>
    <t-button class="check-box" :class="{ 'is-active': isChecked }" variant="text" @click="checkClick">
      <SystemSumIcon />
      <span>深度思考</span>
    </t-button>
  </div>
</template>
```

### 列表测试

- 无序列表项1
- 无序列表项2
  - 嵌套列表项
  - 嵌套列表项

1. 有序列表项1
2. 有序列表项2

### 表格测试

| 左对齐     | 居中对齐 | 右对齐 |
| :--------- | :------: | -----: |
| 单元格     |  单元格  | 单元格 |
| 长文本示例 | 中等长度 |   $100 |

![示例](https://tdesign.gtimg.com/demo/demo-image-1.png "示例")

### 其他元素

> 引用文本块  
> 多行引用内容

---

分割线测试（上方）

块级公式
$$
E=mc^2
$$

行内公式 $\\sqrt{3x-1}+(1+x)^2$

脚注测试[^1]

[^1]: 这里是脚注内容

这是一个链接 [Markdown语法](https://markdown.com.cn)。

✅ 任务列表：

- [ ] 未完成任务
- [x] 已完成任务

HTML混合测试：
<br>（需要开启html选项）
<small>辅助文字</small>
