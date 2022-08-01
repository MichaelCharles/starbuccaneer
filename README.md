# スタバカニア (Starbuccaneer)

[![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/starbuccaneer)

スターバックスジャパンの Wi-Fi に接続と再接続することを自動化するツールです。

スターバックスジャパンの Wi-Fi はよく切断されますか。再接続は何度でも可能ですが、ログイン画面が出てこなかったり、時間がかかったり、そういう問題がよくあります。starbuccaneer は接続状態を検出し、切断されている場合に自動的に(puppeteer を利用して headless browser でログイン画面を操作して）再接続することができます。

## 使い方

ターミナルから下記のコマンドを実行します。

```bash
npx starbuccaneer@latest
```

また、`npm i --location=global starbuccaneer` でインストールすれば、 `starbuccaneer` だけで実行することも可能です。

## English

Programmatically login to Starbucks Japan Wifi in Japan using Puppeteer and Node.

Starbucks in Japan requires frequent re-login to continue using the Internet, which can be cumbersome and take time. Starbuccaneer attempts to detect disconnected status and automatically relogin.

Just run,

```bash
npx starbuccaneer@latest
```

and then leave it running. It will check for internet connectivity every 10 seconds. If it cannot connect to the internet, it will automatically try to log you into Starbucks Wifi.

Alternatively, you can install the tool globally with `npm i --location=global starbuccaneer`, and then run it with `starbuccaneer` on the command line.
