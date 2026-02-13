# VS Code

## ファイル比較

> compare

⌘B 左の表示をオン・オフする。

⌘J 下の標示をオン・オフする。

⌘q VSCodeを閉じる。誤って閉じないように、このショートカットをオフにする人も多いらしい。

⌘w エディタのファイルを閉じる。VSCodeまで閉じれちゃうぽいけど、設定で変更できる。

## settings

多人数開発

特定のファイル・フォルダを非表示にできる。
多人数で開発しているgit管理のプロジェクトで、1つのフォルダの中に大量のファイルがあって鬱陶しいと思うときに、非表示にできて便利そう。
```json
{
  "files.exclude": {
    "**/unused-folder": true,
    "**/legacy-data": true,
    "**/rarely-used": true,
    "202[0-5]*": true
  }
}
```
ただ、存在を忘れると、地獄そう。「どうして非表示のファイルがあるんだ!!??」ってなってしまいそう……。

`*` によるワイルドカード文字の設定や、正規表現の範囲指定のようなこともできる。

## Terminal

Terminal > integrated > Default Profile: Windows

Windowsで、Terminalの初期設定をPowershellからGit Bashに変更したりするときに使用する
(Git for Winwdows を使う前提)

## 拡張機能

- 2024年12月25日: [Qiita: VSCodeに入れるべき拡張機能【2024年最新版】\- Qiita](https://qiita.com/qrrq/items/0e116a59743874d18cb1) by @qrrq in (株)Nuco
- 2025年9月12日: [Kannart Blog: VSCodeで使いたい便利な拡張機能・プラグイン15選 入れ方も解説【Visual Studio Code】](https://www.kannart.co.jp/blog/web-hacks/web-coding/14096/)

### indent-rainbow by oderwat

インデントに色をつける。オススメの常連。

- Marp for VS Code by Marp team
- Open In Default Browser by peackchen90

### Rainbow CSV by mechatroner

CSVファイルに対して、列ごとに色をつける。オススメの常連。昔からある。

オススメ者: qrrq。

### Trailing Spaces

行末にある余分なスペースを赤く表示。色を抑えられないかな?

- trail(トレイル) ＝ 跡を引く・後ろをついていく.
- trailing ＝ 後ろにぶら下がっている／末尾にある.

setting.jsonで、色の変更可能。薄くできる。
```json setting.json
    // "trailing-spaces.regexp": "(?<=\\S)\\s+$",
    "trailing-spaces.backgroundColor": "rgba(255, 0, 0, 0.1)",   // 背景色
    // "trailing-spaces.borderColor": "rgba(255, 0, 0, 0.1)",      // 枠線色
    // "trailing-spaces.borderStyle": "solid"
```

Trailing-spaces: Delete Modified Lines Only
By default, trailing spaces are deleted within the whole document. Set to true to affect only the lines you edited since last save. Trailing spaces will still be searched for and highlighted in the whole document.

変更した行だけ削除
デフォルトでは、行末のスペースは ドキュメント全体から削除されます。この設定を true にすると、前回保存してから 編集した行だけに削除処理が適用されます。ただし、行末スペースの 検索とハイライト表示は、ドキュメント全体に対してそのまま行われます。

```json settings.json
    "trailing-spaces.deleteModifiedLinesOnly": true,
```

### Japanese Language Pack for Visual Studio Code

オススメにあったので、やってみる。日本語化。

### vscode-icons CSCode by Icons Team

フォルダ名・ファイル名に応じて、Explorerのアイコンが変わって、見やすくなる。

オススメの常連。

オススメ者: qrrq。

#### zenkaku by mosapride

全角スペースの可視化。

説明に書いてあるけど、コマンドで簡単にオン・オフできる。

鬱陶しくなったらオフにして、欲しくなったらオンにしよう。

```
> Enable Zenkaku
> Disable Zenkaku
```

`> zenkaku`でいける。


### Ruby や Rails開発

RubyやRails開発をしているときは、Aki77氏の拡張機能を入れていた。
