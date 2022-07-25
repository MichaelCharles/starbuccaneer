# Starbuccaneer

This tool will only work in Japan.

Programmatically login to Starbucks Wifi in Japan using Puppeteer and Node.

Just run,

```
npx starbuccaneer@latest
```

and then leave it running. It will check for internet connectivity every 10 seconds. If it cannot connect to the internet, it will automatically try to log you into Starbucks Wifi. 

Alternatively, you can install the tool globally with `npm i --location=global starbuccaneer`, and then run it with `starbuccaneer` on the command line.
