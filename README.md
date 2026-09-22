# Agent Lab 全栈版

面向全栈开发者的 Agent 开发学习平台：React + TypeScript 单页前端，Express + SQLite 后端，内置 Monaco 代码编辑器和服务端沙箱，可一键 Docker 部署。

课程内容覆盖 **11 个阶段 / 21 个章节 / 68 个知识点 / 214 张术语卡 / 37 道面试题**，从 LLM 生成机制一路走到 RAG、Agent、Workflow、评估与生产化，并配套 4 个递进项目（V1～V4）、真实 API 实战，以及一套大厂高并发架构设计与面经专题。

## 技术栈

| 层 | 选型 |
|---|---|
| 前端 | React 19、TypeScript 5.8、Vite 6、Ant Design 5、React Router 7、Monaco Editor、react-resizable-panels |
| 后端 | Node.js ≥22、Express 5、better-sqlite3、jsonwebtoken、bcryptjs |
| 沙箱 | 子进程执行临时 `.mjs` 文件，8s 超时 + 512KB 输出上限 + 危险模式静态拦截 |
| 部署 | Dockerfile + docker-compose，SQLite 文件挂载持久化 |

## 默认登录

- 账号：`admin`
- 密码：`AgentLab@2026`

部署到服务器后请立刻修改 `docker-compose.yml` 里的 `DEFAULT_PASSWORD` 和 `JWT_SECRET`。

## 本地运行

前端产物已经构建到 `public/`，只跑后端即可访问完整站点：

```bash
npm install
npm start          # http://localhost:3000
```

改了前端源码后需要重新构建：

```bash
cd frontend && npm install
cd .. && npm run build:start     # 构建前端 → 启动后端
```

前端独立开发模式（Vite dev server 5173，`/api` 代理到 3000）：

```bash
npm run dev:server     # 终端 1：后端 --watch
cd frontend && npm run dev   # 终端 2：前端热更新
```

### npm scripts

