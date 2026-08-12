---
title: chezmoiをつかう
created: 2026-08-12 19:04:53
modified: 2026-08-12 19:04:53
description: null
tags: []
aliases:
  - "20260812190453"
---

# chezmoiをつかう
## はじめに
[chezmoi](https://www.chezmoi.io/)とはdotfilesを複数マシン間で管理するためのツールである。私のdotfilesは次のリポジトリにある。

[GitHub - 426ggme/dotfiles: chezmoi · GitHub](https://github.com/426ggme/dotfiles)
## 初期設定とファイルの追加
まずは `chezmoi init` を実行して、ローカルリポジトリを初期化する。管理したいファイルがある場合は、`chezmoi add ~/.zshrc` のようにコマンドを打つことで、そのファイルがソースディレクトリ（`~/.local/share/chezmoi`）にコピーされる。

## 設定の編集と反映
ソース状態のファイルを編集するには `chezmoi edit <ファイル名>` を使用する。これにより、エディタでソースファイルが開き、変更を加えることができる。
変更内容を実際のホームディレクトリに適用する前に、`chezmoi diff` で差分を確認することが推奨される。内容に問題がなければ、`chezmoi apply` を実行して変更を反映させる。

## リポジトリの管理
ソースディレクトリでの作業が必要な場合は `chezmoi cd` でディレクトリを移動し、通常のgitコマンドを用いてコミットやリモートリポジトリへのプッシュを行う。chezmoiの設定によっては、これらの操作を自動化することも可能である。

## 複数マシン間での同期
別のマシンで既存の設定を利用する場合、`chezmoi init <リポジトリURL>` を実行してリポジトリを取得する。その後、`chezmoi apply` で設定を適用する。すでに運用しているマシンで最新の状態を取り込むには、`chezmoi update` を使用する。
また、新規マシンのセットアップ時には `chezmoi init --apply <リポジトリURL>` という1つのコマンドで、初期化から適用までを完結させることができる。