export const stage11 = {
  id: "interview-arch",
  title: "课后拓展：大厂高并发架构设计与面经通关",
  goal: "吃透腾讯等一线大厂 AI 应用岗高频面试题、系统设计实战与项目全链路陈述策略。",
  routeIndex: 11,
  routeFocus: "面试通关 & 架构设计",
  studyFlow: ["架构设计拆解", "高并发难点攻坚", "STAR法则项目讲述", "速查复习"],
  chapters: [
    {
      id: "system-designs",
      title: "第 18 章：大模型应用系统设计实战",
      goal: "掌握大厂二面必考的端到端架构设计，包括 C 端知识库助手与高可用通用 Agent 平台。",
      lessons: [
        {
          id: "system-design-doc-assistant",
          title: "系统设计：C 端长文档知识库助手（类似腾讯文档 AI）",
          level: "进阶",
          focus: "面试重点",
          estimatedMinutes: 50,
          scenario: "面试官发问：“请你设计一个类似腾讯文档 AI 助手的 C 端知识库问答产品，用户可上传数十万字长文档（PDF/Word/Excel），支持多轮问答和流式输出。请画出系统架构，讲清核心模块和核心难点。”",
          why: "这是大厂二面出现频率最高的系统架构设计题，综合考察了文件离线管道、在线流式链路、多模态处理和长文本上下文治理能力。",
          definition: "集成异步文档解析引擎、多路召回重排流水线、分布式会话状态机和 SSE 流式输出的高并发 C 端 RAG 架构方案。",
          explanation: [
            "【全链路架构分层】：\n" +
            "1. 客户端接入层：Web/小程序通过统一 API 网关接入，维持 SSE 长连接进行实时打字机输出。\n" +
            "2. 离线/异步解析管道：用户上传文档后由 OSS 存储，通过 MQ（Kafka）异步派发给解析集群。采用 MinerU / PaddleOCR 解析文本、图表和表格，使用父子分块（Parent-Child）切片并丰富元数据，调用 Embedding 模型写入分布式向量库（Qdrant）与全文索引（ES）。\n" +
            "3. 在线检索问答管道：用户提问经过输入安全检测、Query 改写与多轮代词消解后，并行触发 BM25 与向量双路召回；经过 RRF 融合与 Cross-Encoder 重排过滤，挑出 Top 3~5 核心证据；组装 Prompt 喂给 LLM，流式推流输出。\n" +
            "4. 状态与存储层：Redis Cluster 缓存最近活跃会话与 Token 预算，PostgreSQL 持久化文档元数据、历史对话与权限 ACL。",
            "【核心难点攻坚 1：超长文档几十万字上传即问的秒级响应】：\n" +
            "几十万字全部完成解析、向量化和建索引可能需要数分钟，不能让用户干等！\n" +
            "架构解法：采用【分阶段渐进式就绪（Progressive Ingestion）】策略。文档上传后，前置轻量提取前 10 页或目录结构做即时粗切片（10 秒内可用），先允许用户针对概览提问；后台通过 Celery / Flink 异步切分后续全量文本，前端显示解析进度条（已索引 30%... 80%... 100%）。",
            "【核心难点攻坚 2：表格与图表精准理解】：\n" +
            "表格通过 Table-to-Markdown 抽取并用小模型做文本摘要用于召回，原表喂给大模型；流程图/架构图离线通过 VLM（Qwen2-VL）生成语义描述注入检索索引，前端输出时渲染高保真原图链接。",
            "【核心难点攻坚 3：多轮对话下的指代消解与上下文膨胀】：\n" +
            "用户在第 3 轮问“它的营收怎么样？”，直接拿“它”去向量检索会彻底丢失语义。在线链路先调用轻量小模型执行【Query Rewrite（查询重写）】，结合最近 2 轮历史改写为独立完整的“腾讯云 2024 年营收怎么样”，再去检索；历史对话采用滑动累加摘要控制在 2000 Token 以内。",
            "【核心难点攻坚 4：客户端意外断连与大模型算力保护】：\n" +
            "服务端监听 socket close 事件，对于纯问答请求立即调用 AbortController 掐断与大模型的下游 HTTP 请求，秒级止血昂贵 GPU 算力；同时通过滑动窗口缓冲实时进行敏感词 Trie 树过滤。"
          ],
          levels: [
            { label: "入门理解", content: "把系统想象成图书馆：管理员（解析管道）把厚书切成卡片塞进抽屉；读者（用户）来借书，前台（检索重排）迅速找出最相关的 3 张卡片，打字员（大模型）根据卡片快速写出回答。" },
            { label: "原理解析", content: "深入理解读写分离、异步消息驱动编排、双路召回融合与 SSE 流式管道的事件驱动机制。" },
            { label: "工程落地", content: "在生产中通过 Redis 缓存高频 Query、分级模型路由（小模型重写+大模型生成）、Nginx 配置 proxy_buffering off 保证流式零卡顿。" }
          ],
          misconceptions: [
            "长文档可以一次性塞进 Gemini 1M 上下文直接问（延迟太高、成本巨贵且存在 Lost-in-the-middle 盲区）。",
            "文档上传可以同步处理（超大 PDF 同步处理必然导致 HTTP 504 网关超时）。",
            "RAG 只要向量检索就够（纯向量在搜索专有名词和错误码时会被 BM25 吊打）。"
          ],
          pitfalls: [
            "Nginx 开启了 proxy_buffering 导致 SSE 流式输出变成几秒才吐一大块。",
            "未对用户上传文件做多租户隔离，导致用户 A 检索到了用户 B 的内部私密文档。",
            "长文档切块未保留父级章节标题，导致单看段落不知所云。"
          ],
          terms: [
            { name: "Query Rewrite", summary: "多轮对话中的查询改写与指代消解技术。", detail: ["消除代词歧义（把'它'还原为主语）。","补全省略的上下文信息。","生成更适合向量检索的独立问题。","通常由微调的轻量级小模型毫秒级完成。"] },
            { name: "Progressive Ingestion", summary: "超大文档渐进式索引与就绪架构。", detail: ["优先解析首部和目录供即时问答。","后台异步队列持续切块全量长文。","前端通过进度条展示知识就绪状态。","解决超大文件等待时间过长痛点。"] }
          ],
          interview: [
            {
              q: "【腾讯二面原题】请画出类似腾讯文档 AI 助手的端到端架构图，并讲出 3 个最核心的技术难点及你的解决方案。",
              a: "1. 整体架构可分为四层：\n- 接入层：API Gateway + Nginx（配置 proxy_buffering off）处理跨域鉴权与 SSE 长连接。\n- 离线/异步知识处理集群：OSS/S3 对象存储 -> Kafka 任务队列 -> 分布式 Worker 集群（基于 OCR/MinerU 处理 PDF、Word、Excel，生成父子分块与图像摘要）-> 写入 Qdrant 向量库与 Elasticsearch 全文检索。\n- 在线推理问答引擎：Input Guardrails -> Query 改写与指代消解 -> 混合检索（BM25 + 向量）-> RRF 融合 -> Cross-Encoder 重排 -> 上下文重排序（两头布局避开 Lost-in-the-middle）-> 大模型 SSE 流式输出 -> 流式敏感词滑窗过滤 -> 客户端逐字渲染。\n- 状态与缓存层：Redis Cluster 存放活跃对话轮次与 Token 熔断计数；PostgreSQL 记录用户权限与文档元信息。\n\n2. 三大核心难点与解法：\n① 难点一：超大文档上传等待时间过长。解法：渐进式解析，首屏优先提取目录和前言，10 秒内即可开启首轮对话，后台多 Worker 异步分片切全量。\n② 难点二：长对话代词歧义与记忆丢失。解法：检索前必经 Query Rewrite 模块把“它”还原；历史对话使用滚动摘要（Rolling Summary）将过往 20 轮压缩在 2000 Token 内。\n③ 难点三：高并发下下游抖动与算力雪崩。解法：客户端断连自动 abort 下游请求；网关接入断路器（Circuit Breaker），大模型 5xx 激增时快速 Fail-Fast 降级至自建容灾模型。"
            }
          ],
          realCode: `// 演示流式知识库助手后端核心逻辑
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });

async function streamDocQA(userQuery, retrievedChunks, onToken) {
  // 1. 首尾倒序布局防止 Lost-in-the-middle
  const orderedChunks = [retrievedChunks[0], ...retrievedChunks.slice(2), retrievedChunks[1]].filter(Boolean);
  const contextText = orderedChunks.map((c, i) => \`[文档片段\${i+1}] \${c}\`).join('\\n\\n');

  const systemPrompt = \`你是一名严格的文档知识助手。请严格根据参考文档回答问题。若文档未提及，请明确拒答。\\n\\n参考资料:\\n\${contextText}\`;

  const stream = await client.chat.completions.create({
    model: process.env.DEFAULT_MODEL || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || '';
    if (token) onToken(token);
  }
}

// 模拟调用
streamDocQA('腾讯云产品优势有哪些？', ['腾讯云依托海量自研基础设施，网络低时延。', '腾讯拥有全球领先的安全合规防护体系。'], t => process.stdout.write(t));`
        },
        {
          id: "system-design-agent-platform",
          title: "系统设计：支撑十万并发的高可用通用 Agent 平台",
          level: "进阶",
          focus: "面试重点",
          estimatedMinutes: 50,
          scenario: "面试官发问：“如果让你设计一个企业级通用的 Agent 开放平台，支持数万开发者/数百万用户创建自己的 Agent、接入自建工具、多轮对话。如何设计分布式会话持久化、熔断限流、审计日志和防雪崩？”",
          why: "考察架构师对分布式高可用系统（HA）、多租户隔离、资源配额管控以及全链路治理的综合掌控力。",
          definition: "一个兼具控制面（配置/插件市场/权限）与数据面（状态机执行引擎/分布式运行时）的高可用 Agent 基础设施平台。",
          explanation: [
            "【控制面与数据面彻底解耦】：\n" +
            "1. 控制面（Control Plane）：管理 Agent 提示词配置、可用 Tool 注册中心（基于 MCP 协议 / OpenAPI Schema 导入）、多租户权限与费用账单系统，使用 MySQL / PostgreSQL 存储。\n" +
            "2. 数据面（Data Plane）：轻量级无状态 Agent 执行引擎（Worker 集群）。根据租户配置动态加载工具定义，执行状态机，通过 Redis Cluster 维系会话态，通过异步消息队列协调长耗时任务。",
            "【高并发会话持久化架构（十万级在线）】：\n" +
            "1. 拒绝单机内存状态：所有 Worker 节点严格保持无状态（Stateless），任何一台 Pod 宕机，其他 Pod 秒级接管。\n" +
            "2. 存储分层：\n" +
            "   - 热状态（Redis Cluster）：Key 为 `agent:{tenant_id}:{session_id}`，存储最近 N 步状态快照与局部变量，设置 30 分钟滑动过期；\n" +
            "   - 冷持久化（PostgreSQL / MongoDB）：通过 Kafka 异步批量落盘，记录完整对话流、Token 消耗、工具出入参和时间戳，供历史审计查阅。",
            "【高并发熔断、限流与防雪崩】：\n" +
            "1. 三级限流体系：\n" +
            "   - 网关层（QPS 限流）：单 IP / 单 User 限制每秒请求频次（令牌桶算法），拦截恶意攻击；\n" +
            "   - 租户层（Token 额度限额）：租户每日 Token 预算预扣机制，超额秒级拦截；\n" +
            "   - 下游模型层（并发度控制）：大模型 API 往往有 TPM/RPM 限制，采用分布式漏桶算法严格控制打向下游大模型的并发连接数。\n" +
            "2. Agent 内部死循环熔断：\n" +
            "   - 使用 Redis + Lua 实现分布式原子计步器（单次任务最大 10 步）；\n" +
            "   - 动作指纹检测：连续出现相同工具与相同参数，直接判定死锁触发断路器。",
            "【工具沙箱与外部调用防护】：\n" +
            "1. 代码执行工具：运行在 Docker / gVisor 轻量级隔离沙箱容器中，限制无外网访问权限、限制 CPU/内存限额，设置 5s 强制 SIGKILL。\n" +
            "2. 外部 HTTP 工具：集成统一的出向 HTTP Proxy，实施域名白名单，阻断内网 SSRF 攻击，设置 3s 严格超时。"
          ],
          levels: [
            { label: "入门理解", content: "就像云服务器平台：用户不仅可以在上面买机器，还可以挂载硬盘（记忆）、插上网线（工具），平台负责保证无论多少人用都不会断电或欠费崩溃。" },
            { label: "原理解析", content: "理解控制面与数据面解耦、基于 Redis 的分布式锁与状态机持久化、以及三级令牌桶/漏桶级联限流算法。" },
            { label: "工程落地", content: "在企业中深度结合 Prometheus + Grafana 监控 P99 延迟与大模型状态码分布，全链路注入 TraceId（OpenTelemetry）。" }
          ],
          misconceptions: [
            "分布式 Agent 可以用单机线程池排队（单机一崩任务全丢失）。",
            "Agent 的工具调用可以由模型直接发起外网请求（存在极高的内网渗透和安全漏洞风险）。",
            "只要大模型可用，系统就不会挂（上游高并发冲垮下游连接池是主要故障原因）。"
          ],
          pitfalls: [
            "外部 Webhook 工具响应慢导致 Worker 线程池耗尽，全站卡死。",
            "多租户环境没有做 Token 隔离，某一个用户的死循环任务烧干了全公司的总账户余额。",
            "分布式会话更新没有考虑并发竞态，两次快速点击导致会话状态错乱覆盖。"
          ],
          terms: [
            { name: "Control Plane / Data Plane", summary: "平台的控制面与数据面分离架构。", detail: ["控制面管配置、注册、鉴权与计费。","数据面专职轻量、无状态的高速状态机推理。","互不影响，数据面支持万级 Pod 水平扩容。","云原生现代基础设施的标准架构范式。"] },
            { name: "SSRF 防护", summary: "防止 Agent 攻击内网的服务端请求伪造防御。", detail: ["工具执行外部网络请求时的高危漏洞。","必须禁止访问 127.0.0.1 及 10.x/192.168.x 私有网段。","强制通过出向安全代理和域名白名单机制。","大模型 Tool Calling 安全体系的生命线。"] }
          ],
          interview: [
            {
              q: "【腾讯二面原题】设计一个高可用企业级通用 Agent 平台，支撑十万并发，会话持久化、熔断、限流、日志审计应该如何端到端落地？",
              a: "这是腾讯架构师级别的压轴大题，需按微服务生产标准架构从容作答：\n1. 总体架构：数据面与控制面分离。控制面基于 Spring/NestJS 管理 Agent 配置、工具市场与多租户权限；数据面由无状态的 Agent Worker 集群组成，基于事件驱动架构（Event-Driven）运行。\n\n2. 分布式会话持久化（支持十万并发）：\n- 状态下沉：严禁使用本地 JVM/Node 内存！活跃态存入 Redis Cluster（以 `session:{id}` 存储最近轮次上下文与中间变量，带 30min 滑动 TTL）；持久态通过 Kafka 异步批量推入 PostgreSQL/MongoDB，保证数据高可靠且杜绝写穿对数据库的压力。\n\n3. 三级立体限流与熔断防雪崩：\n- 第一级（入口防护）：网关层针对用户 ID 与 IP 基于 Redis 令牌桶做 QPS 限流；\n- 第二级（下游控频）：针对模型服务商的 RPM/TPM 限制，在平台出向接入分布式漏桶，避免 429 报错；\n- 第三级（Agent 自愈熔断）：单次 Agent 交互设置最大步数（Redis 原子计数上限 10 步）、单任务 Token 预算上限（如 16k tokens）、工具连续重复调用指纹（MD5）检测，任意一项违规立即熔断退出并告警。\n\n4. 工具调用沙箱与安全隔离：\n- 任何代码解释器工具强制运行于独立的 gVisor / Firecracker 微虚拟机沙箱，彻底封死网络权限并限制 5s 超时；\n- 外部 HTTP 工具调用经过出网安全网关，硬性拦截 127.0.0.1、192.168.x 等私网 IP，防止内网 SSRF 探测穿透。\n\n5. 全链路可观测性与日志审计：\n- 引入 OpenTelemetry 协议。生成全局全局唯一 `trace_id`，打通网关、Agent 决策循环、工具执行、大模型出入参、风控敏感词检测全流程；异步落入 ClickHouse / Elasticsearch，支持按用户、错误码、延迟秒级过滤溯源排障与财务计费对账。"
            }
          ],
          realCode: `// 演示分布式会话与步数熔断控制核心实现
class DistributedAgentGovernor {
  constructor(redisClient) {
    this.redis = redisClient;
  }

  async checkAndStep(traceId, toolFingerprint, maxSteps = 8) {
    // 模拟原子操作检查
    const currentSteps = 3; // 假设从 Redis 获取
    if (currentSteps >= maxSteps) {
      throw new Error(\`[Circuit Breaker] Agent 步骤超过上限 \${maxSteps}，触发熔断停止！\`);
    }
    console.log(\`[Trace: \${traceId}] 当前步数: \${currentSteps + 1}，检查通过，继续执行。\`);
    return true;
  }
}

const governor = new DistributedAgentGovernor();
governor.checkAndStep('trace_123456', 'get_weather_shanghai')
  .then(() => console.log('执行工具中...'))
  .catch(err => console.error(err.message));`
        }
      ]
    },
    {
      id: "interview-mastery",
      title: "第 19 章：腾讯大模型面经通关与项目陈述",
      goal: "掌握大厂面试中的项目讲述 STAR 表达模型，与 20 道高频必杀工程题的核心记忆网络。",
      lessons: [
        {
          id: "interview-project-walkthrough",
          title: "面试必通：如何用 STAR 模型讲透你的 RAG / Agent 落地项目",
          level: "进阶",
          focus: "面试重点",
          estimatedMinutes: 45,
          scenario: "面试官：“请花 3-5 分钟，完整讲一遍你做过的最具挑战性的 RAG 或 Agent 项目流程，讲清背景、架构、难点和最终结果。”",
          why: "很多候选人做了很多工作，但一开口就像报流水账，抓不住痛点与指标。大厂极其看重结构化表达与技术选型背后的商业推导。",
          definition: "利用 STAR 法则（Situation 业务情境, Task 目标指标, Action 核心技术攻坚, Result 量化业务产出）进行大模型项目的专业汇报范式。",
          explanation: [
            "【S - Situation（业务背景与核心痛点）】：\n" +
            "切忌一上来就罗列 LangChain/向量库！先讲业务真实痛点：例如“我们公司原来有数十万份复杂的售后产品技术文档，客服人工查找慢、平均响应时长高达 3 分钟，且普通客服对生僻型号回答错误率高达 25%，导致严重客诉；同时老一代关键字搜索面对用户口语化提问命中率极低。”",
            "【T - Task（项目技术指标与目标）】：\n" +
            "给出量化工程目标：例如“构建一套低延迟的企业级智能文档问答助手，目标将平均首字延迟（TTFB）压缩到 1.5 秒以内，知识召回率达到 92% 以上，回答准确率提升至 90%，并保证回答 100% 具备原文引用标注，支持日均 10 万次提问。”",
            "【A - Action（核心架构与三大技术攻坚点，重中之重）】：\n" +
            "1. 召回层攻坚（解决搜不到）：抛弃单向量检索，构建了 BM25 + BGE-Large-zh 的混合检索通道，使用 RRF 算法动态融合；针对几十万字超长 PDF，自研了基于父子文档切块（Parent-Child Chunking）的索引结构，命中率大幅提升。\n" +
            "2. 排序与生成层攻坚（解决答不对）：在粗排后引入 BGE-Reranker-Large，并通过 ONNX+INT8 量化使单次重排耗时从 80ms 压到 18ms；首创两头倒序布局，彻底解决 Lost-in-the-middle 盲区；System Prompt 加入严格依据性校验，杜绝幻觉。\n" +
            "3. 生产工程稳定性攻坚（解决扛不住）：全链路采用 SSE 流式打字；集成分布式熔断限流；对于高频问题建立 Redis 语义缓存，直接拦截 32% 的重复提问，单月节省 API 成本 4.2 万元。",
            "【R - Result（量化结果与价值沉淀）】：\n" +
            "“上线后系统平稳支撑了峰值 200 QPS。客服平均响应耗时由 3 分钟降至 15 秒，回答准确率由 75% 跃升至 93.5%，BadCase 投诉率下降 80%，同时沉淀了包含 500+ 条用例的自动化回归测试飞轮。”"
          ],
          levels: [
            { label: "入门理解", content: "像讲一个精彩的侦探故事：遇到了什么离奇大案（S），立下了什么军令状（T），使用了什么独门破案绝技攻克难关（A），最终抓获凶手获得了什么勋章（R）。" },
            { label: "原理解析", content: "面试官真正在考核的是：你是否具备将模糊业务需求转化为清晰工程架构的能力，以及你在高并发、高成本真实世界中的工程权衡取舍能力。" },
            { label: "工程落地", content: "提前将架构图、核心指标（TTFT、NDCG@10、成本节约数据、P99）烂熟于心，随时准备在白板上画出完整的数据流水线。" }
          ],
          misconceptions: [
            "只讲调了哪个开源库，不讲为什么这样选型。",
            "没有量化指标，通篇只说'效果很好'、'性能有了很大提升'。",
            "把所有的技术栈全都罗列一遍，但说不出自己在其中攻坚了哪一部分。"
          ],
          pitfalls: [
            "被追问'如果召回正确但回答错误你具体看了几百个 BadCase 怎么分类的'时哑口无言。",
            "虚构了超高并发指标，但在被问到底层 Redis 内存占用和 HNSW 索引大小计算时露怯。"
          ],
          terms: [
            { name: "STAR 模型", summary: "Situation, Task, Action, Result 结构化陈述法则。", detail: ["大厂技术与架构面试的标准沟通模型。","杜绝流水账，突出痛点与工程决策价值。","重点在 Action 的技术攻坚深度与权衡。","终结在量化的数字指标与真实业务影响。"] }
          ],
          interview: [
            {
              q: "【腾讯一面必考】请详细讲讲你做过的 RAG/Agent 项目中，遇到过最难的一个 Bug/BadCase 是什么？你是怎么排查并定位修复的？",
              a: "推荐采用深度技术归因的真实范例回答：\n“在我们的智能知识库项目上线初期，遇到了一个极其诡异的高频 BadCase：在跨季度财报问答中，知识库明明精准召回了包含‘2024年Q2国际游戏收入增长9%’的正确切片，但是大模型在生成回答时，却屡屡给出‘收入下滑3%’的荒谬结论，业务方险些认定系统不可用。\n\n我的排查与攻坚链路：\n1. 排除检索问题：比对 Rerank 后的 Top 5 Chunk，确认正确证据排在第 3 位。\n2. 定位底层机理：通过打印模型注意力热力图与对比实验，发现两个致命叠加原因：\n   - 其一是 Lost-in-the-Middle 效应：前后的第 1、2、4、5 块均在讨论早期的其他亏损业务，中间第 3 块的正向证据被大量负向上下文‘注意力淹没’；\n   - 其二是切块上下文断裂：第 3 块文字开头为‘该板块在经历调整后实现 9% 增幅’，缺失了‘国际游戏’的主语指代，而第 2 块的主语是‘国内传统业务下滑 3%’，大模型发生了指代混淆！\n3. 落地体系化三步重构：\n   - 第一，切块链路升级：引入父子分块（Parent-Child）与前置上下文注入（Contextual Retrieval），给每个切片头部带上章节背景；\n   - 第二，上下文布局优化：采用首尾倒序布局，将最核心证据放在最贴近 User Query 的两端；\n   - 第三，Prompt 强约束重构：强制引入 CoT 推理与实体引用标记。\n修复后，在 500 条财务对比专用测试集上，该类错误发生率从 28% 直接降至 0.8%。”"
            }
          ],
          realCode: `// 演示 RAG 项目中的端到端上下文重编排与事实核验
function assembleProductionContext(query, rankedChunks) {
  // 1. 过滤低置信度（分值低于阈值 0.65 的直接剔除）
  const validChunks = rankedChunks.filter(c => c.score >= 0.65);
  if (validChunks.length === 0) return { canAnswer: false, context: '' };

  // 2. 实施'两头沉'布局，化解 Lost-in-the-middle
  const reordered = [];
  let left = true;
  for (const chunk of validChunks.slice(0, 5)) {
    if (left) reordered.unshift(chunk);
    else reordered.push(chunk);
    left = !left;
  }

  const contextStr = reordered.map((c, i) => \`<evidence id="\${i+1}" relevance="\${c.score}">\${c.text}</evidence>\`).join('\\n');
  return { canAnswer: true, context: contextStr };
}

const chunks = [
  { text: '国际业务板块Q2增长9%', score: 0.92 },
  { text: '国内传统业务受影响下滑3%', score: 0.85 },
  { text: '公司总体合规良好', score: 0.70 },
];
console.log(assembleProductionContext('Q2业务表现', chunks));`
        },
        {
          id: "interview-20-hardcore-qa-index",
          title: "腾讯 AI 大模型应用岗 20 道硬核必杀题速查全景",
          level: "进阶",
          focus: "面试重点",
          estimatedMinutes: 60,
          scenario: "距离腾讯大模型面试还有 30 分钟，你需要快速过一遍所有高频工程考点、底层瓶颈、核心指标公式和标准标准话术要点。",
          why: "临门一脚，将全站分散的工程考点汇总提炼成一张高密度的认知思维网，随查随用。",
          definition: "覆盖流式通信、长文档分块、混合检索打分、Rerank加速、向量库高并发、分布式熔断、评测缺陷等 20 道一线大厂工程必考题的终极速查指南。",
          explanation: [
            "【模块一：通信与流式工程 (Q1, Q4, Q10)】\n" +
            "1. SSE vs 普通 HTTP：单向长连接、Transfer-Encoding: chunked、文本协议、无额外握手。用户断连必须立即 AbortController 中断大模型节省 Token，除有副作用事务需后台异步执行。\n" +
            "2. 下游大模型抖动保护：网关断路器（Circuit Breaker）、TTFT 超时切换多厂商双活通道、SSE 心跳定时保活（: ping\\n\\n）。",
            "【模块二：RAG 数据与检索加速 (Q4, Q5, Q11, Q21, Q22, Q23, Q25)】\n" +
            "3. 超长文档切块：父子分块（Small-to-Big）、RAPTOR 摘要树路由、Contextual 头部背景注入。\n" +
            "4. 多模态 RAG：复杂表格通过 Table-to-Markdown 摘要增强；图片离线通过 VLM 做详细图文 Captioning 并入文本切片。\n" +
            "5. BM25 + 向量打分融合：严禁直接加！采用 RRF（倒数排名融合，k=60），仅依赖位次无视量纲，抗长尾强。\n" +
            "6. Rerank 推理慢 QPS 低：缩减候选集至 Top 20~30、文本截断至 256、ONNX/TensorRT INT8 量化加速、轻量级模型蒸馏、查询级 Redis 缓存。\n" +
            "7. 向量库高并发瓶颈：HNSW 内存膨胀 OOM（开启 SQ8 量化）、CPU 浮点计算饱和（SIMD 指令集+只读副本分流）、锁竞争（冷热双分片）、单阶段联合过滤（Single-stage filter）。\n" +
            "8. Lost-in-the-middle：U型自注意力偏见，核心证据采取两头沉排布，限制总上下文长度。",
            "【模块三：Agent 架构与稳定性 (Q3, Q8, Q13, Q14, Q19, Q20, Q26)】\n" +
            "9. 死循环熔断：无状态节点不能用内存！使用 Redis + Lua 分布式原子滑动窗口步数计数、Token 预算熔断与动作 MD5 指纹去重。\n" +
            "10. 非法 JSON 与参数错误：jsonrepair 本地快速自愈、Zod 强类型拦截、错误字段精准回填 Reflection 循环纠错，硬设 2 次重试上限。\n" +
            "11. 十万并发会话存储：单机内存必死！采用 Redis Cluster 热缓存（TTL 30min）+ Kafka 异步批量持久化至 PostgreSQL。\n" +
            "12. Workflow vs Agent：确定性高要求 C 端主链路坚决选 Workflow 状态机，局部小范围赋能 Agentic Workflow。\n" +
            "13. 多 Agent 缺点与协同：高延迟高成本，通信采用强类型 JSON 协议，状态采用黑板模式（Blackboard）共享中心。",
            "【模块四：成本、安全与评测运营 (Q2, Q6, Q7, Q9, Q15, Q16)】\n" +
            "14. Token 成本管控：大模型分级级联路由、深度利用 Prompt Caching（降本 80%）、语义问答缓存、上下文预算治理。\n" +
            "15. 内容安全流式过滤：输入正则+越狱检测；输出采用定长滑动窗口缓冲区（Sliding Window Buffer）与 AC 自动机前缀匹配，命中敏感词立即中断清空。\n" +
            "16. LLM-as-Judge 致命缺陷：位置偏见（换位跑两次）、长度冗余偏见（字数惩罚）、自夸偏见（多模型交叉裁判）、逻辑数值盲区（改用代码断言）。\n" +
            "17. 线上 BadCase 飞轮：全链路 Trace 归因打标 -> 补充进入 Golden Dataset -> 优化引擎与提示词 -> CI/CD 自动回归门禁拦截。"
          ],
          levels: [
            { label: "入门理解", content: "这是一张通关小抄，把前面 10 个阶段的所有难点融会贯通，直接对准腾讯技术总监的提问框架。" },
            { label: "原理解析", content: "每道题都不是孤立的技术点，背后都是大厂在海量并发、昂贵算力和容灾稳定性下的工程妥协与最优解。" },
            { label: "工程落地", content: "建议将这 20 个核心技术模块整理成脑图，在白板面试和简历项目中逐一对应体现。" }
          ],
          misconceptions: [
            "以为面试官只是在背八股文（大厂面试官会从第 1 题不断顺藤摸瓜追问到底层代码和线上故障）。",
            "只要背住结论不需要懂推导（被追问'为什么 RRF 的常数 k 设为 60 而不是 0'时必须解释平滑长尾的数学意义）。"
          ],
          pitfalls: [
            "回答系统设计题时没有层次，想到哪讲到哪。",
            "只讲算法原理，忽视了高并发下的超时、熔断、日志和降级兜底。"
          ],
          terms: [
            { name: "RRF (Reciprocal Rank Fusion)", summary: "倒数排名融合算法。", detail: ["两路召回打分融合的工业界标杆算法。","Score = 1 / (60 + Rank)。","不受绝对分数量纲差异影响。","无需机器学习参数训练，极度鲁棒。"] },
            { name: "Golden Dataset", summary: "业务核心基准回归评测集。", detail: ["覆盖线上典型样本与全量历史 BadCase。","CI/CD 自动化发版前的质量门禁。","评估 Agent 优化是否产生副作用的唯一准绳。","大模型团队持续迭代的数据飞轮核心资产。"] }
          ],
          interview: [
            {
              q: "【腾讯大模型终面】如果让你用一句话总结做大模型应用工程研发和传统后端研发的最大区别，是什么？",
              a: "传统后端研发面对的是【确定性系统（Deterministic System）】，核心关注高并发高可用、状态一致性与代码分支覆盖；\n而大模型应用研发面对的是【概率性黑盒（Probabilistic System）】，核心挑战在于【如何用确定性的软件工程体系（强契约、工作流状态机、分布式容错、防护护栏与数据闭环飞轮），去驾驭一个底层不可完全预测的概率大模型】，在不可靠的基础设施之上构建出让用户信赖的确定性生产级服务。"
            }
          ],
          realCode: `// 20 道必杀题速查代码索引演示
console.log("=== 腾讯 AI 大模型应用岗 20 道工程难题速查索引就绪 ===");
console.log("已涵盖：SSE断连、Token控本、超长文分块、RRF混合打分、Rerank优化、向量库高并发、死循环熔断、LLM裁判偏见等全部核心代码模式。");`
        }
      ]
    }
  ]
};
