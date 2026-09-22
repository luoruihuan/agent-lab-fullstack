export const stage3 = {
  "id": "structured-tools",
  "title": "阶段三：结构化输出与工具调用",
  "goal": "让模型输出进入软件工程体系，并安全调用外部能力。",
  "chapters": [
    {
      "id": "structured",
      "title": "第 5 章：结构化输出",
      "lessons": [
        {
          "id": "json-mode",
          "title": "JSON Mode",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "JSON Mode 解决语法问题，但不能解决业务契约问题。",
          "definition": "JSON Mode 是让模型尽量返回合法 JSON 的输出模式。",
          "explanation": [
            "它降低 JSON 解析失败概率，但不保证字段完整、类型正确或枚举合法。",
            "适合简单结构化输出，不适合作为唯一可靠性机制。",
            "生产中必须继续做 Schema 和业务校验。",
            "从工程角度来看，JSON Mode不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理JSON Mode可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保JSON Mode的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "JSON 合法就等于可用。",
            "JSON Mode 能保证枚举正确。",
            "用了 JSON Mode 就不用重试。",
            "只要模型足够强大，就不需要考虑JSON Mode了。"
          ],
          "pitfalls": [
            "字段缺失。",
            "额外字段污染。",
            "枚举大小写错误。",
            "线上环境缺乏对JSON Mode的日志追踪。"
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
              "name": "合法 JSON",
              "summary": "JSON Mode 是让模型尽量返回合法 JSON 的输出模式。",
              "detail": [
                "先建立层级直觉：合法 JSON是“JSON Mode”中的一个关键概念。JSON Mode 是让模型尽量返回合法 JSON 的输出模式。",
                "它降低 JSON 解析失败概率，但不保证字段完整、类型正确或枚举合法。",
                "在 Agent 系统中，合法 JSON不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：JSON 合法就等于可用。。工程坑点：字段缺失。。"
              ]
            },
            {
              "name": "解析",
              "summary": "理解解析：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：解析是“JSON Mode”中的一个关键概念。JSON Mode 是让模型尽量返回合法 JSON 的输出模式。",
                "适合简单结构化输出，不适合作为唯一可靠性机制。",
                "在 Agent 系统中，解析不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：JSON Mode 能保证枚举正确。。工程坑点：额外字段污染。。"
              ]
            },
            {
              "name": "字段完整性",
              "summary": "理解字段完整性：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：字段完整性是“JSON Mode”中的一个关键概念。JSON Mode 是让模型尽量返回合法 JSON 的输出模式。",
                "生产中必须继续做 Schema 和业务校验。",
                "在 Agent 系统中，字段完整性不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：用了 JSON Mode 就不用重试。。工程坑点：枚举大小写错误。。"
              ]
            },
            {
              "name": "JSON Mode 边界",
              "summary": "理解JSON Mode 边界：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：JSON Mode 边界是“JSON Mode”中的一个关键概念。JSON Mode 是让模型尽量返回合法 JSON 的输出模式。",
                "它降低 JSON 解析失败概率，但不保证字段完整、类型正确或枚举合法。",
                "在 Agent 系统中，JSON Mode 边界不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：JSON 合法就等于可用。。工程坑点：字段缺失。。"
              ]
            }
          ],
          "lab": {
            "title": "JSON Mode实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const output = { category:'payment', priority:'HIGH', confidence:0.8 };\nconst allowed = ['PAYMENT','LOGISTICS','AFTER_SALE','ACCOUNT'];\nconst errors = [];\nif (!allowed.includes(output.category)) errors.push('category 枚举错误');\nif (typeof output.confidence !== 'number') errors.push('confidence 类型错误');\nconsole.log(errors.length ? errors : 'valid');"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于JSON Mode的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：JSON Mode就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与JSON Mode交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，JSON Mode会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 JSON Mode 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示JSON Mode' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "json-schema",
          "title": "JSON Schema",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "JSON Mode、JSON Schema 和 Structured Outputs 有什么区别？",
              "a": "JSON Mode 主要保证语法，Schema 描述契约，Structured Outputs 约束生成；三者都不能替代业务校验和失败处理。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "Schema 是模型和后端之间的结构契约。",
          "definition": "JSON Schema 描述 JSON 字段、类型、枚举、必填项和额外字段规则。",
          "explanation": [
            "Schema 把自然语言格式要求变成机器可校验契约。",
            "它可以作为模型输入，也可以作为后端校验标准。",
            "Schema 不能表达全部业务规则，例如用户是否有权访问订单。",
            "从工程角度来看，JSON Schema不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理JSON Schema可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保JSON Schema的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "Schema 是生成方式本身。",
            "Schema 可以替代业务校验。",
            "Schema 不需要版本管理。",
            "只要模型足够强大，就不需要考虑JSON Schema了。"
          ],
          "pitfalls": [
            "additionalProperties 未限制。",
            "字段变更无版本。",
            "nullable 语义不清。",
            "线上环境缺乏对JSON Schema的日志追踪。"
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
              "name": "Schema",
              "summary": "JSON Schema 描述 JSON 字段、类型、枚举、必填项和额外字段规则。",
              "detail": [
                "先建立层级直觉：Schema是“JSON Schema”中的一个关键概念。JSON Schema 描述 JSON 字段、类型、枚举、必填项和额外字段规则。",
                "Schema 把自然语言格式要求变成机器可校验契约。",
                "在 Agent 系统中，Schema不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Schema 是生成方式本身。。工程坑点：additionalProperties 未限制。。"
              ]
            },
            {
              "name": "类型约束",
              "summary": "理解类型约束：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：类型约束是“JSON Schema”中的一个关键概念。JSON Schema 描述 JSON 字段、类型、枚举、必填项和额外字段规则。",
                "它可以作为模型输入，也可以作为后端校验标准。",
                "在 Agent 系统中，类型约束不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Schema 可以替代业务校验。。工程坑点：字段变更无版本。。"
              ]
            },
            {
              "name": "枚举",
              "summary": "理解枚举：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：枚举是“JSON Schema”中的一个关键概念。JSON Schema 描述 JSON 字段、类型、枚举、必填项和额外字段规则。",
                "Schema 不能表达全部业务规则，例如用户是否有权访问订单。",
                "在 Agent 系统中，枚举不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Schema 不需要版本管理。。工程坑点：nullable 语义不清。。"
              ]
            },
            {
              "name": "版本兼容",
              "summary": "理解版本兼容：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：版本兼容是“JSON Schema”中的一个关键概念。JSON Schema 描述 JSON 字段、类型、枚举、必填项和额外字段规则。",
                "Schema 把自然语言格式要求变成机器可校验契约。",
                "在 Agent 系统中，版本兼容不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Schema 是生成方式本身。。工程坑点：additionalProperties 未限制。。"
              ]
            }
          ],
          "lab": {
            "title": "JSON Schema实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const output = { category:'payment', priority:'HIGH', confidence:0.8 };\nconst allowed = ['PAYMENT','LOGISTICS','AFTER_SALE','ACCOUNT'];\nconst errors = [];\nif (!allowed.includes(output.category)) errors.push('category 枚举错误');\nif (typeof output.confidence !== 'number') errors.push('confidence 类型错误');\nconsole.log(errors.length ? errors : 'valid');"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于JSON Schema的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：JSON Schema就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与JSON Schema交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，JSON Schema会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 JSON Schema 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示JSON Schema' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "structured-retry",
          "title": "校验失败、重试与降级",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "模型输出失败是常态，必须有恢复策略。",
          "definition": "结构化输出失败处理包括解析失败、Schema 失败、业务失败后的重试、修复和降级。",
          "explanation": [
            "失败后应把校验错误作为修复指令反馈给模型，而不是简单重复原请求。",
            "重试必须有上限，多次失败进入默认降级或人工审核。",
            "失败样本要记录，后续进入评估集。",
            "从工程角度来看，校验失败、重试与降级不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理校验失败、重试与降级可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保校验失败、重试与降级的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "无限重试可以解决问题。",
            "默认值可以填补所有缺失。",
            "失败直接抛给用户。",
            "只要模型足够强大，就不需要考虑校验失败、重试与降级了。"
          ],
          "pitfalls": [
            "重试无上限。",
            "错误栈泄露。",
            "降级没有置信度标记。",
            "线上环境缺乏对校验失败、重试与降级的日志追踪。"
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
              "name": "解析失败",
              "summary": "结构化输出失败处理包括解析失败、Schema 失败、业务失败后的重试、修复和降级。",
              "detail": [
                "先建立层级直觉：解析失败是“校验失败、重试与降级”中的一个关键概念。结构化输出失败处理包括解析失败、Schema 失败、业务失败后的重试、修复和降级。",
                "失败后应把校验错误作为修复指令反馈给模型，而不是简单重复原请求。",
                "在 Agent 系统中，解析失败不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：无限重试可以解决问题。。工程坑点：重试无上限。。"
              ]
            },
            {
              "name": "校验失败",
              "summary": "理解校验失败：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：校验失败是“校验失败、重试与降级”中的一个关键概念。结构化输出失败处理包括解析失败、Schema 失败、业务失败后的重试、修复和降级。",
                "重试必须有上限，多次失败进入默认降级或人工审核。",
                "在 Agent 系统中，校验失败不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：默认值可以填补所有缺失。。工程坑点：错误栈泄露。。"
              ]
            },
            {
              "name": "有限重试",
              "summary": "理解有限重试：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：有限重试是“校验失败、重试与降级”中的一个关键概念。结构化输出失败处理包括解析失败、Schema 失败、业务失败后的重试、修复和降级。",
                "失败样本要记录，后续进入评估集。",
                "在 Agent 系统中，有限重试不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：失败直接抛给用户。。工程坑点：降级没有置信度标记。。"
              ]
            },
            {
              "name": "降级与人工审核",
              "summary": "理解降级与人工审核：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：降级与人工审核是“校验失败、重试与降级”中的一个关键概念。结构化输出失败处理包括解析失败、Schema 失败、业务失败后的重试、修复和降级。",
                "失败后应把校验错误作为修复指令反馈给模型，而不是简单重复原请求。",
                "在 Agent 系统中，降级与人工审核不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：无限重试可以解决问题。。工程坑点：重试无上限。。"
              ]
            }
          ],
          "lab": {
            "title": "校验失败、重试与降级实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "function validate(o){const e=[]; if(!o.category)e.push('missing category'); if(typeof o.confidence!=='number')e.push('bad confidence'); return e;}\nlet out={confidence:'0.8'};\nlet errors=validate(out);\nconsole.log('errors',errors);\nif(errors.length) out={category:'PAYMENT',confidence:0.8};\nconsole.log('fixed',validate(out));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于校验失败、重试与降级的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：校验失败、重试与降级就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与校验失败、重试与降级交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，校验失败、重试与降级会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 校验失败、重试与降级 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示校验失败、重试与降级' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "合法 JSON 也可能不可用",
          "scenario": "模型返回 {category: \"payment\"}，JSON 语法正确，但业务枚举要求 PAYMENT，且 priority 缺失。",
          "takeaway": "解析成功只是第一关，Schema 和业务校验才是契约。"
        },
        {
          "title": "把自由文本变成工单契约",
          "scenario": "输出固定的 category、priority、confidence、reason，前端和后端就能稳定消费。",
          "takeaway": "结构化输出让模型进入类型、测试和重试体系。"
        }
      ],
      "diagram": {
        "title": "结构化输出的四道门",
        "caption": "任何一道门失败，都不能直接把结果交给业务系统。",
        "nodes": [
          "模型输出",
          "JSON 解析",
          "Schema 校验",
          "业务校验",
          "可执行结果"
        ]
      },
      "order": "3.1",
      "routeFocus": "核心能力",
      "studyFlow": [
        "理解检索链路",
        "对比策略",
        "测量质量",
        "交付 V3"
      ],
      "goal": "本章围绕结构化输出建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    },
    {
      "id": "tools",
      "title": "第 6 章：Tool Calling",
      "lessons": [
        {
          "id": "tool-schema",
          "title": "工具 Schema",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "工具描述和参数 Schema 决定模型能否正确选择工具和生成参数。",
          "definition": "工具 Schema 包括工具名、用途描述、参数结构、必填字段和约束。",
          "explanation": [
            "工具名要清晰，描述要说明什么时候用、什么时候不用。",
            "参数 Schema 要收紧类型、枚举和范围。",
            "工具越多越需要分组、裁剪和上下文预算管理。",
            "从工程角度来看，工具 Schema不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理工具 Schema可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保工具 Schema的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "工具描述越长越好。",
            "工具名随便取。",
            "参数可以靠模型自己猜。",
            "只要模型足够强大，就不需要考虑工具 Schema了。"
          ],
          "pitfalls": [
            "工具语义重叠。",
            "缺少 required。",
            "描述没有反例。",
            "线上环境缺乏对工具 Schema的日志追踪。"
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
              "name": "工具名称",
              "summary": "工具 Schema 包括工具名、用途描述、参数结构、必填字段和约束。",
              "detail": [
                "先建立层级直觉：工具名称是“工具 Schema”中的一个关键概念。工具 Schema 包括工具名、用途描述、参数结构、必填字段和约束。",
                "工具名要清晰，描述要说明什么时候用、什么时候不用。",
                "在 Agent 系统中，工具名称不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：工具描述越长越好。。工程坑点：工具语义重叠。。"
              ]
            },
            {
              "name": "参数 Schema",
              "summary": "理解参数 Schema：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：参数 Schema是“工具 Schema”中的一个关键概念。工具 Schema 包括工具名、用途描述、参数结构、必填字段和约束。",
                "参数 Schema 要收紧类型、枚举和范围。",
                "在 Agent 系统中，参数 Schema不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：工具名随便取。。工程坑点：缺少 required。。"
              ]
            },
            {
              "name": "调用条件",
              "summary": "理解调用条件：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：调用条件是“工具 Schema”中的一个关键概念。工具 Schema 包括工具名、用途描述、参数结构、必填字段和约束。",
                "工具越多越需要分组、裁剪和上下文预算管理。",
                "在 Agent 系统中，调用条件不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：参数可以靠模型自己猜。。工程坑点：描述没有反例。。"
              ]
            },
            {
              "name": "工具描述",
              "summary": "理解工具描述：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：工具描述是“工具 Schema”中的一个关键概念。工具 Schema 包括工具名、用途描述、参数结构、必填字段和约束。",
                "工具名要清晰，描述要说明什么时候用、什么时候不用。",
                "在 Agent 系统中，工具描述不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：工具描述越长越好。。工程坑点：工具语义重叠。。"
              ]
            }
          ],
          "lab": {
            "title": "工具 Schema实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const tools = { query_order: { risk:'low', run: a => ({ orderId:a.orderId, status:'PAID' }) }, refund_order:{ risk:'high', run:a=>({ok:true}) } };\nfunction run(call){ const t=tools[call.name]; if(!t) throw Error('unknown tool'); if(t.risk==='high') throw Error('需要人工确认'); return t.run(call.args);}\nconsole.log(run({name:'query_order',args:{orderId:'1024'}}));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于工具 Schema的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：工具 Schema就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与工具 Schema交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，工具 Schema会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 工具 Schema 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示工具 Schema' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "tool-runtime",
          "title": "工具运行时",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "Function Calling 和真正执行工具的区别是什么？",
              "a": "模型只生成工具名和参数，运行时负责校验、权限、幂等、执行、结果回填和审计。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "模型只生成调用意图，运行时负责校验、鉴权、执行和审计。",
          "definition": "工具运行时是执行模型工具调用的后端系统。",
          "explanation": [
            "运行时必须验证参数、权限、幂等和风险等级。",
            "查询工具可自动执行，高风险工具必须确认。",
            "工具结果应结构化回填，避免冗长和敏感信息。",
            "从工程角度来看，工具运行时不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理工具运行时可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保工具运行时的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "模型真的调用函数。",
            "工具描述能保证安全。",
            "所有工具都能自动执行。",
            "只要模型足够强大，就不需要考虑工具运行时了。"
          ],
          "pitfalls": [
            "越权查询。",
            "重复副作用。",
            "内部错误泄露。",
            "线上环境缺乏对工具运行时的日志追踪。"
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
              "name": "意图与执行",
              "summary": "工具运行时是执行模型工具调用的后端系统。",
              "detail": [
                "先建立层级直觉：意图与执行是“工具运行时”中的一个关键概念。工具运行时是执行模型工具调用的后端系统。",
                "运行时必须验证参数、权限、幂等和风险等级。",
                "在 Agent 系统中，意图与执行不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型真的调用函数。。工程坑点：越权查询。。"
              ]
            },
            {
              "name": "参数校验",
              "summary": "理解参数校验：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：参数校验是“工具运行时”中的一个关键概念。工具运行时是执行模型工具调用的后端系统。",
                "查询工具可自动执行，高风险工具必须确认。",
                "在 Agent 系统中，参数校验不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：工具描述能保证安全。。工程坑点：重复副作用。。"
              ]
            },
            {
              "name": "鉴权",
              "summary": "理解鉴权：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：鉴权是“工具运行时”中的一个关键概念。工具运行时是执行模型工具调用的后端系统。",
                "工具结果应结构化回填，避免冗长和敏感信息。",
                "在 Agent 系统中，鉴权不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有工具都能自动执行。。工程坑点：内部错误泄露。。"
              ]
            },
            {
              "name": "幂等与审计",
              "summary": "理解幂等与审计：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：幂等与审计是“工具运行时”中的一个关键概念。工具运行时是执行模型工具调用的后端系统。",
                "运行时必须验证参数、权限、幂等和风险等级。",
                "在 Agent 系统中，幂等与审计不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型真的调用函数。。工程坑点：越权查询。。"
              ]
            }
          ],
          "lab": {
            "title": "工具运行时实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const tools = { query_order: { risk:'low', run: a => ({ orderId:a.orderId, status:'PAID' }) }, refund_order:{ risk:'high', run:a=>({ok:true}) } };\nfunction run(call){ const t=tools[call.name]; if(!t) throw Error('unknown tool'); if(t.risk==='high') throw Error('需要人工确认'); return t.run(call.args);}\nconsole.log(run({name:'query_order',args:{orderId:'1024'}}));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于工具运行时的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：工具运行时就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与工具运行时交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，工具运行时会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 工具运行时 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示工具运行时' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "tool-errors",
          "title": "工具错误处理",
          "interview": [
            {
              "q": "【腾讯一面】工具调用失败、大模型返回非法 JSON 或缺少参数怎么处理？完整的错误自愈链路怎么设计？",
              a: "这是考察 Tool Calling 鲁棒性与工程防御纵深的硬核考题：\n1. 明确错误分层诊断：\n- 语法解析错误（Syntax Error）：模型返回的 arguments 不是合法的 JSON 字符串（尾部截断、单双引号混用、特殊字符未转义）。\n- Schema 契约校验错误（Validation Error）：JSON 语法合法，但缺少了 required 必填字段，或者类型不匹配（如把 string 传成了 array）。\n- 运行时业务执行错误（Runtime Error）：参数符合契约，但外部 API 返回 404 资源不存在、403 权限拒绝或连接超时。\n\n2. 工业级自愈防护链路设计：\n- 第一道防线【本地代码级轻量自愈（0 Token 消耗）】：在解析 arguments 时，引入容错解析器（如 Python 的 dirty-json 或 JS 的 jsonrepair / partial-json），自动补全漏掉的大括号、清理 markdown 代码块标记（```json...```）。80% 的浅层格式错误在本地即可被静默拉平，无需重新请求模型。\n- 第二道防线【结构化校验与精准回填自愈（Reflection Loop）】：\n  使用 Zod / Pydantic 进行严格反序列化。一旦报错，将详细的字段级校验信息包装为 JSON 工具回包：\n  `{ \"status\": \"error\", \"error_type\": \"SCHEMA_VALIDATION_FAILED\", \"detail\": \"字段 phone_number 必须符合 11 位中国大陆手机号规范，当前输入不合法，请重新提取并纠错重试\" }`。\n  以 `role: tool` 身分推回 messages。大模型阅读到具体的错误原因后，会在下一轮自动发起纠偏重试。\n- 第三道防线【严格限制纠错轮次与幂等兜底】：\n  为参数错误纠偏设置硬上限（MAX_RETRIES = 2）。若连续 2 次模型依然无法生成合法参数，触发熔断，降级为友好话术向用户主动求助：“抱歉，我无法识别您的手机号，能否请您手动输入确认？”\n- 第四道防线【不可逆操作直接 Fail-Fast】：对于涉及写数据库、发短信、扣款转账的高危工具，只要参数有任何歧义或失败，严禁让模型自由猜想重试，必须直接阻断上报日志。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "工具失败后，Agent 要知道如何恢复，而不是编造结果或无限重试。",
          "definition": "工具错误处理是把底层异常转成安全、结构化、可恢复的观察结果。",
          "explanation": [
            "错误要区分参数错误、权限错误、超时和内部异常。",
            "给模型看的是安全摘要，给日志保存的是完整细节。",
            "可重试错误要有限次重试，不可重试错误要停止或请求用户补充。",
            "从工程角度来看，工具错误处理不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理工具错误处理可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保工具错误处理的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "完整错误栈给模型更好。",
            "所有失败都能重试。",
            "工具失败可以让模型自由发挥。",
            "只要模型足够强大，就不需要考虑工具错误处理了。"
          ],
          "pitfalls": [
            "泄露 SQL 或密钥。",
            "权限错误伪装成系统错误。",
            "没有 traceId。",
            "线上环境缺乏对工具错误处理的日志追踪。"
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
              "name": "参数错误",
              "summary": "工具错误处理是把底层异常转成安全、结构化、可恢复的观察结果。",
              "detail": [
                "先建立层级直觉：参数错误是“工具错误处理”中的一个关键概念。工具错误处理是把底层异常转成安全、结构化、可恢复的观察结果。",
                "错误要区分参数错误、权限错误、超时和内部异常。",
                "在 Agent 系统中，参数错误不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：完整错误栈给模型更好。。工程坑点：泄露 SQL 或密钥。。"
              ]
            },
            {
              "name": "权限错误",
              "summary": "理解权限错误：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：权限错误是“工具错误处理”中的一个关键概念。工具错误处理是把底层异常转成安全、结构化、可恢复的观察结果。",
                "给模型看的是安全摘要，给日志保存的是完整细节。",
                "在 Agent 系统中，权限错误不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：所有失败都能重试。。工程坑点：权限错误伪装成系统错误。。"
              ]
            },
            {
              "name": "超时",
              "summary": "理解超时：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：超时是“工具错误处理”中的一个关键概念。工具错误处理是把底层异常转成安全、结构化、可恢复的观察结果。",
                "可重试错误要有限次重试，不可重试错误要停止或请求用户补充。",
                "在 Agent 系统中，超时不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：工具失败可以让模型自由发挥。。工程坑点：没有 traceId。。"
              ]
            },
            {
              "name": "可恢复性",
              "summary": "理解可恢复性：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：可恢复性是“工具错误处理”中的一个关键概念。工具错误处理是把底层异常转成安全、结构化、可恢复的观察结果。",
                "错误要区分参数错误、权限错误、超时和内部异常。",
                "在 Agent 系统中，可恢复性不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：完整错误栈给模型更好。。工程坑点：泄露 SQL 或密钥。。"
              ]
            }
          ],
          "lab": {
            "title": "工具错误处理实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "function normalize(e){ if(e.code==='FORBIDDEN') return {type:'permission_denied',retryable:false}; if(e.code==='TIMEOUT') return {type:'temporary_failure',retryable:true}; return {type:'tool_failed',retryable:false}; }\nconsole.log(normalize({code:'FORBIDDEN',stack:'secret'}));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于工具错误处理的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：工具错误处理就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与工具错误处理交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，工具错误处理会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 工具错误处理 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示工具错误处理' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "查订单和退款不是同一种风险",
          "scenario": "query_order 只读；refund_order 会产生资金副作用，必须带权限检查和用户确认。",
          "takeaway": "工具不是普通函数，它是 Agent 进入真实世界的边界。"
        },
        {
          "title": "工具结果要给模型看什么",
          "scenario": "模型只需要看到 status=PAID 和 traceId，不需要看到数据库 SQL、内部堆栈或敏感字段。",
          "takeaway": "用户可见、模型可见、内部日志三种信息应该分层。"
        }
      ],
      "diagram": {
        "title": "Tool Calling 完整链路",
        "caption": "模型只表达意图，运行时才拥有真正的执行权。",
        "nodes": [
          "用户目标",
          "模型选择工具",
          "参数校验",
          "权限 / 风险检查",
          "执行工具",
          "结构化结果回填"
        ]
      },
      "order": "3.2",
      "routeFocus": "核心能力",
      "studyFlow": [
        "理解检索链路",
        "对比策略",
        "测量质量",
        "交付 V3"
      ],
      "goal": "本章围绕Tool Calling建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    }
  ],
  "routeIndex": 3,
  "routeFocus": "核心能力",
  "studyFlow": [
    "理解检索链路",
    "对比策略",
    "测量质量",
    "交付 V3"
  ]
};