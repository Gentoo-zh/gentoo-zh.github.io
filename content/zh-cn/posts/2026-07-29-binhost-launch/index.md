---
title: "gentoo-zh 二进制包服务上线"
description: "gentoo-zh overlay 的 194 个包现在有预编译的二进制包，签名后由 distfiles.gentoozh.org 与南京大学镜像分发。本文说明如何配置、验签怎么工作，以及哪些包不在其中。"
date: 2026-07-29
tags: ["announcement", "binhost", "overlay"]
authors:
  - name: Zakk
    image: /contributors/zakkaus/feature.webp
    link: https://github.com/zakkaus
---

overlay 目前 490 个包，其中 194 个有预编译的二进制包，每晚构建、签名后分发。配置说明在 <https://distfiles.gentoozh.org>。

收录的以编译耗时长的包为主：Electron 应用、浏览器、办公套件，以及带大量 crate 或 Go module 的项目。因为这些包在本机编译动辄数十分钟到数小时，所以取二进制包省下的时间与编译时长成正比。

## 配置

配置需要三步：

- 导入签名公钥
- 添加仓库
- 打开 `getbinpkg`

### 导入签名公钥

因为 Portage 的验签用的是它自己的 keyring（`/etc/portage/gnupg`），而那个目录要 `getuto` 先建出来，所以顺序不能颠倒：

```shell
emerge sec-keys/openpgp-keys-gentoozh
getuto
gpg --homedir /etc/portage/gnupg --import /usr/share/openpgp-keys/gentoozh.asc
gpg --homedir /etc/portage/gnupg --batch --yes --pinentry-mode loopback \
    --passphrase-file /etc/portage/gnupg/pass --lsign-key 6A0726AF1476A2F382C6AC6638A0234EC16AD42E
gpg --homedir /etc/portage/gnupg --check-trustdb
```

`--lsign-key` 用指纹而不是邮箱，因为指纹唯一标识这把密钥，而 UID 是公钥文件里的一段可变文本。

### 添加仓库

将以下内容写进 `/etc/portage/binrepos.conf/gentoo-zh.conf`：

```ini
[gentoo-zh]
sync-uri = https://mirror.nju.edu.cn/gentoo-zh/binpkgs/x86-64
priority = 10
verify-signature = true
location = /var/cache/binhost/gentoo-zh
```

其中 `sync-uri` 只接受一个地址，在中国大陆建议使用南京大学镜像，下载会更快，源站是 <https://distfiles.gentoozh.org/binpkgs/x86-64>（位于美国）。两边的包与签名相同，切换地址不影响验签。因为镜像的同步有延迟，所以镜像上的包数可能比源站落后一轮构建。

为什么用 `binrepos.conf` 而不是直接设 `PORTAGE_BINHOST`？因为 `PORTAGE_BINHOST` 产生的是隐式仓库，所以无法单独设置 `verify-signature`；若为使用本站的包而关闭验签，官方 binhost 的验签会一并关闭。

### 打开 getbinpkg

将以下内容写进 `/etc/portage/make.conf`：

```ini
FEATURES="${FEATURES} getbinpkg"
```

{{< callout type="warning" >}}
验签由添加仓库时写入的 `verify-signature = true` 提供，只作用于本源。请不要使用 `FEATURES=binpkg-request-signature`：这是全局的，会覆盖前者，并且会要求本机 `FEATURES=buildpkg` 编出来的包也带签名，而那些包默认没有签名，于是每个本地构建都会在合并时报错 `GnuPG verification failed`。
{{< /callout >}}

## 哪些包不在其中

收录清单里排除了几类包，所以二进制包的数量会少于 overlay 的总数：

- `RESTRICT=bindist`，上游不允许再分发构建产物
- 许可证不允许再分发，构建时 `ACCEPT_LICENSE="-* @BINARY-REDISTRIBUTABLE"` 会拦下
- 上游已经发布二进制的 `-bin` 包，安装过程只是解压
- 字体、词库、主题这类没有构建系统的包
- `virtual`、`acct-user` 这类不安装文件的包
- 只有 `9999` 的 live 包，没有固定版本可供构建

包属于哪一类，可以在 <https://distfiles.gentoozh.org/packages> 的状态列上查到。因为那张表只收录有源码文件或被构建过的包，所以只有 `9999` 的 live 包不会出现在上面。

不在清单上、但作为 overlay 内部依赖被连带构建的包（`acct-*`、`virtual/*` 这类），仍会出现在索引里。

因为二进制包只在 USE 完全匹配时才会被 Portage 采用，所以 USE 组合差异大的包命中率低，构建成本收不回来，也不在清单上。配置好之后若 `emerge` 仍然编译源码，用 `emerge -pv` 检查，前缀为 `[binary]` 才表示采用了二进制包。

## distfiles 镜像

二进制包与 distfiles 两者互相独立，按需分别配置。distfiles 镜像是 overlay 里各包的源码，目前约 1200 个文件、33 GB。

将以下内容写进 `/etc/portage/make.conf`：

```ini
GENTOO_MIRRORS="${GENTOO_MIRRORS} https://mirror.nju.edu.cn/gentoo-zh https://distfiles.gentoozh.org"
```

这里只有 overlay 的源码，不能替代官方源，所以是追加而不是替换。`GENTOO_MIRRORS` 是按顺序尝试的列表，南京大学取不到时会落到源站。地址不写 `distfiles/`，Portage 会自动补上。

`::gentoo` 的部分请用[社区镜像列表](/mirrorlist/)里的节点。

## 构建与分发

每晚 02:00（Asia/Shanghai）构建一轮，产物签名后发布。因为构建一个包会把它的依赖一并编出来，所以实际发布数会多于收录清单的条数。

overlay 里已经删除的包，会在下一轮构建时从索引中移除，本地已安装的包不受影响。

镜像站也可以使用 rsync 同步（包含二进制包与 distfiles）：

```shell
rsync rsync://distfiles.gentoozh.org/gentoo-zh/
```

若因版权等原因不希望某个包的源码被镜像，请在其 ebuild 中加入 `RESTRICT="mirror"`，同步工具会跳过。构建产物是另一回事：不希望它被再分发，要写 `RESTRICT="bindist"`，收录清单的校验会据此拒绝该包。

## 收录新包

请在 [binhost 仓库](https://github.com/gentoo-zh/binhost)的 `build/packages.txt` 中添加一行 `category/package`，然后提交 PR。合并后会在下一轮构建中产出。

相关的服务端配置、构建与发布脚本都在同一个仓库，如有问题请提 issue。
