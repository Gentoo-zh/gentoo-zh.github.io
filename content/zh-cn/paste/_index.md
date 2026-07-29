---
title: "Pastebin"
---

社区自建的 pastebin,贴代码和日志。网页 [paste.gentoozh.org](https://paste.gentoozh.org),后端 [wastebin](https://github.com/matze/wastebin),命令行工具 [gzpaste](https://github.com/gentoo-zh/gzpaste)(MIT)。

{{< callout type="warning" >}}
链接是公开的,贴之前把密码、密钥、token 删干净。
{{< /callout >}}

## 网页

打开 [paste.gentoozh.org](https://paste.gentoozh.org),粘贴或把文件拖进去,选好高亮和保留时间,提交后得到链接。

## 命令行

装 [`gzpaste`](https://github.com/gentoo-zh/gzpaste),只需要 `curl`。装到 `~/.local/bin`,确保在 PATH 里:

```bash
mkdir -p ~/.local/bin && curl -fsSL https://gentoozh.org/gzpaste.sh -o ~/.local/bin/gzpaste && chmod +x ~/.local/bin/gzpaste
```

贴命令输出(通过管道):

```bash
emerge --info | gzpaste                    # 系统信息,求助必贴
emerge -pv app-text/gzpaste | gzpaste      # 看某个包会装什么、USE 怎么算
```

贴文件(给出路径):

```bash
gzpaste /etc/portage/make.conf                                  # 配置
gzpaste /etc/portage/package.use/00-desktop                     # USE 设置
gzpaste /var/tmp/portage/app-text/gzpaste-0.1.3/temp/build.log  # 构建失败的日志
```

Gentoo 也可以用 overlay:先加 [gentoo-zh overlay](/overlay/),再:

```bash
emerge app-text/gzpaste
```

{{% details closed="true" title="全部选项" %}}

| 选项 | 作用 |
| --- | --- |
| `-e, --ext EXT` | 语法高亮语言,扩展名或文件名(见下);不指定则不高亮 |
| `-x, --expires 秒` | 多少秒后过期 |
| `-b, --burn` | 阅后即焚,第一次打开后删除 |
| `-p, --password 密码` | 加密,读取时带 `wastebin-password` 头 |
| `-r, --raw` | 输出 `/raw/` 纯文本链接 |
| `-m, --md` | 输出 `/md/` Markdown 渲染链接 |
| `-o, --owner` | 连 owner 一起输出(之后删除要用) |
| `-v, --verbose` | 进度输出到 stderr(URL 仍在 stdout) |
| `-h, --help` | 显示帮助 |
| `-V, --version` | 显示版本 |
| `del <id> <owner>` | 删除一份 paste |

`gzpaste -h` 输出的内容相同。

{{% /details %}}

{{% details closed="true" title="高亮语言(178 种)" %}}

`-e` 的值是扩展名或文件名,网页表单的下拉列表里也能选:

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

{{% details closed="true" title="免安装,直接跑" %}}

贴标准输入:

```bash
某命令 | sh -c "$(curl -fsSL https://gentoozh.org/gzpaste.sh)"
```

贴文件:

```bash
curl -fsSL https://gentoozh.org/gzpaste.sh | sh -s -- 文件
```

{{% /details %}}

{{% details closed="true" title="不装 gzpaste?原始 curl" %}}

gzpaste 本身只要 curl。手动实现则需要安装 [jq](https://github.com/jqlang/jq/wiki/Installation):

```bash
echo "内容" | jq -Rs '{text: .}' \
  | curl -s -H 'content-type: application/json' --data-binary @- https://paste.gentoozh.org/ \
  | jq -r '"https://paste.gentoozh.org" + .path'
```

完整 HTTP API 见 [wastebin 文档](https://github.com/matze/wastebin#api-endpoints)。

{{% /details %}}

## 读取

链接的 ID 前面加 `/raw/` 就是纯文本,方便脚本或 `curl` 直接读,贴的时候加 `-r` 也能直接拿到:

```bash
curl https://paste.gentoozh.org/raw/ID
```

Markdown 文档可以用 `/md/ID` 看渲染效果,贴的时候加 `-m` 直接拿这个链接。

加密的 paste,读取时把密码放在 `wastebin-password` 头里(不带密码打开只会看到密码框,内容不泄露):

```bash
curl -H 'wastebin-password: 你的密码' https://paste.gentoozh.org/raw/ID
```

## 说明

- 匿名、单份最大 10 MB、默认存 7 天(提交时可选 1 小时到 1 个月)。
- 有问题去 [关于页](/about/) 找联系方式。
