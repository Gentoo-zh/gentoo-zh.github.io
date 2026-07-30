---
title: "Overlay"
---

Overlay 是官方 Portage 树之外的软件来源，叠加上去就能装到官方源里没有的包。gentoo-zh 收录的是中文用户常用的软件，它是当年的 gentoo-tw 与 gentoo-china [两岸社区合并](https://code.google.com/archive/p/gentoo-taiwan/issues/2)而来。

{{< callout type="info" >}}
**因为 GitHub 走的是境外 CDN、源站在美国，所以中国大陆访问都可能较慢**：下面每一处配置都能换源，git 同步源、distfiles、二进制包各有一排镜像按钮，点一下这段配置里的地址就跟着改。
{{< /callout >}}

- **中文输入与字体**：fcitx 输入法、拼音词库、中文字体
- **国内常用应用**：微信、QQ、钉钉、WPS、飞书、网易云音乐
- **网络与代理工具**
- **打好补丁的桌面 / 性能向内核**：cachyos-sources、xanmod、liquorix
- **开发与日常工具**

## 添加 overlay

同步源默认是 GitHub 上游。访问慢的话换成下面任一镜像，它们是 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay) 的完整 ebuild 镜像，只含 ebuild、不含源码。

{{< gz-mirror name="git" >}}

需先安装 `app-eselect/eselect-repository` 与 `dev-vcs/git`。

{{< gz-cmd path="shell" sudo="true" >}}
eselect repository add gentoo-zh git @@SRC@@
emerge --sync gentoo-zh
{{< /gz-cmd >}}

{{% details closed="true" title="不想用 eselect：手写 repos.conf" %}}

在 `/etc/portage/repos.conf/` 下建 `gentoo-zh.conf`：

{{< gz-cmd path="/etc/portage/repos.conf/gentoo-zh.conf" >}}
[gentoo-zh]
location = /var/db/repos/gentoo-zh
sync-type = git
sync-uri = @@SRC@@
auto-sync = yes
{{< /gz-cmd >}}

然后同样跑 `emerge --sync gentoo-zh`。

{{% /details %}}

{{% details closed="true" title="已经添加过，只想换同步源" %}}

改 `/etc/portage/repos.conf/` 里含 `[gentoo-zh]` 那一段的 `sync-uri`（用 eselect 添加的在 `eselect-repo.conf`），换成上面选中的地址，再 `emerge --sync gentoo-zh`。

{{% /details %}}

## 接受测试关键字

gentoo-zh 的包**只有 `~arch`（测试）关键字，没有 stable 关键字**。已经在跑 `~amd64` 的系统跳过这步；稳定分支的系统要先放行。

因为 `::gentoo-zh` 这个限定只作用于本 overlay，而这里的包全都是 `~arch`，所以直接放行整个 overlay 即可，官方源的包不受影响：

{{< gz-cmd path="shell" sudo="true" >}}
echo "*/*::gentoo-zh ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
{{< /gz-cmd >}}

想逐个记录装了什么的，也可以一个个写，效果一样：

{{< gz-cmd path="shell" sudo="true" >}}
echo "net-im/tencent-qq ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
{{< /gz-cmd >}}

## 安装软件包

{{< gz-cmd path="shell" sudo="true" >}}
emerge --ask net-im/tencent-qq
{{< /gz-cmd >}}

列出 overlay 提供的包：`eix -RO gentoo-zh`。

## distfiles 镜像与二进制包

除了 ebuild，社区还为 overlay 运行了两个服务，与上面的同步互不影响，按需分别配置，两者的源也可以各选一个。

### distfiles 镜像

