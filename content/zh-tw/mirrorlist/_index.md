---
title: "鏡像列表"
---

Gentoo 換源分為兩部分：

- **Portage 樹**：軟體套件的 ebuild 與後設資料，推薦用 git 同步，也可以用 rsync 同步
- **Distfiles**：軟體套件原始碼，走 HTTP，由 `make.conf` 的 `GENTOO_MIRRORS` 指定

下面是各鏡像站的**實測彙總表**，列出每個鏡像站的 distfiles 地址和支援的同步方式；具體配置方法見下方的配置教學。

{{< callout type="info" >}}
**推薦組合**：用 **git** 同步 Portage 樹（增量更新）+ 就近的 **distfiles** 源。不確定填哪個，照表裡離你近的地區選即可。
{{< /callout >}}

## 鏡像總覽

所有節點均逐項實測，✓ = 實測可用。distfiles 地址即 `GENTOO_MIRRORS` 要填的值；git / rsync 的具體同步地址見下方教學。

| 鏡像 | 地區 | distfiles 地址 | git | rsync |
| --- | --- | --- | :-: | :-: |
| 清華 TUNA | 華北·北京 | `https://mirrors.tuna.tsinghua.edu.cn/gentoo` | ✓ | ✓ |
| 北外 BFSU | 華北·北京 | `https://mirrors.bfsu.edu.cn/gentoo` | ✓ | ✓ |
| 中科大 USTC | 華東·合肥 | `https://mirrors.ustc.edu.cn/gentoo` | ✓ | ✓ |
| 浙大 ZJU | 華東·杭州 | `https://mirrors.zju.edu.cn/gentoo` | ✓ | |
| 南大 NJU | 華東·南京 | `https://mirrors.nju.edu.cn/gentoo` | ✓ | |
| 山大 SDU | 華東·青島 | `https://mirrors.sdu.edu.cn/gentoo` | ✓ | |
| 華科 HUST | 華中·武漢 | `https://mirrors.hust.edu.cn/gentoo` | ✓ | |
| 南科大 SUSTech | 華南·深圳 | `https://mirrors.sustech.edu.cn/gentoo` | | |
| 哈工大 HIT | 東北·哈爾濱 | `https://mirrors.hit.edu.cn/gentoo` | | |
| 蘭大 LZU | 西北·蘭州 | `https://mirror.lzu.edu.cn/gentoo` | | |
| 阿里雲 | 全國·CDN | `https://mirrors.aliyun.com/gentoo` | | |
| 網易 163 | 全國·CDN | `https://mirrors.163.com/gentoo` | | |
| CERNET | 全國·就近 | `https://mirrors.cernet.edu.cn/gentoo` | | |
| CICKU | 香港 | `https://hk.mirrors.cicku.me/gentoo` | | |
| PlanetUnix | 香港 | `https://hippocamp.cn.ext.planetunix.net/pub/gentoo` | | ✓ |
| xTom | 香港 | `https://mirror.xtom.com.hk/gentoo` | | |
| Rackspace | 香港 | `https://mirror.rackspace.com/gentoo` | | |
| aditsu | 香港 | `http://gentoo.aditsu.net:8000`（HTTP） | | |
| NCHC | 臺灣 | `http://ftp.twaren.net/Linux/Gentoo` | | ✓ |
| CICKU | 臺灣 | `https://tw.mirrors.cicku.me/gentoo` | | |
| Freedif | 新加坡 | `https://mirror.freedif.org/gentoo` | | |
| CICKU | 新加坡 | `https://sg.mirrors.cicku.me/gentoo` | | |
| PlanetUnix | 新加坡 | `https://enceladus.sg.ext.planetunix.net/pub/gentoo` | | |

## 配置教學

{{% details title="使用 git 同步 Portage 樹（推薦）" %}}

**實測可用的 git 源：**

| 鏡像 | 同步地址 |
| --- | --- |
| 清華 TUNA | `https://mirrors.tuna.tsinghua.edu.cn/git/gentoo-portage.git` |
| 中科大 USTC | `https://mirrors.ustc.edu.cn/gentoo.git` |
| 浙大 ZJU | `https://mirrors.zju.edu.cn/git/gentoo-portage.git` |
| 南大 NJU | `https://mirrors.nju.edu.cn/git/gentoo-portage.git` |
| 北外 BFSU | `https://mirrors.bfsu.edu.cn/git/gentoo-portage.git` |
| 山大 SDU | `https://mirrors.sdu.edu.cn/git/gentoo-portage.git` |
| 華科 HUST | `https://mirrors.hust.edu.cn/git/gentoo-portage.git` |
| GitHub（國外） | `https://github.com/gentoo-mirror/gentoo.git` |

**首次換用 git 同步**：編輯 `/etc/portage/repos.conf/gentoo.conf`：

```ini
[gentoo]
location = /var/db/repos/gentoo
sync-type = git
sync-uri = https://github.com/gentoo-mirror/gentoo.git
auto-sync = yes
```

刪掉舊的 rsync 目錄後再同步：

```bash
rm -rf /var/db/repos/gentoo
emerge --sync
```

**已在用 git，僅換源**：改上面的 `sync-uri`，再到倉庫目錄把 git remote 一起指過去：

```bash
cd /var/db/repos/gentoo
git remote set-url origin <新的 sync-uri>
emerge --sync
```

{{% /details %}}

{{% details title="使用 rsync 同步 Portage 樹" %}}

{{< callout type="warning" >}}
多數鏡像只提供 git / distfiles，並不提供 rsync 同步。下面這些鏡像實測能列出 `gentoo-portage` 模組。
{{< /callout >}}

| 鏡像 | 同步地址 |
| --- | --- |
| 清華 TUNA | `rsync://mirrors.tuna.tsinghua.edu.cn/gentoo-portage` |
| 中科大 USTC | `rsync://rsync.mirrors.ustc.edu.cn/gentoo-portage` |
| 北外 BFSU | `rsync://mirrors.bfsu.edu.cn/gentoo-portage` |
| 臺灣 NCHC | `rsync://ftp.twaren.net/gentoo-portage` |
| 香港 PlanetUnix | `rsync://hippocamp.cn.ext.planetunix.net/gentoo-portage` |

編輯 `/etc/portage/repos.conf/gentoo.conf`，把 `sync-uri` 指向上面任一地址：

```ini
[gentoo]
location = /var/db/repos/gentoo
sync-type = rsync
sync-uri = rsync://mirrors.bfsu.edu.cn/gentoo-portage
auto-sync = yes
```

然後執行 `emerge --sync`。

{{% /details %}}

{{% details title="Distfiles 配置（GENTOO_MIRRORS）" %}}

在 `/etc/portage/make.conf` 中填入總覽表裡的 distfiles 地址，可填多個（Portage 按順序嘗試，前面的優先）：

```bash
GENTOO_MIRRORS="https://mirrors.bfsu.edu.cn/gentoo https://mirrors.tuna.tsinghua.edu.cn/gentoo https://mirrors.ustc.edu.cn/gentoo"
```

配好 Portage 與 Distfiles 後，執行 `emerge --sync` 更新。

{{% /details %}}

官方完整列表見 [下載鏡像](https://www.gentoo.org/downloads/mirrors/) 與 [rsync 鏡像](https://www.gentoo.org/support/rsync-mirrors/)。社群 overlay 的換源見 [Overlay 頁的中國內陸鏡像加速一節](/overlay/#中國內陸鏡像加速)。
