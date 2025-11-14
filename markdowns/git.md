# git

## 基本的なコマンド

```sh
git switch -c <new_branch>
```
新しいブランチを作成して、切り替え。

## よく使う便利なコマンド

```sh
git switch -
```
前回いたブランチに切り替える。`checkout`は長いし古いコマンドなので非推奨。

```sh
cd -
```
前回いたディレクトリの位置に移動する。`-`での指定は、`cd`コマンドでもよく使う。

```sh
git commit --amend
git commit --no-edit
```

直前のコミットを修正する。git addされているファイルがあれば、それもコミットする。コミットの上書き修正なので、乱用に注意する。コミットをamendし、リモートレポジトリのコミットと異なる場合、force pushが必要になる。

`--no-edit`は、コミットメッセージの編集なく、ステージングエリアの編集をとりこむ形でコミットを上書きしたい場合に用いる。使いたいケースはよくあるが、オプション名が長いので使わない・使えない。

```sh
git push -u origin feature/foo
```

`-u`は、`--set-upstream`の略。ブランチを追跡関係にする。`git push`と`git pull`だけでよくなるし、`git status`のときにリモートブランチとの関係を教えてくれる。

## たまに使う

```sh
git add -i
git add -p
git add --patch
```
ファイル単位ではなく、インタラクティブにパッチ単位で登録する。自動更新されてしまうファイルで修正したくない場合に使う。常に使うようにすると、確認になって良いかもしれない。

`git add -i`は、`git add -p`を包括する総合的なモード。

```sh
git add -u
git add --update
```
新規ファイルを含めず、既存の更新(update)されたファイルだけを`git add`する。たまに使いたくなるけど、たまに過ぎて覚えていない。

```sh
git restore -s <commit> -- path/to/file
git restore --source <commit> -- path/to/file
```

`-s`は、`--source`。`<commit>`を取得元(ソース)とする。
ブランチ名はコミットを指すものなので、`<commit>`はブランチ名でも良い。
`--`は、「ここから先は、ファイル名」という区切りの宣言。

`git checkout`は「ブランチ切り替え」「ファイル復元」の2つの意味が混ざっているため、混乱を生むとして`git switch`と`git restore`に分離された。`git checkout`は古いコマンドなので、使わないようにする。

```sh
git reset --hard
```
変更を取り消すコマンドであり、`--hard`なので特に強力。変更が取り消されても良いファイルしかないような場合に使う。

```sh
git fetch
```

```sh
git push --force-with-lease
```
語源が意味不明な感じがするコマンド。

```sh
git clean -n
```
未追跡ファイルを削除して綺麗にする。削除系なので、慎重に使う必要あり。恐ろしい。--dry-runできる。`-f`で削除。

[TODO] マージ時に、相手優先・自分優先について

```sh
git diff --diff-filter=ACMRT
```

`diff`が重複するところにセンスがない感じのするオプション名。Cは、Changeではなく、Copied。MがModifiedで修正。

| 文字 | 種類名            | 説明 |
|------|--------------------|------|
| **A** | Added              | 新しく追加されたファイル。 |
| **C** | Copied             | コピーされたファイル。Git がコピーと判断したもの。 |
| **D** | Deleted            | 削除されたファイル。 |
| **M** | Modified           | 内容が変更されたファイル。 |
| **R** | Renamed            | ファイル名が変更されたファイル。 |
| **T** | Type changed       | ファイルタイプが変化(例：通常ファイル → シンボリックリンク)。 |
| **U** | Unmerged           | マージコンフリクトが未解決のファイル。 |
| **X** | Unknown            | Git が分類できない変更。 |
| **B** | Broken pairing     | rename/copy などのペア推定が破損した場合。 |


## [TODO]

- .git/info/exclude
- .gitattributes
- ~/.gitconfig

## リンク集

- [GIGAZINE: 混乱を引き起こしがちなGitの用語まとめ](https://gigazine.net/news/20231111-confusing-git-terminology/)