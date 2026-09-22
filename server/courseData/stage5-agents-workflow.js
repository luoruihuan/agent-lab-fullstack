export const stage5 = {
  "id": "agents-workflow",
  "title": "阶段五：Agent 模式与 Workflow",
  "goal": "掌握 ReAct、Planning、Workflow、Graph、Checkpoint 等多步任务核心能力。",
  "chapters": [
    {
      "id": "agent-patterns",
      "title": "第 10 章：Agent 基本模式",
      "lessons": [
        {
          "id": "react",
          "title": "ReAct：Reasoning + Acting",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "【腾讯一面深度追问】Agent 陷入死循环怎么熔断？单机怎么做？海量用户高并发分布式场景下怎么实现（不能用本地内存状态）？",
              a: "这是腾讯考察系统高并发架构与容错设计的杀手锏问题：\n1. 单机基础熔断策略（初级回答）：\n- 硬步数截断（Max Iterations）：严格限制单次 ReAct 循环上限（如最多 8~10 轮）。\n- 幂等与动作指纹检测（Action Fingerprint）：计算 `MD5(tool_name + args)`，若同一工具连续以相同参数调用超过 2 次，或者连续返回相同错误 Observation，立即判定陷入局部死锁。\n- 总超时限制（Global Timeout）：单次请求设置 30s 超时时间。\n\n2. 海量用户高并发分布式场景下的落地方案（腾讯追问破局点）：\n- 痛点背景：线上微服务通常是集群部署（数十个 Pod 无状态运行），多轮 Agent 交互或长流式可能漂移到不同节点，单机内存变量（如 `let step = 0`）完全失效，且多请求并发可能产生竞态击穿。\n- 【核心解法 1：基于 Redis + Lua 脚本的原子计数与动作去重】：\n  以 `agent:loop:{trace_id}` 为 Key，每次执行前调用一段原子的 Lua 脚本：自增计数并比对阈值；同时将 `tool_name:args` 加入 Redis 的有限长度 List，用 Lua 检测末尾元素重复度。原子操作避免并发竞态，超时设置 300s TTL 自动清理。\n- 【核心解法 2：分布式 Token 预算熔断（Token Budget Breaker）】：\n  除了步数，死循环最致命的是刷爆 Token 成本。在 Redis 中预设本次会话的消耗预算（如单次任务上限 12,000 Token）。每轮模型响应后，解析 `usage.total_tokens` 原子累加，一旦突破预算阈值，直接熔断并触发兜底降级响应。\n- 【核心解法 3：状态下沉至分布式 Checkpoint 引擎（如 Redis/PG）】：\n  采用 LangGraph / 类似状态机架构，每跑一步将完整 State 序列化写回 Redis/数据库。从持久化 State 中读取历史步骤，无论请求分发到哪台机器，都能精准计算当前轮次与动作循环状态。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "ReAct 是最经典的工具型 Agent 模式。",
          "definition": "ReAct 让模型在思考、行动和观察之间交替进行。",
          "explanation": [
            "模型先决定下一步行动，工具执行后返回观察，再继续下一轮。",
            "它适合信息不完整、需要查询外部环境的任务。",
            "缺点是多轮调用增加延迟，也更依赖工具质量。",
            "从工程角度来看，ReAct：Reasoning + Acting不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理ReAct：Reasoning + Acting可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保ReAct：Reasoning + Acting的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "ReAct 必须暴露思维链。",
            "ReAct 越多轮越聪明。",
            "工具越多越好。",
            "只要模型足够强大，就不需要考虑ReAct：Reasoning + Acting了。"
          ],
          "pitfalls": [
            "重复调用工具。",
            "观察结果未结构化。",
            "没有最大轮次。",
            "线上环境缺乏对ReAct：Reasoning + Acting的日志追踪。"
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
              "name": "Reasoning",
              "summary": "ReAct 让模型在思考、行动和观察之间交替进行。",
              "detail": [
                "先建立层级直觉：Reasoning是“ReAct：Reasoning + Acting”中的一个关键概念。ReAct 让模型在思考、行动和观察之间交替进行。",
                "模型先决定下一步行动，工具执行后返回观察，再继续下一轮。",
                "在 Agent 系统中，Reasoning不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：ReAct 必须暴露思维链。。工程坑点：重复调用工具。。"
              ]
            },
            {
              "name": "Acting",
              "summary": "理解Acting：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Acting是“ReAct：Reasoning + Acting”中的一个关键概念。ReAct 让模型在思考、行动和观察之间交替进行。",
                "它适合信息不完整、需要查询外部环境的任务。",
                "在 Agent 系统中，Acting不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：ReAct 越多轮越聪明。。工程坑点：观察结果未结构化。。"
              ]
            },
            {
              "name": "Observation",
              "summary": "理解Observation：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Observation是“ReAct：Reasoning + Acting”中的一个关键概念。ReAct 让模型在思考、行动和观察之间交替进行。",
                "缺点是多轮调用增加延迟，也更依赖工具质量。",
                "在 Agent 系统中，Observation不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：工具越多越好。。工程坑点：没有最大轮次。。"
              ]
            },
            {
              "name": "停止条件",
              "summary": "理解停止条件：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：停止条件是“ReAct：Reasoning + Acting”中的一个关键概念。ReAct 让模型在思考、行动和观察之间交替进行。",
                "模型先决定下一步行动，工具执行后返回观察，再继续下一轮。",
                "在 Agent 系统中，停止条件不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：ReAct 必须暴露思维链。。工程坑点：重复调用工具。。"
              ]
            }
          ],
          "lab": {
            "title": "ReAct：Reasoning + Acting实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "let state = { order:null, done:false };\nconst trace=[];\nfor(let i=0;i<4 && !state.done;i++){\n  if(!state.order){ trace.push('act: query_order'); state.order={status:'PAID'}; trace.push('observe: '+state.order.status); }\n  else { trace.push('final: 已支付'); state.done=true; }\n}\nconsole.log(trace.join(' -> '));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于ReAct：Reasoning + Acting的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：ReAct：Reasoning + Acting就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与ReAct：Reasoning + Acting交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，ReAct：Reasoning + Acting会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 ReAct：Reasoning + Acting 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示ReAct：Reasoning + Acting' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "plan-execute",
          "title": "Plan-and-Execute",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "复杂任务需要先规划，否则容易遗漏步骤。",
          "definition": "Plan-and-Execute 是先生成计划，再逐步执行并根据结果更新计划的模式。",
          "explanation": [
            "Plan 阶段拆目标、识别依赖和风险。",
            "Execute 阶段调用工具完成每一步。",
            "计划需要可更新，因为工具结果可能推翻假设。",
            "从工程角度来看，Plan-and-Execute不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Plan-and-Execute可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Plan-and-Execute的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "计划生成后不能改。",
            "计划越长越好。",
            "简单任务也要规划。",
            "只要模型足够强大，就不需要考虑Plan-and-Execute了。"
          ],
          "pitfalls": [
            "计划与状态不同步。",
            "步骤不可验证。",
            "失败后不重新规划。",
            "线上环境缺乏对Plan-and-Execute的日志追踪。"
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
              "name": "Plan",
              "summary": "Plan-and-Execute 是先生成计划，再逐步执行并根据结果更新计划的模式。",
              "detail": [
                "先建立层级直觉：Plan是“Plan-and-Execute”中的一个关键概念。Plan-and-Execute 是先生成计划，再逐步执行并根据结果更新计划的模式。",
                "Plan 阶段拆目标、识别依赖和风险。",
                "在 Agent 系统中，Plan不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：计划生成后不能改。。工程坑点：计划与状态不同步。。"
              ]
            },
            {
              "name": "Execute",
              "summary": "理解Execute：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Execute是“Plan-and-Execute”中的一个关键概念。Plan-and-Execute 是先生成计划，再逐步执行并根据结果更新计划的模式。",
                "Execute 阶段调用工具完成每一步。",
                "在 Agent 系统中，Execute不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：计划越长越好。。工程坑点：步骤不可验证。。"
              ]
            },
            {
              "name": "依赖关系",
              "summary": "理解依赖关系：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：依赖关系是“Plan-and-Execute”中的一个关键概念。Plan-and-Execute 是先生成计划，再逐步执行并根据结果更新计划的模式。",
                "计划需要可更新，因为工具结果可能推翻假设。",
                "在 Agent 系统中，依赖关系不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：简单任务也要规划。。工程坑点：失败后不重新规划。。"
              ]
            },
            {
              "name": "重新规划",
              "summary": "理解重新规划：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：重新规划是“Plan-and-Execute”中的一个关键概念。Plan-and-Execute 是先生成计划，再逐步执行并根据结果更新计划的模式。",
                "Plan 阶段拆目标、识别依赖和风险。",
                "在 Agent 系统中，重新规划不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：计划生成后不能改。。工程坑点：计划与状态不同步。。"
              ]
            }
          ],
          "lab": {
            "title": "Plan-and-Execute实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const plan=[{id:1,t:'搜索资料',s:'todo'},{id:2,t:'写大纲',s:'todo'}];\nplan[0].s='done';\nconsole.log(JSON.stringify(plan,null,2));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Plan-and-Execute的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Plan-and-Execute就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Plan-and-Execute交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Plan-and-Execute会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Plan-and-Execute 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Plan-and-Execute' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "multi-agent",
          "title": "Multi-Agent 多智能体",
          "interview": [
            {
              "q": "【腾讯二面】多 Agent 协作适合什么业务场景？多 Agent 的致命缺点是什么？工程上如何解决通信、状态同步和失败容错？",
              a: "这是腾讯考察复杂分布式认知架构的进阶大题：\n1. 适合的业务场景：\n- 必须具备天然异构分工或红蓝对抗属性：\n  ① 研报/长篇内容生产：检索 Researcher + 撰稿 Writer + 事实核对 Fact-Checker（交叉纠偏）；\n  ② 软件工程智能体：架构设计 Architect + 编码 Coder + 单元测试生成 Tester + 严格代码审阅 Reviewer（通过反馈闭环写出高可用代码）；\n  ③ 仿真与推演：多角色博弈沙盘。\n\n2. 多 Agent 在生产中的致命缺点（踩坑血泪史）：\n- 成本呈乘法级膨胀：每个 Agent 都要携带各自的历史与背景，单次任务容易烧掉数万 Token；\n- 延迟严重不可控：全链路依赖多次大模型往返，P99 耗时可能达到 30s~1min，无法直接用于实时 C 端；\n- 闭环死锁与复读（Echo Chamber）：Agent A 和 Agent B 互相客套、意见对立无法收敛，陷入死循环；\n- 级联错误放大（Error Cascade）：上游 Agent 产生 10% 的幻觉，下游 Agent 基于该错误事实做推导，最终结果面目全非。\n\n3. 通信、状态同步与失败容错工程解法：\n- 【通信协议：禁止自由对话，使用结构化数据包】：必须强制约束通信格式为强类型 JSON 协议（包含 sender, receiver, message_type, structured_payload）。各 Agent 之间不进行自由发散聊天，只做确定性消息派发。\n- 【状态同步：黑板模式（Blackboard Pattern / Shared State）】：坚决避免点对点网状混乱同步。引入类似 LangGraph 的集中式全局状态机。所有 Agent 的读写均统一指向中心状态存储（Redis/PG），由主控协调器（Supervisor / Router）仲裁更新，保证状态单向数据流与可追溯性。\n- 【容错与降级机制】：为每两个 Agent 的交互轮数设置上限（如最多驳回修改 2 轮）；若 Reviewer 再次不通过，主控强制降级输出当前最高分草稿并附带人工待确认标签，避免系统永久卡死。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "多智能体适合分工、审查和辩论，但也会增加复杂度。",
          "definition": "Multi-Agent 是多个具备不同角色或能力的 Agent 协作完成任务。",
          "explanation": [
            "常见模式包括专家分工、审稿人、辩论和管理者协调。",
            "它不是默认更强，很多任务单 Agent 加 Workflow 更稳定。",
            "多智能体需要消息协议、角色边界、冲突解决和成本控制。",
            "从工程角度来看，Multi-Agent 多智能体不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Multi-Agent 多智能体可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Multi-Agent 多智能体的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "多个 Agent 一定更聪明。",
            "角色越多越专业。",
            "多智能体能替代评估。",
            "只要模型足够强大，就不需要考虑Multi-Agent 多智能体了。"
          ],
          "pitfalls": [
            "互相复读。",
            "成本翻倍。",
            "责任边界不清。",
            "线上环境缺乏对Multi-Agent 多智能体的日志追踪。"
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
              "name": "角色分工",
              "summary": "Multi-Agent 是多个具备不同角色或能力的 Agent 协作完成任务。",
              "detail": [
                "先建立层级直觉：角色分工是“Multi-Agent 多智能体”中的一个关键概念。Multi-Agent 是多个具备不同角色或能力的 Agent 协作完成任务。",
                "常见模式包括专家分工、审稿人、辩论和管理者协调。",
                "在 Agent 系统中，角色分工不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：多个 Agent 一定更聪明。。工程坑点：互相复读。。"
              ]
            },
            {
              "name": "协调者",
              "summary": "理解协调者：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：协调者是“Multi-Agent 多智能体”中的一个关键概念。Multi-Agent 是多个具备不同角色或能力的 Agent 协作完成任务。",
                "它不是默认更强，很多任务单 Agent 加 Workflow 更稳定。",
                "在 Agent 系统中，协调者不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：角色越多越专业。。工程坑点：成本翻倍。。"
              ]
            },
            {
              "name": "消息协议",
              "summary": "理解消息协议：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：消息协议是“Multi-Agent 多智能体”中的一个关键概念。Multi-Agent 是多个具备不同角色或能力的 Agent 协作完成任务。",
                "多智能体需要消息协议、角色边界、冲突解决和成本控制。",
                "在 Agent 系统中，消息协议不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：多智能体能替代评估。。工程坑点：责任边界不清。。"
              ]
            },
            {
              "name": "冲突解决",
              "summary": "理解冲突解决：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：冲突解决是“Multi-Agent 多智能体”中的一个关键概念。Multi-Agent 是多个具备不同角色或能力的 Agent 协作完成任务。",
                "常见模式包括专家分工、审稿人、辩论和管理者协调。",
                "在 Agent 系统中，冲突解决不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：多个 Agent 一定更聪明。。工程坑点：互相复读。。"
              ]
            }
          ],
          "lab": {
            "title": "Multi-Agent 多智能体实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const agents=['researcher','writer','reviewer'];\nconst task='写 Agent 学习路线';\nconsole.log(agents.map(a=>a+': '+task));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Multi-Agent 多智能体的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Multi-Agent 多智能体就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Multi-Agent 多智能体交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Multi-Agent 多智能体会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Multi-Agent 多智能体 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Multi-Agent 多智能体' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "ReAct 适合查未知信息",
          "scenario": "先查订单，再根据订单状态决定是否查退款；工具结果会改变下一步。",
          "takeaway": "当下一步依赖环境反馈时，边做边观察比一次性计划更自然。"
        },
        {
          "title": "多智能体不是默认答案",
          "scenario": "一个简单的订单查询被拆成五个 Agent，消息协调成本反而超过任务本身。",
          "takeaway": "先用单 Agent + Workflow，确有分工和隔离需求再引入多智能体。"
        }
      ],
      "diagram": {
        "title": "Agent 的基本循环",
        "caption": "循环必须有状态、最大轮次和明确停止条件。",
        "nodes": [
          "目标",
          "计划 / 决策",
          "调用工具",
          "观察结果",
          "更新状态",
          "完成或继续"
        ]
      },
      "order": "5.1",
      "routeFocus": "生产必备",
      "studyFlow": [
        "建立评估集",
        "加安全闸门",
        "接入观测",
        "准备上线"
      ],
      "goal": "本章围绕Agent 基本模式建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    },
    {
      "id": "workflow",
      "title": "第 11 章：Workflow 与 Graph",
      "lessons": [
        {
          "id": "workflow-vs-agent",
          "title": "Workflow vs Agent",
          "interview": [
            {
              "q": "【腾讯二面】什么场景用 Workflow，什么场景用 Agent？在面向海量用户的 C 端产品中应该怎么取舍？",
              a: "这是考察架构成熟度与产品工程平衡感的经典大题：\n1. 本质特征与控制权归属（Control Spectrum）：\n- Workflow（工作流）：控制权在确定性代码（Code-directed）。执行路径是预先编排的图，大模型仅作为节点内的一个“处理函数”（如信息抽取、总结）。特点是稳定可复现、低延迟、高吞吐、成本可控、易做单元测试。\n- Agent（自主智能体）：控制权交给了大模型（Model-directed）。模型自主决定下一步是调用工具、发起反思还是给出回答，循环步数动态不确定。特点是极强的开放探索能力，但高延迟、高成本、行为不可完全预测。\n\n2. 业务场景分类落地矩阵：\n- 必须优先选 Workflow：金融对账、订单售后退款流程、政企合规审查、医疗诊断初筛等容错率极低、有法定合规要求的场景。\n- 适合选 Agent：技术排障诊断助手、开放式深度调研（Deep Research）、自动化代码重构编写、跨多个异构系统的灵活数据探索。\n\n3. C 端高并发产品的取舍军规：\n- 【法则一：C 端主链路坚决禁止不可控的纯 ReAct Agent！】\n  C 端用户对“响应延迟（TTFB/Total Time）”和“体验一致性”极度苛刻。纯 Agent 动态循环 4~5 步往往耗时突破 15~20 秒，用户流失率直线上升；且同一个问题两次问可能走不同工具分支，客诉率暴涨。\n- 【法则二：行业终局范式是 Agentic Workflow（有约束的确定性框架）】\n  外层骨架必须是确定性的状态机：例如 [意图识别网关] -> [槽位提取] -> [指定数据流水线] -> [生成质检兜底]。\n  仅在有限的微观局部赋予模型自主权（例如：当一次检索结果分数为 0 时，允许模型自主做一次 Query 改写重试，但硬性上限为 1 次，随后必须降级退出）。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "生产系统不能把所有控制权都交给模型。",
          "definition": "Workflow 用确定性流程控制任务，Agent 用模型动态决定下一步。",
          "explanation": [
            "固定业务流程优先 Workflow。",
            "开放探索任务适合 Agent。",
            "生产常用 Agentic Workflow：主流程固定，局部节点交给 Agent。",
            "从工程角度来看，Workflow vs Agent不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Workflow vs Agent可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Workflow vs Agent的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "Workflow 不够智能。",
            "纯 Agent 更先进。",
            "所有条件都交给模型判断。",
            "只要模型足够强大，就不需要考虑Workflow vs Agent了。"
          ],
          "pitfalls": [
            "流程不可审计。",
            "模型误执行高风险动作。",
            "状态无法恢复。",
            "线上环境缺乏对Workflow vs Agent的日志追踪。"
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
              "name": "Workflow",
              "summary": "Workflow 用确定性流程控制任务，Agent 用模型动态决定下一步。",
              "detail": [
                "先建立层级直觉：Workflow是“Workflow vs Agent”中的一个关键概念。Workflow 用确定性流程控制任务，Agent 用模型动态决定下一步。",
                "固定业务流程优先 Workflow。",
                "在 Agent 系统中，Workflow不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Workflow 不够智能。。工程坑点：流程不可审计。。"
              ]
            },
            {
              "name": "Agent",
              "summary": "理解Agent：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Agent是“Workflow vs Agent”中的一个关键概念。Workflow 用确定性流程控制任务，Agent 用模型动态决定下一步。",
                "开放探索任务适合 Agent。",
                "在 Agent 系统中，Agent不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：纯 Agent 更先进。。工程坑点：模型误执行高风险动作。。"
              ]
            },
            {
              "name": "自由度",
              "summary": "理解自由度：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：自由度是“Workflow vs Agent”中的一个关键概念。Workflow 用确定性流程控制任务，Agent 用模型动态决定下一步。",
                "生产常用 Agentic Workflow：主流程固定，局部节点交给 Agent。",
                "在 Agent 系统中，自由度不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有条件都交给模型判断。。工程坑点：状态无法恢复。。"
              ]
            },
            {
              "name": "Agentic Workflow",
              "summary": "理解Agentic Workflow：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Agentic Workflow是“Workflow vs Agent”中的一个关键概念。Workflow 用确定性流程控制任务，Agent 用模型动态决定下一步。",
                "固定业务流程优先 Workflow。",
                "在 Agent 系统中，Agentic Workflow不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Workflow 不够智能。。工程坑点：流程不可审计。。"
              ]
            }
          ],
          "lab": {
            "title": "Workflow vs Agent实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const graph = { start:'classify', classify:'query_order', query_order:'confirm', confirm:'create_ticket', create_ticket:'done' };\nlet node='start'; const path=[];\nwhile(node!=='done'){ path.push(node); node=graph[node]; }\npath.push('done'); console.log(path.join(' -> '));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Workflow vs Agent的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Workflow vs Agent就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Workflow vs Agent交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Workflow vs Agent会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Workflow vs Agent 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Workflow vs Agent' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "state-graph",
          "title": "Node、Edge、State",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "为什么生产 Agent 常采用 Agentic Workflow？",
              "a": "固定主流程保证可测试和可审计，局部 Agent 保留探索能力；把自由度放在低风险、可回退的节点。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "Graph 是 Workflow 的基本表达方式。",
          "definition": "Node 是执行单元，Edge 是跳转规则，State 是流程共享状态。",
          "explanation": [
            "Node 负责调用模型、工具或业务函数。",
            "Edge 根据条件决定下一个节点。",
            "State 必须结构化保存，不能只存在自然语言里。",
            "从工程角度来看，Node、Edge、State不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Node、Edge、State可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Node、Edge、State的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "Graph 只是画图。",
            "State 可以让模型记住。",
            "所有节点都必须是 LLM。",
            "只要模型足够强大，就不需要考虑Node、Edge、State了。"
          ],
          "pitfalls": [
            "状态字段无 schema。",
            "节点副作用不可追踪。",
            "条件分支无测试。",
            "线上环境缺乏对Node、Edge、State的日志追踪。"
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
              "name": "Node 节点",
              "summary": "Node 是执行单元，Edge 是跳转规则，State 是流程共享状态。",
              "detail": [
                "先建立层级直觉：Node 节点是“Node、Edge、State”中的一个关键概念。Node 是执行单元，Edge 是跳转规则，State 是流程共享状态。",
                "Node 负责调用模型、工具或业务函数。",
                "在 Agent 系统中，Node 节点不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Graph 只是画图。。工程坑点：状态字段无 schema。。"
              ]
            },
            {
              "name": "Edge 边",
              "summary": "理解Edge 边：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Edge 边是“Node、Edge、State”中的一个关键概念。Node 是执行单元，Edge 是跳转规则，State 是流程共享状态。",
                "Edge 根据条件决定下一个节点。",
                "在 Agent 系统中，Edge 边不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：State 可以让模型记住。。工程坑点：节点副作用不可追踪。。"
              ]
            },
            {
              "name": "State 状态",
              "summary": "理解State 状态：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：State 状态是“Node、Edge、State”中的一个关键概念。Node 是执行单元，Edge 是跳转规则，State 是流程共享状态。",
                "State 必须结构化保存，不能只存在自然语言里。",
                "在 Agent 系统中，State 状态不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有节点都必须是 LLM。。工程坑点：条件分支无测试。。"
              ]
            },
            {
              "name": "条件分支",
              "summary": "理解条件分支：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：条件分支是“Node、Edge、State”中的一个关键概念。Node 是执行单元，Edge 是跳转规则，State 是流程共享状态。",
                "Node 负责调用模型、工具或业务函数。",
                "在 Agent 系统中，条件分支不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Graph 只是画图。。工程坑点：状态字段无 schema。。"
              ]
            }
          ],
          "lab": {
            "title": "Node、Edge、State实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const graph = { start:'classify', classify:'query_order', query_order:'confirm', confirm:'create_ticket', create_ticket:'done' };\nlet node='start'; const path=[];\nwhile(node!=='done'){ path.push(node); node=graph[node]; }\npath.push('done'); console.log(path.join(' -> '));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Node、Edge、State的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Node、Edge、State就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Node、Edge、State交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Node、Edge、State会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Node、Edge、State 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Node、Edge、State' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "checkpoint",
          "title": "Checkpoint 与 Resume",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "长任务会中断，必须能恢复。",
          "definition": "Checkpoint 是保存任务执行状态，Resume 是从状态继续执行。",
          "explanation": [
            "应保存当前节点、任务状态、工具结果摘要、副作用 ID 和等待事项。",
            "不能只保存聊天历史。",
            "副作用操作要保存幂等键，避免恢复后重复执行。",
            "从工程角度来看，Checkpoint 与 Resume不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Checkpoint 与 Resume可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Checkpoint 与 Resume的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "失败后重跑即可。",
            "聊天记录就是状态。",
            "所有工具都可重复执行。",
            "只要模型足够强大，就不需要考虑Checkpoint 与 Resume了。"
          ],
          "pitfalls": [
            "重复创建工单。",
            "用户确认丢失。",
            "计划和状态不一致。",
            "线上环境缺乏对Checkpoint 与 Resume的日志追踪。"
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
              "name": "Checkpoint",
              "summary": "Checkpoint 是保存任务执行状态，Resume 是从状态继续执行。",
              "detail": [
                "先建立层级直觉：Checkpoint是“Checkpoint 与 Resume”中的一个关键概念。Checkpoint 是保存任务执行状态，Resume 是从状态继续执行。",
                "应保存当前节点、任务状态、工具结果摘要、副作用 ID 和等待事项。",
                "在 Agent 系统中，Checkpoint不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：失败后重跑即可。。工程坑点：重复创建工单。。"
              ]
            },
            {
              "name": "Resume",
              "summary": "理解Resume：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Resume是“Checkpoint 与 Resume”中的一个关键概念。Checkpoint 是保存任务执行状态，Resume 是从状态继续执行。",
                "不能只保存聊天历史。",
                "在 Agent 系统中，Resume不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：聊天记录就是状态。。工程坑点：用户确认丢失。。"
              ]
            },
            {
              "name": "幂等键",
              "summary": "理解幂等键：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：幂等键是“Checkpoint 与 Resume”中的一个关键概念。Checkpoint 是保存任务执行状态，Resume 是从状态继续执行。",
                "副作用操作要保存幂等键，避免恢复后重复执行。",
                "在 Agent 系统中，幂等键不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有工具都可重复执行。。工程坑点：计划和状态不一致。。"
              ]
            },
            {
              "name": "副作用",
              "summary": "理解副作用：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：副作用是“Checkpoint 与 Resume”中的一个关键概念。Checkpoint 是保存任务执行状态，Resume 是从状态继续执行。",
                "应保存当前节点、任务状态、工具结果摘要、副作用 ID 和等待事项。",
                "在 Agent 系统中，副作用不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：失败后重跑即可。。工程坑点：重复创建工单。。"
              ]
            }
          ],
          "lab": {
            "title": "Checkpoint 与 Resume实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const checkpoint={node:'confirm',state:{orderId:'1024'},sideEffects:['ticket:T1'],waitingFor:'user'};\nconsole.log(JSON.stringify(checkpoint,null,2));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Checkpoint 与 Resume的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Checkpoint 与 Resume就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Checkpoint 与 Resume交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Checkpoint 与 Resume会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Checkpoint 与 Resume 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Checkpoint 与 Resume' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "退款流程不应完全自由发挥",
          "scenario": "识别问题、查订单、展示退款金额、用户确认、执行退款，这些节点顺序和权限都应由代码控制。",
          "takeaway": "高风险、强约束业务优先用 Workflow。"
        },
        {
          "title": "Checkpoint 为什么重要",
          "scenario": "用户离开页面后，任务停在等待确认；回来时从 confirm 节点继续，而不是重新创建工单。",
          "takeaway": "恢复需要结构化状态和幂等副作用记录。"
        }
      ],
      "diagram": {
        "title": "Agentic Workflow",
        "caption": "主流程确定，局部探索交给 Agent，兼顾稳定与灵活。",
        "nodes": [
          "固定入口",
          "Agent 子任务",
          "确定性校验",
          "人工确认",
          "副作用执行",
          "完成 / 回滚"
        ]
      },
      "order": "5.2",
      "routeFocus": "生产必备",
      "studyFlow": [
        "建立评估集",
        "加安全闸门",
        "接入观测",
        "准备上线"
      ],
      "goal": "本章围绕Workflow 与 Graph建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    }
  ],
  "routeIndex": 5,
  "routeFocus": "生产必备",
  "studyFlow": [
    "建立评估集",
    "加安全闸门",
    "接入观测",
    "准备上线"
  ]
};