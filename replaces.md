# 置換のJSON形式対応

```html
<div id="replaceContainer">
    <div class="replace-pair">
      <label></label><input type="text" class="searchText" value="foo">
      →
      <label></label><input type="text" class="replaceText" value="bar">
      <label class="inline"><input type="checkbox" class="regexToggle">正規表現を使用</label>
      <label class="inline"><input type="checkbox" class="replaceToggle" checked="">置換実行</label>
</div>
```

`<div id="replaceContainer">`の中に複数の、置換の指示が入っています。

これらを、JSON形式のinputタグ内に表示します。

また、JSON形式形式ののinputタグに変化があった場合には、それらを`<div id="replaceContainer">`に反映するようにします。

JSON形式は、以下の通りとします。

```json
{
  "replacements": [
    { "before": "foo", "after": "bar" },
    { "before": "(\\d{4})-(\\d{2})-(\\d{2})", "after": "$1/$2/$3", "regex": true
    },
    { "before": "DEBUG:", "after": "", "enabled": false },
  ]
}
```


## 参考: YAML形式
```yaml
replacements:
  - before: "foo"
    after:  "bar"
    # regex が省略なら false (リテラル置換)
    # enabled が省略なら true (実行する)
  - before: "(\\d{4})-(\\d{2})-(\\d{2})"
    after:  "$1/$2/$3"
    regex: true       # 正規表現置換
    enabled: false    # 実行しない
```