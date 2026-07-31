---
title: "Overlay"
---

Overlay 是官方 Portage 樹之外的軟體來源，疊加上去就能裝到官方源裡沒有的包。gentoo-zh 收錄的是中文使用者常用的軟體，它由當年 gentoo-tw 與 gentoo-china [兩岸的 overlay 合併](https://code.google.com/archive/p/gentoo-taiwan/issues/2)而來。

{{< callout type="info" >}}
**因為 GitHub 走的是境外 CDN、源站在美國，所以中國大陸訪問都可能較慢**：下面每一處配置都能換源，git 同步源、distfiles、二進位包各有一排鏡像按鈕，點一下這段配置裡的地址就跟著改。
{{< /callout >}}

- **中文輸入與字型**：fcitx 輸入法、拼音詞庫、中文字型
- **中國內陸常用應用**：微信、QQ、釘釘、WPS、飛書、網易雲音樂
- **網路與代理工具**
- **打好修補的桌面 / 效能向核心**：cachyos-sources、xanmod、liquorix
- **開發與日常工具**

## 新增 overlay

同步源預設是 GitHub 上游。訪問慢的話換成下面任一鏡像，它們是 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay) 的完整 ebuild 鏡像，只含 ebuild、不含原始碼。

{{< gz-mirror name="git" >}}

需先安裝 `app-eselect/eselect-repository` 與 `dev-vcs/git`。

{{< gz-cmd path="shell" sudo="true" >}}
eselect repository add gentoo-zh git @@SRC@@
emerge --sync gentoo-zh
{{< /gz-cmd >}}

{{% details closed="true" title="不想用 eselect：手寫 repos.conf" %}}

在 `/etc/portage/repos.conf/` 下建 `gentoo-zh.conf`：

{{< gz-cmd path="/etc/portage/repos.conf/gentoo-zh.conf" >}}
[gentoo-zh]
location = /var/db/repos/gentoo-zh
sync-type = git
sync-uri = @@SRC@@
auto-sync = yes
{{< /gz-cmd >}}

然後同樣跑 `emerge --sync gentoo-zh`。

{{% /details %}}

{{% details closed="true" title="已經新增過，只想換同步源" %}}

改 `/etc/portage/repos.conf/` 裡含 `[gentoo-zh]` 那一段的 `sync-uri`（用 eselect 新增的在 `eselect-repo.conf`），換成上面選中的地址，再 `emerge --sync gentoo-zh`。

{{% /details %}}

## 接受測試關鍵字

gentoo-zh 的包**只有 `~arch`（測試）關鍵字，沒有 stable 關鍵字**。已經在跑 `~amd64` 的系統跳過這步；穩定分支的系統要先放行。

因為 `::gentoo-zh` 這個限定只作用於本 overlay，而這裡的包全都是 `~arch`，所以直接放行整個 overlay 即可，官方源的包不受影響：

{{< gz-cmd path="shell" sudo="true" >}}
echo "*/*::gentoo-zh ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
{{< /gz-cmd >}}

想逐個記錄裝了什麼的，也可以一個個寫，效果一樣：

{{< gz-cmd path="shell" sudo="true" >}}
echo "net-im/tencent-qq ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
{{< /gz-cmd >}}

## 安裝軟體套件

{{< gz-cmd path="shell" sudo="true" >}}
emerge --ask net-im/tencent-qq
{{< /gz-cmd >}}

列出 overlay 提供的包：`eix -RO gentoo-zh`。

## distfiles 鏡像與二進位包

除了 ebuild，社群還為 overlay 運行了兩個服務，與上面的同步互不影響，按需分別配置，兩者的源也可以各選一個。

### distfiles 鏡像

