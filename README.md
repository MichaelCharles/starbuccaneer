# スタバカニア (Starbuccaneer)

## 日本語の説明書

日本のスタバでのみ動作します。

PuppeteerとNodeを使って、日本のスターバックスのWifiに自動的にログインします。

実行すると、ターミナルから下記のコマンドを実行します。

```bash
npx starbuccaneer@latest
```

起動したままにしておくと、スターバックスのWifiにサインインしたままになります。

また、`npm i --location=global starbuccaneer` でツールをグローバルにインストールし、ターミナルで `starbuccaneer` と実行することも可能です。


## English Instructions

This tool will only work in Japan.

Programmatically login to Starbucks Wifi in Japan using Puppeteer and Node.

Just run,

```bash
npx starbuccaneer@latest
```

and then leave it running. It will check for internet connectivity every 10 seconds. If it cannot connect to the internet, it will automatically try to log you into Starbucks Wifi. 

Alternatively, you can install the tool globally with `npm i --location=global starbuccaneer`, and then run it with `starbuccaneer` on the command line.
