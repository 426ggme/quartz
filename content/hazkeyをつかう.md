---
title: Hazkeyをつかう
created: 2026-08-09 03:41:03
modified: 2026-08-09 03:41:03
description: null
tags: []
aliases:
  - "20260809034103"
---

# Hazkeyをつかう
## はじめに
Hazkeyとは[AzooKeyKanaKanjiConverter](https://github.com/azooKey/AzooKeyKanaKanjiConverter)を利用した先進的なIMEである。LLMによる変換のほか、リアルタイム変換に対応している。

## Arch Linuxでのインストール
[Arch Linuxへのインストール \| Hazkey](https://hazkey.hiira.dev/docs/install/archlinux)

```bash
paru -S fcitx5-hazkey-bin hazkey-zenzai-model
```

## Ubuntuでのインストール
まずは`fcitx5`を導入して、設定する必要がある。
[Ubuntu 24.04 + GNOME で日本語入力環境を構築する（fcitx5 + Mozc / US キーボード） #Ubuntu24.04 - Qiita](https://qiita.com/kanagawa41/items/c54d0616ae27fa47dc4a)
[Ubuntuへのインストール \| Hazkey](https://hazkey.hiira.dev/docs/install/ubuntu/)

## 設定
任意のwaylandコンポジタより、`fcitx5 -d` が実行されていることを確認したのち、`fcitx5-configtool` による設定を行う。「利用可能な入力メソッド」から `Hazkey` を検索し、右側の「現在の入力メソッド」に移動させる。キーボード - 日本語 > `{IME}` の順序にすることで、通常は直接入力、切り替えキーで `IME` による変換入力となる。