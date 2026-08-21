---
title: "镜像列表"
---

Gentoo 镜像包含以下资源：

- **Gentoo ebuild 仓库**：Portage 用于解析和构建软件包的 ebuild 与元数据，可通过 Git 或 rsync 同步
- **Distfiles**：Portage 编译软件包时下载的源代码及相关文件，由 `make.conf` 中的 `GENTOO_MIRRORS` 指定
- **Stage 3 与官方二进制包（binhost）**：同步相应内容的 HTTP 镜像会在 `releases/` 目录中提供

相应镜像不提供 ebuild，需要搭配 Gentoo ebuild 仓库的 rsync 或 Git 同步源使用，配置见下方的[配置教程](#配置教程)。

下面是各镜像站的**实测汇总表**，列出每个镜像站的 Distfiles 地址和支持的同步方式；具体配置方法见下方的配置教程。

{{< callout type="info" >}}
Gentoo ebuild 仓库与 Distfiles 需要分别配置。Git、rsync 和 HTTP 镜像也可能由不同节点提供。
{{< /callout >}}

{{% details closed="true" title="镜像总览" %}}

所有节点均逐项实测，✓ = 实测可用。Distfiles 地址即 `GENTOO_MIRRORS` 要填的值；Git / rsync 的具体同步地址见下方教程。

{{% gz-table %}}
| 镜像 | 地区 | Distfiles 地址 | Git | rsync |
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
| CERNET | 全国·就近 | `https://mirrors.cernet.edu.cn/gentoo` | ✓ | |
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
{{% /gz-table %}}

{{% /details %}}

## 配置教程

{{% details title="使用 Git 同步 Gentoo ebuild 仓库" %}}

**实测可用的 Git 源：**

{{% gz-table %}}
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
{{% /gz-table %}}

{{< gz-mirror name="gentoo-git" set="gentoo_git" >}}

安装 `eselect-repository`：

{{< gz-cmd path="shell" sudo="true" slot="gentoo-git" set="gentoo_git" >}}
emerge --ask app-eselect/eselect-repository
eselect repository remove -f gentoo
eselect repository add gentoo git @@SRC@@
emaint sync -r gentoo
{{< /gz-cmd >}}

删除现有的 Gentoo ebuild 仓库配置和本地副本，再使用所选镜像添加 Git 仓库。不同镜像的同步进度可能不同；更换 Git 镜像时，建议删除并重新添加仓库。

选 CERNET 时，git 会提示 `warning: redirecting to ...`，因为 CERNET 按来源把请求转到就近的成员镜像，同步本身照常完成。

手动配置或更换镜像时，编辑 `/etc/portage/repos.conf/` 中包含 `[gentoo]` 的配置文件。首次配置可创建 `/etc/portage/repos.conf/gentoo.conf`；通过 `eselect-repository` 生成的配置位于 `/etc/portage/repos.conf/eselect-repo.conf`。

完整配置示例：

{{< gz-cmd path="/etc/portage/repos.conf/gentoo.conf" slot="gentoo-git" set="gentoo_git" >}}
[gentoo]
location = /var/db/repos/gentoo
sync-type = git
sync-uri = @@SRC@@
auto-sync = yes
{{< /gz-cmd >}}

首次从 rsync 切换到 Git 或更换镜像时，删除现有的本地仓库并重新同步：

{{< gz-cmd path="shell" sudo="true" >}}
rm -rf /var/db/repos/gentoo
emaint sync -r gentoo
{{< /gz-cmd >}}

配置原理和排障方法见 [Portage with Git](https://wiki.gentoo.org/wiki/Portage_with_Git)。

{{% /details %}}

{{% details title="使用 rsync 同步 Gentoo ebuild 仓库" %}}

{{< callout type="warning" >}}
多数镜像只提供 Git / Distfiles，并不提供 rsync 同步。下面这些镜像实测能列出 `gentoo-portage` 模块。
{{< /callout >}}

{{% gz-table %}}
| 镜像 | 同步地址 |
| --- | --- |
| 清华 TUNA | `rsync://mirrors.tuna.tsinghua.edu.cn/gentoo-portage` |
| 中科大 USTC | `rsync://rsync.mirrors.ustc.edu.cn/gentoo-portage` |
| 北外 BFSU | `rsync://mirrors.bfsu.edu.cn/gentoo-portage` |
| 台湾 NCHC | `rsync://ftp.twaren.net/gentoo-portage` |
| 香港 PlanetUnix | `rsync://hippocamp.cn.ext.planetunix.net/gentoo-portage` |
{{% /gz-table %}}

{{< gz-mirror name="gentoo-rsync" set="gentoo_rsync" >}}

编辑 `/etc/portage/repos.conf/gentoo.conf`，把 `sync-uri` 指向上面任一地址：

{{< gz-cmd path="/etc/portage/repos.conf/gentoo.conf" slot="gentoo-rsync" set="gentoo_rsync" >}}
[gentoo]
location = /var/db/repos/gentoo
sync-type = rsync
sync-uri = @@SRC@@
auto-sync = yes
{{< /gz-cmd >}}

然后执行 `emaint sync -r gentoo`。

{{% /details %}}

{{% details title="Distfiles 配置（GENTOO_MIRRORS）" %}}

在 `/etc/portage/make.conf` 中填入总览表里的 Distfiles 地址，可填多个（Portage 按顺序尝试，前面的优先）：

{{< gz-mirror name="gentoo-dist" set="gentoo_dist" >}}

{{< gz-cmd path="/etc/portage/make.conf" slot="gentoo-dist" set="gentoo_dist" >}}
GENTOO_MIRRORS="@@LIST@@"
{{< /gz-cmd >}}

配置完成后，执行 `emaint sync -r gentoo` 更新 Gentoo ebuild 仓库。

{{% /details %}}

{{% details title="官方二进制包（binhost）" %}}

[Gentoo 官方二进制包仓库](https://wiki.gentoo.org/wiki/Project:Binhost)提供预编译并签名的二进制包。较新的 Stage 3 已在 `/etc/portage/binrepos.conf/` 中预配置该仓库；使用镜像时，编辑 `[gentoo]` 配置中的 `sync-uri`。

以下配置使用当前的 `23.0` profile，具体路径见 [amd64 二进制包目录](https://distfiles-cdn-origin.gentoo.org/releases/amd64/binpackages/)和 [arm64 二进制包目录](https://distfiles-cdn-origin.gentoo.org/releases/arm64/binpackages/)。

Gentoo Binhost 项目目前支持使用 GNU 工具链（glibc、GCC 和 binutils）的 amd64 和 arm64。其他架构和工具链的二进制包仅限 Release Engineering 构建 Stage 3 所用的包缓存。

以下示例使用常规 amd64 的 x86-64 二进制包：

{{< gz-mirror name="gentoo-bin" set="gentoo_bin" >}}

{{< gz-cmd path="/etc/portage/binrepos.conf/gentoo.conf" slot="gentoo-bin" set="gentoo_bin" suffix="/releases/amd64/binpackages/23.0/x86-64" >}}
[gentoo]
priority = 1
sync-uri = @@SRC@@
location = /var/cache/binhost/gentoo
verify-signature = true
{{< /gz-cmd >}}

`sync-uri` 指向包含 `Packages` 文件的目录。常规 arm64 系统可将路径改为 `/releases/arm64/binpackages/23.0/arm64`。

对于常规 amd64 系统，CPU 支持 [x86-64-v3](https://www.gentoo.org/news/2024/02/04/x86-64-v3.html) 时可使用对应的二进制包，以获得针对该指令集的优化。检查 CPU 是否支持：

{{< gz-cmd path="shell" >}}
ld.so --help
{{< /gz-cmd >}}

输出中包含 `x86-64-v3 (supported, searched)` 即表示支持。可将上方配置的路径末尾改为 `x86-64-v3`：

{{< gz-cmd path="/etc/portage/binrepos.conf/gentoo.conf" slot="gentoo-bin" set="gentoo_bin" suffix="/releases/amd64/binpackages/23.0/x86-64-v3" >}}
sync-uri = @@SRC@@
{{< /gz-cmd >}}

在有合适的二进制包时自动下载并使用：

{{< gz-cmd path="/etc/portage/make.conf" >}}
FEATURES="${FEATURES} getbinpkg"
{{< /gz-cmd >}}

如果没有合适的二进制包，Portage 会照常从源码编译。

单次使用二进制包安装：

{{< gz-cmd path="shell" sudo="true" >}}
emerge --ask --getbinpkg <package>
{{< /gz-cmd >}}

根据 [Portage binpkg changes](https://www.gentoo.org/support/news-items/2026-05-03-portage-binpkg-changes.html)，新版 Portage 默认验证远程二进制包的签名，并将其缓存到 `location` 指定的目录。官方 binhost 用户不再需要启用 `FEATURES="binpkg-request-signature"`；首次下载时，Portage 会自动运行 `getuto` 创建可信密钥环。

更多配置见 [Gentoo Binary Host Quickstart](https://wiki.gentoo.org/wiki/Gentoo_Binary_Host_Quickstart)、[Binary package guide](https://wiki.gentoo.org/wiki/Binary_package_guide)和 [MirrorZ Gentoo 帮助](https://help.mirrorz.org/gentoo/)。

{{% /details %}}

官方完整列表见 [下载镜像](https://www.gentoo.org/downloads/mirrors/)与 [rsync 镜像](https://www.gentoo.org/support/rsync-mirrors/)。gentoo-zh overlay 的 Git、Distfiles 与二进制包镜像配置见 [Overlay](/overlay/)。

## Gentoo Prefix Bootstrap 镜像配置

运行 Bootstrap 脚本前，可以通过以下环境变量选择镜像：

{{< gz-mirror name="gentoo-dist-prefix" set="gentoo_dist" >}}

{{< gz-cmd path="shell" slot="gentoo-dist-prefix" set="gentoo_dist" >}}
export GENTOO_MIRRORS="@@SRC@@"
export SNAPSHOT_URL="@@SRC@@/snapshots"
{{< /gz-cmd >}}

Bootstrap 完成后，如需为 Gentoo Portage 和 Distfiles 更换镜像，只需将 `/etc` 替换为 `$EPREFIX/etc`。`GNU_URL` 指向 GNU 软件的镜像，地址见所用镜像站的 GNU 帮助页。
