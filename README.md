# 王秋里 · 个人主页

单栏学术主页，[Eleventy (11ty)](https://www.11ty.dev/) 构建，静态输出托管在 GitHub Pages：
<https://qiuliwang.github.io>

## 页面结构

```
页头（头像 · 姓名 · 职称单位 · 邮箱 · 研究方向 · 外链）
  ↓
吸顶导航（经历 / 项目 / 地图 / 论文）
  ↓
01 工作与教育经历   02 科研项目   03 研究地图   04 论文
```

研究地图是一张内联 SVG：左列数据模态、中列方法、右列应用场景。悬停节点点亮有论文支撑的连线，
点击节点把下方论文筛成该方向，点页面别处恢复。停在图上 0.5 秒会弹一次操作提示（全站两次）。

## 本地预览

```powershell
npm install      # 第一次
npm run serve    # http://localhost:8099
```

## 目录

```
src/
├── _data/
│   ├── site.yaml            # 姓名、职称、单位、邮箱、研究方向、外链
│   ├── publications.yaml    # 论文（一篇一条，含 map 标签）
│   ├── projects.yaml        # 科研项目
│   ├── experience.yaml      # 工作与教育经历
│   └── service.yaml         # 学术服务（空列表则整节隐藏）
├── _includes/
│   ├── home.njk             # 页面骨架
│   └── research-map.svg     # 研究地图（静态 SVG）
└── assets/
    ├── css/style.css        # 含本地字体 @font-face
    ├── js/main.js           # 主题切换、导航高亮、地图交互
    ├── fonts/kinghwa/       # 京华老宋体切片（授权见同目录 LICENSE.txt）
    └── img/avatar.jpg
```

## 改内容

**加一篇论文** —— `src/_data/publications.yaml` 里复制一段：

```yaml
- title: '论文标题'
  authors: 'Qiuli Wang, A, B'
  venue: 'IEEE Transactions on Medical Imaging (TMI)'
  year: 2027
  map: [ct, unc, lung]             # 决定它出现在地图哪些节点的筛选结果里
  corresponding: true              # 本人名字后加 *
```

`map` 可用标签：

| 列 | 标签 |
|---|---|
| 模态 | `ct` `mri` `wsi` `report` `natural` |
| 方法 | `unc` `cm` `syn` `lw` `msf` `vlm` |
| 场景 | `lung` `liver` `brain` `general` |

**改研究方向** —— `src/_data/site.yaml` 的 `interests` 列表，显示在页头邮箱下方。

**改经历 / 项目** —— `experience.yaml`、`projects.yaml`，每条一行，页面自动排成“时间 · 主体 · 角色”。

**改配色** —— `src/assets/css/style.css` 开头的 `:root`（浅色）与 `[data-theme="dark"]`（深色）。
标题用京华老宋体（`--display`），正文 Arial + 系统中文（`--sans`）。

## 发布

每次 push 到 `master`，`.github/workflows/deploy.yml` 自动构建并部署，无需手动操作。
