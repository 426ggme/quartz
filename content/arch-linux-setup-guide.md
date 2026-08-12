---
title: Arch Linux Setup Guide
created: 2026-08-09 03:21:26
modified: 2026-08-09 03:21:26
description: null
tags: []
aliases:
  - "20260809032126"
---

# Arch Linux Setup Guide
## はじめに
[[arch-linux-install-guide|Arch Linuxのインストール]]が無事に終わったら、今度は基本的なセットアップに移っていく。ネットワークや時刻の設定や、パッケージ管理の拡充、デスクトップ環境の整備など多岐にわたる。

## システムの設定
### ネットワークの管理
再起動後、まずはネットワーク接続を確認する。`NetworkManager`が有効であれば、有線LANは自動で認識されるだろう。無線LANは`nmtui` を実行し、GUIベースのインターフェースでSSIDを選択してパスワードを入力すると楽である。

### 時刻同期の設定
[[20260809032506|デュアルブート時にWindowsと時刻をそろえる]]

## パッケージ管理ツールの拡充
### パッケージマネージャの最適化
必要であれば`/etc/pacman.conf` を編集し、ダウンロード速度の向上と視認性の改善を行う。設定後、 `sudo pacman -Syu`でデータベースを同期する。また、高速な国内ミラーを選択する。
```bash
sudo pacman -S reflector
sudo reflector --country Japan --protocol https --sort rate --save /etc/pacman.d/mirrorlist
```

### AURヘルパの導入
Arch User Repository (AUR) を利用するため、`paru` を導入する。
```bash
sudo pacman -S --needed base-devel git
mkdir sources & cd sources
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

## 日本語環境の構築
### フォント
最低限、Noto Sans CJK JPをインストールする。 
```bash
sudo pacman -S noto-fonts-cjk noto-fonts-emoji noto-fonts-extra
```

開発用のフォントもいくつかインストールしておく。
```bash
paru -S ttf-plemoljp-bin ttf-hackgen
```

### 日本語入力
入力メソッドフレームワークには[Fcitx5](https://wiki.archlinux.jp/index.php/Fcitx5)を用いる。日本語IMEは一般的にはMozcを用いる。LLMを応用した先進的なIMEとして[[hazkeyをつかう|Hazkey]]や[Karukan](https://github.com/togatoga/karukan) を使うのも良いだろう。私は現在Hazkeyを利用している。

```bash
sudo pacman -S fcitx5-im
```

`~/.config/environment.d/im.conf`に`XMODIFIERS=@im=fcitx`を記述し、X Window System（X11）の標準的な入力プロトコルである XIM（X Input Method）を利用するアプリケーションに対し、Fcitxの使用を指定する。

[[fcitx5でmacライクなime切り替えをする|Fcitx5でMacライクなIME切り替えをする]]ための設定をする。

## グラフィック環境
### グラフィックドライバの導入
使用しているハードウェアに適したドライバをインストールする。Intel CPUの内蔵グラフィックスでは次のようになる。
`sudo pacman -S mesa vulkan-intel`

### デスクトップ環境の構築
[[waylandデスクトップ環境|Waylandデスクトップ環境]]

### ディスプレイマネージャの設定
起動後にユーザを認証し、そのユーザのデスクトップセッションを開始するためのソフトウェアであり、これを[ディスプレイマネージャ](https://wiki.archlinux.jp/index.php/%E3%83%87%E3%82%A3%E3%82%B9%E3%83%97%E3%83%AC%E3%82%A4%E3%83%9E%E3%83%8D%E3%83%BC%E3%82%B8%E3%83%A3)と呼ぶ。ここでは[`greetd`](https://wiki.archlinux.jp/index.php/Greetd)を利用する。`greetd`自体はログイン画面を描画するものではなく、ユーザー認証とセッションの開始を管理するデーモンである。実際のログイン画面には`tuigreet`を利用する。

```bash
sudo pacman -S greetd greetd-tuigreet
```

`greetd` の動作を規定する設定ファイルは `/etc/greetd/config.toml` であり、Niriを用いるのであれば、次の内容のようにする。

```
[default_session]
command = "tuigreet --time --remember --cmd niri-session"
user = "greeter"
```

任意のログインマネージャを無効化したのち、`sudo systemctl enable greetd`によって有効化する。

## オーディオ
Linuxのデスクトップで音声を扱う場合、ハードウェアを認識するためのカーネルドライバだけでなく、アプリケーションとオーディオデバイスの間で音声を管理する仕組みが必要になる。ここでは[`PipeWire`](https://wiki.archlinux.jp/index.php/PipeWire)を利用する。

PipeWireは、低遅延での音声・映像の再生およびキャプチャを目的としたマルチメディアフレームワークである。オーディオサーバーおよびビデオキャプチャサーバーとして機能する。
PipeWire自体は接続ロジックを持たず、WirePlumberなどの外部コンポーネントがストリームの管理と接続を担う。

```bash
sudo pacman -S pipewire pipewire-pulse wireplumber
```

systemdのユーザーユニットを使用してサービスを有効化・起動する。

```bash
systemctl --user enable --now pipewire.service pipewire-pulse.service wireplumber.service
```

### ファームウェア
一部のPCでは、カーネルだけでは内蔵オーディオデバイスを正しく利用できず、追加のファームウェアが必要になる。DellのPCではオーディオデバイスが認識されなかったため、Sound Open FirmwareとALSA用の設定データを導入する。[Linuxのサウンドまわりのデバイスが動かないときはsof-firmwareを入れておけ](https://zenn.dev/botamotch/articles/7aa63cc51d3443)

```bash
sudo pacman -S sof-firmware alsa-ucm-conf
```

## 周辺機能
### Bluetooth
LinuxではBluetoothプロトコルスタックとしてBlueZが利用される。`bluez`がBluetooth機能本体を提供し、`bluez-utils`には`bluetoothctl`など管理用のコマンドが含まれている。

```bash
# install
sudo pacman -S bluez bluez-utils

