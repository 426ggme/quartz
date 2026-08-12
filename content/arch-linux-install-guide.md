---
title: Arch Linux Install Guide
created: 2026-08-09 02:32:44
modified: 2026-08-09 02:32:44
description: null
tags: []
aliases:
  - "20260809023244"
---

# Arch Linux Install Guide
## はじめに
基本的には[インストールガイド - ArchWiki](https://wiki.archlinux.jp/index.php/%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%82%AC%E3%82%A4%E3%83%89)を参照しつつ進める。しかしWikiの構造上いくつかのページを巡回しOSの機能に対する理解を深めつつインストールをしていくこととなる。本来そうあるべきであるのだが一旦周辺の知識を無視しつつインストールを進めるために過去に行なった手順のみを示す。

> [!warning]
> このノートは特定時点の作業記録であり、最新の推奨手順を保証するものではない。インストールやパーティション操作はデータ消失につながるため、実行前に重要なデータをバックアップし、対象ディスクを`lsblk -f`と`fdisk -l`で確認する。コマンド中のデバイス名、パーティション番号、UUID、ホスト名は、自分の環境で確認した値へ読み替える。

---

## Windowsとのデュアルブートを行う場合
インストールに先立ち、Windows側で以下の設定変更を行う。[Windows とのデュアルブート](https://wiki.archlinux.jp/index.php/Windows_%E3%81%A8%E3%81%AE%E3%83%87%E3%83%A5%E3%82%A2%E3%83%AB%E3%83%96%E3%83%BC%E3%83%88)を参照する。
### システム設定の変更
- まず、起動モードの確認を行う。`powershell`上で`msinfo32`を実行し、BIOSモードがUEFIであることを確認する。現代的なコンピュータならば多くの場合でUEFIのはずだ。
- 次に高速スタートアップの無効化を行う。コントロールパネル > デバイス > 電源の管理よりオフにする。管理者権限のPowerShellで`Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power" -Name HiberbootEnabled`を実行し、値が`0`であることを確認する。
- ハイバネーションの無効化も行う。管理者権限のプロンプトで`powercfg /H off`を実行する。このコマンドでは高速スタートアップもオフになるので、上の作業は不要だったことになる。
- 最後にセキュアブートの無効化を行う。UEFI設定画面からSecure Bootを`Disabled`に設定する。

### 領域の確保
この作業はWindowsと同一のSSDにLinuxをインストールする場合のみ行えばよい。ディスク管理ツールを用い、Linux用の未割り当て領域を作成する。スワップ領域を含めたサイズを確保する。

しかし、Windows Setupで作成されたESPは小さい場合がある。このためルート領域を確保できたとしても、ブート領域にLinuxカーネルやinitramfsを格納できない問題に直面するだろう。この場合の対策としてパーテーション作成時にESP領域に含まれる不要なフォント等を削除する、あるいは[[windowsのインストール|Windowsのインストール]]を改めて行い、ESP領域を含めて適切な領域を確保することが挙げられる。可能であれば後者をおすすめする。どうやら新しくESP領域を作成して、そこからWindowsのブート領域を参照することも可能らしいがシステムとして複雑となるので私は好まない。。このためルート領域を確保できたとしても、ブート領域にLinuxカーネルやinitramfsを格納できない問題に直面するだろう。この場合の対策としてパーテーション作成時にESP領域に含まれる不要なフォント等を削除する、あるいは[[windowsのインストール|Windowsのインストール]]を改めて行い、ESP領域を含めて適切な領域を確保することが挙げられる。可能であれば後者をおすすめする。どうやら新しくESP領域を作成して、そこからWindowsのブート領域を参照することも可能らしいがシステムとして複雑となるので私は好まない。

---

## インストールメディアの作成と検証
### イメージの取得と検証
[Arch Linux - Downloads](https://archlinux.org/download/)より各種ファイルを取得する。

**1. ISOファイルの取得**
`BitTorrent`を利用したダウンロードが推奨される。Magnet linkを都度踏めばよい。非推奨とはいえ、JAIST ミラーから Arch Linux の ISO ファイル（例: `archlinux-2025.10.01-x86_64.iso`）と署名ファイル（`.sig`）を取得することも可能。

**2. 署名の検証**
GnuPG をインストールし、ISO ファイルの署名を検証する。ファイル名は適宜置き換える。
```pwsh
winget install -e --id GnuPG.Gpg4win
Get-FileHash .\archlinux-202X.XX.XX-x86_64.iso -Algorithm SHA256
gpg --keyserver-options auto-key-retrieve --verify archlinux-202X.XX.XX-x86_64.iso.sig
```

### 書き込み
Rufusを使用し、パーティション構成を`GPT`、書き込みモードを`dd`に指定してUSBメモリへ書き込む。

---
  
## ライブ環境での作業
### ネットワークとキーボードの設定
- JIS配列のキーボードを使用しているなら`loadkeys jp106`を実行。
- Wi-Fi接続については`iwctl`を使用する。
	```bash
	ip link  # インターフェイス名の確認
	iwctl
	station wlan0 scan
	station wlan0 connect Buffalo-A-3570
	```
	
### パーティション
ラップトップPCのようにWIndowsとArchLinuxで1枚のSSDを共有する場合には[[既存ディスクに対するパーティション作成|既存ディスクに対するパーティション作成]]を参照する。まっさらなSSDを使う場合には[[新規ディスクに対するパーティション作成|新規ディスクに対するパーティション作成]]を参照する。

---

## システムのインストールと設定
### パッケージの導入
`pacstrap`を用い、ベースシステム、カーネル、ファームウェア、およびプロセッサに応じたマイクロコードをインストールする。`intel-ucode`をこの段階で導入しておく。
```
pacstrap -K /mnt base linux linux-firmware intel-ucode
```

### 構成設定
#### fstab生成
マウント状態を反映した `fstab` を生成する。
```
genfstab -U /mnt >> /mnt/etc/fstab
cat /mnt/etc/fstab  # 内容の確認
```
#### Chroot
新システムへ移行し、内部の設定を行う。
```
arch-chroot /mnt
```

#### 追加パッケージの導入
運用に不可欠なエディタ、ネットワーク管理ツール、およびブート管理ツールなどを導入する。
```
pacman -S vi sudo networkmanager efibootmgr
```

#### 時刻設定
タイムゾーンを設定し、ハードウェアクロックを調整する。
```
ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
hwclock --systohc
```

#### ロケール設定
`/etc/locale.gen` で `en_US.UTF-8 UTF-8` と `ja_JP.UTF-8 UTF-8` をアンコメントし、生成する。システム言語は、TTYでの文字化けを防ぐため英語に設定する。
```
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf
```

#### ネットワーク設定
ホスト名を定義し、`NetworkManager` を有効化する。
```
echo "example-host" > /etc/hostname
systemctl enable NetworkManager
```

---

### ブートローダー（systemd-boot）の設定
#### インストール
EFIシステムパーティション（ESP）を `/boot` にマウントした状態で実行する。
```
bootctl install
```
#### 設定ファイルの作成
`/boot/loader/loader.conf` にデフォルトのエントリとタイムアウトを記述する。

```
default  arch.conf
timeout  3
console-mode max
editor   no
```

起動エントリ `/boot/loader/entries/arch.conf` を作成する。`initrd` の順序は、`options` には `blkid` で確認したルートパーティション（p6）のUUIDを指定する。

```
title   Arch Linux
linux   /vmlinuz-linux
initrd  /intel-ucode.img
initrd  /initramfs-linux.img
options root=UUID=cbbcf583-7bd8-4388-9966-1a86995c187a rw
```

---

### ユーザー設定と再起動
#### パスワードとユーザー作成
rootパスワードの設定と、管理権限を持つ一般ユーザーを作成する。

```
passwd
useradd -m -G wheel {username}
passwd {username}
```
#### sudo権限の付与
`visudo` を実行し、`%wheel ALL=(ALL:ALL) ALL` の行をアンコメントする。
#### 起動順序の調整と完了
chrootを抜け、アンマウント後に再起動する。

```
exit
umount -R /mnt
reboot
```
