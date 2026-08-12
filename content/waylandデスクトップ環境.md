---
title: Waylandデスクトップ環境
created: 2026-08-09 03:50:06
modified: 2026-08-09 03:50:06
description: null
tags: []
aliases:
  - "20260809035006"
---

# Waylandデスクトップ環境
## はじめに
[Wayland](https://wiki.archlinux.jp/index.php/Wayland)tとはX Window System の後継として設計されたディスプレイサーバプロトコルである。Waylandそのものが画面を描画したり、ウィンドウを配置したりするわけではない。アプリケーションと画面表示を管理するソフトウェアの間で、どのように通信するかを定めたものである。
## Waylandコンポジタ
Wayland環境の中心となるソフトウェアであり、画面表示やウィンドウの配置などを担当する。ラップトップでは[[20260809040231|Niri]]、デスクトップでは[[20260809040437|Hyprland]]を使っている。

## X11アプリケーション互換
すべてのLinuxアプリケーションがWaylandにネイティブ対応しているわけではない。対応のないX11アプリケーションをWayland環境で動作させるために、XWaylandという互換層を利用する。

Hyprlandでは通常のXWaylandを利用する。NiriではXWaylandを非rootで動作させるために`xwayland-satellite`を利用する。

```bash
# hyprland
sudo pacman -S xorg-xwayland

# niri
sudo pacman -S xwayland-satellite
```

## XDG Desktop Portal
Waylandでは画面共有やスクリーンキャプチャのような画面の内容にアクセスする操作を、アプリケーションがコンポジタへ直接要求できるとは限らない。その仲介を行う一つの仕組みが[XDG Desktop Portal](https://wiki.archlinux.jp/index.php/XDG_%E3%83%87%E3%82%B9%E3%82%AF%E3%83%88%E3%83%83%E3%83%97_%E3%83%9D%E3%83%BC%E3%82%BF%E3%83%AB)である。

`xdg-desktop-portal`はアプリケーションに対して、ファイルを選ぶ・画面を共有する・スクリーンショットを撮るといった機能を、デスクトップ環境に依存しない共通APIとして提供する役割を持つ。

一方で、実際に何をどのように実行するかは`Portal backend`が担当する。ここではHyprlandやNiriといったコンポジタと連携し、どのモニターを共有するか・ユーザーに許可ダイアログを出すか・どの領域を切り出すかといった具体的な処理を行う。

```bash
# hyprland
sudo pacman -S xdg-desktop-portal xdg-desktop-portal-hyprland xdg-desktop-portal-gtk

# niri
sudo pacman -S xdg-desktop-portal xdg-desktop-portal-gnome xdg-desktop-portal-gtk
```

## デスクトップシェル
WaylandコンポジタだけでもGUIアプリケーションを表示することはできる。しかし、一般的なデスクトップに存在する全ての機能をコンポジタが提供するわけではない。例えば、ステータスバーやアプリケーションランチャ、通知、音量、輝度、ロック画面の表示など別途インストールが必要となる。このようなユーザーインターフェースをまとめてデスクトップシェルと呼ぶことがある。

現在は[DankMaterialShell](https://danklinux.com/docs/)を利用している。上で挙げられたような機能を一通り揃えており、必要があれば個別のコンポーネントを導入することもできるので、コンポジタの恩恵は受けたいけど細々としたツール群を個別に管理するのは面倒、というようなケースには向いている。ひとまずはステータスバー・通知・音量・輝度・壁紙・ロック画面だけを担当させる。アプリケーションランチャはfuzzelを用いる。ここに書いた文章と矛盾するようだが、ミニマルで好みだからだ。

```bash
sudo pacman -S dms-shell
```

DMSを利用しない場合、Waybar, fuzzel, mako, hyprlockなど個別に組み合わせて環境を構築する。

## ユーティリティ
Wayland環境で利用するいくつかのツールを導入する。
### クリップボード
Waylandのクリップボードを操作するため、`wl-clipboard`を利用する。クリップボード履歴の管理には`cliphist`を利用する。

```bash
sudo pacman -S wl-clipboard
paru -S cliphist
```

### 画面キャプチャ
Wayland環境でスクリーンショットを取得するために`grim`を利用する。画面上から領域を選択するためには`slurp`を組み合わせる。スクリプトを用意することで撮影方法、範囲を選択できるようにする。

```bash
sudo pacman -S grim slurp
```

### ディスプレイ制御
ディスプレイの画面輝度を変更するために`brightnessctl`を利用する。色温度の調整には`wlsunset`を利用する。

```bash
sudo pacman -S brightnessctl wlsunset
```
