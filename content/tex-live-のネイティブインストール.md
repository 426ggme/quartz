---
title: TeX Live のネイティブインストール
created: 2026-08-12 18:35:05
modified: 2026-08-12 18:35:05
description: null
tags: []
aliases:
  - "20260812183505"
---

# TeX Live のネイティブインストール
## はじめに
TeX Live は Arch Linux の公式リポジトリからもインストールできるが、ここでは TeX Users Group が配布している公式インストーラ `install-tl` を利用して、TeX Live を `/usr/local/texlive` 以下へ直接インストールする。

以下では TeX Live 2026 を想定する。

## 事前準備
インストーラは Perl で動作するため、Perl が利用できることを確認する。

```sh
perl --version
```

## インストーラのダウンロード
作業用ディレクトリへ移動する。

```sh
cd /tmp
```

TeX Live の公式ネットワークインストーラを取得する。

```sh
curl -L -o install-tl-unx.tar.gz \
    https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
```

## インストーラの展開
ダウンロードしたアーカイブを展開する。

```sh
zcat < install-tl-unx.tar.gz | tar xf -
```

展開すると `install-tl-YYYYMMDD` のようなディレクトリが作成される。

```sh
cd install-tl-2*
```

---

## TeX Live のインストール
今回は標準構成をすべてインストールする。

```sh
sudo perl ./install-tl --no-interaction
```

デフォルトでは、おおむね次の場所へインストールされる。
```text
/usr/local/texlive/2026/
```

## PATH の設定
インストールしただけでは、シェルから `latex`、`pdflatex`、`lualatex` などを直接実行できない。TeX Live のバイナリディレクトリを `PATH` に追加する。x86_64 Linux の場合、TeX Live 2026 では通常、次のパスにある。

```text
/usr/local/texlive/2026/bin/x86_64-linux
```

`~/.zshrc` に追加する。

```sh
export PATH="/usr/local/texlive/2026/bin/x86_64-linux:$PATH"
```

## TeX Live の更新

公式インストーラで導入した TeX Live は、Arch Linux の `pacman` ではなく `tlmgr` によって管理する。パッケージ一覧を更新し、インストール済みパッケージを更新するには次を実行する。

```sh
sudo tlmgr update --self
sudo tlmgr update --all
```