---
title: "Overlay"
---

An overlay is a source of software outside the official Portage tree: layer it on top and you can install packages the official repos don't carry. gentoo-zh collects the software Chinese-speaking users need day to day; it came out of gentoo-tw and gentoo-china, [when the two communities merged](https://code.google.com/archive/p/gentoo-taiwan/issues/2).

{{< callout type="info" >}}
**GitHub is served from CDN nodes outside mainland China and the origin server is in the US, so access from either can be slow there**: every piece of configuration below can point at a mirror instead — the git sync source, distfiles and the binary packages each have a row of mirror buttons, and clicking one rewrites the addresses in that block.
{{< /callout >}}

- **Chinese input methods and fonts**: fcitx, pinyin dictionaries, Chinese fonts
- **Applications popular in China**: WeChat, QQ, DingTalk, WPS Office, Feishu, NetEase Cloud Music
- **Networking and proxy tools**
- **Patched desktop / performance kernels**: cachyos-sources, xanmod, liquorix
- **Development and everyday tools**

## Adding the overlay

The sync source defaults to GitHub upstream. If that is slow for you, switch to one of the mirrors below — each is a full ebuild mirror of [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay), ebuilds only, no source code.

{{< gz-mirror name="git" >}}

Install `app-eselect/eselect-repository` and `dev-vcs/git` first.

{{< gz-cmd path="shell" sudo="true" >}}
eselect repository add gentoo-zh git @@SRC@@
emerge --sync gentoo-zh
{{< /gz-cmd >}}

{{% details closed="true" title="Without eselect: write repos.conf yourself" %}}

Create `gentoo-zh.conf` under `/etc/portage/repos.conf/`:

{{< gz-cmd path="/etc/portage/repos.conf/gentoo-zh.conf" >}}
[gentoo-zh]
location = /var/db/repos/gentoo-zh
sync-type = git
sync-uri = @@SRC@@
auto-sync = yes
{{< /gz-cmd >}}

Then run `emerge --sync gentoo-zh` as above.

{{% /details %}}

{{% details closed="true" title="Already added, just switching sync source" %}}

Edit the `sync-uri` in whichever file under `/etc/portage/repos.conf/` holds the `[gentoo-zh]` section — `eselect-repo.conf` if you added it with eselect — set it to the address selected above, then run `emerge --sync gentoo-zh`.

{{% /details %}}

## Accept the testing keyword

gentoo-zh packages are **`~arch` (testing) keyworded, with nothing marked stable**. Systems already running `~amd64` can skip this step; on a stable branch, accept the packages you actually want:

{{< gz-cmd path="shell" sudo="true" >}}
echo "app-i18n/fcitx ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
{{< /gz-cmd >}}

Or accept the whole overlay in one line, at the cost of pulling in a lot more testing packages:

{{< gz-cmd path="shell" sudo="true" >}}
echo "*/*::gentoo-zh ~amd64" >> /etc/portage/package.accept_keywords/gentoo-zh
{{< /gz-cmd >}}

## Install a package

{{< gz-cmd path="shell" sudo="true" >}}
emerge --ask app-i18n/fcitx
{{< /gz-cmd >}}

To list what the overlay provides: `eix -RO gentoo-zh`.

## The distfiles mirror and binary packages

The community runs two services for the overlay, independent of the ebuild sync above. Set up whichever you need; each takes its own source.

### distfiles mirror

The overlay's distfiles are not on `distfiles.gentoo.org`, so `SRC_URI` fetches straight from upstream, which is slow or fails outright. The [package list](https://distfiles.gentoozh.org/packages) shows which packages are mirrored. The mirror holds source code for the overlay's own packages only and cannot replace the official mirrors, so append it rather than substituting it:

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

The one you pick goes first and the origin backs it up: `GENTOO_MIRRORS` is a list tried in order, so if the first has nothing, Portage falls through to the next. Don't put `distfiles/` in the address, Portage appends it itself.

### Binary packages (binhost)

`emerge` takes a prebuilt package instead of compiling locally. It's x86-64 only for now; the [package list](https://distfiles.gentoozh.org/packages) shows which packages have one.

{{< gz-mirror name="bin" set="dist" >}}

{{< gz-mode name="bin" >}}

Import the signing key first. Portage verifies signatures against its own keyring (`/etc/portage/gnupg`), and that directory has to be created by `getuto`, so the order matters:

{{< gz-cmd path="shell" sudo="true" >}}
emerge sec-keys/openpgp-keys-gentoozh
getuto
gpg --homedir /etc/portage/gnupg --import /usr/share/openpgp-keys/gentoozh.asc
gpg --homedir /etc/portage/gnupg --batch --yes --pinentry-mode loopback \
    --passphrase-file /etc/portage/gnupg/pass --lsign-key 6A0726AF1476A2F382C6AC6638A0234EC16AD42E
gpg --homedir /etc/portage/gnupg --check-trustdb
{{< /gz-cmd >}}

{{% gz-pane group="bin" name="manual" %}}
Then add the repository:

{{< gz-cmd path="/etc/portage/binrepos.conf/gentoo-zh.conf" slot="bin" suffix="/binpkgs/x86-64" >}}
[gentoo-zh]
sync-uri = @@SRC@@
priority = 10
verify-signature = true
location = /var/cache/binhost/gentoo-zh
{{< /gz-cmd >}}

Finally enable `getbinpkg`:

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
Verification comes from the `verify-signature = true` above and applies to this repository only. Do not use `FEATURES=binpkg-request-signature`: it is global, it overrides the per-repository setting, and it also demands signatures on the packages your own `FEATURES=buildpkg` produces. Those are unsigned by default, so every local build then fails at merge time with `GnuPG verification failed`.
{{< /callout >}}

{{< callout type="info" >}}
For anything else, see **[distfiles.gentoozh.org](https://distfiles.gentoozh.org/)** — package counts, sync times and the [FAQ](https://distfiles.gentoozh.org/faq) all live there. For `::gentoo` itself, see the [mirror list](/mirrorlist/).
{{< /callout >}}

## Worth knowing

{{< callout type="info" >}}
As of October 2025 the official project no longer provides cache mirrors for third-party repositories, so gentoo-zh syncs directly from GitHub upstream. If you added it before then, update your sync source — see [this note](/posts/2025-10-07-thirdparty-repo-mirror-removal/).
{{< /callout >}}

- The repository is [gentoo-zh/overlay](https://github.com/gentoo-zh/overlay). The old `microcai/gentoo-zh` redirects (301) to it; if you wrote the remote by hand, update it. See the [migration record](/posts/2026-07-02-gentoo-zh-repo-migration/)
- The CERNET united mirror stores nothing itself: it forwards the request to a nearby member site, so git reports one redirect, which is expected
- The mirrors are not always equally fresh; if one serves an older version of a package, switch to another and sync again
- For packagers: if a package's source should not be mirrored, for copyright or similar reasons, add `RESTRICT="mirror"` to its ebuild and the sync tool skips it

## Contributing

Contributions are welcome: open a pull request on the [GitHub repository](https://github.com/gentoo-zh/overlay), and issues are welcome too. The [contributing guide](/contributing/) walks through the workflow.

## Thanks

Thanks to the [CERNET united mirror](https://mirrors.cernet.edu.cn/), [Nanjing University](https://mirror.nju.edu.cn/), [Nanyang Institute of Technology](https://mirror.nyist.edu.cn/) and [HERNET](https://mirrors.ha.edu.cn/) for mirroring gentoo-zh. The mirror list was collected by [peeweep](/contributors/peeweep/) in [this announcement](https://t.me/gentoocn/56).
