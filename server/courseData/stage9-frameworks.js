export const stage9 = {
  id: "frameworks",
  title: "阶段九：主流框架与工具生态",
  goal: "掌握业内主流 Agent 框架的优缺点，能够在不同场景下正确选型。",
  chapters: [
    {
      id: "framework-ecosystem",
      title: "第 16 章：框架横评与核心概念",
      lessons: [
        {
          id: "framework-comparison",
          title: "框架横评：LangChain vs LangGraph vs AutoGen vs CrewAI",
          scenario: "你要在下午的技术分享上给团队讲清楚这 4 个框架的区别，帮助团队决定新项目用哪个框架。",
          why: "框架选型直接决定了系统的开发成本、维护难度和扩展性。",
          definition: "横向对比目前最主流的四大 Agent 开发框架的适用场景和核心设计理念。",
          explanation: [
            "LangChain 适合简单的链式调用（Chain），封装了很多工具和组件，但在处理复杂循环和状态时显得笨重。",
            "LangGraph 基于图（Graph）的概念，非常适合构建有复杂状态流转、需要人工介入和循环的单体 Agent。",
            "AutoGen 是微软开源的多智能体框架，强调智能体之间的对话（Conversation）来解决问题，适合开放式问题和代码执行。",
            "CrewAI 是一个基于角色的多智能体框架，让智能体像人类团队一样协作（Crew, Task, Agent），概念上对非技术人员更友好。",
            "结论是：简单 Chain 选 LangChain；状态图选 LangGraph；多智能体交互选 AutoGen/CrewAI。"
          ],
          levels: [
            { label: "入门理解", content: "把 LangChain 看作乐高积木，把 LangGraph 看作流水线，把 AutoGen 看作圆桌会议，把 CrewAI 看作公司组织架构。" },
            { label: "原理解析", content: "LangChain 核心是 Runnable 接口，LangGraph 核心是 StateGraph 和 Checkpointer，多智能体核心是消息路由和对话管理。" },
            { label: "工程落地", content: "在生产中，很多团队最终会放弃沉重的框架，选择用原生代码（如 OpenAI SDK）自己实现状态机，以获得更好的可控性。" }
          ],
          misconceptions: ["必须用框架才能写 Agent。", "LangChain 是解决一切问题的银弹。", "多智能体一定比单智能体强。", "用框架就不需要了解底层 API。"],
          pitfalls: ["框架版本迭代太快导致代码废弃。", "黑盒封装导致难以排查底层错误。", "引入不必要的复杂度导致系统变慢。", "状态管理与自己的业务系统冲突。"],
          terms: [
            { name: "Chain", summary: "将多个组件串联起来的链条。", detail: ["LangChain 的核心概念。","通常包括 Prompt -> Model -> OutputParser。","适合线性工作流。","复杂场景容易变得不可读。"] },
            { name: "Multi-Agent", summary: "多智能体协作系统。", detail: ["将复杂任务拆分给不同角色。","各个角色之间可以进行对话。","适合开放式、探索性任务。","调试难度大。"] }
          ],
          realCode: "// 此处主要为概念横评，可参考各框架官方文档。",
          task: { title: "框架选型报告", description: "写一份 500 字的选型建议。", checklist: ["包含4个框架", "有明确结论"] }
        },
        {
          id: "langchain-concepts",
          title: "LangChain 核心概念",
          scenario: "你需要接手一个用 LangChain 写的旧项目，面对满屏的 Chain 和 LCEL 语法感到困惑。",
          why: "LangChain 是目前生态最丰富的框架，即使不用它，它的概念也深刻影响了行业。",
          definition: "LangChain 是一套提供大模型应用开发的抽象接口和组件库。",
          explanation: [
            "核心组件包括：Model（统一不同厂商接口）、Prompt Template（管理提示词）、OutputParser（解析输出）。",
            "高级组件包括：Memory（历史记录）、Retriever（检索器）、Tool（工具封装）。",
            "最新架构中，LCEL（LangChain Expression Language）被广泛使用，通过管道符（|）串联组件。",
            "它的优点是快速连接各种数据库和工具，缺点是抽象层次太深，排查问题困难。",
            "理解它的设计模式，比记住它的 API 更重要。"
          ],
          levels: [
            { label: "入门理解", content: "把组件想象成工厂里的流水线机器，数据从一端进去，变成结果从另一端出来。" },
            { label: "原理解析", content: "了解 Runnable 接口背后的 invoke, stream, batch 方法如何统一各种组件的输入输出。" },
            { label: "工程落地", content: "在生产中，不要过度依赖它的高级封装，尽量自己管理 Prompt 和状态，只用它的底层连接器。" }
          ],
          misconceptions: ["LCEL 是必须的。", "LangChain 的 Memory 适合所有场景。", "LangChain 会自动解决 Token 限制。", "用它就不用学底层原理。"],
          pitfalls: ["LCEL 报错堆栈难以阅读。", "隐式状态导致内存泄漏。", "默认重试机制导致意外超支。", "升级版本导致大量 API 不兼容。"],
          terms: [],
          realCode: `import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, configuration: { baseURL: process.env.OPENAI_BASE_URL } });
const prompt = PromptTemplate.fromTemplate("讲一个关于 {topic} 的笑话");
const chain = prompt.pipe(model);

async function main() {
  const result = await chain.invoke({ topic: "程序员" });
  console.log(result.content);
}
main();`
        },
        {
          id: "langgraph",
          title: "LangGraph：状态图 Agent",
          scenario: "你需要实现一个能够主动反思、能因为错误而回退重试的复杂写作助手。",
          why: "普通的 Chain 无法表达循环和复杂的分支逻辑，而有向图是完美的数学模型。",
          definition: "LangGraph 是基于状态机和图论构建复杂、可控多步 Agent 的框架。",
          explanation: [
            "在 LangGraph 中，流程被定义为图（Graph），节点（Node）是函数或模型调用，边（Edge）是条件转移逻辑。",
            "整个图共享一个状态（State），每个节点执行后会更新这个状态。",
            "它天然支持循环（比如执行工具 -> 检查结果 -> 不合格则重新执行）。",
            "它内置了 Checkpointer，可以随时保存状态，支持人工中断（Human-in-the-loop）和恢复。",
            "这种范式比 LangChain 的 AgentExecutor 更加可控和透明。"
          ],
          levels: [
            { label: "入门理解", content: "就像画业务流程图，有判断框和执行框，图的当前状态就是表格里记录的参数。" },
            { label: "原理解析", content: "核心是 StateGraph 类的编译和执行过程，理解 reducer 函数如何合并状态变更。" },
            { label: "工程落地", content: "在企业应用中，结合持久化存储（如 Postgres）保存图的 Checkpoint，实现跨会话的中断与继续。" }
          ],
          misconceptions: ["图只适合画 UI，不能用来写代码。", "状态共享会导致并发问题（实际上每个流是独立的）。", "LangGraph 比原生代码难维护。", "只能在 Python 用。"],
          pitfalls: ["状态定义过于庞大。", "死循环没有设置最大步数。", "节点函数中修改了全局变量而不是返回更新状态。", "条件边的逻辑分支未穷尽。"],
          terms: [],
          realCode: `import { StateGraph, END } from "@langchain/langgraph";
// LangGraph 代码结构较长，这里为简写示例
const graph = new StateGraph({ channels: { messages: { value: (x, y) => x.concat(y), default: () => [] } } })
  .addNode("agent", async (state) => ({ messages: ["agent message"] }))
  .addEdge("agent", END);
const app = graph.compile();
app.invoke({ messages: ["start"] }).then(console.log);`
        },
        {
          id: "streaming",
          title: "Streaming 流式输出",
          scenario: "用户在等待长答案时，页面一直转圈加载，导致他们以为系统死机了，你需要逐字显示内容。",
          why: "流式输出大幅降低了用户的首字节时间（TTFB），是现代 AI 应用的标配体验。",
          definition: "Streaming 是一种通过 Server-Sent Events (SSE) 或块传输技术，将模型的生成内容逐个 Token 推送给前端的技术。",
          explanation: [
            "大模型是自回归生成的，本身就是逐个 Token 吐出结果。",
            "传统的 HTTP 请求要等所有内容生成完才返回，这可能需要几十秒。",
            "流式输出利用 SSE，保持连接不断开，后端一旦收到新的 chunk 就转发给前端。",
            "前端接收到流后，逐步拼接到 UI 上，实现“打字机”效果。",
            "在实现流式输出时，工具调用和 JSON 解析会变得更复杂，因为需要在半途解析不完整的结构。"
          ],
          levels: [
            { label: "入门理解", content: "就像看直播，不是等比赛结束才发录像给你，而是一边打一边看。" },
            { label: "原理解析", content: "底层基于 HTTP 的 chunked 传输编码和 SSE 协议。模型 API 返回的也是一个可迭代的数据流。" },
            { label: "工程落地", content: "需要在网关层、负载均衡器配置支持长连接。处理工具调用时，需等待特定的 stream_options 标志位结束。" }
          ],
          misconceptions: ["流式输出会让模型生成得更快。", "WebSocket 是流式输出的唯一方法。", "流式输出没法做 JSON 解析。", "只能输出文字不能输出工具事件。"],
          pitfalls: ["Nginx 配置中屏蔽了 chunked 传输。", "前端拼接状态未做防抖导致渲染卡顿。", "网关 60 秒超时切断了长连接。", "无法拦截过滤涉黄涉政词汇（因为是逐字输出的）。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });
async function main() {
  const stream = await client.chat.completions.create({
    model: process.env.DEFAULT_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: '写一首关于秋天的诗' }],
    stream: true,
  });
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}
main();`
        },
        {
          id: "langsmith-prompt",
          title: "Prompt 版本管理与 LangSmith",
          scenario: "团队里不同的人都在修改提示词，结果昨天的改动导致今天线上某个重要场景崩了，没人知道是谁改了什么。",
          why: "Prompt 就是 AI 时代的代码，必须像管理代码一样对其进行版本控制和回归测试。",
          definition: "Prompt 版本管理和评测平台（如 LangSmith）是用于跟踪、调试、版本化和评估大模型调用的工具链。",
          explanation: [
            "很多团队的 Prompt 直接硬编码在代码里，缺乏变更审查机制。",
            "专业平台（LangSmith / Langfuse）可以把 Prompt 与代码解耦，实现云端获取和版本回退。",
            "同时，这些平台提供了 Trace 功能，记录了每一次调用的输入、输出、耗时和成本，形成可视化链路。",
            "更重要的是，可以在平台上沉淀测试数据集。每次修改 Prompt，都能一键在测试集上跑回归，验证是否变好。",
            "这是从个人作坊走向企业级团队协作的关键一步。"
          ],
          levels: [
            { label: "入门理解", content: "就像 Git + GitHub，不过管理的是提示词和运行日志，而不是纯代码。" },
            { label: "原理解析", content: "平台通过拦截 OpenAI API 请求（或者通过特定 SDK注入 callback），把 trace 数据异步上报。" },
            { label: "工程落地", content: "一定要在代码中透传 session_id 和 user_id，这样才能在平台上追踪到一个用户完整的交互链路。" }
          ],
          misconceptions: ["Prompt 就是文本，存在代码里就行。", "没必要花钱买观测平台，自己打 log 即可。", "评估指标一定得是数学公式计算的。", "Trace 会严重拖慢系统性能。"],
          pitfalls: ["异步日志上传失败导致应用崩溃。", "在 Trace 中泄露了用户敏感隐私数据（PII）。", "测试集长期不更新，与线上真实场景脱节。", "环境未隔离，测试数据混入生产日志。"],
          terms: [],
          realCode: `// 演示如何使用 LangSmith (需配置 LANGCHAIN_API_KEY 等环境变量)
import { Client } from "langsmith";
const client = new Client();
async function main() {
  // 实际项目中，通过 @langchain 的机制自动 tracing
  console.log("假设正在上报 trace 数据到 LangSmith...");
}
main();`
        },
        {
          id: "openai-assistants",
          title: "OpenAI Assistants API",
          scenario: "你要开发一个带有状态记忆的长期伴学机器人，但不想自己维护复杂的数据库和上下文截断逻辑。",
          why: "Assistants API 把状态管理、RAG 检索、代码解释器等底层脏活累活都打包成了后端服务。",
          definition: "OpenAI 提供的一套带有持久化线程（Thread）、内置工具（Code Interpreter, Retrieval）和生命周期管理（Run）的 API。",
          explanation: [
            "传统的 Chat Completion 每次请求都要把整个历史发过去（Stateless）。",
            "Assistants API 引入了 Thread（线程）概念，你只需向 Thread 追加 Message，OpenAI 帮你管理历史和截断（Stateful）。",
            "你可以创建一个 Assistant（包含模型、指令和内置工具配置），然后将 Run（运行实例）关联到某个 Thread 上。",
            "它极大地简化了多模态和工具调用的实现，尤其是代码解释器，可以安全执行 Python 脚本来处理数据。",
            "缺点是目前仍较慢，且强绑定 OpenAI 生态，难以平滑迁移到开源模型。"
          ],
          levels: [
            { label: "入门理解", content: "把 OpenAI 当成你的云端数据库，你只负责发新消息，它帮你记住之前聊了什么并处理工具。" },
            { label: "原理解析", content: "理解 Assistant, Thread, Message, Run, RunStep 这几个核心对象之间的关系和生命周期轮询机制。" },
            { label: "工程落地", content: "必须处理 Run 的 status 轮询（或者使用流式 SDK），处理 require_action 状态以执行本地自定义工具。" }
          ],
          misconceptions: ["Assistants API 就是普通对话接口。", "它支持任何大模型。", "它比自己实现 Agent 更快更便宜。", "不需要维护本地数据库（业务状态依然需要本地维护）。"],
          pitfalls: ["轮询导致大量冗余网络请求和延迟。", "线程无限增长导致费用爆炸。", "卡在 in_progress 状态无法取消。", "难以定制化复杂的内置 RAG 逻辑。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });
async function main() {
  // 1. 创建 Assistant
  const assistant = await openai.beta.assistants.create({
    name: "数学辅导员",
    instructions: "你是一个辅导数学的老师。",
    tools: [{ type: "code_interpreter" }],
    model: process.env.DEFAULT_MODEL || "gpt-4o"
  });
  // 2. 创建 Thread
  const thread = await openai.beta.threads.create();
  // 3. 发送消息并运行
  await openai.beta.threads.messages.create(thread.id, { role: "user", content: "帮我算一下 12345 的平方根" });
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, { assistant_id: assistant.id });
  
  if (run.status === 'completed') {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    console.log(messages.data[0].content[0].text.value);
  } else {
    console.log("Run status:", run.status);
  }
}
main().catch(console.error);`
        },
        {
          id: "multimodal",
          title: "多模态输入 (Vision)",
          scenario: "用户上传了一张 UI 设计图截图，Agent 需要分析布局并生成一套改进建议和对应的 Tailwind 代码。",
          why: "真实世界的交互不仅仅是文本，能够“看图说话”的 Agent 极大扩展了应用边界（如 RPA、自动化测试、医疗辅助）。",
          definition: "多模态大模型能够同时接收并理解文本、图像、甚至音频等多种格式的输入。",
          explanation: [
            "如今的主流模型（如 GPT-4o, Claude 3.5 Sonnet）都是原生多模态的。",
            "在 API 层，你可以将图片转为 Base64 或提供 URL，放入消息的 content 数组中一并发送。",
            "模型能够进行 OCR（文字识别）、空间关系理解、物体检测和样式解析。",
            "虽然很强大，但处理图片的 Token 成本非常高。一张高分辨率图片可能消耗上千 Token。",
            "通常可以将图片按分辨率切块，或者使用低分辨率模式（low detail）来节省成本。"
          ],
          levels: [
            { label: "入门理解", content: "不仅可以对模型打字，还可以发图、发语音，就像给微信好友发文件一样。" },
            { label: "原理解析", content: "底层是通过 Vision Encoder 将图像切分成 Patch，并投影到与文本相同的向量空间中一起进行自注意力计算。" },
            { label: "工程落地", content: "在上传前，前端或后端应进行图片压缩；对于视频提取关键帧后再组合成序列发送。" }
          ],
          misconceptions: ["多模态模型能精确测量图里物体的尺寸（像素级精度有限）。", "发送图片和文字的费用一样。", "图片里的微小文字都能 100% 识别。", "视频处理是真正的原生的流（目前多是切帧）。"],
          pitfalls: ["发送超大分辨率原图导致请求直接超时或报 413。", "依赖模型对复杂图表做精确数值计算导致幻觉。", "用户上传恶意图片触发安全审查被封号。", "未考虑透明背景 (Alpha通道) 图片导致的识别异常。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });
async function main() {
  const response = await client.chat.completions.create({
    model: process.env.DEFAULT_MODEL || "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "这张图片里有什么？" },
          {
            type: "image_url",
            image_url: {
              url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wis-flying-lesser-marsh-grasshopper.jpg/1200px-Gfp-wis-flying-lesser-marsh-grasshopper.jpg",
              detail: "low"
            }
          }
        ],
      },
    ],
  });
  console.log(response.choices[0].message.content);
}
main();`
        }
      ]
    }
  ]
};
