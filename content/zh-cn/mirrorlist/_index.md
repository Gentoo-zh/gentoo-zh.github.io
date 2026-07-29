---
title: "镜像列表"
---

Gentoo 换源分为两部分：

- **Portage 树**：软件包的 ebuild 与元数据，推荐用 git 同步，也可以用 rsync 同步
- **Distfiles**：软件包源码，走 HTTP，由 `make.conf` 的 `GENTOO_MIRRORS` 指定

下面是各镜像站的**实测汇总表**，列出每个镜像站的 distfiles 地址和支持的同步方式；具体配置方法见下方的配置教程。

{{< callout type="info" >}}
**推荐组合**：用 **git** 同步 Portage 树（增量更新）+ 就近的 **distfiles** 源。不确定填哪个，照表里离你近的地区选即可。
{{< /callout >}}

## 镜像总览

所有节点均逐项实测，✓ = 实测可用。distfiles 地址即 `GENTOO_MIRRORS` 要填的值；git / rsync 的具体同步地址见下方教程。

| 镜像 | 地区 | distfiles 地址 | git | rsync |
| --- | --- | --- | :-: | :-: |
| 清华 TUNA | 华北·北京 | `https://mirrors.tuna.tsinghua.edu.cn/gentoo` | ✓ | ✓ |
| 北外 BFSU | 华北·北京 | `https://mirrors.bfsu.edu.cn/gentoo` | ✓ | ✓ |
| 中科大 USTC | 华东·合肥 | `https://mirrors.ustc.edu.cn/gentoo` | ✓ | ✓ |
| 浙大 ZJU | 华东·杭州 | `https://mirrors.zju.edu.cn/gentoo` | ✓ | |
| 南大 NJU | 华东·南京 | `https://mirrors.nju.edu.cn/gentoo` | ✓ | |
| 山大 SDU | 华东·青岛 | `https://mirrors.sdu.edu.cn/gentoo` | ✓ | |
| 华科 HUST | 华中·武汉 | `https://mirrors.hust.edu.cn/gentoo` | ✓ | |
| 南科大 SUSTech | 华南·深圳 | `https://mirrors.sustech.edu.cn/gentoo` | | |
| 哈工大 HIT | 东北·哈尔滨 | `https://mirrors.hit.edu.cn/gentoo` | | |
| 兰大 LZU | 西北·兰州 | `https://mirror.lzu.edu.cn/gentoo` | | |
| 阿里云 | 全国·CDN | `https://mirrors.aliyun.com/gentoo` | | |
| 网易 163 | 全国·CDN | `https://mirrors.163.com/gentoo` | | |
| CERNET | 全国·就近 | `https://mirrors.cernet.edu.cn/gentoo` | | |
| CICKU | 香港 | `https://hk.mirrors.cicku.me/gentoo` | | |
| PlanetUnix | 香港 | `https://hippocamp.cn.ext.planetunix.net/pub/gentoo` | | ✓ |
| xTom | 香港 | `https://mirror.xtom.com.hk/gentoo` | | |
| Rackspace | 香港 | `https://mirror.rackspace.com/gentoo` | | |
| aditsu | 香港 | `http://gentoo.aditsu.net:8000`（HTTP） | | |
| NCHC | 台湾 | `http://ftp.twaren.net/Linux/Gentoo` | | ✓ |
| CICKU | 台湾 | `https://tw.mirrors.cicku.me/gentoo` | | |
| Freedif | 新加坡 | `https://mirror.freedif.org/gentoo` | | |
| CICKU | 新加坡 | `https://sg.mirrors.cicku.me/gentoo` | | |
| PlanetUnix | 新加坡 | `https://enceladus.sg.ext.planetunix.net/pub/gentoo` | | |

## 配置教程

{{% details title="使用 git 同步 Portage 树（推荐）" %}}

**实测可用的 git 源：**

| 镜像 | 同步地址 |
| --- | --- |
| 清华 TUNA | `https://mirrors.tuna.tsinghua.edu.cn/git/gentoo-portage.git` |
| 中科大 USTC | `https://mirrors.ustc.edu.cn/gentoo.git` |
| 浙大 ZJU | `https://mirrors.zju.edu.cn/git/gentoo-portage.git` |
| 南大 NJU | `https://mirrors.nju.edu.cn/git/gentoo-portage.git` |
| 北外 BFSU | `https://mirrors.bfsu.edu.cn/git/gentoo-portage.git` |
| 山大 SDU | `https://mirrors.sdu.edu.cn/git/gentoo-portage.git` |
| 华科 HUST | `https://mirrors.hust.edu.cn/git/gentoo-portage.git` |
| GitHub（国外） | `https://github.com/gentoo-mirror/gentoo.git` |

**首次换用 git 同步**：编辑 `/etc/portage/repos.conf/gentoo.conf`：

```ini
[gentoo]
location = /var/db/repos/gentoo
sync-type = git
sync-uri = https://mirrors.bfsu.edu.cn/git/gentoo-portage.git
auto-sync = yes
```

删掉旧的 rsync 目录后再同步：

```bash
rm -rf /var/db/repos/gentoo
emerge --sync
```

**已在用 git，仅换源**：改上面的 `sync-uri`，再到仓库目录把 git remote 一起指过去：

```bash
cd /var/db/repos/gentoo
git remote set-url origin <新的 sync-uri>
emerge --sync
```

{{% /details %}}

{{% details title="使用 rsync 同步 Portage 树" %}}

{{< callout type="warning" >}}
多数镜像只提供 git / distfiles，并不提供 rsync 同步。下面这些镜像实测能列出 `gentoo-portage` 模块。
{{< /callout >}}

| 镜像 | 同步地址 |
| --- | --- |
| 清华 TUNA | `rsync://mirrors.tuna.tsinghua.edu.cn/gentoo-portage` |
| 中科大 USTC | `rsync://rsync.mirrors.ustc.edu.cn/gentoo-portage` |
| 北外 BFSU | `rsync://mirrors.bfsu.edu.cn/gentoo-portage` |
| 台湾 NCHC | `rsync://ftp.twaren.net/gentoo-portage` |
| 香港 PlanetUnix | `rsync://hippocamp.cn.ext.planetunix.net/gentoo-portage` |

编辑 `/etc/portage/repos.conf/gentoo.conf`，把 `sync-uri` 指向上面任一地址：

```ini
[gentoo]
location = /var/db/repos/gentoo
sync-type = rsync
sync-uri = rsync://mirrors.bfsu.edu.cn/gentoo-portage
auto-sync = yes
```

然后执行 `emerge --sync`。

{{% /details %}}

{{% details title="Distfiles 配置（GENTOO_MIRRORS）" %}}

在 `/etc/portage/make.conf` 中填入总览表里的 distfiles 地址，可填多个（Portage 按顺序尝试，前面的优先）：

```bash
GENTOO_MIRRORS="https://mirrors.bfsu.edu.cn/gentoo https://mirrors.tuna.tsinghua.edu.cn/gentoo https://mirrors.ustc.edu.cn/gentoo"
```

配好 Portage 与 Distfiles 后，执行 `emerge --sync` 更新。

{{% /details %}}

官方完整列表见 [下载镜像](https://www.gentoo.org/downloads/mirrors/) 与 [rsync 镜像](https://www.gentoo.org/support/rsync-mirrors/)。社区 overlay 的换源见 [Overlay 页的国内镜像加速一节](/overlay/#国内镜像加速)。
