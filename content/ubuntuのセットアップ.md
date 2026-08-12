---
title: Ubuntuのセットアップ
created: 2026-05-06 22:40:25
modified: 2026-08-12 16:49:50
description: null
tags: []
aliases:
  - "20260506224025"
---

# Ubuntuのセットアップ
## パッケージマネージャの準備

```
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git wget
LC_ALL=C xdg-user-dirs-update --force
```

## Flatpak環境の構築

Ubuntuのデスクトップアプリ管理をFlatpakに一元化するため、ランタイムとリポジトリを追加する。

```
sudo apt install -y flatpak gnome-software-plugin-flatpak
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

設定を反映させるため、ここで一度再起動を行う。

### デスクトップアプリケーションの導入

```
flatpak install flathub md.obsidian.Obsidian
flatpak install flathub com.slack.Slack
flatpak install flathub com.discordapp.Discord
flatpak install flathub org.zotero.Zotero
flatpak install flathub com.bitwarden.desktop
```

## ランチャーの導入 (Ulauncher)

```
sudo add-apt-repository ppa:agornostal/ulauncher
sudo apt update && sudo apt install -y ulauncher
```

インストール後、自動起動設定を有効にする。

## 日本語環境の構築

### フォント
Noto Sans CJK JPおよび開発用フォントを導入する。

```
sudo apt install -y fonts-noto-cjk fonts-noto-color-emoji
```

PlemolJPやHackGenなどの特殊なフォントは、配布元のGitHubからdebパッケージ、またはttfファイルを直接取得して`~/.local/share/fonts`に配置する。

### 日本語入力 (Fcitx5)
fcitx5を利用する。[[hazkeyをつかう|Hazkey]]を使いたいからだ。

```
sudo apt install -y fcitx5
im-config -n fcitx5
```

## 開発環境とCLIツール
### シェルとドットファイル管理
zshへの切り替えと、chezmoiによる設定の同期を行う。

```
sudo apt install -y zsh nvim
chsh -s $(which zsh)

# chezmoiの導入
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply <YOUR_GITHUB_USERNAME>
```