overlay 的 distfiles 不在 `distfiles.gentoo.org` 上，`SRC_URI` 只能直連上游，慢或者取不到。哪些包的原始碼已經鏡像，見[套件列表](https://distfiles.gentoozh.org/packages)。鏡像只存 overlay 的原始碼，不能替代官方源，所以是追加而不是替換：

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

選中的排在前面、源站兜在後面：`GENTOO_MIRRORS` 是按順序嘗試的列表，前面取不到會落到後面。地址不寫 `distfiles/`，Portage 會自動補上。

### 二進位包（binhost）

`emerge` 優先取編好的包，省掉本地編譯。目前只有 x86-64；哪些包有二進位包，見[套件列表](https://distfiles.gentoozh.org/packages)。

{{< gz-mirror name="bin" set="dist" >}}

{{< gz-mode name="bin" >}}

先匯入簽名公鑰。因為 Portage 的驗簽用的是它自己的 keyring（`/etc/portage/gnupg`），而那個目錄要 `getuto` 先建出來，所以順序不能顛倒：

{{< gz-cmd path="shell" sudo="true" >}}
emerge sec-keys/openpgp-keys-gentoozh
getuto
gpg --homedir /etc/portage/gnupg --import /usr/share/openpgp-keys/gentoozh.asc
gpg --homedir /etc/portage/gnupg --batch --yes --pinentry-mode loopback \
    --passphrase-file /etc/portage/gnupg/pass --lsign-key 6A0726AF1476A2F382C6AC6638A0234EC16AD42E
gpg --homedir /etc/portage/gnupg --check-trustdb
{{< /gz-cmd >}}

再新增倉庫：

{{% gz-pane group="bin" name="manual" %}}
{{< gz-cmd path="/etc/portage/binrepos.conf/gentoo-zh.conf" slot="bin" suffix="/binpkgs/x86-64" >}}
[gentoo-zh]
sync-uri = @@SRC@@
priority = 10
verify-signature = true
location = /var/cache/binhost/gentoo-zh
{{< /gz-cmd >}}

最後開啟 `getbinpkg`：

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
驗簽由上面的 `verify-signature = true` 提供，只作用於本源。不要用 `FEATURES=binpkg-request-signature`：它是全域的，會覆蓋前者，還會要求本機 `FEATURES=buildpkg` 建置的包也帶簽名，而那些包預設沒有簽名，於是每個本地建置都會在合併時報錯 `GnuPG verification failed`。
{{< /callout >}}

{{< callout type="info" >}}
更多問題見 **[distfiles.gentoozh.org](https://distfiles.gentoozh.org/)**，包數量、同步時間與 [FAQ](https://distfiles.gentoozh.org/faq) 都在那邊。`::gentoo` 的源另見[鏡像列表](/mirrorlist/)。
{{< /callout >}}

## 注意事項

{{< callout type="info" >}}
2025 年 10 月起官方不再為第三方倉庫提供快取鏡像，gentoo-zh 改為直接從 GitHub 上游同步。在那之前新增過的使用者需要更新同步源，見[這篇說明](/posts/2025-10-07-thirdparty-repo-mirror-removal/)。
{{< /callout >}}

- 倉庫地址是 [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay)。舊的 `microcai/gentoo-zh` 會 301 到新倉庫，手寫過 remote 的建議更新，詳見[遷移記錄](/posts/2026-07-02-gentoo-zh-repo-migration/)
- 教育網聯合鏡像站不自己存檔案，它把請求轉到就近的成員站，所以 git 會提示一次重新導向，這是正常的
- 各鏡像的同步進度不一定一致，某個源上的版本偏舊時，換另一個再同步
- 打包者：因為版權等原因不希望某個包的原始碼被鏡像時，在它的 ebuild 裡加 `RESTRICT="mirror"`，同步工具會跳過

## 參與貢獻

歡迎參與 gentoo-zh：到 [GitHub 倉庫](https://github.com/gentoo-zh/overlay) 提 Pull Request，發現問題也歡迎提 issue。完整流程見[貢獻指南](/contributing/)。

## 致謝

感謝[教育網聯合鏡像站](https://mirrors.cernet.edu.cn/)、[南京大學](https://mirror.nju.edu.cn/)、[南陽理工學院](https://mirror.nyist.edu.cn/)與[河南省教育科研網](https://mirrors.ha.edu.cn/)為 gentoo-zh 提供鏡像。鏡像清單整理自 [peeweep](/contributors/peeweep/) 的[公告](https://t.me/gentoocn/56)。
