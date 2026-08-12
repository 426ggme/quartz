---
title: Obsidianの運用方法
created: 2026-08-13 01:20:25
modified: 2026-08-13 01:34:00
description: ノートの構成、保存場所、ID、テンプレート、拡張機能について
tags: []
aliases:
  - "20260813012025"
---

# Obsidianの運用方法
このページには、Obsidianでノートを書く方法と、Vault内で管理する方法を記録する。

## フォルダ
Vaultの中では、用途に応じてファイルを次のフォルダに分けている。

| フォルダ | 内容 |
| --- | --- |
| `Notes` | 通常のノート |
| `Daily` | デイリーノート |
| `Assets` | 画像などの添付ファイル |
| `Templates` | ノート作成時に使うテンプレート |

新しい通常ノートは `Notes` に作る。デイリーノートは `Daily` に、添付ファイルは `Assets` に置く。`Templates` には新規ノートの形式を定めるテンプレートを置いている。

## ページとリンク
考えたことや調べたことは、まず関係する一つの文書へ追記する。書き進めるうちに、ある部分が単独でも読めるまとまりになったり、別の文脈から参照したくなったりしたときに、新しいページとして切り出す。

この方針は、Scrapbox（現Cosense）の使い方から受けた影響が大きい。公式ヘルプでも、[ページ間のリンクを情報整理の中心に置くこと](https://scrapbox.io/help-jp/%E3%83%9A%E3%83%BC%E3%82%B8%E3%82%92%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%99%E3%82%8B)や、[独立した内容を別のページへ切り出すこと](https://scrapbox.io/help-jp/%E8%A6%8B%E5%87%BA%E3%81%97)が説明されている。

### 分類を先に決めない
フォルダやタグを細かく決めて情報を分類する方法は採っていない。あるノートをどの分類へ置くべきか考え続けたり、分類体系を保守したりするのが負担になるからである。`Notes` や `Daily` などのフォルダは、内容の分類ではなく、ノートの用途を分けるために使う。タグも必要な場合を除いて付けない。

ノートの関係は、階層や作成順よりもWikiリンクによって表す。リンクは一つのノートを複数の文脈へ接続できるため、どこか一つの分類へ所属させる必要がない。リンクを増やすとバックリンクとグラフにも関係が現れ、後から別の経路でノートを見つけられる。

一ページに一つのアイデアだけを書くことを規則にはしていない。作品の感想や一連の作業手順は、一つのページに複数の話題を含むことがある。ページの単位を最初に決めるのではなく、追記を重ねた結果として独立したまとまりが現れたときに分ける。切り出したページは元のページからリンクし、必要であれば別のページからも参照する。

## IDとタイトル

ノートのファイル名には、作成時刻を `YYYYMMDDHHmmss` の形式にした14桁のIDを使う。たとえば、2026年8月13日1時20分25秒に作ったノートのファイル名は `20260813012025.md` になる。

人が読む題名は、ファイル名ではなくfrontmatterの `title` に保存する。IDはノートを一意に識別するための値、タイトルは内容を示す表示名として役割を分けている。題名を変えてもファイル名が変わらないため、ノートへのリンクを維持しやすい。

## 新規ノートの作成

`Notes` にファイルを作ると、Templaterがテンプレートを自動で適用する。無題のファイルであれば最初にタイトルを入力し、その後でファイル名を14桁のIDへ変更する。テンプレートは次のfrontmatterと見出しを作る。

```yaml
---
title: ノートのタイトル
created: 2026-08-13 01:20:25
modified: 2026-08-13 01:20:25
description:
tags: []
aliases:
  - ノートのタイトル
---
```

`created` と `modified` は作成時点の日時を入れる。`description` と `tags` は必要になったときに記入する。最初のタイトルはaliasにも保存する。

## 使用している拡張機能

### ノートの作成と表示

[Templater](https://github.com/SilentVoid13/Templater)は、新規ノートへのテンプレート適用、IDの生成、frontmatterの作成に使う。

[Front Matter Title](https://github.com/snezhig/obsidian-front-matter-title)は、IDで保存したファイルを `title` の値で表示するために使う。ファイル一覧、タブ、検索結果、グラフ、リンク候補などでは、IDではなくノートの題名が見える。

### ノートの参照

[Dataview](https://github.com/blacksmithgu/obsidian-dataview)は、frontmatterやファイル情報を条件にしてノートを一覧するために使う。

[Auto Link Title](https://github.com/zolrath/obsidian-auto-link-title)は、外部URLを貼ったときにページのタイトルを取得し、Markdownリンクへ変換する。

[Recent Files](https://github.com/tgrosinger/recent-files-obsidian)は、最近開いたノートへ戻るために使う。

### 同期と外観

[Self-hosted LiveSync](https://github.com/vrtmrz/obsidian-livesync)は、複数の端末の間でVaultを同期するために使う。

[Minimal Theme Settings](https://github.com/kepano/obsidian-minimal-settings)と[Style Settings](https://github.com/mgmeyers/obsidian-style-settings)は、Obsidianの外観を調整するために使う。
