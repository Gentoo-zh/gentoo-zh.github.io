---
title: "Pastebin"
---

社群自建的 pastebin,貼程式碼和日誌。網頁 [paste.gentoozh.org](https://paste.gentoozh.org),後端 [wastebin](https://github.com/matze/wastebin),指令列工具 [gzpaste](https://github.com/gentoo-zh/gzpaste)(MIT)。

{{< callout type="warning" >}}
連結是公開的,貼之前把密碼、金鑰、token 刪乾淨。
{{< /callout >}}

## 網頁

開啟 [paste.gentoozh.org](https://paste.gentoozh.org),貼上或把檔案拖進去,選好高亮和保留時間,提交後得到連結。

## 指令列

裝 [`gzpaste`](https://github.com/gentoo-zh/gzpaste),只需要 `curl`。裝到 `~/.local/bin`,確保在 PATH 裡:

```bash
mkdir -p ~/.local/bin && curl -fsSL https://gentoozh.org/gzpaste.sh -o ~/.local/bin/gzpaste && chmod +x ~/.local/bin/gzpaste
```

貼指令輸出(透過管道):

```bash
emerge --info | gzpaste                    # 系統資訊,求助必貼
emerge -pv app-text/gzpaste | gzpaste      # 看某個包會裝什麼、USE 怎麼算
```

貼檔案(給出路徑):

```bash
gzpaste /etc/portage/make.conf                                  # 配置
gzpaste /etc/portage/package.use/00-desktop                     # USE 設定
gzpaste /var/tmp/portage/app-text/gzpaste-0.1.3/temp/build.log  # 建置失敗的日誌
```

Gentoo 也可以用 overlay:先加 [gentoo-zh overlay](/overlay/),再:

```bash
emerge app-text/gzpaste
```

{{% details closed="true" title="全部選項" %}}

| 選項 | 作用 |
| --- | --- |
| `-e, --ext EXT` | 語法高亮語言,副檔名或檔名(見下);不指定則不高亮 |
| `-x, --expires 秒` | 多少秒後過期 |
| `-b, --burn` | 閱後即焚,第一次開啟後刪除 |
| `-p, --password 密碼` | 加密,讀取時帶 `wastebin-password` 頭 |
| `-r, --raw` | 輸出 `/raw/` 純文字連結 |
| `-m, --md` | 輸出 `/md/` Markdown 渲染連結 |
| `-o, --owner` | 連 owner 一起輸出(之後刪除要用) |
| `-v, --verbose` | 進度輸出到 stderr(URL 仍在 stdout) |
| `-h, --help` | 顯示幫助 |
| `-V, --version` | 顯示版本 |
| `del <id> <owner>` | 刪除一份 paste |

`gzpaste -h` 輸出的內容相同。

{{% /details %}}

{{% details closed="true" title="高亮語言(178 種)" %}}

`-e` 的值是副檔名或檔名,網頁表單的下拉列表裡也能選:

```text
adb                haml               rails
adoc               hh.in              rb
adp                h.in               rd
applescript        hs                 re
as                 htm.j2             rego
asa                html               requirements.txt
asp                html.eex           resolv.conf
attributes         http               rkt
authorized_keys    idr                robot
awk                ini                rs
bat                j2                 rst
bib                java               rxml
build              jl                 sass
c                  jq                 scala
cabal              js                 scss
cfml               js.erb             sh
clj                json               show-nonprintable
CMakeCache.txt     jsonnet            slim
CMakeLists.txt     jsp                sml
cmd-help           known_hosts        sol
coffee             kt                 sources.list
COMMIT_EDITMSG     lean               sql
conf.erb           less               ssh_config
cpp                lhs                sshd_config
cpuinfo            lisp               strace
cr                 ll                 sty
cs                 log                styl
css                ls                 sv
csv                lua                svlt
d                  m                  swift
dart               .mailmap           syslog
diff               make               tab
Dockerfile         man                tcl
dot                matlab             tex
elm                md                 textile
eml                mediawiki          tf
.env               meminfo            tfstate
envvars            ml                 todo.txt
erbsql             mll                toml
erl                mly                ts
ex                 mm                 tsv
exclude            namelist           tsx
f                  nim                twig
f90                ninja              txt
fish               nix                typ
fs                 nsi                v
fstab              odin               varlink
gd                 org                vhd
.git               pas                vim
gitconfig          passwd             vs
gitlog             pb.txt             vue
git-rebase-todo    php                vy
go                 pl                 wgsl
go.mod             pp                 xml
go.sum             properties         yaml
gp                 proto              yasm
graphql            purs               yaws
groff              py                 zig
groovy             qml
group              R
```

{{% /details %}}

{{% details closed="true" title="免安裝,直接跑" %}}

貼標準輸入:

```bash
某指令 | sh -c "$(curl -fsSL https://gentoozh.org/gzpaste.sh)"
```

貼檔案:

```bash
curl -fsSL https://gentoozh.org/gzpaste.sh | sh -s -- 檔案
```

{{% /details %}}

{{% details closed="true" title="不裝 gzpaste?原始 curl" %}}

gzpaste 本身只要 curl。手動實現則需要安裝 [jq](https://github.com/jqlang/jq/wiki/Installation):

```bash
echo "內容" | jq -Rs '{text: .}' \
  | curl -s -H 'content-type: application/json' --data-binary @- https://paste.gentoozh.org/ \
  | jq -r '"https://paste.gentoozh.org" + .path'
```

完整 HTTP API 見 [wastebin 文件](https://github.com/matze/wastebin#api-endpoints)。

{{% /details %}}

## 讀取

連結的 ID 前面加 `/raw/` 就是純文字,方便指令碼或 `curl` 直接讀,貼的時候加 `-r` 也能直接拿到:

```bash
curl https://paste.gentoozh.org/raw/ID
```

Markdown 文件可以用 `/md/ID` 看渲染效果,貼的時候加 `-m` 直接拿這個連結。

加密的 paste,讀取時把密碼放在 `wastebin-password` 頭裡(不帶密碼開啟只會看到密碼框,內容不洩露):

```bash
curl -H 'wastebin-password: 你的密碼' https://paste.gentoozh.org/raw/ID
```

## 說明

- 匿名、單份最大 10 MB、預設存 7 天(提交時可選 1 小時到 1 個月)。
- 有問題去 [關於頁](/about/) 找聯絡方式。
