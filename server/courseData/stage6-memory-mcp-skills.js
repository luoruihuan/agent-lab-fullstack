export const stage6 = {
  "id": "memory-mcp-skills",
  "title": "阶段六：Memory、MCP 与 Skills",
  "goal": "掌握 Agent 如何跨任务积累经验、扩展工具和复用流程。",
  "chapters": [
    {
      "id": "memory",
      "title": "第 12 章：Agent 记忆系统",
      "lessons": [
        {
          "id": "memory-types",
          "title": "短期、长期、情节、语义、过程记忆",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "【腾讯一面】如果系统上线十万级并发用户，会话状态存在单机内存行不行？存在哪里？分布式场景会话状态怎么架构？",
              a: "这是腾讯极其典型的分布式系统高并发架构考察：\n1. 存单机内存为什么绝对不可行（三大致命缺陷）：\n- 无法水平扩展：十万用户必须依赖微服务多节点集群（如 50 个 Pod）。无状态网关轮询分发请求时，若会话在 Pod A 内存，下一次轮到 Pod B 就会丢失历史；如果用粘性会话（Sticky Session），单机宕机所有用户状态瞬间雪崩，且无法平滑扩缩容。\n- 容易诱发 OOM 崩溃：十万活跃会话若按每人 20 轮、单人 50KB 内存计算，原始占用达 5GB，在 Node.js V8 或 Java 堆中会引发极其剧烈的垃圾回收（GC STW）甚至内存溢出。\n- 发布即灾难：线上服务每次 Rolling Update 滚动更新重启，用户对话立即被清空中断。\n\n2. 腾讯级高并发分布式存储架构标准解法：\n- 【L1 热缓存层（Redis Cluster / 腾讯 CKV）】：\n  以 `session:{session_id}` 为 Key，使用 List 或 ZSet 保存当前活跃会话消息。读写微秒级响应；配置滑动 TTL（如 30 分钟无动作自动过期淘汰），保证热数据高效常驻。\n- 【L2 冷持久化层（PostgreSQL / MongoDB / 腾讯 TDSQL）】：\n  所有历史消息最终必须持久化入库，保障跨天漫游、审计合规与多端同步。\n- 【异步解耦削峰流水线】：\n  LLM 对话主链路中，后端只操作 Redis（毫秒级拉取上下文与追加当前轮）；同时通过 Kafka / Pulsar 消息队列发送一条持久化事件，后台异步 Consumer 批量写入数据库，防止数据库在大促或洪峰流量下被击穿。"
            },
            {
              "q": "【腾讯二面】多轮长对话几十轮历史，全部丢给大模型 Token 成本太高且易超长，工业界有哪些优化方案？各自优缺点是什么？",
              a: "长对话治理是 Agent 降本增效的核心技术，业内四大主流方案：\n1. 方案一：固定滑动窗口截断（Sliding Window）：\n- 做法：仅保留最近 K 轮（如最近 5 轮 / 10 条消息），更早的历史直接物理抛弃。\n- 优缺点：实现最简单，0 额外开销，时效性近因效应好；致命缺点是长期记忆完全丧失（比如用户第 1 轮说的“我叫张三，预算 5000”，到第 15 轮时模型彻底失忆）。\n\n2. 方案二：滑动累加摘要压缩（Rolling Summarization，如 BufferSummaryMemory）：\n- 做法：设定 Token 阈值（如 2000 Token）。一旦历史累积超标，触发轻量级小模型（如 GPT-4o-mini 或端侧小模型）将早期的旧历史压缩为一段 200 字的事实摘要，替换为：`[前情摘要: ...] + 最近 3 轮原始文本`。\n- 优缺点：平衡了全局事实与最近上下文细节；缺点是每次生成摘要需要额外异步消耗模型成本，且多轮递归摘要容易出现“传话筒效应”（事实逐渐丢失失真）。\n\n3. 方案三：实体槽位与键值记忆抽取（Key-Value Slot Memory）：\n- 做法：不存对话流水账！每轮模型通过 Function Call 提取用户核心画像与业务属性（如 `{ \"user_name\": \"张三\", \"budget\": 5000, \"target_city\": \"深圳\" }`），直接存入 Redis Hash。每次只把结构化属性注入 Prompt 头部。\n- 优缺点：Token 压缩率超过 90%，无任何上下文冗余；缺点是只适用于垂直任务型 Agent（订票、售前），无法支持开放式自由漫聊。\n\n4. 方案四：对话历史向量检索（Conversation RAG / MemGPT 架构）：\n- 做法：将过往所有历史切片落入向量库，新提问时通过向量相似度检索唤醒相关的旧对话历史片段插入当前上下文。\n- 优缺点：支持无限轮次对话持久记忆；缺点是检索可能丢失对话的时序线性逻辑（容易把去年和昨天的对话拼在一起造成时空错乱）。\n- 工业界最佳落地：【方案二摘要 + 方案三槽位 + 最近 3 轮原文】混合架构！"
            }
          ],
          "estimatedMinutes": 35,
          "why": "记忆决定 Agent 能否跨轮、跨任务持续改进。",
          "definition": "Agent 记忆是把任务状态、历史事实和流程经验保存在上下文外并按需注入的机制。",
          "explanation": [
            "短期记忆服务当前任务。",
            "长期语义记忆保存稳定事实，情节记忆保存历史事件，过程记忆保存做事流程。",
            "记忆必须有写入、检索、更新和遗忘策略。",
            "从工程角度来看，短期、长期、情节、语义、过程记忆不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理短期、长期、情节、语义、过程记忆可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保短期、长期、情节、语义、过程记忆的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "所有东西都该记住。",
            "向量库等于记忆。",
            "记忆不需要纠错。",
            "只要模型足够强大，就不需要考虑短期、长期、情节、语义、过程记忆了。"
          ],
          "pitfalls": [
            "临时信息写成长期规则。",
            "旧记忆覆盖新指令。",
            "检索无关记忆污染任务。",
            "线上环境缺乏对短期、长期、情节、语义、过程记忆的日志追踪。"
          ],
          "compare": [
            [
              "维度",
              "要点",
              "工程判断",
              "常见风险"
            ],
            [
              "原理",
              "先理解它解决的问题",
              "能解释为什么需要它",
              "只记 API 名称"
            ],
            [
              "实践",
              "用最小代码验证",
              "能独立改参数观察结果",
              "只复制示例"
            ],
            [
              "评估",
              "用指标或用例验证",
              "能判断是否变好",
              "凭感觉优化"
            ]
          ],
          "terms": [
            {
              "name": "短期记忆",
              "summary": "Agent 记忆是把任务状态、历史事实和流程经验保存在上下文外并按需注入的机制。",
              "detail": [
                "先建立层级直觉：短期记忆是“短期、长期、情节、语义、过程记忆”中的一个关键概念。Agent 记忆是把任务状态、历史事实和流程经验保存在上下文外并按需注入的机制。",
                "短期记忆服务当前任务。",
                "在 Agent 系统中，短期记忆不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有东西都该记住。。工程坑点：临时信息写成长期规则。。"
              ]
            },
            {
              "name": "长期记忆",
              "summary": "理解长期记忆：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：长期记忆是“短期、长期、情节、语义、过程记忆”中的一个关键概念。Agent 记忆是把任务状态、历史事实和流程经验保存在上下文外并按需注入的机制。",
                "长期语义记忆保存稳定事实，情节记忆保存历史事件，过程记忆保存做事流程。",
                "在 Agent 系统中，长期记忆不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：向量库等于记忆。。工程坑点：旧记忆覆盖新指令。。"
              ]
            },
            {
              "name": "情节记忆",
              "summary": "理解情节记忆：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：情节记忆是“短期、长期、情节、语义、过程记忆”中的一个关键概念。Agent 记忆是把任务状态、历史事实和流程经验保存在上下文外并按需注入的机制。",
                "记忆必须有写入、检索、更新和遗忘策略。",
                "在 Agent 系统中，情节记忆不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：记忆不需要纠错。。工程坑点：检索无关记忆污染任务。。"
              ]
            },
            {
              "name": "语义与过程记忆",
              "summary": "理解语义与过程记忆：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：语义与过程记忆是“短期、长期、情节、语义、过程记忆”中的一个关键概念。Agent 记忆是把任务状态、历史事实和流程经验保存在上下文外并按需注入的机制。",
                "短期记忆服务当前任务。",
                "在 Agent 系统中，语义与过程记忆不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有东西都该记住。。工程坑点：临时信息写成长期规则。。"
              ]
            }
          ],
          "lab": {
            "title": "短期、长期、情节、语义、过程记忆实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const facts=[['用户偏好中文',true],['刚才工具超时',false]];\nconsole.log(facts.filter(x=>x[1]).map(x=>x[0]));"
          },
          "task": {
            "title": "完成本知识点复盘",
            "description": "用自己的话解释这个知识点，并写出一个适合它的工程场景。",
            "checklist": [
              "能说清它解决的问题",
              "能运行示例代码",
              "能写出至少一个工程坑点"
            ]
          },
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于短期、长期、情节、语义、过程记忆的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：短期、长期、情节、语义、过程记忆就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与短期、长期、情节、语义、过程记忆交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，短期、长期、情节、语义、过程记忆会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 短期、长期、情节、语义、过程记忆 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示短期、长期、情节、语义、过程记忆' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "memory-write",
          "title": "记忆写入策略",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "乱写记忆会让 Agent 越用越错。",
          "definition": "记忆写入策略决定什么信息值得保存到长期记忆。",
          "explanation": [
            "只保存稳定、可复用、经过确认的信息。",
            "不确定、临时、敏感和错误信息不应长期保存。",
            "写入时要记录来源、时间和置信度。",
            "从工程角度来看，记忆写入策略不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理记忆写入策略可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保记忆写入策略的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "用户说过的话都要记。",
            "模型总结一定准确。",
            "记忆越多越懂用户。",
            "只要模型足够强大，就不需要考虑记忆写入策略了。"
          ],
          "pitfalls": [
            "保存敏感信息。",
            "没有置信度。",
            "无法删除或纠正。",
            "线上环境缺乏对记忆写入策略的日志追踪。"
          ],
          "compare": [
            [
              "维度",
              "要点",
              "工程判断",
              "常见风险"
            ],
            [
              "原理",
              "先理解它解决的问题",
              "能解释为什么需要它",
              "只记 API 名称"
            ],
            [
              "实践",
              "用最小代码验证",
              "能独立改参数观察结果",
              "只复制示例"
            ],
            [
              "评估",
              "用指标或用例验证",
              "能判断是否变好",
              "凭感觉优化"
            ]
          ],
          "terms": [
            {
              "name": "稳定事实",
              "summary": "记忆写入策略决定什么信息值得保存到长期记忆。",
              "detail": [
                "先建立层级直觉：稳定事实是“记忆写入策略”中的一个关键概念。记忆写入策略决定什么信息值得保存到长期记忆。",
                "只保存稳定、可复用、经过确认的信息。",
                "在 Agent 系统中，稳定事实不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：用户说过的话都要记。。工程坑点：保存敏感信息。。"
              ]
            },
            {
              "name": "来源与时间",
              "summary": "理解来源与时间：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：来源与时间是“记忆写入策略”中的一个关键概念。记忆写入策略决定什么信息值得保存到长期记忆。",
                "不确定、临时、敏感和错误信息不应长期保存。",
                "在 Agent 系统中，来源与时间不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型总结一定准确。。工程坑点：没有置信度。。"
              ]
            },
            {
              "name": "置信度",
              "summary": "理解置信度：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：置信度是“记忆写入策略”中的一个关键概念。记忆写入策略决定什么信息值得保存到长期记忆。",
                "写入时要记录来源、时间和置信度。",
                "在 Agent 系统中，置信度不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：记忆越多越懂用户。。工程坑点：无法删除或纠正。。"
              ]
            },
            {
              "name": "遗忘与删除",
              "summary": "理解遗忘与删除：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：遗忘与删除是“记忆写入策略”中的一个关键概念。记忆写入策略决定什么信息值得保存到长期记忆。",
                "只保存稳定、可复用、经过确认的信息。",
                "在 Agent 系统中，遗忘与删除不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：用户说过的话都要记。。工程坑点：保存敏感信息。。"
              ]
            }
          ],
          "lab": {
            "title": "记忆写入策略实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "function shouldRemember(f){return f.stable && f.confirmed && !f.sensitive}\nconsole.log(shouldRemember({stable:true,confirmed:true,sensitive:false}));"
          },
          "task": {
            "title": "完成本知识点复盘",
            "description": "用自己的话解释这个知识点，并写出一个适合它的工程场景。",
            "checklist": [
              "能说清它解决的问题",
              "能运行示例代码",
              "能写出至少一个工程坑点"
            ]
          },
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于记忆写入策略的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：记忆写入策略就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与记忆写入策略交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，记忆写入策略会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 记忆写入策略 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示记忆写入策略' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "memory-retrieval",
          "title": "记忆检索与注入",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "正确记忆如果在错误时机注入，也会成为噪声。",
          "definition": "记忆检索是在当前任务中找到相关历史信息并加入上下文。",
          "explanation": [
            "检索应基于任务、用户、项目和时间范围。",
            "注入要有数量和优先级限制。",
            "记忆与当前显式指令冲突时，当前指令优先。",
            "从工程角度来看，记忆检索与注入不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理记忆检索与注入可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保记忆检索与注入的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "每次都注入全部记忆。",
            "相似度高就一定相关。",
            "旧偏好永远有效。",
            "只要模型足够强大，就不需要考虑记忆检索与注入了。"
          ],
          "pitfalls": [
            "跨项目记忆污染。",
            "过期记忆未降权。",
            "冲突无处理规则。",
            "线上环境缺乏对记忆检索与注入的日志追踪。"
          ],
          "compare": [
            [
              "维度",
              "要点",
              "工程判断",
              "常见风险"
            ],
            [
              "原理",
              "先理解它解决的问题",
              "能解释为什么需要它",
              "只记 API 名称"
            ],
            [
              "实践",
              "用最小代码验证",
              "能独立改参数观察结果",
              "只复制示例"
            ],
            [
              "评估",
              "用指标或用例验证",
              "能判断是否变好",
              "凭感觉优化"
            ]
          ],
          "terms": [
            {
              "name": "相关性",
              "summary": "记忆检索是在当前任务中找到相关历史信息并加入上下文。",
              "detail": [
                "先建立层级直觉：相关性是“记忆检索与注入”中的一个关键概念。记忆检索是在当前任务中找到相关历史信息并加入上下文。",
                "检索应基于任务、用户、项目和时间范围。",
                "在 Agent 系统中，相关性不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：每次都注入全部记忆。。工程坑点：跨项目记忆污染。。"
              ]
            },
            {
              "name": "时间衰减",
              "summary": "理解时间衰减：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：时间衰减是“记忆检索与注入”中的一个关键概念。记忆检索是在当前任务中找到相关历史信息并加入上下文。",
                "注入要有数量和优先级限制。",
                "在 Agent 系统中，时间衰减不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：相似度高就一定相关。。工程坑点：过期记忆未降权。。"
              ]
            },
            {
              "name": "注入",
              "summary": "理解注入：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：注入是“记忆检索与注入”中的一个关键概念。记忆检索是在当前任务中找到相关历史信息并加入上下文。",
                "记忆与当前显式指令冲突时，当前指令优先。",
                "在 Agent 系统中，注入不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：旧偏好永远有效。。工程坑点：冲突无处理规则。。"
              ]
            },
            {
              "name": "冲突解决",
              "summary": "理解冲突解决：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：冲突解决是“记忆检索与注入”中的一个关键概念。记忆检索是在当前任务中找到相关历史信息并加入上下文。",
                "检索应基于任务、用户、项目和时间范围。",
                "在 Agent 系统中，冲突解决不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：每次都注入全部记忆。。工程坑点：跨项目记忆污染。。"
              ]
            }
          ],
          "lab": {
            "title": "记忆检索与注入实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const memories=[{text:'偏好中文',project:'global'},{text:'项目A用MySQL',project:'A'}];\nconsole.log(memories.filter(m=>m.project==='global'||m.project==='B'));"
          },
          "task": {
            "title": "完成本知识点复盘",
            "description": "用自己的话解释这个知识点，并写出一个适合它的工程场景。",
            "checklist": [
              "能说清它解决的问题",
              "能运行示例代码",
              "能写出至少一个工程坑点"
            ]
          },
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于记忆检索与注入的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：记忆检索与注入就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与记忆检索与注入交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，记忆检索与注入会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 记忆检索与注入 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示记忆检索与注入' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "什么值得长期记住",
          "scenario": "用户确认“以后默认用中文”适合长期记忆；“今天临时要查订单 1024”只属于当前任务。",
          "takeaway": "稳定、可复用、被确认的信息才值得进入长期记忆。"
        },
        {
          "title": "旧记忆不能覆盖当前指令",
          "scenario": "历史记录说用户喜欢 TypeScript，但本次明确要求 Python，当前任务应优先遵守新指令。",
          "takeaway": "记忆是辅助上下文，不是最高优先级规则。"
        }
      ],
      "diagram": {
        "title": "记忆的生命周期",
        "caption": "记忆需要写入、检索、注入、纠错和遗忘。",
        "nodes": [
          "当前事件",
          "判断是否值得记",
          "长期存储",
          "按任务检索",
          "受控注入",
          "纠正 / 过期"
        ]
      },
      "order": "6.1",
      "routeFocus": "项目复盘",
      "studyFlow": [
        "复用已有资产",
        "完成验收",
        "记录取舍",
        "形成作品"
      ],
      "goal": "本章围绕Agent 记忆系统建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    },
    {
      "id": "mcp-skills",
      "title": "第 13 章：MCP 与 Skills",
      "lessons": [
        {
          "id": "function-mcp-agent-skill",
          "title": "Function Calling / MCP / Agent / Skill 分层",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "分清层级，才能避免架构混乱。",
          "definition": "Function Calling 表达调用意图，MCP 标准化工具接入，Agent 负责任务循环，Skill 沉淀任务经验。",
          "explanation": [
            "Function Calling 是模型 API 层。",
            "MCP 是 Host/Client/Server 间的工具和上下文协议。",
            "Skill 是可加载的任务说明，不是工具本身。",
            "从工程角度来看，Function Calling / MCP / Agent / Skill 分层不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Function Calling / MCP / Agent / Skill 分层可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Function Calling / MCP / Agent / Skill 分层的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "MCP 就是 Agent。",
            "Skill 是工具调用。",
            "装了 MCP 就自动可靠。",
            "只要模型足够强大，就不需要考虑Function Calling / MCP / Agent / Skill 分层了。"
          ],
          "pitfalls": [
            "把流程写进工具描述。",
            "工具和经验边界混淆。",
            "Skill 太泛无法执行。",
            "线上环境缺乏对Function Calling / MCP / Agent / Skill 分层的日志追踪。"
          ],
          "compare": [
            [
              "概念",
              "解决问题",
              "层级",
              "例子"
            ],
            [
              "Prompt",
              "表达任务",
              "输入",
              "分析报表"
            ],
            [
              "Function Calling",
              "表达工具意图",
              "模型 API",
              "call read_file"
            ],
            [
              "MCP",
              "接入工具",
              "协议",
              "文件系统服务"
            ],
            [
              "Agent",
              "完成任务",
              "运行时",
              "循环执行"
            ],
            [
              "Skill",
              "沉淀经验",
              "流程知识",
              "报表分析步骤"
            ]
          ],
          "terms": [
            {
              "name": "Function Calling",
              "summary": "Function Calling 表达调用意图，MCP 标准化工具接入，Agent 负责任务循环，Skill 沉淀任务经验。",
              "detail": [
                "先建立层级直觉：Function Calling是“Function Calling / MCP / Agent / Skill 分层”中的一个关键概念。Function Calling 表达调用意图，MCP 标准化工具接入，Agent 负责任务循环，Skill 沉淀任务经验。",
                "Function Calling 是模型 API 层。",
                "在 Agent 系统中，Function Calling不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：MCP 就是 Agent。。工程坑点：把流程写进工具描述。。"
              ]
            },
            {
              "name": "MCP",
              "summary": "理解MCP：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：MCP是“Function Calling / MCP / Agent / Skill 分层”中的一个关键概念。Function Calling 表达调用意图，MCP 标准化工具接入，Agent 负责任务循环，Skill 沉淀任务经验。",
                "MCP 是 Host/Client/Server 间的工具和上下文协议。",
                "在 Agent 系统中，MCP不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Skill 是工具调用。。工程坑点：工具和经验边界混淆。。"
              ]
            },
            {
              "name": "Agent",
              "summary": "理解Agent：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Agent是“Function Calling / MCP / Agent / Skill 分层”中的一个关键概念。Function Calling 表达调用意图，MCP 标准化工具接入，Agent 负责任务循环，Skill 沉淀任务经验。",
                "Skill 是可加载的任务说明，不是工具本身。",
                "在 Agent 系统中，Agent不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：装了 MCP 就自动可靠。。工程坑点：Skill 太泛无法执行。。"
              ]
            },
            {
              "name": "Skill",
              "summary": "理解Skill：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Skill是“Function Calling / MCP / Agent / Skill 分层”中的一个关键概念。Function Calling 表达调用意图，MCP 标准化工具接入，Agent 负责任务循环，Skill 沉淀任务经验。",
                "Function Calling 是模型 API 层。",
                "在 Agent 系统中，Skill不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：MCP 就是 Agent。。工程坑点：把流程写进工具描述。。"
              ]
            }
          ],
          "lab": {
            "title": "Function Calling / MCP / Agent / Skill 分层实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "console.table([['Prompt','用户任务'],['Function Calling','调用意图'],['MCP','工具来源'],['Agent','执行循环'],['Skill','任务经验']]);"
          },
          "task": {
            "title": "完成本知识点复盘",
            "description": "用自己的话解释这个知识点，并写出一个适合它的工程场景。",
            "checklist": [
              "能说清它解决的问题",
              "能运行示例代码",
              "能写出至少一个工程坑点"
            ]
          },
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Function Calling / MCP / Agent / Skill 分层的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Function Calling / MCP / Agent / Skill 分层就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Function Calling / MCP / Agent / Skill 分层交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Function Calling / MCP / Agent / Skill 分层会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Function Calling / MCP / Agent / Skill 分层 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Function Calling / MCP / Agent / Skill 分层' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "mcp-architecture",
          "title": "MCP Host / Client / Server",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "理解 MCP 架构，才能正确接入外部工具。",
          "definition": "MCP Host 承载用户和模型，Client 与 Server 通信，Server 暴露工具、资源和提示。",
          "explanation": [
            "Host 是应用，如 IDE 或 Agent 平台。",
            "Client 负责协议连接。",
            "Server 把文件、数据库、浏览器等能力以标准形式暴露。",
            "从工程角度来看，MCP Host / Client / Server不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理MCP Host / Client / Server可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保MCP Host / Client / Server的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "Server 直接和模型通信。",
            "MCP 只支持工具。",
            "MCP 可以绕过权限。",
            "只要模型足够强大，就不需要考虑MCP Host / Client / Server了。"
          ],
          "pitfalls": [
            "信任未知 Server。",
            "权限范围过大。",
            "工具描述未审计。",
            "线上环境缺乏对MCP Host / Client / Server的日志追踪。"
          ],
          "compare": [
            [
              "维度",
              "要点",
              "工程判断",
              "常见风险"
            ],
            [
              "原理",
              "先理解它解决的问题",
              "能解释为什么需要它",
              "只记 API 名称"
            ],
            [
              "实践",
              "用最小代码验证",
              "能独立改参数观察结果",
              "只复制示例"
            ],
            [
              "评估",
              "用指标或用例验证",
              "能判断是否变好",
              "凭感觉优化"
            ]
          ],
          "terms": [
            {
              "name": "Host",
              "summary": "MCP Host 承载用户和模型，Client 与 Server 通信，Server 暴露工具、资源和提示。",
              "detail": [
                "先建立层级直觉：Host是“MCP Host / Client / Server”中的一个关键概念。MCP Host 承载用户和模型，Client 与 Server 通信，Server 暴露工具、资源和提示。",
                "Host 是应用，如 IDE 或 Agent 平台。",
                "在 Agent 系统中，Host不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Server 直接和模型通信。。工程坑点：信任未知 Server。。"
              ]
            },
            {
              "name": "Client",
              "summary": "理解Client：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Client是“MCP Host / Client / Server”中的一个关键概念。MCP Host 承载用户和模型，Client 与 Server 通信，Server 暴露工具、资源和提示。",
                "Client 负责协议连接。",
                "在 Agent 系统中，Client不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：MCP 只支持工具。。工程坑点：权限范围过大。。"
              ]
            },
            {
              "name": "Server",
              "summary": "理解Server：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Server是“MCP Host / Client / Server”中的一个关键概念。MCP Host 承载用户和模型，Client 与 Server 通信，Server 暴露工具、资源和提示。",
                "Server 把文件、数据库、浏览器等能力以标准形式暴露。",
                "在 Agent 系统中，Server不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：MCP 可以绕过权限。。工程坑点：工具描述未审计。。"
              ]
            },
            {
              "name": "Resources 与 Tools",
              "summary": "理解Resources 与 Tools：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Resources 与 Tools是“MCP Host / Client / Server”中的一个关键概念。MCP Host 承载用户和模型，Client 与 Server 通信，Server 暴露工具、资源和提示。",
                "Host 是应用，如 IDE 或 Agent 平台。",
                "在 Agent 系统中，Resources 与 Tools不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Server 直接和模型通信。。工程坑点：信任未知 Server。。"
              ]
            }
          ],
          "lab": {
            "title": "MCP Host / Client / Server实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const mcp={host:'Agent App',client:'MCP Client',server:'File Server',tools:['read_file','search']};\nconsole.log(JSON.stringify(mcp,null,2));"
          },
          "task": {
            "title": "完成本知识点复盘",
            "description": "用自己的话解释这个知识点，并写出一个适合它的工程场景。",
            "checklist": [
              "能说清它解决的问题",
              "能运行示例代码",
              "能写出至少一个工程坑点"
            ]
          },
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于MCP Host / Client / Server的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：MCP Host / Client / Server就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与MCP Host / Client / Server交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，MCP Host / Client / Server会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 MCP Host / Client / Server 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示MCP Host / Client / Server' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "skills-design",
          "title": "Skill 设计",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "Skill 把可复用经验固化下来，让 Agent 不必每次从零摸索。",
          "definition": "Skill 是 Agent 在特定任务中按需加载的操作手册。",
          "explanation": [
            "Skill 适合写流程、约束、检查清单和领域经验。",
            "不适合写空泛性格设定。",
            "好的 Skill 有清晰触发条件、步骤、边界和失败处理。",
            "从工程角度来看，Skill 设计不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Skill 设计可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Skill 设计的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "Skill 越长越好。",
            "Skill 替代工具。",
            "所有知识都写进一个 Skill。",
            "只要模型足够强大，就不需要考虑Skill 设计了。"
          ],
          "pitfalls": [
            "触发条件模糊。",
            "步骤不可执行。",
            "与其他 Skill 重叠冲突。",
            "线上环境缺乏对Skill 设计的日志追踪。"
          ],
          "compare": [
            [
              "维度",
              "要点",
              "工程判断",
              "常见风险"
            ],
            [
              "原理",
              "先理解它解决的问题",
              "能解释为什么需要它",
              "只记 API 名称"
            ],
            [
              "实践",
              "用最小代码验证",
              "能独立改参数观察结果",
              "只复制示例"
            ],
            [
              "评估",
              "用指标或用例验证",
              "能判断是否变好",
              "凭感觉优化"
            ]
          ],
          "terms": [
            {
              "name": "触发条件",
              "summary": "Skill 是 Agent 在特定任务中按需加载的操作手册。",
              "detail": [
                "先建立层级直觉：触发条件是“Skill 设计”中的一个关键概念。Skill 是 Agent 在特定任务中按需加载的操作手册。",
                "Skill 适合写流程、约束、检查清单和领域经验。",
                "在 Agent 系统中，触发条件不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Skill 越长越好。。工程坑点：触发条件模糊。。"
              ]
            },
            {
              "name": "操作步骤",
              "summary": "理解操作步骤：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：操作步骤是“Skill 设计”中的一个关键概念。Skill 是 Agent 在特定任务中按需加载的操作手册。",
                "不适合写空泛性格设定。",
                "在 Agent 系统中，操作步骤不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Skill 替代工具。。工程坑点：步骤不可执行。。"
              ]
            },
            {
              "name": "边界",
              "summary": "理解边界：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：边界是“Skill 设计”中的一个关键概念。Skill 是 Agent 在特定任务中按需加载的操作手册。",
                "好的 Skill 有清晰触发条件、步骤、边界和失败处理。",
                "在 Agent 系统中，边界不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有知识都写进一个 Skill。。工程坑点：与其他 Skill 重叠冲突。。"
              ]
            },
            {
              "name": "失败处理",
              "summary": "理解失败处理：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：失败处理是“Skill 设计”中的一个关键概念。Skill 是 Agent 在特定任务中按需加载的操作手册。",
                "Skill 适合写流程、约束、检查清单和领域经验。",
                "在 Agent 系统中，失败处理不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Skill 越长越好。。工程坑点：触发条件模糊。。"
              ]
            }
          ],
          "lab": {
            "title": "Skill 设计实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const skill={name:'code-review',trigger:'用户要求审查代码',steps:['看架构','看安全','看测试','给结论']};\nconsole.log(JSON.stringify(skill,null,2));"
          },
          "task": {
            "title": "完成本知识点复盘",
            "description": "用自己的话解释这个知识点，并写出一个适合它的工程场景。",
            "checklist": [
              "能说清它解决的问题",
              "能运行示例代码",
              "能写出至少一个工程坑点"
            ]
          },
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Skill 设计的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Skill 设计就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Skill 设计交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Skill 设计会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Skill 设计 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Skill 设计' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "把几层概念放回位置",
          "scenario": "Function Calling 表达“我要调用 read_file”；MCP 负责把文件能力接入宿主；Agent 决定什么时候调用；Skill 规定代码审查步骤。",
          "takeaway": "协议、工具、运行时和经验是不同层次。"
        },
        {
          "title": "Skill 不应该变成百科全书",
          "scenario": "代码审查 Skill 只写触发条件、检查顺序、风险边界和输出格式，不把所有编程知识塞进去。",
          "takeaway": "Skill 越具体、可执行，复用价值越高。"
        }
      ],
      "diagram": {
        "title": "能力扩展的分层",
        "caption": "分层清晰，才能知道问题应该改 Prompt、工具、协议还是流程。",
        "nodes": [
          "Prompt / 任务",
          "Function Calling / 意图",
          "MCP / 工具接入",
          "Agent / 执行循环",
          "Skill / 经验流程"
        ]
      },
      "order": "6.2",
      "routeFocus": "项目复盘",
      "studyFlow": [
        "复用已有资产",
        "完成验收",
        "记录取舍",
        "形成作品"
      ],
      "goal": "本章围绕MCP 与 Skills建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    }
  ],
  "routeIndex": 6,
  "routeFocus": "项目复盘",
  "studyFlow": [
    "复用已有资产",
    "完成验收",
    "记录取舍",
    "形成作品"
  ]
};