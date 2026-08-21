---
title: "常見問題"
description: "Gentoo 中文社群新手常見問題：從哪開始、Overlay 與官方源的關係、鏡像加速、去哪提問、如何貢獻。"
---

新手最常提出的問題。

{{% details closed="true" title="我是新手，該從哪開始？用官方 Gentoo 還是社群 Live ISO？" %}}

- **想完整安裝一遍、理解每個步驟**：照 [Gentoo 官方 Handbook（中文）](https://wiki.gentoo.org/wiki/Handbook:AMD64/Full/Installation/zh-cn) 逐步安裝。
- **想盡快可用、少花時間配置**：用社群客製的 [KDE 桌面 Live ISO](/download/#live-iso)，開箱即用，自帶中文環境。
- 裝好系統後再[新增 gentoo-zh Overlay](/overlay/)，即可安裝官方源沒有的中文與 CJK 軟體套件。

{{% /details %}}

{{% details closed="true" title="gentoo-zh Overlay 和官方 Portage 源是什麼關係？" %}}

Overlay 是疊加在官方 Portage 樹之上的額外軟體來源，官方源沒有的包（中文輸入法、字型、詞庫，以及跟進新版、打了修補的包）都放在這裡。注意 gentoo-zh 的包只有 `~arch`（測試）關鍵字，沒有 stable 關鍵字，所以穩定系統上不能直接裝；接受測試關鍵字後再安裝的方法見 [Overlay 頁](/overlay/)。

{{% /details %}}

{{% details closed="true" title="下載或同步太慢怎麼辦？" %}}

直連 GitHub 與官方 distfiles 慢時，把 Overlay 同步源與 distfiles 換成教育網鏡像：CERNET、南京大學、南陽理工學院、河南省教育科研網。具體地址與實測結果見 [Overlay 頁](/overlay/)與[鏡像列表](/mirrorlist/)。

{{% /details %}}

{{% details closed="true" title="遇到問題去哪問？" %}}

交流渠道（Telegram、Matrix、IRC 等）列在[關於頁面](/about/)，按需選擇。Overlay 的缺陷請到 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay/issues) 提交 issue。

{{% /details %}}

{{% details closed="true" title="如何為社群貢獻？" %}}

為 Overlay 提交軟體套件或修復缺陷、為網站撰寫文章或補充翻譯，流程見[貢獻指南](/contributing/)。

{{% /details %}}
