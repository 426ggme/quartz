---
title: Fcitx5でMacライクなIME切り替えをする
created: 2026-08-09 03:46:49
modified: 2026-08-09 03:46:49
description: null
tags: null
aliases:
  - "20260809034649"
---

# Fcitx5でMacライクなIME切り替えをする
ターミナルから `fcitx5-config-tool` を実行する。
グローバルオプションタブを選択し、入力メソッドの切り替えセクションにある以下の項目を設定する。
- Activate Input Method < henkan
- Deactivate Input Method  < muhenkan