---
title: Windowsのインストール
created: 2026-05-06 22:41:13
modified: 2026-08-12 16:49:50
description: null
tags: []
aliases:
  - "20260506224113"
---

# Windowsのインストール
## はじめに
本ドキュメントは、Dell Inspiron 14（Intel 第11世代以降のプロセッサ搭載モデル）において、Arch Linuxとのデュアルブート環境を構築することを前提としたWindows 11のクリーンインストール手順をまとめたものである。Intel VMDによるストレージ認識の問題、およびネットワーク接続制限を回避しながら、適切なパーティション構成とドライバ導入を実現することを目的としてする。

[Windows 11 クリーン インストール](https://www.microsoft.com/ja-jp/windowsinsider/cleaninstall)
このページの内容に基づき作成する。

## 事前準備
### インストール メディアを作成する
1. USB ドライブを Windows PC に接続する。
2. Windows 11 メディア作成ツールをダウンロードし、管理者として実行する。
3. ライセンス条項に同意し、言語とエディションを選択する。
4. USB ドライブを選択してメディアを作成する。
    
### ドライバーの用意
1. Dellのサポートサイトから、対象モデルの「Intel Rapid Storage Technology Driver」をダウンロードする。
2. ダウンロードしたファイルを展開（解凍）し、中身のフォルダ一式を、作成したWindowsインストールUSBのルートディレクトリにコピーする。 インストーラー（.exe）そのものではなく、展開後のドライバファイル群（.infや.sysが含まれるもの）が必要である。
3. セットアップ完了後にインターネットに接続するため、Intel BE2xx/AX4xx/AX2xx/9xxx Wi-Fi Driverをダウンロードしてコピーしておく。

### ファイルをバックアップする
保持したいすべてのコンテンツを、クリーン インストールする PC からバックアップする。これ以降の操作で、ディスク上のすべてのデータは消去される。

## Windows 11 のクリーン インストール
### 起動とドライバーの読み込み
1. クリーン インストールが必要な PC に USB ドライブを挿入する。
2. PCを起動（または再起動）し、F12キー等を連打してブートメニューを表示させ、USB ドライブから起動する。
3. 言語、時間、キーボードの設定を行い、「今すぐインストール」を選択する。
4. インストール場所を選択する画面で「ドライブが見つかりません」と表示されることを確認し、「ドライバーの読み込み」をクリックする。
5. 「参照」からUSBドライブ内のドライバーフォルダを指定し、**「Intel RST VMD Managed Controller」**を選択してロードする。

### パーティションの手動設定 (diskpart)
ストレージが認識されたら、画面を進めずに Shift + F10を押してコマンドプロンプトを起動し、以下のコマンドを順に入力してパーティションを作成する。
```
list disk
select disk 0
clean
convert gpt
create partition efi size=1024
format quick fs=fat32 label="System"
create partition msr size=16
create partition primary size=262144
format quick fs=ntfs label="Windows"
exit
exit
```

## インストール後
1. Windowsが再起動され、初期セットアップ画面が表示される。
2. ネットワーク接続の回避**: 「ネットワークに接続しましょう」という画面で、Wi-Fiが認識されていない場合はShift + F10キーを押す。
3. コマンドプロンプトに `OOBE\BYPASSNRO` と入力してEnterキーを押すと、PCが再起動される。
4. 再起動後のセットアップ画面で「インターネットに接続していません」という選択肢が現れるので、これを選択してローカルアカウントを作成し、デスクトップ画面まで進める。
5. USBメモリに保存しておいた「Intel BE2xx/AX4xx/AX2xx/9xxx Wi-Fi Driver」を実行し、ネットワークに接続可能な状態にする。
6. SupportAssistを実行する。
7. [[Windowsのセットアップ]]を行う。