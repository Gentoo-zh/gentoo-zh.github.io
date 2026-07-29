---
title: "Overlay"
---

Overlay 是官方 Portage 树之外的软件来源——叠加上去，就能装到官方源里没有的包。gentoo-zh 是其中历史悠久的一个：前身是 2003 年的 gentoo-tw 与随后的 gentoo-china，两岸社区合并而来，源码在 [GitHub](https://github.com/gentoo-zh/overlay)。

{{< callout type="info" >}}
overlay 仓库已迁移到组织仓库 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay)，旧的 `microcai/gentoo-zh` 个人仓库会 301 到新仓库，建议在方便时更新到新 URL，详见[公告与执行记录](/posts/2026-07-02-gentoo-zh-repo-migration/)。
{{< /callout >}}

至今为止 gentoo-zh 已收录了 490 个左右的软件包（准确数量以[仓库](https://github.com/gentoo-zh/overlay)为准），可大致分为：

- **中文 / CJK**：fcitx 输入法和一大堆插件、码表（rime、chinese-addons 等），搜狗 / 萌娘 / zhwiki 拼音词库，中文字体，以及一些软件的 CJK 补丁
- **网络、开发工具等**：毕竟是 Gentoo 用户，谁手里没几个自己维护的包
- **打好补丁的桌面 / 性能向内核**：cachyos-sources、xanmod、liquorix 这些

还有部分是官方源暂时没人管的包，这边接着出新版。以及一些错误修复，开发者踩到 Bug，解决后把补丁推回源里。

只有一条规则：别弄坏别人的系统。每个 ebuild 在进源之前都得在它支持的架构上测过。

## 添加 gentoo-zh Overlay

{{% details title="使用 eselect repository 启用" %}}

需先安装 `app-eselect/eselect-repository`：

```bash
eselect repository enable gentoo-zh
emerge --sync gentoo-zh
```

{{% /details %}}

{{% details title="手动配置（不想用 eselect）" %}}

在 `/etc/portage/repos.conf/` 下创建 `gentoo-zh.conf`：

```ini
[gentoo-zh]
location = /var/db/repos/gentoo-zh
sync-type = git
sync-uri = https://github.com/gentoo-zh/overlay.git
auto-sync = yes
```

然后 `emerge --sync gentoo-zh`。

{{% /details %}}

{{< callout type="info" >}}
2025 年 10 月起官方不再为第三方仓库提供缓存镜像，gentoo-zh 改为直接从 GitHub 上游同步。之前添加过的用户需更新同步源，见 [这篇说明](/posts/2025-10-07-thirdparty-repo-mirror-removal/)。
{{< /callout >}}

## 国内镜像加速

直连 GitHub 或官方 distfiles 偏慢时，可将 gentoo-zh 换成国内镜像。整理自 [peeweep](/contributors/peeweep/) 的[公告](https://t.me/gentoocn/56)，感谢！

### git 同步源

将 overlay 的同步源切到国内镜像（gentoo-zh 是 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay) 的完整 ebuild 镜像，只含 ebuild、不含源码）。可用源：

- 南京大学：`https://mirror.nju.edu.cn/git/gentoo-zh.git`

首次添加（需先安装 git）：

```bash
sudo emerge -aq dev-vcs/git          # 没装 git 先装
rm -rf /var/db/repos/gentoo-zh       # 同步过的话先清掉旧的
eselect repository add gentoo-zh git https://mirror.nju.edu.cn/git/gentoo-zh.git
emerge --sync gentoo-zh
```

已经添加过的，把 `/etc/portage/repos.conf/gentoo-zh.conf` 里的 `sync-uri` 改成上面的地址即可。

### distfiles 缓存

加速软件包源码下载。这里只有 overlay 的源码，不能替代官方源，因此是**追加**而非替换。源站 <https://distfiles.gentoozh.org/>，可用镜像：

- 南京大学：`https://mirror.nju.edu.cn/gentoo-zh`

在 `/etc/portage/make.conf` 的 `GENTOO_MIRRORS` 里，官方源之后追加：

```bash
GENTOO_MIRRORS="${GENTOO_MIRRORS} https://mirror.nju.edu.cn/gentoo-zh https://distfiles.gentoozh.org"
```

`GENTOO_MIRRORS` 是按顺序尝试的列表，两个都列上，南京大学取不到时会落到源站。地址不写 `distfiles/`，portage 会自己补上。可直接复制的配置块，以及当前的文件数量与同步时间，都在 [distfiles.gentoozh.org](https://distfiles.gentoozh.org/)。

{{< callout type="info" >}}
不想 mirror 某些 distfiles（版权等原因）时，在对应 ebuild 里加 `RESTRICT="mirror"`。
{{< /callout >}}

## 二进制包（binhost）

社区现在也提供 gentoo-zh 的**二进制包**，装 overlay 里的包不用每个都自己编。目前只有 x86-64，也不是每个包都有，与上面的 distfiles 相互独立、按需分别配置。

配置分三步：导入签名公钥、在 `/etc/portage/binrepos.conf/` 里添加仓库、在 `FEATURES` 里追加 `getbinpkg`。

{{< callout type="info" >}}
每一步可直接复制的命令与配置块、源站与南京大学两个地址、签名公钥，以及当前覆盖的包数量与同步时间，都在 **[distfiles.gentoozh.org](https://distfiles.gentoozh.org/)**，照着配即可。
{{< /callout >}}

## 用 overlay 里的包

gentoo-zh 的包**都是 `~arch`（测试）关键字、没有稳定关键字**。已经在跑 `~amd64`（测试分支）的系统直接 `emerge` 即可；**稳定分支**的系统安装前要先为这些包接受测试关键字。

按需放行你要装的包（推荐，只接受用到的）：

```bash
echo "app-foo/bar ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
emerge --ask app-foo/bar
```

或放行整个 overlay（只需写一条，但会一并引入更多测试包，自行取舍）：

```bash
echo "*/*::gentoo-zh ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
```

看 overlay 提供了哪些包：`eix -RO gentoo-zh`。

## 参与贡献

欢迎给 gentoo-zh 添砖加瓦：到 [GitHub 仓库](https://github.com/gentoo-zh/overlay) 提 Pull Request，发现问题也欢迎提 issue。
