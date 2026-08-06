---
title: "鏡像列表"
---

Gentoo 鏡像包含以下資源：

- **Gentoo ebuild 倉庫**：Portage 用於解析和建置軟體套件的 ebuild 與元資料，可透過 Git 或 rsync 同步
- **Distfiles**：Portage 編譯軟體套件時下載的原始碼及相關檔案，由 `make.conf` 中的 `GENTOO_MIRRORS` 指定
- **Stage 3 與官方二進位包（binhost）**：同步對應內容的 HTTP 鏡像會在 `releases/` 目錄中提供

對應鏡像不提供 ebuild，需要搭配 [Gentoo Portage 鏡像](/gentoo-portage/)或 [Gentoo Portage Git 鏡像](/gentoo-portage.git/)使用。

下面是各鏡像站的**實測彙總表**，列出每個鏡像站的 Distfiles 地址和支援的同步方式；具體設定方法見下方的設定教學。

{{< callout type="info" >}}
Gentoo ebuild 倉庫與 Distfiles 需要分別設定。Git、rsync 和 HTTP 鏡像也可能由不同節點提供。
{{< /callout >}}

{{% details closed="true" title="鏡像總覽" %}}

所有節點均逐項實測，✓ = 實測可用。Distfiles 地址即 `GENTOO_MIRRORS` 要填的值；Git / rsync 的具體同步地址見下方教學。

{{% gz-table %}}
| 鏡像 | 地區 | Distfiles 地址 | Git | rsync |
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
{{% /gz-table %}}

{{% /details %}}

## 設定教學

{{% details title="使用 Git 同步 Gentoo ebuild 倉庫" %}}

**實測可用的 Git 源：**

{{% gz-table %}}
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
{{% /gz-table %}}

{{< gz-mirror name="gentoo-git" set="gentoo_git" >}}

安裝 `eselect-repository`：

{{< gz-cmd path="shell" sudo="true" slot="gentoo-git" set="gentoo_git" >}}
emerge --ask app-eselect/eselect-repository
eselect repository remove -f gentoo
eselect repository add gentoo git @@SRC@@
emaint sync -r gentoo
{{< /gz-cmd >}}

刪除現有的 Gentoo ebuild 倉庫設定和本地副本，再使用所選鏡像新增 Git 倉庫。不同鏡像的同步進度可能不同；更換 Git 鏡像時，建議刪除並重新新增倉庫。

手動設定或更換鏡像時，編輯 `/etc/portage/repos.conf/` 中包含 `[gentoo]` 的設定檔。首次設定可建立 `/etc/portage/repos.conf/gentoo.conf`；透過 `eselect-repository` 產生的設定位於 `/etc/portage/repos.conf/eselect-repo.conf`。

完整設定範例：

{{< gz-cmd path="/etc/portage/repos.conf/gentoo.conf" slot="gentoo-git" set="gentoo_git" >}}
[gentoo]
location = /var/db/repos/gentoo
sync-type = git
sync-uri = @@SRC@@
auto-sync = yes
{{< /gz-cmd >}}

首次從 rsync 切換到 Git 或更換鏡像時，刪除現有的本地倉庫並重新同步：

{{< gz-cmd path="shell" sudo="true" >}}
rm -rf /var/db/repos/gentoo
emaint sync -r gentoo
{{< /gz-cmd >}}

