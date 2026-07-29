---
title: "gentoo-zh 二進位包服務上線"
description: "gentoo-zh overlay 的 194 個包現在有預編譯的二進位包，簽名後由 distfiles.gentoozh.org 與南京大學鏡像分發。本文說明如何配置、驗簽怎麼工作，以及哪些包不在其中。"
date: 2026-07-29
featured: true
tags: ["announcement", "binhost", "overlay"]
authors:
  - name: Zakk
    image: /contributors/zakkaus/feature.webp
    link: https://github.com/zakkaus
---

overlay 目前 490 個包，其中 194 個有預編譯的二進位包，每晚建置、簽名後分發。配置說明在 <https://distfiles.gentoozh.org>。

收錄的以編譯耗時長的包為主：Electron 應用、瀏覽器、辦公套件，以及帶大量 crate 或 Go module 的專案。因為這些包在本機編譯動輒數十分鐘到數小時，所以取二進位包省下的時間與編譯時長成正比。

## 配置

配置需要三步：

- 匯入簽名公鑰
- 新增倉庫
- 開啟 `getbinpkg`

### 匯入簽名公鑰

因為 Portage 的驗簽用的是它自己的 keyring（`/etc/portage/gnupg`），而那個目錄要 `getuto` 先建出來，所以順序不能顛倒：

```shell
emerge sec-keys/openpgp-keys-gentoozh
getuto
gpg --homedir /etc/portage/gnupg --import /usr/share/openpgp-keys/gentoozh.asc
gpg --homedir /etc/portage/gnupg --batch --yes --pinentry-mode loopback \
    --passphrase-file /etc/portage/gnupg/pass --lsign-key 6A0726AF1476A2F382C6AC6638A0234EC16AD42E
gpg --homedir /etc/portage/gnupg --check-trustdb
```

`--lsign-key` 用指紋而不是信箱，因為指紋唯一標識這把金鑰，而 UID 是公鑰檔案裡的一段可變文字。

### 新增倉庫

將以下內容寫進 `/etc/portage/binrepos.conf/gentoo-zh.conf`：

```ini
[gentoo-zh]
sync-uri = https://distfiles.gentoozh.org/binpkgs/x86-64
priority = 10
verify-signature = true
location = /var/cache/binhost/gentoo-zh
```

其中 `sync-uri` 只接受一個地址，這裡填的是源站（位於美國）；在中國大陸可改用南京大學鏡像 <https://mirror.nju.edu.cn/gentoo-zh/binpkgs/x86-64>，下載會更快。兩邊的包與簽名相同，切換地址不影響驗簽。因為鏡像的同步有延遲，所以鏡像上的包數可能比源站落後一輪建置。

為什麼用 `binrepos.conf` 而不是直接設 `PORTAGE_BINHOST`？因為 `PORTAGE_BINHOST` 產生的是隱式倉庫，所以無法單獨設定 `verify-signature`；若為使用本站的包而關閉驗簽，官方 binhost 的驗簽會一併關閉。

### 開啟 getbinpkg

將以下內容寫進 `/etc/portage/make.conf`：

```ini
FEATURES="${FEATURES} getbinpkg"
```

{{< callout type="warning" >}}
驗簽由新增倉庫時寫入的 `verify-signature = true` 提供，只作用於本源。請不要使用 `FEATURES=binpkg-request-signature`：這是全域的，會覆蓋前者，並且會要求本機 `FEATURES=buildpkg` 編出來的包也帶簽名，而那些包預設沒有簽名，於是每個本地建置都會在合併時報錯 `GnuPG verification failed`。
{{< /callout >}}

## 哪些包不在其中

收錄清單裡排除了幾類包，所以二進位包的數量會少於 overlay 的總數：

- `RESTRICT=bindist`，上游不允許再分發建置產物
- 許可證不允許再分發，建置時 `ACCEPT_LICENSE="-* @BINARY-REDISTRIBUTABLE"` 會攔下
- 上游已經發布二進位的 `-bin` 包，安裝過程只是解壓
- 字型、詞庫、主題這類沒有建置系統的包
- `virtual`、`acct-user` 這類不安裝檔案的包
- 只有 `9999` 的 live 包，沒有固定版本可供建置

包屬於哪一類，可以在 <https://distfiles.gentoozh.org/packages> 的狀態列上查到。因為那張表只收錄有原始碼檔案或被建置過的包，所以只有 `9999` 的 live 包不會出現在上面。

不在清單上、但作為 overlay 內部依賴被連帶建置的包（`acct-*`、`virtual/*` 這類），仍會出現在索引裡。

因為二進位包只在 USE 完全匹配時才會被 Portage 採用，所以 USE 組合差異大的包命中率低，建置成本收不回來，也不在清單上。配置好之後若 `emerge` 仍然編譯原始碼，用 `emerge -pv` 檢查，前綴為 `[binary]` 才表示採用了二進位包。

## distfiles 鏡像

二進位包與 distfiles 兩者互相獨立，按需分別配置。distfiles 鏡像是 overlay 裡各包的原始碼，目前約 1200 個檔案、33 GB。

將以下內容寫進 `/etc/portage/make.conf`：

```ini
GENTOO_MIRRORS="${GENTOO_MIRRORS} https://distfiles.gentoozh.org https://mirror.nju.edu.cn/gentoo-zh"
```

這裡只有 overlay 的原始碼，不能替代官方源，所以是追加而不是替換。`GENTOO_MIRRORS` 是按順序嘗試的列表，源站取不到時會落到南京大學鏡像。地址不寫 `distfiles/`，Portage 會自動補上。

`::gentoo` 的部分請用[社群鏡像列表](/mirrorlist/)裡的節點。

## 建置與分發

每晚 02:00（Asia/Shanghai）建置一輪，產物簽名後釋出。因為建置一個包會把它的依賴一併編出來，所以實際釋出數會多於收錄清單的條數。

overlay 裡已經刪除的包，會在下一輪建置時從索引中移除，本地已安裝的包不受影響。

鏡像站也可以使用 rsync 同步（包含二進位包與 distfiles）：

```shell
rsync rsync://distfiles.gentoozh.org/gentoo-zh/
```

若因版權等原因不希望某個包的原始碼被鏡像，請在其 ebuild 中加入 `RESTRICT="mirror"`，同步工具會跳過。建置產物是另一回事：不希望它被再分發，要寫 `RESTRICT="bindist"`，收錄清單的校驗會據此拒絕該包。

## 收錄新包

請在 [binhost 倉庫](https://github.com/gentoo-zh/binhost)的 `build/packages.txt` 中新增一行 `category/package`，然後提交 PR。合併後會在下一輪建置中產出。

相關的服務端配置、建置與釋出指令碼都在同一個倉庫，如有問題請提 issue。
