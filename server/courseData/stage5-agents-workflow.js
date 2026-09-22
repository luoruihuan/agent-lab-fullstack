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
              "q": "ReAct 和 Workflow 的区别是什么？",
              "a": "ReAct 由模型根据观察动态决定下一步，适合不确定探索；Workflow 由代码或图控制主流程，适合强约束和高风险任务。"
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
          "level": "基础",
          "focus": "必学",
          "interview": [],
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
          "level": "基础",
          "focus": "必学",
          "interview": [],
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