| 命令 | 作用 |
|---|---|
| `npm start` | 启动 Express 服务，托管 `public/` 静态产物 |
| `npm run dev:server` | 后端 watch 模式 |
| `npm run build` | 构建前端（`tsc -b && vite build` → 输出到 `public/`） |
| `npm run build:start` | 先构建前端再启动后端 |

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PORT` | `3000` | 监听端口 |
| `DATA_DIR` | `./data` | SQLite 存放目录 |
| `DB_PATH` | `$DATA_DIR/agent_lab.sqlite` | 数据库文件路径 |
| `JWT_SECRET` | `agent-lab-dev-secret-change-me` | JWT 签名密钥，生产必须改 |
| `DEFAULT_USERNAME` | `admin` | 首次启动创建的账号 |
| `DEFAULT_PASSWORD` | `AgentLab@2026` | 首次启动创建的密码 |

模型 API 的 Base URL / API Key / 默认模型**不走环境变量**，在站内「设置」弹窗里按用户维度保存到 `user_settings` 表，运行代码时注入子进程。

## Docker 部署

```bash
docker compose up -d --build     # http://服务器IP:3000
```

SQLite 数据文件挂载在 `./data/agent_lab.sqlite`。注意 `Dockerfile` 只 COPY `server/` 和 `public/`，所以**镜像里用的是构建好的前端产物**，改前端后要先本地 `npm run build` 再 build 镜像。

## 课程体系

11 个阶段，每个阶段标注学习主线序号（`routeIndex`）和定位（必学基础 / 核心能力 / 架构判断 / 生产必备 / 进阶专题 / 面试通关 & 架构设计）：

| 阶段 | 标题 | 章节 | 知识点 |
|---|---|---|---|
| 一 | LLM 基础与模型调用 | 2 | 6 |
| 二 | Prompt 与 Context Engineering | 2 | 6 |
| 三 | 结构化输出与工具调用 | 2 | 6 |
| 四 | RAG 与向量检索 | 3 | 9 |
| 五 | Agent 模式与 Workflow | 2 | 6 |
| 六 | Memory、MCP 与 Skills | 2 | 6 |
| 七 | 评估、安全与生产化 | 3 | 9 |
| 八 | 贯穿项目实战 | 1 | 4 |
| 九 | 主流框架与工具生态 | 1 | 7 |
| 十 | 真实 API 实战 | 1 | 5 |
| 十一 | 课后拓展：大厂高并发架构设计与面经通关 | 2 | 4 |

各章知识点：

1. **LLM 基础** — 自回归生成、Token 与上下文、Logits 与 Softmax ／ 上下文窗口、采样参数、模型边界
2. **Prompt 与 Context** — RTCF 骨架、Few-shot、Prompt Injection ／ 上下文分块、历史摘要、上下文预算
3. **结构化与工具** — JSON Mode、JSON Schema、校验重试 ／ 工具 Schema、工具运行时、工具错误处理
4. **RAG 与检索** — RAG 全链路、解析清洗、Chunking ／ Embedding、混合检索、Rerank ／ ANN、引擎选型、过滤与召回
5. **Agent 与 Workflow** — ReAct、Plan-and-Execute、Multi-Agent ／ Workflow vs Agent、State Graph、Checkpoint
6. **Memory / MCP / Skills** — 记忆分类、记忆写入、记忆检索 ／ Function Calling 与 MCP/Agent/Skill 分层、MCP 架构、Skills 设计
7. **评估与生产** — 评估集、工具评估、RAG 评估 ／ 权限、人工确认、沙箱 ／ Harness、可观测性、部署发布
8. **项目主线** — V1 工单分类器、V2 订单助手、V3 文档 RAG、V4 研究型 Workflow
9. **框架生态** — 四大框架横评、LangChain 核心概念、LangGraph、流式输出、LangSmith 与 Prompt 管理、OpenAI Assistants、多模态
10. **真实 API 实战** — 第一次 API 调用、真实 Tool Calling、最小 RAG、Demo 到生产、评估你的第一个 Agent
11. **架构设计与面经** — C 端长文档知识库助手系统设计、高可用通用 Agent 平台系统设计 ／ 项目全链路陈述（STAR 法则）、20 道硬核面试题索引

### 知识点包含什么

每个知识点（`lesson`）的字段结构：

- `scenario` 开场场景、`why` 为什么学、`definition` 一句话定义
- `explanation` 详细解析、`levels` 三层递进讲解（入门理解 / 原理解析 / 工程落地）
- `misconceptions` 常见误区、`pitfalls` 工程坑点、`compare` 对比表
- `terms` 术语卡（全站共 214 张，点击弹窗查看详解）
- `lab` 在线代码实验（starterCode + 目标说明）
- `task` 实战任务与 checklist
- `interview` 面试题（32 个知识点提供，共 37 题）

### 面试题体系

37 道面试题按大厂真实面试场景组织，覆盖一面到二面的递进深度，标注题目来源（如「【腾讯一面】」「【腾讯二面】」「【腾讯工程题】」）。答案不是要点罗列，而是按分层诊断 → 方案对比 → 工程取舍的结构展开，典型题目包括：

- **鲁棒性**：工具调用失败、非法 JSON、参数缺失的错误自愈链路怎么设计
- **高并发**：十万级并发下会话状态存哪里，分布式场景怎么架构（不能用单机内存）
- **成本控制**：Token 成本指数飙升时的模型级联路由、缓存、裁剪、限额四道防线
- **流式输出**：SSE 原理与普通 HTTP 的区别，客户端中途断连后端要不要继续请求大模型
- **熔断容错**：Agent 陷入死循环怎么熔断，单机 vs 分布式两套方案
- **多模态 RAG**：文档里有跨页表格、架构图时怎么处理
- **长对话治理**：几十轮历史全丢给模型 Token 太贵，工业界四大优化方案的优缺点
- **内容安全**：输入/推理/输出三道防线，SSE 流式输出时怎么做违规词过滤
- **评测体系**：RAG 三元组指标，LLM-as-a-Judge 的致命缺陷与应对
- **BadCase 飞轮**：线上问题怎么收集并驱动团队持续迭代

阶段十一额外提供两道完整的系统设计实战题（C 端长文档知识库助手、高可用通用 Agent 平台），按「全链路架构分层 + 核心难点攻坚」的格式拆解，以及一份用 STAR 法则讲述项目的陈述模板。

### 学习主线与概念地图

`courseData` 顶层维护一条 6 步学习主线和一张概念地图（5 个层级 + 20 个核心概念 + 4 个项目绑定）：

```text
模型基础 → 输入与契约 → 行动与知识 → 编排与记忆 → 可靠性与交付
```

项目绑定关系：

- **V1 工单分类器**：RTCF、Few-shot、JSON Mode、JSON Schema、校验重试、评估集
- **V2 订单助手 Agent**：工具 Schema、工具运行时、错误处理、ReAct、权限、人工确认
- **V3 文档 RAG Agent**：RAG 链路、Embedding、混合检索、Rerank、过滤与召回
- **V4 研究型 Workflow**：Context Engineering、Planning、Workflow、Memory、MCP、Skills、Harness、观测与发布

课程内容参考 [JavaGuide《AI 核心概念总览》](https://javaguide.cn/ai/ai-core-concepts.html) 的概念分层，用自己的例子和实验重新组织。

## 功能

- **学习进度**：按知识点标记完成，顶栏显示环形进度，侧边栏打勾
- **学习笔记**：每个知识点记录「我的理解 / 疑问 / 结论」，落库持久化
- **实战 checklist**：按条勾选，独立存表
- **在线代码实验**：Monaco 编辑器写代码 → 服务端沙箱执行 → 实时看 stdout/stderr
- **可拖拽分栏**：正文区与实验区默认 55/45 分栏，可自由拖拽调整宽度（最小 30/25）
- **术语弹窗**：点击术语卡弹出居中 Modal，600px 宽度 + 内部滚动，长释义不再挤在侧边抽屉里
- **运行历史**：最近 50 次实验运行记录（代码 + 输出 + 状态）
- **模型配置**：按用户保存 Base URL / API Key / 默认模型，Key 回显打掩码
- **全局搜索**：跨标题、定义、解析、坑点的关键词搜索
- **认证**：JWT + HttpOnly Cookie，7 天有效期

## 目录结构

```text
agent-lab-fullstack/
├── Dockerfile
├── docker-compose.yml
├── package.json              # 后端依赖与 scripts
├── data/                     # SQLite 数据文件（挂载卷）
├── public/                   # 前端构建产物，由 Express 托管
├── frontend/                 # React + Vite 源码
│   ├── vite.config.ts        # 构建输出到 ../public
│   └── src/
│       ├── App.tsx           # 路由
│       ├── components/
│       │   ├── auth/         # LoginPage
│       │   ├── layout/       # AppLayout / TopBar / Sidebar
│       │   ├── lesson/       # LessonView（可拖拽分栏）/ CoreContent / ConceptTab / InterviewTab
│       │   ├── lab/          # LabPanel / CodeEditor / OutputBox
│       │   └── settings/     # SettingsModal
│       ├── hooks/            # useCourse / useProgress
│       ├── services/api.ts   # 统一 fetch 封装
│       └── types/course.ts   # 课程数据类型
└── server/
    ├── index.js              # Express 应用 + 建表 + 路由
    ├── codeRunner.js         # 代码沙箱
    ├── courseData/           # 按阶段拆分的课程数据
    │   ├── index.js          # 汇总导出 + 学习主线 + 概念地图
    │   └── stage1~stage11-*.js
    ├── courseData.js         # 旧版单文件课程数据（历史遗留）
    ├── refactor.js           # 一次性拆分脚本（历史遗留）
    └── count.js              # 知识点计数脚本
