(function () {
  /* 挡住重复执行：同一页上每个短代码都会引入本脚本，重复绑监听器会让 sudo 按一次
     翻转多次、等于没反应。 */
  if (window.__gzConfig) return;
  window.__gzConfig = true;

  function each(list, f) { Array.prototype.forEach.call(list, f); }

  /* 等 DOM 解析完再绑。本脚本随页面上第一个短代码输出，位置在正文中间，那时后面
     的代码块还没解析出来，直接 querySelectorAll 拿到的是空集合，监听器绑不上，
     按钮点了没反应。 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initModes();
    initSudo();
    initPickers();
    initCopy();
  }

  /* 手动配置 / 快速配置。
     每处配置各自一组：distfiles 与二进制包是两段独立的配置，一个人可能想照着改
     make.conf、但二进制包那段直接贴命令，所以按 group 分别切换。 */
  function initModes() {
    each(document.querySelectorAll('[data-gz-mode-pick]'), function (pick) {
      var group = pick.getAttribute('data-gz-mode-pick');
      var btns = pick.querySelectorAll('.gz-mode');
      var panes = document.querySelectorAll('.gz-pane[data-gz-pane-group="' + group + '"]');
      if (!btns.length || !panes.length) return;

      function show(mode) {
        each(btns, function (b) {
          b.setAttribute('aria-pressed', b.getAttribute('data-gz-mode') === mode ? 'true' : 'false');
        });
        each(panes, function (el) {
          el.hidden = el.getAttribute('data-gz-pane') !== mode;
        });
      }

      each(btns, function (btn) {
        btn.addEventListener('click', function () { show(btn.getAttribute('data-gz-mode')); });
      });
      /* 载入时也走一遍：markup 里漏写 hidden 的那一栏否则会一直露在外面。 */
      show('manual');
    });
  }

  /* sudo 开关。
     两种模式共用同一条命令，差别只有前缀：写文件那几条用 tee 而不是 cat，因为
     `sudo cat > /etc/x` 的重导向是以当前身份做的、写不进去，而 sudo tee 可以。
     提示符是伪元素（# / $），不进 DOM 文本，所以复制不会把它带走；sudo 是命令的
     一部分，必须真的在文本里，因此这里改 textContent 而不是用 hidden。
     整页一起换：一个人有没有 sudo，对每条命令都是同一个答案。 */
  function initSudo() {
    var btns = document.querySelectorAll('.gz-sudo-btn');
    if (!btns.length) return;

    function setSudo(on) {
      document.documentElement.setAttribute('data-gz-sudo', on ? 'on' : 'off');
      each(btns, function (b) { b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      each(document.querySelectorAll('.gz-sudo'), function (el) {
        el.textContent = on ? 'sudo ' : '';
      });
    }

    each(btns, function (btn) {
      btn.addEventListener('click', function () {
        setSudo(btn.getAttribute('aria-pressed') !== 'true');
      });
    });
    setSudo(false);
  }

  /* 换源。
     一页可能有多个选择器，但问的是同一件事：用哪个源。各自独立就会同时给出两份
     互相矛盾的配置，所以点任意一个都同步整页。槽位 [data-gz-slot] 填选中的地址，
     data-gz-suffix 补它后面要跟的路径。 */
  function initPickers() {
    var pickers = [];

    each(document.querySelectorAll('[data-gz-pick]'), function (group) {
      var name = group.getAttribute('data-gz-pick');
      var opts = group.querySelectorAll('.gz-opt');
      if (!opts.length) return;

      /* 源站：GENTOO_MIRRORS 那种列表槽位把它兜在后面，选中的取不到还能回退。 */
      var origin = Array.prototype.filter.call(opts, function (o) {
        return o.getAttribute('data-gz-origin') === '1';
      })[0];

      function render(chosen) {
        each(opts, function (o) {
          o.setAttribute('aria-pressed', o === chosen ? 'true' : 'false');
        });
        var uri = chosen.getAttribute('data-gz-uri');
        each(document.querySelectorAll('[data-gz-slot="' + name + '"]'), function (slot) {
          var suffix = slot.getAttribute('data-gz-suffix') || '';
          if (slot.getAttribute('data-gz-list')) {
            /* 列表槽位写全部镜像：选中的排最前、源站兜最后，中间保留其余镜像。
               GENTOO_MIRRORS 是按顺序尝试的列表，多留几个就多几层回退。 */
            var list = [chosen];
            each(opts, function (o) {
              if (o !== chosen && o !== origin) list.push(o);
            });
            if (origin && origin !== chosen) list.push(origin);
            slot.textContent = list.map(function (o) {
              return o.getAttribute('data-gz-uri') + suffix;
            }).join(' ');
          } else {
            slot.textContent = uri + suffix;
          }
        });
      }

      pickers.push({ name: name, opts: opts, render: render });

      /* 只同步同名的选择器。distfiles 与二进制包是两件事，一个人可能想让源码走
         一个镜像、二进制包走另一个，所以两组各自独立；而同一组若在页面上出现多次
         （例如折叠块里再放一份），它们问的是同一个问题，必须跟着一起动。 */
      each(opts, function (btn) {
        btn.addEventListener('click', function () {
          var uri = btn.getAttribute('data-gz-uri');
          each(pickers, function (p) {
            if (p.name !== name) return;
            var match = Array.prototype.filter.call(p.opts, function (o) {
              return o.getAttribute('data-gz-uri') === uri;
            })[0];
            if (match) p.render(match);
          });
        });
      });
    });

    /* 默认源跟界面语言走：简体读者多在中国大陆，教育网镜像更快；繁体与英文界面的
       读者多在境外，直连上游更合适。标了 data-gz-default 的按钮列出它适合当默认的
       语言，都没标就用第一个。 */
    var lang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    each(pickers, function (p) {
      var hit = Array.prototype.filter.call(p.opts, function (o) {
        return (o.getAttribute('data-gz-default') || '').split(' ').indexOf(lang) >= 0;
      })[0];
      p.render(hit || p.opts[0]);
    });
  }

  /* 复制。
     复制的是 <pre> 的文本值：提示符是伪元素不在其中，sudo 若开着则在其中，槽位里
     是当前选中的地址，所以复制到的就是屏幕上看到的那一份。 */
  function initCopy() {
    each(document.querySelectorAll('.gz-copy-btn'), function (btn) {
      btn.addEventListener('click', function () {
        var pre = btn.closest('.gz-code').querySelector('.gz-pre');
        if (!pre || !navigator.clipboard) return;
        navigator.clipboard.writeText(pre.textContent).then(function () {
          var was = btn.textContent;
          btn.textContent = btn.getAttribute('data-gz-done') || 'OK';
          setTimeout(function () { btn.textContent = was; }, 1200);
        });
      });
    });
  }
})();
