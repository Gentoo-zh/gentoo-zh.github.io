---
title: "Mirror List"
---

Switching Gentoo's sources happens in two parts:

- **Portage tree**: the ebuilds and metadata for packages. Sync with git (recommended), or use rsync.
- **Distfiles**: the package source tarballs, served over HTTP and set by `GENTOO_MIRRORS` in `make.conf`.

Below is a **tested summary table** listing each mirror's distfiles URL and the sync methods it supports; the per-method config is in the collapsible tutorials further down.

{{< callout type="info" >}}
**Recommended setup**: sync the Portage tree over **git** (incremental updates) plus a nearby **distfiles** mirror. If you're not sure what to put, just pick whichever region in the table is closest to you.
{{< /callout >}}

## Overview

Every node has been individually tested; ✓ = verified working. The distfiles URL is the value you put in `GENTOO_MIRRORS`; the exact git / rsync sync URLs are in the tutorials below.

| Mirror | Region | distfiles URL | git | rsync |
| --- | --- | --- | :-: | :-: |
| Tsinghua TUNA | North China · Beijing | `https://mirrors.tuna.tsinghua.edu.cn/gentoo` | ✓ | ✓ |
| BFSU | North China · Beijing | `https://mirrors.bfsu.edu.cn/gentoo` | ✓ | ✓ |
| USTC | East China · Hefei | `https://mirrors.ustc.edu.cn/gentoo` | ✓ | ✓ |
| ZJU | East China · Hangzhou | `https://mirrors.zju.edu.cn/gentoo` | ✓ | |
| NJU | East China · Nanjing | `https://mirrors.nju.edu.cn/gentoo` | ✓ | |
| SDU | East China · Qingdao | `https://mirrors.sdu.edu.cn/gentoo` | ✓ | |
| HUST | Central China · Wuhan | `https://mirrors.hust.edu.cn/gentoo` | ✓ | |
| SUSTech | South China · Shenzhen | `https://mirrors.sustech.edu.cn/gentoo` | | |
| HIT | Northeast · Harbin | `https://mirrors.hit.edu.cn/gentoo` | | |
| LZU | Northwest · Lanzhou | `https://mirror.lzu.edu.cn/gentoo` | | |
| Alibaba Cloud | Nationwide · CDN | `https://mirrors.aliyun.com/gentoo` | | |
| NetEase 163 | Nationwide · CDN | `https://mirrors.163.com/gentoo` | | |
| CERNET | Nationwide · geo-routed | `https://mirrors.cernet.edu.cn/gentoo` | | |
| CICKU | Hong Kong | `https://hk.mirrors.cicku.me/gentoo` | | |
| PlanetUnix | Hong Kong | `https://hippocamp.cn.ext.planetunix.net/pub/gentoo` | | ✓ |
| xTom | Hong Kong | `https://mirror.xtom.com.hk/gentoo` | | |
| Rackspace | Hong Kong | `https://mirror.rackspace.com/gentoo` | | |
| aditsu | Hong Kong | `http://gentoo.aditsu.net:8000` (HTTP) | | |
| NCHC | Taiwan | `http://ftp.twaren.net/Linux/Gentoo` | | ✓ |
| CICKU | Taiwan | `https://tw.mirrors.cicku.me/gentoo` | | |
| Freedif | Singapore | `https://mirror.freedif.org/gentoo` | | |
| CICKU | Singapore | `https://sg.mirrors.cicku.me/gentoo` | | |
| PlanetUnix | Singapore | `https://enceladus.sg.ext.planetunix.net/pub/gentoo` | | |

## Configuration tutorials

{{% details title="Sync the Portage tree with git (recommended)" %}}

**Tested working git sources:**

| Mirror | Sync URL |
| --- | --- |
| Tsinghua TUNA | `https://mirrors.tuna.tsinghua.edu.cn/git/gentoo-portage.git` |
| USTC | `https://mirrors.ustc.edu.cn/gentoo.git` |
| ZJU | `https://mirrors.zju.edu.cn/git/gentoo-portage.git` |
| NJU | `https://mirrors.nju.edu.cn/git/gentoo-portage.git` |
| BFSU | `https://mirrors.bfsu.edu.cn/git/gentoo-portage.git` |
| SDU | `https://mirrors.sdu.edu.cn/git/gentoo-portage.git` |
| HUST | `https://mirrors.hust.edu.cn/git/gentoo-portage.git` |
| GitHub (overseas) | `https://github.com/gentoo-mirror/gentoo.git` |

**Switching to git for the first time**: edit `/etc/portage/repos.conf/gentoo.conf`:

```ini
[gentoo]
location = /var/db/repos/gentoo
sync-type = git
sync-uri = https://mirrors.bfsu.edu.cn/git/gentoo-portage.git
auto-sync = yes
```

Remove the old rsync directory, then sync:

```bash
rm -rf /var/db/repos/gentoo
emerge --sync
```

**Already on git, just changing mirrors**: update the `sync-uri` above, then point the git remote at the new URL in the repo directory:

```bash
cd /var/db/repos/gentoo
git remote set-url origin <new sync-uri>
emerge --sync
```

{{% /details %}}

{{% details title="Sync the Portage tree with rsync" %}}

{{< callout type="warning" >}}
Most mirrors only offer git / distfiles, not rsync sync. The mirrors below are tested and do list the `gentoo-portage` module.
{{< /callout >}}

| Mirror | Sync URL |
| --- | --- |
| Tsinghua TUNA | `rsync://mirrors.tuna.tsinghua.edu.cn/gentoo-portage` |
| USTC | `rsync://rsync.mirrors.ustc.edu.cn/gentoo-portage` |
| BFSU | `rsync://mirrors.bfsu.edu.cn/gentoo-portage` |
| NCHC (Taiwan) | `rsync://ftp.twaren.net/gentoo-portage` |
| PlanetUnix (Hong Kong) | `rsync://hippocamp.cn.ext.planetunix.net/gentoo-portage` |

Edit `/etc/portage/repos.conf/gentoo.conf` and point `sync-uri` at any of the addresses above:

```ini
[gentoo]
location = /var/db/repos/gentoo
sync-type = rsync
sync-uri = rsync://mirrors.bfsu.edu.cn/gentoo-portage
auto-sync = yes
```

Then run `emerge --sync`.

{{% /details %}}

{{% details title="Distfiles (GENTOO_MIRRORS)" %}}

In `/etc/portage/make.conf`, fill in the distfiles URL from the overview table. You can list several (Portage tries them in order, with the earlier ones taking priority):

```bash
GENTOO_MIRRORS="https://mirrors.bfsu.edu.cn/gentoo https://mirrors.tuna.tsinghua.edu.cn/gentoo https://mirrors.ustc.edu.cn/gentoo"
```

Once both Portage and Distfiles are set up, run `emerge --sync` to update.

{{% /details %}}

For the full official lists, see [Download mirrors](https://www.gentoo.org/downloads/mirrors/) and [rsync mirrors](https://www.gentoo.org/support/rsync-mirrors/). For switching the community overlay's source, see [Mirrors for mainland China on the Overlay page](/overlay/#mirrors-for-mainland-china).