```

## 数据库表

| 表 | 用途 |
|---|---|
| `users` | 账号、bcrypt 密码哈希、展示名 |
| `progress` | 知识点完成状态（user_id + lesson_id 主键） |
| `notes` | 学习记录：理解 / 疑问 / 结论 |
| `checklist` | 实战任务勾选状态（含 item_index） |
| `lab_runs` | 实验运行历史：代码、输出、状态 |
| `user_settings` | 每用户的 OpenAI Base URL / API Key / 默认模型 |

外键全部 `ON DELETE CASCADE`，开启 WAL 模式。

## API

全部接口除 `/api/health` 和登录外都需要携带 Cookie 认证。

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/health` | 健康检查，返回课程版本 |
| POST | `/api/auth/login` | 登录，下发 HttpOnly Cookie |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/auth/me` | 当前用户 |
| GET | `/api/course` | 完整课程数据 |
| GET | `/api/me/state` | 进度 + 笔记 + checklist + 最近 50 条运行记录 |
| PUT | `/api/me/progress/:lessonId` | 更新完成状态 |
| PUT | `/api/me/notes/:lessonId` | 保存学习记录 |
| PUT | `/api/me/checklist/:lessonId/:itemIndex` | 勾选任务项 |
| POST | `/api/me/lab-runs` | 手动写入运行记录 |
| POST | `/api/me/run-code` | 沙箱执行代码并落库 |
| GET | `/api/me/settings` | 读取模型配置（Key 打掩码） |
| PUT | `/api/me/settings` | 保存模型配置（传掩码则保留原 Key） |
| GET | `/api/search?q=` | 全局搜索知识点 |

非 `/api/` 的 GET 请求统一回落到 `public/index.html`，支持前端路由刷新。

## 代码沙箱说明

`server/codeRunner.js` 通过子进程执行用户代码，限制如下：

- 写入系统临时目录的 `.mjs` 文件，执行完即删
- 超时 8 秒，输出上限 512KB
- 静态黑名单拦截 `process.exit`、`child_process`、`fs.rm/rmdir/unlink`、`execSync` 等
- `cwd` 设为项目根目录，因此实验代码可直接 `import` 根 `node_modules` 里的 `openai`、`axios`、`zod`、`dotenv`
- 用户配置的 API Key 以环境变量注入：`OPENAI_API_KEY`、`OPENAI_BASE_URL`、`DEFAULT_MODEL`

⚠️ 这是**教学用途的轻量隔离**，不是真正的安全沙箱（没有容器/命名空间/资源 cgroup 隔离）。仅在可信环境或单人自用场景部署，不要开放给不受信任的用户。

## 已知问题

- `App.tsx` 首页重定向到 `/lesson/intro`，但课程数据里没有 `intro` 这个 lesson，第一个知识点实际是 `autoregressive`
- 阶段九、十、十一的 16 个知识点没有 `lab` 字段（以理论讲解和面试题为主），实验面板会留空
- `level` / `focus` 字段覆盖 68 个知识点中的 47 / 46 个，阶段九、十的知识点缺这两个字段
- 阶段九、阶段十的章节编号与阶段七、阶段八重复（都是「第 16 章 / 第 17 章」），阶段十一从「第 18 章」接续
- `courseData.version` 仍是 `2026.09.21-all-terms`，未随阶段十一的加入更新
- `server/courseData.js` 和 `server/refactor.js` 是拆分前的历史文件，已不被运行时引用

## 后续扩展方向

- 把课程内容迁移到后台可编辑的表结构
- 用容器化沙箱（gVisor / Firecracker / Docker-in-Docker）替换子进程执行
- 接入真实向量库实验环境：pgvector、Qdrant、Elasticsearch、Meilisearch
- 评估集导入导出与 Prompt 版本管理
- 多用户注册与角色权限
