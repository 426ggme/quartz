# Readme

[ggme.net](https://ggme.net) のソースコードである。Obsidianで管理している公開ノートを、静的なWebサイトとして配信する。

## Quartzについて

このサイトは、Jacky Zhao氏が開発しているオープンソースの静的サイトジェネレーター[Quartz](https://quartz.jzhao.xyz/)をもとに構築している。Quartzは、Markdownで書かれたデジタルガーデンやノートを、リンク、全文検索、グラフ表示などを備えたWebサイトとして公開するためのツールである。

- 公式サイト: [quartz.jzhao.xyz](https://quartz.jzhao.xyz/)
- 参照元リポジトリ: [jackyzha0/quartz](https://github.com/jackyzha0/quartz)

## ローカルでの確認

Node.js 22以上とnpm 10.9.2以上が必要である。

1. 依存関係をインストールする。

   ```sh
   npm ci
   ```

2. 公開するObsidianノートを `~/obsidiannotes/Public` に配置する。別の場所を使う場合は、`VAULT_PUBLIC` にそのパスを指定する。

3. 開発サーバーを起動する。

   ```sh
   npm run serve
   ```

   ノートは `content/` に同期され、Quartzの開発サーバーが起動する。静的ファイルだけを生成する場合は `npm run build` を実行する。生成物は `public/` に出力される。

   ```sh
   VAULT_PUBLIC=/path/to/vault/Public npm run build
   ```

## デプロイ

`main` ブランチへpushすると、GitHub Actionsの [Deploy Quartz site](.github/workflows/deploy.yaml) が実行される。ワークフローはサイトをビルドし、Tailscale経由で配信サーバーへ接続して、`public/` の内容を次の場所へ `rsync --delete` で同期する。

## ライセンス

Quartzのソースコードは[MIT License](LICENSE.txt)のもとで公開されている。Copyright (c) 2021 Jacky Zhao.

MIT Licenseは、著作権表示とライセンス文を含めることを条件に、ソフトウェアの利用、複製、変更、配布などを許可している。ソフトウェアは無保証で提供される。正確な条件については [LICENSE.txt](LICENSE.txt) を参照すること。

サイト内の文章、画像、その他のコンテンツについては、個別に明記されていない限り、このMIT Licenseの対象には含まれない。
