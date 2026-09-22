export const stage10 = {
  id: "practice",
  title: "阶段十：真实 API 实战",
  goal: "摆脱纸上谈兵，用真实代码从零构建完整的 Agent 组件。",
  chapters: [
    {
      id: "api-practice",
      title: "第 17 章：代码实战指南",
      lessons: [
        {
          id: "first-api-call",
          title: "第一个真实 LLM 调用",
          scenario: "完全从零开始，10 分钟跑通第一个 API 调用，为后续复杂 Agent 搭建脚手架。",
          why: "这是所有 AI 应用的基础，理解 API Key、Base URL 和包管理的依赖配置，才能顺畅地开发。",
          definition: "利用官方或社区维护的 SDK（如 openai-node），与大模型云端 API 建立安全的数据通信。",
          explanation: [
            "调用 API 时，环境配置是最容易出错的地方。推荐使用 .env 文件管理 API Key。",
            "了解 Base URL 非常关键，因为它允许你无缝切换到 OpenAI 兼容的代理平台或本地模型（如 Ollama）。",
            "请求结构中，messages 数组承载了所有的对话历史，role 分别代表 system, user, assistant。",
            "在拿到结果后，必须处理网络异常、鉴权失败等基础错误。",
            "这段代码是一切的基础，请务必保证它在你本地跑通。"
          ],
          levels: [
            { label: "入门理解", content: "相当于用代码发一个 HTTP POST 请求给服务器，把你的问题传过去，拿到回答。" },
            { label: "原理解析", content: "SDK 底层使用了 fetch 或 axios 封装请求，包含身份验证的 header 并在收到 JSON 响应后序列化成对象。" },
            { label: "工程落地", content: "生产环境切记不要把 API Key 硬编码在代码中提交到仓库，必须用环境变量，并且做好超时重试机制。" }
          ],
          misconceptions: ["只能连官方域名。", "只能用 OpenAI 家的模型。", "不用 SDK 就没法调用。", "代码写完就不用考虑网络因素。"],
          pitfalls: ["API Key 泄露被盗刷。", "未处理 429 频率限制报错。", "国内网络未配置代理导致超时。", "模型名字拼写错误报错 404。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
// 假设你已经配置了环境变量，或通过 dotenv 库加载了 .env
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 必填
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1', // 可替换为国内兼容服务
});
async function main() {
  try {
    const response = await client.chat.completions.create({
      model: process.env.DEFAULT_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: '你好，请用一句话介绍你自己。' }],
    });
    console.log("AI 响应:", response.choices[0].message.content);
  } catch (error) {
    console.error("调用失败:", error.message);
  }
}
main();`
        },
        {
          id: "real-tool-calling",
          title: "真实 Tool Calling 实战",
          scenario: "你需要实现一个天气查询 Agent，用户问“今天上海热吗？”，模型自己决定去调用气象局 API 获取数据然后再作答。",
          why: "只会文字回答的模型缺乏实用价值，连接真实世界的系统（如数据库、第三方服务）必须通过 Tool Calling。",
          definition: "将本地的 JS 函数结构定义提交给模型，模型返回参数后执行，最后将结果传回模型的完整循环。",
          explanation: [
            "完整流程分三步：1. 传递工具定义给模型。2. 模型决定调用哪个工具以及带什么参数，暂停生成。3. 代码拦截，执行本地函数，将结果以 tool 身份推回 messages。",
            "这里最容易迷惑的是第二步和第三步：模型只负责输出参数，不负责真正的“执行”。",
            "对于并行工具调用（Parallel Tool Calls），可能一次返回多个工具，你需要使用 Promise.all 并发执行后全部回填。",
            "必须要严格按照 tool_call_id 把结果映射回去，否则大模型会抛出验证错误。",
            "这是搭建复杂工作流最硬核的代码逻辑之一。"
          ],
          levels: [
            { label: "入门理解", content: "就像你告诉秘书你可以用电话查询，秘书遇到需要查天气的时候就给你写个条子：“请打这个电话查询天气”。你去打完后把结果写在纸条上还给秘书，秘书再回信给用户。" },
            { label: "原理解析", content: "底层依赖 JSON Schema 定义参数格式，模型内部进行了指令微调来输出特定的 'function_call' 或 'tool_calls' 字段。" },
            { label: "工程落地", content: "必须要用 try-catch 捕获本地执行的异常，并把异常信息（精简后）告诉模型，让模型去解释错误，而不是让程序崩溃。" }
          ],
          misconceptions: ["模型自己联网去执行了函数。", "只需要传定义，不需要回传结果。", "必须是真实存在的外部 API，不能是本地数据库查询。", "不用校验模型传来的参数。"],
          pitfalls: ["忘记把模型调用的消息本身（assistant tool_calls）追加到记录里。", "回传结果缺少对应的 tool_call_id。", "工具执行的字符串过长超出了上下文限制。", "忽略了模型偶尔会造出未定义参数的幻觉。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });

function getWeather({ location }) {
  // 模拟真实 API 查询
  const data = { "上海": "晴天，32度", "北京": "多云，25度" };
  return data[location] || "未知";
}

async function main() {
  const messages = [{ role: "user", content: "今天上海天气如何？" }];
  const tools = [{
    type: "function",
    function: {
      name: "get_weather",
      description: "查询指定城市的天气",
      parameters: { type: "object", properties: { location: { type: "string" } }, required: ["location"] }
    }
  }];
  
  // 第一轮：触发工具调用
  const response1 = await client.chat.completions.create({
    model: process.env.DEFAULT_MODEL || "gpt-4o-mini",
    messages, tools
  });
  const msg = response1.choices[0].message;
  messages.push(msg); // 必须保存这行！
  
  if (msg.tool_calls) {
    for (const call of msg.tool_calls) {
      if (call.function.name === "get_weather") {
        const args = JSON.parse(call.function.arguments);
        const result = getWeather(args);
        // 回填结果
        messages.push({ role: "tool", tool_call_id: call.id, content: String(result) });
      }
    }
    // 第二轮：获取最终答案
    const response2 = await client.chat.completions.create({
      model: process.env.DEFAULT_MODEL || "gpt-4o-mini", messages
    });
    console.log("最终回答:", response2.choices[0].message.content);
  }
}
main();`
        },
        {
          id: "rag-minimal",
          title: "RAG 最小实现（无向量数据库）",
          scenario: "5 分钟实现一个基础 RAG，将一段产品文档作为知识库，当用户提问时从中匹配片段，而不依赖沉重的第三方数据库组件。",
          why: "理解 RAG 的本质（检索+拼接），不要被市面上的向量数据库营销所迷惑。",
          definition: "利用内存数组和简单的字符串匹配或 Embedding 相似度计算，实现的最轻量级检索增强生成。",
          explanation: [
            "RAG 的本质是：在向模型提问前，先从外部找资料，拼在系统提示词里。",
            "如果不考虑海量数据，其实一个简单的数组过滤（filter/includes）就能完成基本的 RAG 概念验证。",
            "进阶做法是调用 Embedding API 把文本转成向量，然后写一个余弦相似度函数进行排序获取 Top-K。",
            "在业务早期、文档很少时（如几十页说明书），直接塞进上下文或者用此方法完全足够，不必过早引入基础设施复杂度。",
            "只有当上下文塞不下、查询速度极慢时，才需要使用 Chroma, Pinecone, Milvus 等向量库。"
          ],
          levels: [
            { label: "入门理解", content: "就像开卷考试，你带了一本书。遇到问题先看书翻到那一页，然后照着这页的内容写答案。" },
            { label: "原理解析", content: "分为两步：Retrieve（检索）利用算法找到相关 chunk；Generate（生成）利用 LLM 阅读 chunk 作答。" },
            { label: "工程落地", content: "在实战中，常常因为文档格式混乱、切块过小导致即使检索到了也回答错误。清洗数据的价值远大于选择高级算法。" }
          ],
          misconceptions: ["RAG 就是必须买向量数据库。", "RAG 能解决大模型所有的幻觉问题。", "检索命中就等于能回答好。", "段落越长切分得越大越好。"],
          pitfalls: ["拼接到 prompt 里的字符超出了 Token 限制。", "没有让模型在“不知道”时明确拒答，导致依然胡编乱造。", "检索出来的文本完全与问题无关变成了噪声。", "文档内容冲突时未做标识。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });

const documents = [
  "Agent Lab 是一个针对全栈开发者的 AI 课程平台。",
  "明天的天气预报说会有大暴雨。",
  "RAG 的核心思想是检索增强生成。"
];

async function main() {
  const query = "Agent Lab 是干嘛的？";
  // 简陋检索：关键词匹配
  const retrievedDocs = documents.filter(doc => doc.includes("Agent"));
  const context = retrievedDocs.join("\\n");
  
  // 构建带上下文的 prompt（用字符串拼接避免嵌套模板字符串）
  const prompt = "基于以下已知信息回答问题。如果已知信息中找不到答案，请说'我不知道'。\\n已知信息:\\n" + context + "\\n\\n问题: " + query;
  
  const res = await client.chat.completions.create({
    model: process.env.DEFAULT_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });
  console.log("回答:", res.choices[0].message.content);
}
main();`
        },
        {
          id: "demo-to-prod",
          title: "从 Demo 到生产的差距",
          scenario: "你在本地跑通了一个牛逼的 Agent Demo，老板说下午就上线，结果上线后因为并发请求导致账户欠费，并且由于偶尔的网络抖动系统崩溃，被用户骂惨了。",
          why: "懂得处理边界条件和系统稳定性，是“玩具”代码和“工程”代码的分水岭。",
          definition: "生产级封装包括加入错误重试机制、限流策略、超时配置、日志追踪、成本统计和兜底反馈。",
          explanation: [
            "大模型接口是不稳定的，必须设置 Timeout 并结合指数退避重试策略（Exponential Backoff）。",
            "如果不设置限流，高并发请求可能瞬间榨干 API 额度或者导致 429 Too Many Requests 瘫痪。",
            "生产级的调用不能只丢弃异常，必须有完善的 Log，记录每一次请求的 request_id, 耗时和使用的 Token，用来算账和诊断。",
            "对于工具返回的敏感信息要脱敏，同时要处理当大模型完全不配合输出预期格式时的兜底逻辑（Fallback）。",
            "优秀的架构应该把对大模型的调用当作对“最不可靠第三方库”的调用来防御。"
          ],
          levels: [
            { label: "入门理解", content: "相当于给一辆跑得很快但不稳的赛车加装安全带、限速器和行车记录仪。" },
            { label: "原理解析", content: "理解断路器模式（Circuit Breaker）、防抖限流（Rate Limiting）和 HTTP 长连接在 AI 调用中的具体表现。" },
            { label: "工程落地", content: "封装一个通用的 llm_call 工具函数，所有项目统一从这个函数出口调用，方便后续统一拦截和注入中间件。" }
          ],
          misconceptions: ["写个 try-catch 就叫生产级了。", "大模型公司承诺了 99.9% 可用，所以我的应用不会挂。", "不需要统计 Token，月结的时候看账单就行。", "用户可以无限次随意调用。"],
          pitfalls: ["无限重试死循环消耗完额度。", "超时设置过短导致生成一半就被切断。", "没有保存 request_id 导致客诉无法定位。", "未能优雅降级，接口直接挂掉前端白屏。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL, timeout: 15000 }); // 设置基础超时

async function robustCall(prompt, maxRetries = 2) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      const startTime = Date.now();
      const res = await client.chat.completions.create({
        model: process.env.DEFAULT_MODEL || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      });
      const duration = Date.now() - startTime;
      console.log("[Log] 调用成功, 耗时" + duration + "ms, Tokens: " + res.usage.total_tokens);
      return res.choices[0].message.content;
    } catch (error) {
      attempt++;
      console.warn("[Warn] 尝试 " + attempt + " 失败:", error.message);
      if (attempt > maxRetries) return "抱歉，系统暂时繁忙，请稍后再试。";
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // 简单的退避重试
    }
  }
}
// robustCall("你好").then(console.log);`
        },
        {
          id: "evaluate-first-agent",
          title: "评估你的第一个 Agent",
          scenario: "你调整了系统提示词想让回复更幽默，但在发布后，发现原来好好的分类功能失效了。你需要自动化评估而不是每次人肉测试。",
          why: "大模型是一个概率黑盒，没有量化评估体系，所有的 Prompt 优化都是在盲人摸象。",
          definition: "利用预先定义的测试集和另一个强大的大模型作为裁判（LLM-as-a-Judge），对 Agent 的输出进行打分和质量断言。",
          explanation: [
            "构建一个包含几十条代表性用例的数据集，每条包含输入、期望输出或评价标准。",
            "对于确定性任务（分类、JSON 提取），可以用传统代码（如正则表达式、精确匹配）写断言直接评估准确率。",
            "对于开放性回答，可以写一个评测 Prompt，让 GPT-4 充当裁判去打分（如 1-5 分），并给出理由。",
            "把这套流程集成进 CI/CD，每次修改 Prompt 或底层架构，跑一遍全量测试对比前后得分（Regression Test）。",
            "没有评估的 Agent 永远停留在玩具阶段。"
          ],
          levels: [
            { label: "入门理解", content: "像做一套考试卷，你修改了 Agent 的脑子后，让它重新做卷子看分数有没有提高。" },
            { label: "原理解析", content: "LLM-as-a-Judge 是基于更强大模型对指令的遵循能力，来代替人工完成主观判别，研究表明其与人类评判有很高一致性。" },
            { label: "工程落地", content: "评估本身也需要评估，要保证裁判模型的稳定性，最好固定 Temperature 为 0，并让裁判模型先解释理由再给出分数以提升准确度。" }
          ],
          misconceptions: ["评估只能人工做。", "只要大模型能力强就不需要评估。", "测试集几十条太少了没用（对于 Prompt 调试，几十条高质量样本非常有用）。", "评估分数 100% 就是完美了。"],
          pitfalls: ["测试集里的数据已经被模型训练过（污染）。", "评判标准的 Prompt 过于模糊导致打分随机。", "过于关注微小的分数差异而忽略定性的反馈。", "只评估“好坏”，不评估耗时和成本。"],
          terms: [],
          realCode: `import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL });

async function evaluate(agentOutput, expectedStandard) {
  // 用字符串拼接构建 prompt，避免嵌套模板字符串
  const prompt = "作为一个严苛的裁判，请评估 AI 助手的回答是否符合标准。\\n标准：" + expectedStandard + "\\nAI回答：" + agentOutput + "\\n请输出 JSON 格式：{score: <0-10分>, reason: <理由>}";

  const res = await client.chat.completions.create({
    model: process.env.DEFAULT_MODEL || "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });
  return JSON.parse(res.choices[0].message.content);
}

// 模拟测试
// evaluate("我不知道该怎么回答。", "不能拒答，必须给出解决方向。").then(console.log);`
        }
      ]
    }
  ]
};
