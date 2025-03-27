# Replace of Rules
根据规则对文件进行批量替换或高亮

## 使用流程
1. 在VSCode扩展商店搜索安装本插件
2. 于项目根目录创建规则文件（命名规则：.replace）
3. 编写替换规则（格式：原始内容=替换内容）
4. 文件中右键菜单[ROR - Replace Text (Edit file)]/[ROR - Replace Show (Read only)]

## 功能描述
### ROR - Replace Text (Edit file)
**功能**:  
直接修改文档内容，根据用户定义的替换规则，自动将匹配的文本替换为指定内容。适用于需要永久性修改文件内容的场景。

### ROR - Replace Show (Read only)
**功能**:  
以只读模式显示替换效果，不修改文档内容。通过视觉提示（如高亮、边框）展示替换后的内容，便于用户预览和验证规则。

### 规则配置
- 文件位置：必须存放在打开的工作区根目录 `.replace` 
- 规则格式：每行单个规则，支持#和//开头的注释
- 正则支持：遵循JavaScript正则表达式语法
```plaintext
# 替换规则示例
// 替换 "foo" 为 "bar"
foo=bar

# 使用正则表达式替换所有数字为 "[number]"
\\d+=[number]

// 替换 "hello" 为 "world"
hello=world
```

## ⚙️ 配置参数表

| 参数名称                                      | 类型      | 默认值                   | 说明                                                                 |
|---------------------------------------------|-----------|--------------------------|--------------------------------------------------------------------|
| `replaceOfRules.decorationType.color`       | `string`  | `"#000000"`              | 装饰器文字颜色<br>支持 HEX/RGB/HSL 格式<br>示例: `"#ff0000"`, `"rgb(255,0,0)"` |
| `replaceOfRules.decorationType.backgroundColor` | `string`  | `"rgba(255,255,0,0.5)"` | 装饰器背景颜色<br>推荐使用透明度格式<br>示例: `"rgba(255,165,0,0.3)"`         |
| `replaceOfRules.decorationType.borderColor` | `string`  | `"black"`                | 装饰器边框颜色<br>支持 CSS 颜色名称<br>示例: `"#ffa500"`, `"darkblue"`       |
| `replaceOfRules.decorationType.borderWidth` | `string`  | `"1px"`                  | 边框宽度设置<br>支持 CSS 单位<br>示例: `"2px"`, `"0.5rem"`                  |
| `replaceOfRules.decorationType.borderRadius`| `string`  | `"3px"`                  | 边框圆角半径<br>支持多值格式<br>示例: `"5px"`, `"10px 5px"`                |
| `replaceOfRules.decorationType.padding`     | `string`  | `"2px"`                  | 内容内边距<br>支持简写格式<br>示例: `"5px 10px"`, `"1em"`                  |