設定原理和疑難排解方法見 [Portage with Git](https://wiki.gentoo.org/wiki/Portage_with_Git)。

{{% /details %}}

{{% details title="使用 rsync 同步 Gentoo ebuild 倉庫" %}}

{{< callout type="warning" >}}
多數鏡像只提供 Git / Distfiles，並不提供 rsync 同步。下面這些鏡像實測能列出 `gentoo-portage` 模組。
{{< /callout >}}

{{% gz-table %}}
| 鏡像 | 同步地址 |
| --- | --- |
| 清華 TUNA | `rsync://mirrors.tuna.tsinghua.edu.cn/gentoo-portage` |
| 中科大 USTC | `rsync://rsync.mirrors.ustc.edu.cn/gentoo-portage` |
| 北外 BFSU | `rsync://mirrors.bfsu.edu.cn/gentoo-portage` |
| 臺灣 NCHC | `rsync://ftp.twaren.net/gentoo-portage` |
| 香港 PlanetUnix | `rsync://hippocamp.cn.ext.planetunix.net/gentoo-portage` |
{{% /gz-table %}}

{{< gz-mirror name="gentoo-rsync" set="gentoo_rsync" >}}

編輯 `/etc/portage/repos.conf/gentoo.conf`，把 `sync-uri` 指向上面任一地址：

{{< gz-cmd path="/etc/portage/repos.conf/gentoo.conf" slot="gentoo-rsync" set="gentoo_rsync" >}}
[gentoo]
location = /var/db/repos/gentoo
sync-type = rsync
sync-uri = @@SRC@@
auto-sync = yes
{{< /gz-cmd >}}

然後執行 `emaint sync -r gentoo`。

{{% /details %}}

{{% details title="Distfiles 設定（GENTOO_MIRRORS）" %}}

在 `/etc/portage/make.conf` 中填入總覽表裡的 Distfiles 地址，可填多個（Portage 按順序嘗試，前面的優先）：

{{< gz-mirror name="gentoo-dist" set="gentoo_dist" >}}

{{< gz-cmd path="/etc/portage/make.conf" slot="gentoo-dist" set="gentoo_dist" >}}
GENTOO_MIRRORS="@@LIST@@"
{{< /gz-cmd >}}

設定完成後，執行 `emaint sync -r gentoo` 更新 Gentoo ebuild 倉庫。

{{% /details %}}

{{% details title="官方二進位包（binhost）" %}}

[Gentoo 官方二進位包倉庫](https://wiki.gentoo.org/wiki/Project:Binhost)提供預編譯並簽名的二進位包。較新的 Stage 3 已在 `/etc/portage/binrepos.conf/` 中預先設定該倉庫；使用鏡像時，編輯 `[gentoo]` 設定中的 `sync-uri`。

以下設定使用當前的 `23.0` profile，具體路徑見 [amd64 二進位包目錄](https://distfiles-cdn-origin.gentoo.org/releases/amd64/binpackages/)和 [arm64 二進位包目錄](https://distfiles-cdn-origin.gentoo.org/releases/arm64/binpackages/)。

Gentoo Binhost 專案目前支援使用 GNU 工具鏈（glibc、GCC 和 binutils）的 amd64 和 arm64。其他架構和工具鏈的二進位包僅限 Release Engineering 建置 Stage 3 所用的套件快取。

以下範例使用常規 amd64 的 x86-64 二進位包：

{{< gz-mirror name="gentoo-bin" set="gentoo_bin" >}}

{{< gz-cmd path="/etc/portage/binrepos.conf/gentoo.conf" slot="gentoo-bin" set="gentoo_bin" suffix="/releases/amd64/binpackages/23.0/x86-64" >}}
[gentoo]
priority = 1
sync-uri = @@SRC@@
location = /var/cache/binhost/gentoo
verify-signature = true
{{< /gz-cmd >}}

`sync-uri` 指向包含 `Packages` 檔案的目錄。常規 arm64 系統可將路徑改為 `/releases/arm64/binpackages/23.0/arm64`。

對於常規 amd64 系統，CPU 支援 [x86-64-v3](https://www.gentoo.org/news/2024/02/04/x86-64-v3.html) 時可使用對應的二進位包，以獲得針對該指令集的最佳化。檢查 CPU 是否支援：

{{< gz-cmd path="shell" >}}
ld.so --help
{{< /gz-cmd >}}

輸出中包含 `x86-64-v3 (supported, searched)` 即表示支援。可將上方設定的路徑末尾改為 `x86-64-v3`：

{{< gz-cmd path="/etc/portage/binrepos.conf/gentoo.conf" slot="gentoo-bin" set="gentoo_bin" suffix="/releases/amd64/binpackages/23.0/x86-64-v3" >}}
sync-uri = @@SRC@@
{{< /gz-cmd >}}

在有合適的二進位包時自動下載並使用：

{{< gz-cmd path="/etc/portage/make.conf" >}}
FEATURES="${FEATURES} getbinpkg"
{{< /gz-cmd >}}

如果沒有合適的二進位包，Portage 會照常從原始碼編譯。

單次使用二進位包安裝：

{{< gz-cmd path="shell" sudo="true" >}}
emerge --ask --getbinpkg <package>
{{< /gz-cmd >}}

根據 [Portage binpkg changes](https://www.gentoo.org/support/news-items/2026-05-03-portage-binpkg-changes.html)，新版 Portage 預設驗證遠端二進位包的簽名，並將其快取到 `location` 指定的目錄。官方 binhost 使用者不再需要啟用 `FEATURES="binpkg-request-signature"`；首次下載時，Portage 會自動執行 `getuto` 建立可信任金鑰環。

更多設定見 [Gentoo Binary Host Quickstart](https://wiki.gentoo.org/wiki/Gentoo_Binary_Host_Quickstart)、[Binary package guide](https://wiki.gentoo.org/wiki/Binary_package_guide)和 [MirrorZ Gentoo 說明](https://help.mirrorz.org/gentoo/)。

{{% /details %}}

官方完整列表見 [下載鏡像](https://www.gentoo.org/downloads/mirrors/)與 [rsync 鏡像](https://www.gentoo.org/support/rsync-mirrors/)。gentoo-zh overlay 的 Git、Distfiles 與二進位包鏡像設定見 [Overlay](/zh-tw/overlay/)。

## Gentoo Prefix Bootstrap 鏡像設定

執行 Bootstrap 腳本前，可以透過以下環境變數選擇鏡像：

{{< gz-mirror name="gentoo-dist-prefix" set="gentoo_dist" >}}

{{< gz-cmd path="shell" slot="gentoo-dist-prefix" set="gentoo_dist" >}}
export GENTOO_MIRRORS="@@SRC@@"
export SNAPSHOT_URL="@@SRC@@/snapshots"
{{< /gz-cmd >}}

Bootstrap 完成後，如需為 Gentoo Portage 和 Distfiles 更換鏡像，只需將 `/etc` 替換為 `$EPREFIX/etc`。`GNU_URL` 的設定見 [GNU 說明](/gnu/)。
