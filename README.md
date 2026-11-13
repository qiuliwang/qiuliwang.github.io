# 王秋里 · 个人主页

单栏学术主页，用 [Eleventy (11ty)](https://www.11ty.dev/) 构建：正文与数据都是 Markdown / YAML，
产物是纯静态 HTML，托管在 GitHub Pages。

## 页面结构

```
页头（头像 + 姓名 + 职称单位 + 邮箱 + 研究方向 + 外链）
  ↓
吸顶导航（经历 / 项目 / 地图 / 论文）
  ↓
01 工作与教育经历   02 科研项目   03 研究地图   04 论文
```

**研究地图**是一张内联 SVG：左列模态、中列方法、右列应用场景。悬停节点会点亮有论文支撑的连线，
点击节点会把下方论文筛成该方向，点页面别处自动恢复。停在图上 0.5 秒会弹一次提示气泡（全站 2 次）。

## 本地预览

```powershell
npm install      # 第一次
npm run serve    # http://localhost:8099
```

## 目录

```
src/
├── index.md                 # 首页 Markdown（目前无正文，留空）
├── _data/
│   ├── site.yaml            # 姓名、职称、单位、邮箱、研究方向、外链
│   ├── publications.yaml    # 论文（一篇一条，含 map 标签）
│   ├── projects.yaml        # 科研项目
│   ├── experience.yaml      # 工作与教育经历
│   └── service.yaml         # 学术服务（空列表则隐藏）
├── _includes/
│   ├── home.njk             # 页面骨架
│   └── research-map.svg     # 研究地图（静态 SVG）
└── assets/
    ├── css/style.css
    ├── js/main.js           # 主题切换、导航高亮、地图交互
    └── img/avatar.jpg
```

## 常改的三处

**加一篇论文**：`src/_data/publications.yaml` 里复制一段

```yaml
- title: '论文标题'
  authors: 'Qiuli Wang, A, B'
  venue: 'IEEE Transactions on Medical Imaging (TMI)'
  year: 2027
  type: journal                                  # journal | conference | preprint | chinese
  map: [ct, unc, lung]                           # 决定它出现在地图哪些节点的筛选结果里
  corresponding: true                            # 本人名字后加 *
```

`map` 可用的标签：

| 列 | 标签 |
|---|---|
| 模态 | `ct` `mri` `wsi` `report` `natural` |
| 方法 | `unc` `cm` `syn` `lw` `msf` `vlm` |
| 场景 | `lung` `liver` `brain` `general` |

**改研究方向**：`src/_data/site.yaml` 的 `interests` 列表。

**改经历/项目**：`experience.yaml`、`projects.yaml`，每条一行数据，页面自动排成“时间 · 主体 · 角色”。

> 地图里的字号按各节点的论文数生成，加论文后想让字重排，需要重新生成 `research-map.svg`
> （脚本在项目外，或直接手改 SVG 里的 `font-size`）。

## 发布到 GitHub Pages

```powershell
git init -b main
git add .
git commit -m "init: academic homepage"
git remote add origin https://github.com/qiuliwang/qiuliwang.github.io.git
git push -u origin main
```

然后在仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
之后每次 push，`.github/workflows/deploy.yml` 会自动构建并发布到 <https://qiuliwang.github.io>。

**上传前检查**

- 仓库名必须是 `qiuliwang.github.io`（用户站点，路径在根目录）；
  若用别的名字，需要把 `eleventy.config.js` 的 `pathPrefix` 改成 `"/仓库名/"`，
  并把 `home.njk` 里 `/assets/...` 的绝对路径一并调整。
- 不要提交 `node_modules/`（20 MB、1600 多个文件）和 `_site/`，`.gitignore` 已排除。
- 必须提交 `package-lock.json`，工作流用 `npm ci` 安装。
- 标题字体（京华老宋体）已本地镜像在 `src/assets/fonts/kinghwa/`，不再依赖外部 CDN；授权说明见同目录 `LICENSE.txt`（允许嵌入与非盈利再分发，禁止修改）。

## 配色

`src/assets/css/style.css` 开头的 `:root`（浅色）与 `[data-theme="dark"]`（深色）。
暖纸色底 + 赭石强调；标题用京华老宋体（`--display`），正文 Arial + 系统中文（`--sans`）。