overlay 的 distfiles 不在 `distfiles.gentoo.org` 上，`SRC_URI` 只能直连上游，慢或者取不到。哪些包的源码已经镜像，见[包列表](https://distfiles.gentoozh.org/packages)。镜像只存 overlay 的源码，不能替代官方源，所以是追加而不是替换：

{{< gz-mirror name="dist" set="dist" >}}

{{< gz-mode name="dist" >}}

{{% gz-pane group="dist" name="manual" %}}
{{< gz-cmd path="/etc/portage/make.conf" slot="dist" >}}
GENTOO_MIRRORS="${GENTOO_MIRRORS} @@LIST@@"
{{< /gz-cmd >}}
{{% /gz-pane %}}

{{% gz-pane group="dist" name="quick" %}}
{{< gz-cmd path="shell" sudo="true" slot="dist" >}}
tee -a /etc/portage/make.conf > /dev/null <<'EOF'
GENTOO_MIRRORS="${GENTOO_MIRRORS} @@LIST@@"
EOF
{{< /gz-cmd >}}
{{% /gz-pane %}}

选中的排在前面、源站兜在后面：`GENTOO_MIRRORS` 是按顺序尝试的列表，前面取不到会落到后面。地址不写 `distfiles/`，Portage 会自动补上。

### 二进制包（binhost）

`emerge` 优先取编好的包，省掉本地编译。目前只有 x86-64；哪些包有二进制包，见[包列表](https://distfiles.gentoozh.org/packages)。

{{< gz-mirror name="bin" set="dist" >}}

{{< gz-mode name="bin" >}}

先导入签名公钥。因为 Portage 的验签用的是它自己的 keyring（`/etc/portage/gnupg`），而那个目录要 `getuto` 先建出来，所以顺序不能颠倒：

{{< gz-cmd path="shell" sudo="true" >}}
emerge sec-keys/openpgp-keys-gentoozh
getuto
gpg --homedir /etc/portage/gnupg --import /usr/share/openpgp-keys/gentoozh.asc
gpg --homedir /etc/portage/gnupg --batch --yes --pinentry-mode loopback \
    --passphrase-file /etc/portage/gnupg/pass --lsign-key 6A0726AF1476A2F382C6AC6638A0234EC16AD42E
gpg --homedir /etc/portage/gnupg --check-trustdb
{{< /gz-cmd >}}

再添加仓库：

{{% gz-pane group="bin" name="manual" %}}
{{< gz-cmd path="/etc/portage/binrepos.conf/gentoo-zh.conf" slot="bin" suffix="/binpkgs/x86-64" >}}
[gentoo-zh]
sync-uri = @@SRC@@
priority = 10
verify-signature = true
location = /var/cache/binhost/gentoo-zh
{{< /gz-cmd >}}

最后打开 `getbinpkg`：

{{< gz-cmd path="/etc/portage/make.conf" >}}
FEATURES="${FEATURES} getbinpkg"
{{< /gz-cmd >}}
{{% /gz-pane %}}

{{% gz-pane group="bin" name="quick" %}}
{{< gz-cmd path="shell" sudo="true" slot="bin" suffix="/binpkgs/x86-64" >}}
mkdir -p /etc/portage/binrepos.conf
tee /etc/portage/binrepos.conf/gentoo-zh.conf > /dev/null <<'EOF'
[gentoo-zh]
sync-uri = @@SRC@@
priority = 10
verify-signature = true
location = /var/cache/binhost/gentoo-zh
EOF

tee -a /etc/portage/make.conf > /dev/null <<'EOF'
FEATURES="${FEATURES} getbinpkg"
EOF
{{< /gz-cmd >}}
{{% /gz-pane %}}

{{< callout type="warning" >}}
验签由上面的 `verify-signature = true` 提供，只作用于本源。不要用 `FEATURES=binpkg-request-signature`：它是全局的，会覆盖前者，还会要求本机 `FEATURES=buildpkg` 构建的包也带签名，而那些包默认没有签名，于是每个本地构建都会在合并时报错 `GnuPG verification failed`。
{{< /callout >}}

{{< callout type="info" >}}
更多问题见 **[distfiles.gentoozh.org](https://distfiles.gentoozh.org/)**，包数量、同步时间与 [FAQ](https://distfiles.gentoozh.org/faq) 都在那边。`::gentoo` 的源另见[镜像列表](/mirrorlist/)。
{{< /callout >}}

## 注意事项

{{< callout type="info" >}}
2025 年 10 月起官方不再为第三方仓库提供缓存镜像，gentoo-zh 改为直接从 GitHub 上游同步。在那之前添加过的用户需要更新同步源，见[这篇说明](/posts/2025-10-07-thirdparty-repo-mirror-removal/)。
{{< /callout >}}

- 仓库地址是 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay)。旧的 `microcai/gentoo-zh` 会 301 到新仓库，手写过 remote 的建议更新，详见[迁移记录](/posts/2026-07-02-gentoo-zh-repo-migration/)
- 教育网联合镜像站不自己存文件，它把请求转到就近的成员站，所以 git 会提示一次重定向，这是正常的
- 各镜像的同步进度不一定一致，某个源上的版本偏旧时，换另一个再同步
- 打包者：因为版权等原因不希望某个包的源码被镜像时，在它的 ebuild 里加 `RESTRICT="mirror"`，同步工具会跳过

## 参与贡献

欢迎参与 gentoo-zh：到 [GitHub 仓库](https://github.com/gentoo-zh/overlay) 提 Pull Request，发现问题也欢迎提 issue。完整流程见[贡献指南](/contributing/)。

## 致谢

感谢[教育网联合镜像站](https://mirrors.cernet.edu.cn/)、[南京大学](https://mirror.nju.edu.cn/)、[南阳理工学院](https://mirror.nyist.edu.cn/)与[河南省教育科研网](https://mirrors.ha.edu.cn/)为 gentoo-zh 提供镜像。镜像清单整理自 [peeweep](/contributors/peeweep/) 的[公告](https://t.me/gentoocn/56)。
