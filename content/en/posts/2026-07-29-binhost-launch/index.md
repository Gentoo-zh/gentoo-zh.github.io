---
title: "The gentoo-zh Binary Package Service Is Live"
description: "194 packages from the gentoo-zh overlay now ship as prebuilt binary packages, signed and served from distfiles.gentoozh.org, with a Nanjing University mirror. How to set it up, how signature verification works, and which packages are left out."
date: 2026-07-29
tags: ["announcement", "binhost", "overlay"]
authors:
  - name: Zakk
    image: /contributors/zakkaus/feature.webp
    link: https://github.com/zakkaus
---

The overlay currently holds 490 packages, 194 of which ship as prebuilt binary packages, built nightly and signed before they go out. Setup instructions live at <https://distfiles.gentoozh.org>.

The selection favours packages that take a long time to compile: Electron apps, browsers, office suites, and projects carrying a large number of crates or Go modules. Compiling these locally takes anywhere from tens of minutes to several hours, so the time a binary package saves scales with how long the build would have taken.

## Setup

Setup takes three steps:

- Import the signing key
- Add the repository
- Enable `getbinpkg`

### Import the signing key

Portage verifies signatures against its own keyring (`/etc/portage/gnupg`), and that directory has to be created by `getuto` first, so the order matters:

```shell
emerge sec-keys/openpgp-keys-gentoozh
getuto
gpg --homedir /etc/portage/gnupg --import /usr/share/openpgp-keys/gentoozh.asc
gpg --homedir /etc/portage/gnupg --batch --yes --pinentry-mode loopback \
    --passphrase-file /etc/portage/gnupg/pass --lsign-key 6A0726AF1476A2F382C6AC6638A0234EC16AD42E
gpg --homedir /etc/portage/gnupg --check-trustdb
```

`--lsign-key` takes the fingerprint rather than the email address, because the fingerprint identifies the key uniquely while the UID is just a piece of mutable text inside the public key file.

### Add the repository

Put the following in `/etc/portage/binrepos.conf/gentoo-zh.conf`:

```ini
[gentoo-zh]
sync-uri = https://distfiles.gentoozh.org/binpkgs/x86-64
priority = 10
verify-signature = true
location = /var/cache/binhost/gentoo-zh
```

`sync-uri` accepts only one address. The one above is the origin, hosted in the US; from mainland China the Nanjing University mirror at <https://mirror.nju.edu.cn/gentoo-zh/binpkgs/x86-64> downloads faster. Both carry the same packages with the same signatures, so switching between them does not affect verification. The mirror syncs on a delay, so its package count can trail the origin by one build round.

Why `binrepos.conf` instead of setting `PORTAGE_BINHOST` directly? `PORTAGE_BINHOST` creates an implicit repository that cannot carry its own `verify-signature` setting, so turning verification off to use our packages would turn it off for the official binhost as well.

### Enable getbinpkg

Put the following in `/etc/portage/make.conf`:

```ini
FEATURES="${FEATURES} getbinpkg"
```

{{< callout type="warning" >}}
Verification comes from the `verify-signature = true` you added with the repository, and applies to that repository only. Do not use `FEATURES=binpkg-request-signature`: it is global, it overrides the per-repository setting, and it also demands signatures on the packages your own `FEATURES=buildpkg` produces. Those are unsigned by default, so every local build then fails at merge time with `GnuPG verification failed`.
{{< /callout >}}

## Which packages are left out

The build list leaves out several kinds of package, so there are fewer binary packages than packages in the overlay:

- `RESTRICT=bindist`, where upstream does not allow the build output to be redistributed
- Licenses that forbid redistribution, which `ACCEPT_LICENSE="-* @BINARY-REDISTRIBUTABLE"` filters out at build time
- `-bin` packages, where upstream already publishes a binary and installation is just an unpack
- Fonts, dictionaries, themes and similar packages that have no build system at all
- `virtual` and `acct-user` packages, which install no files
- Live packages with only a `9999` ebuild, which have no fixed version to build

The status column at <https://distfiles.gentoozh.org/packages> shows which category a package falls into. That table only covers packages that have source files or have been built, so live packages with only a `9999` ebuild do not appear there.

Packages that are not on the list but get built as dependencies inside the overlay (`acct-*`, `virtual/*` and the like) still show up in the index.

Portage only takes a binary package when the USE flags match exactly, so packages whose USE combinations vary widely rarely get a hit, the build cost never pays off, and they are not on the list either. If `emerge` still compiles from source after you have set this up, check with `emerge -pv`: only a `[binary]` prefix means a binary package was used.

## distfiles mirror

The binary packages and the distfiles mirror are independent of each other, so set up whichever you need. The distfiles mirror holds the source code for the overlay's packages, currently around 1200 files and 33 GB.

Put the following in `/etc/portage/make.conf`:

```ini
GENTOO_MIRRORS="${GENTOO_MIRRORS} https://distfiles.gentoozh.org https://mirror.nju.edu.cn/gentoo-zh"
```

It holds source code for the overlay only and cannot replace the official mirrors, so append it rather than substituting it. `GENTOO_MIRRORS` is a list tried in order: if the origin does not have a file, it falls back to the Nanjing University mirror. Don't put `distfiles/` in the address, Portage appends it itself.

For `::gentoo` itself, use a node from the [community mirror list](/mirrorlist/).

## Building and distribution

A build round runs nightly at 02:00 (Asia/Shanghai), and the output is signed before publication. Building one package also builds its dependencies, so more packages are published than the list has entries.

Packages removed from the overlay drop out of the index on the next build round; copies already installed are unaffected.

Mirrors can also sync over rsync (binary packages and distfiles both):

```shell
rsync rsync://distfiles.gentoozh.org/gentoo-zh/
```

If a package's source should not be mirrored, for copyright or similar reasons, add `RESTRICT="mirror"` to its ebuild and the sync tool skips it. Build output is a separate matter: to keep it from being redistributed, set `RESTRICT="bindist"`, and validation rejects the package from the build list.

## Getting a package added

Add a `category/package` line to `build/packages.txt` in the [binhost repository](https://github.com/gentoo-zh/binhost) and open a pull request. Once merged, the package is produced in the next build round.

The server configuration and the build and publish scripts live in that same repository; open an issue there if something goes wrong.