# check
lsmod | grep btusb

# activate
sudo systemctl enable --now bluetooth.service
```

[Bluetooth - ArchWiki](https://wiki.archlinux.jp/index.php/Bluetooth)

### 電源管理
もしサスペンドや充電の設定など行う場合は使用するハードウェアによって適切に設定する。
[[20260809215901|Inspiron14の電力管理]]

### クラウドストレージ
Google Driveなどのクラウドストレージを通常のファイルシステムに近い形で扱いたい場合は`rclone`を利用できる。

`rclone`はGoogle Driveそのもののクライアントではなく、多数のクラウドストレージサービスに共通して接続できるファイル転送・マウントツールである。
[[20260809215945|rcloneでGoogle Driveをマウント]]

## 基本アプリケーション
ターミナルエミュレータは文字ベースの入出力を行うためのGUIを提供し、その内部で`bash`や`zsh`などのシェルが動作する。ターミナルエミュレータには`alacritty`を利用する。

シェルのデフォルトは`zsh`に切り替える。フレームワークとして[[20260809220623|Oh My Zsh]]をつかう。

```bash
sudo pacman -S alacritty
```

### ファイルマネージャ
コンソールでは`yazi`を使う。グラフィカルなものについては依存が多いのは嫌だったので`Thunar`をつかっている。

```bash
sudo pacman -S yazi thunar
```

### ブラウザ
Firefoxを利用している。

```bash
sudo pacman -S firefox-i18n-ja
```

### エディタやノート
コンソールでは`NeoVim`を使う。たまにしか使わないので多くの環境で使うことのできる`Vim`のほうがいいのかもしれないがストレスは少ないほうがよい。
グラフィカルなものは`Visual Studio Code`を使う。

```bash
sudo pacman -S nvim obsidian
paru -S visual-studio-code-bin
```

### 組版
Arch Linux 版では TeX Live が `texlive-basic`、`texlive-latexextra`、`texlive-fontsextra` などのパッケージに分割されている。特に `texlive-fontsextra` のようなパッケージは非常に大きく、TeX Live を一通り導入していると `pacman -Syu` の際に数百MB規模の TeX 関連アップデートがシステム更新へ頻繁に混ざることがある。それが嫌だったため[[tex-live-のネイティブインストール|TeX Live のネイティブインストール]]を行う。

## dotfiles
[[chezmoiをつかう|chezmoiをつかう]]

## 開発環境
[[20260812191514|開発環境を構築する]]
### Python
[[uvをつかう|uvをつかう]]
### Node.js
[[20260812191142|fnmをつかう]]
