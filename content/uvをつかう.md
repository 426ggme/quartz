---
title: uvをつかう
created: 2026-08-12 19:11:06
modified: 2026-08-13 01:42:00
description: null
tags: []
aliases:
  - "20260812191106"
---

# uv をつかう
[uv](https://docs.astral.sh/uv/)
## インストール

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

公式リポジトリでもよい。
```bash
sudo pacman -S uv
```

## Pythonバージョンの管理
Python自体のインストールや管理ができる。

- Pythonのインストール: `uv python install 3.1X`
- 利用可能なバージョンの確認:  `uv python list`
- 特定のバージョンをプロジェクトに固定: `uv python pin 3.1X`

## プロジェクト管理
プロジェクト単位での依存関係を管理できる。`pyproject.toml`と、プラットフォームに依存しない`uv.lock`ファイルを使用する。

- プロジェクトの初期化: `uv init {name}`
- 依存関係の追加: `uv add {packeges}`
- 仮想環境の構築と適用: `uv sync`
- コマンドの実行: `uv run python main.py`

## スクリプトの実行
単一のPythonファイルに対して、一時的な仮想環境を作成して実行できる。スクリプト内に依存関係を記述（PEP 723）している場合、uvはそれを自動的に解決する。

- スクリプトの実行: `uv run script.py`
- 一時的な依存関係の追加: `uv run --with rich script.py`
- メタデータの追加: `uv add --script script.py requests`

```python
# /// script
# dependencies = [
#   "requests",
# ]
# ///
```

## ツールの管理
pipxのように、Pythonパッケージとして公開されているCLIツールを、独立した環境にインストールして利用できる。

- 一時的な実行: `uvx ruff check`
- 永続的なインストール: `uv tool install ruff`

## pipインターフェース
既存のpipコマンドとの互換性を持つインターフェースも提供されている。既存のワークフローを維持したまま、高速化の恩恵を受けることができる。

- パッケージのインストール: `uv pip install -r requirements.txt`
- 依存関係のコンパイル: `uv pip compile requirements.in -o requirements.txt`
