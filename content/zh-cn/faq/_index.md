---
title: "常见问题"
description: "Gentoo 中文社区新手常见问题：从哪开始、Overlay 与官方源的关系、镜像加速、去哪提问、如何贡献。"
---

新手最常提出的问题。

{{% details closed="true" title="我是新手，该从哪开始？用官方 Gentoo 还是社区 Live ISO？" %}}

- **想完整安装一遍、理解每个步骤**：照 [Gentoo 官方 Handbook（中文）](https://wiki.gentoo.org/wiki/Handbook:AMD64/Full/Installation/zh-cn) 逐步安装。
- **想尽快可用、少花时间配置**：用社区定制的 [KDE 桌面 Live ISO](/download/#live-iso)，开箱即用，自带中文环境。
- 装好系统后再[添加 gentoo-zh Overlay](/overlay/)，即可安装官方源没有的中文与 CJK 软件包。

{{% /details %}}

{{% details closed="true" title="gentoo-zh Overlay 和官方 Portage 源是什么关系？" %}}

Overlay 是叠加在官方 Portage 树之上的额外软件来源，官方源没有的包（中文输入法、字体、词库，以及跟进新版、打了补丁的包）都放在这里。注意 gentoo-zh 的包只有 `~arch`（测试）关键字，没有 stable 关键字，所以稳定系统上不能直接装；接受测试关键字后再安装的方法见 [Overlay 页](/overlay/)。

{{% /details %}}

{{% details closed="true" title="下载或同步太慢怎么办？" %}}

直连 GitHub 与官方 distfiles 慢时，把 Overlay 同步源与 distfiles 换成教育网镜像：CERNET、南京大学、南阳理工学院、河南省教育科研网。具体地址与实测结果见 [Overlay 页](/overlay/)与[镜像列表](/mirrorlist/)。

{{% /details %}}

{{% details closed="true" title="遇到问题去哪问？" %}}

交流渠道（Telegram、Matrix、IRC 等）列在[关于页面](/about/)，按需选择。Overlay 的缺陷请到 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay/issues) 提交 issue。

{{% /details %}}

{{% details closed="true" title="如何为社区贡献？" %}}

为 Overlay 提交软件包或修复缺陷、为网站撰写文章或补充翻译，流程见[贡献指南](/contributing/)。

{{% /details %}}
