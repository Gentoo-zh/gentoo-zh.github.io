---
title: "基礎設施開銷"
description: "Gentoo 中文社群各臺伺服器的配置、價格與累計支出，數字隨網站建置更新。"
---

下面的伺服器與服務目前全部由 [Zakk](/contributors/zakkaus/) 個人承擔，沒有商業贊助，也沒有社群經費。另有幾項由其他成員承擔，列在文末。

## 裝置

{{< gz-costs >}}

## 支出

{{< gz-costs table="ledger" >}}

## 計算方式

- 累計從起算日計到今天：按月付費的按已開始的月數計，按年付費的按已付的年數計。因為年付是一次付清整年，所以不按天數攤分。
- 匯率取自下載伺服器年付的實際扣款：100 EUR 折合 115.24 USD、777 CNY、3713.80 TWD、900 HKD。各項幣種不同，表內統一折成美元再合計。

## 各項用途

- **下載伺服器**：[distfiles.gentoozh.org](https://distfiles.gentoozh.org/) 的源站，提供 overlay 的 distfiles 與二進位包，同時作為各高校鏡像的 rsync 同步源。
- **建置伺服器**：每晚建置 overlay 的[二進位包](/posts/2026-07-29-binhost-launch/)。因為 Electron 應用與瀏覽器這類包編譯耗時長，所以用 80 執行緒保證一輪建置內完成。
- **論壇伺服器**：執行 [forum.gentoozh.org](https://forum.gentoozh.org/)。
- **Matrix 與橋接伺服器**：執行 Matrix 服務端，以及 Telegram、IRC、Matrix 之間的訊息轉發。
- **高可用節點**：異地探測鏡像與各網站，與主力機不在同一機房，避免同時失效。
- **域名**：[gentoozh.org](/posts/2026-07-01-domain-migration/) 與 gentootw.org，都在 Porkbun 註冊。
- **Cloudflare Workers**：託管官網與鏡像落地頁，付費方案提供的是請求配額與 CPU 時間。
- **郵件傳送**：論壇的註冊驗證與通知郵件由 Hostinger 的發信服務投遞，不自建 SMTP，因為自建 IP 難以透過各家郵件服務商的投遞策略。
- **監控與告警**：執行 Grafana 與 Alertmanager，狀態公開在 [status.gentoozh.org](https://status.gentoozh.org/)。

## 由其他成員承擔

下面幾項不在上面的表裡，費用由他們自己承擔：

- **gentoocn.org**：[Clover](/contributors/simplewrite/) 續費。
- **gentoo.org.cn**：一位不願具名的老社群成員續費。
- **早前的下載站**：伺服器由 [peeweep](/contributors/peeweep/) 提供，現已關閉，Live ISO 與 distfiles 遷至上表的下載伺服器。

## 參與方式

社群不接受捐款。需要的是 ebuild、缺陷修復與文件，流程見[貢獻指南](/contributing/)。
