export const stage1 = {
  "id": "foundation",
  "title": "阶段一：LLM 基础与模型调用",
  "goal": "先建立模型运行机制的心智模型，理解 Token、上下文、采样和模型边界。",
  "chapters": [
    {
      "id": "generation",
      "title": "第 1 章：LLM 生成机制",
      "lessons": [
        {
          "id": "autoregressive",
          "title": "自回归生成",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "LLM 为什么是一个 Token 一个 Token 地生成？",
              "a": "先说自回归预测下一个 Token，再说明前文会影响后续，最后落到 Agent 需要控制上下文和纠正错误。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "理解模型为什么逐 Token 生成，是理解 Prompt、上下文污染和 Agent 轨迹漂移的起点。",
          "definition": "自回归生成是模型基于已有上下文预测下一个 Token，再把新 Token 加回上下文继续预测的过程。",
          "explanation": [
            "LLM 并不是先想好完整答案再一次性输出，而是在当前上下文下不断预测下一个 Token。",
            "这意味着前文的系统规则、用户输入、工具结果、检索片段都会影响后续每一步。",
            "Agent 的多轮轨迹会持续进入上下文，所以早期错误如果不纠正，后续推理会建立在错误基础上。",
            "从工程角度来看，自回归生成不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理自回归生成可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保自回归生成的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "模型先生成完整思路再输出。",
            "每次回答只受当前问题影响。",
            "模型幻觉只和模型能力有关。",
            "只要模型足够强大，就不需要考虑自回归生成了。"
          ],
          "pitfalls": [
            "错误工具结果污染后续推理。",
            "上下文中存在互相冲突的约束。",
            "早期错误没有被状态系统纠正。",
            "线上环境缺乏对自回归生成的日志追踪。"
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
              "name": "LLM",
              "summary": "Large Language Model，大语言模型。",
              "detail": [
                "LLM 是通过大量文本训练出来的概率模型，输入一段上下文后，预测接下来最可能出现的 Token。它的核心能力来自语言模式学习，不等于数据库、搜索引擎或程序执行器。",
                "模型输出具有概率性：同一个问题在不同上下文和采样参数下可能得到不同答案。工程系统因此需要 Prompt、Schema、工具和评估来约束它。",
                "在 Agent 中，LLM 主要负责理解任务、生成候选计划、选择工具和组织回答；权限判断、数据写入、金额计算和副作用执行应由确定性代码负责。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "自回归生成",
              "summary": "根据已有上下文逐步预测下一个 Token。",
              "detail": [
                "模型不是先完整写好答案再一次性返回，而是生成一个 Token 后，把它放回上下文，再预测下一个 Token。",
                "因此系统提示词、用户消息、历史记录、工具结果和 RAG 证据都会影响后续生成。前面的错误如果没有被状态或校验纠正，可能一路传递。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "幻觉 Hallucination",
              "summary": "模型生成听起来合理但缺乏可靠依据的内容。",
              "detail": [
                "幻觉不是简单的“模型撒谎”，而是概率生成机制会优先生成语言上连贯的内容，却不天然知道内容是否真实。",
                "降低幻觉不能只靠一句“不要编造”。需要提供可验证证据、限定输出契约、允许拒答，并在关键场景交给工具或数据库核实。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            }
          ],
          "lab": {
            "title": "自回归生成实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const text = 'Agent 需要上下文、工具和记忆。';\nconst roughTokens = Array.from(text).length;\nconsole.log('文本:', text);\nconsole.log('粗略 token 估算:', roughTokens);\nconsole.log('思考: 中文、英文、代码的 token 切分并不相同。');"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于自回归生成的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：自回归生成就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与自回归生成交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，自回归生成会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 自回归生成 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示自回归生成' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "tokens",
          "title": "Token、分词与成本",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "Token 和字符、单词是什么关系？为什么影响成本？",
              "a": "Token 是模型处理的片段，不等于字符或单词；输入、输出、工具 Schema、历史和 RAG 都计入预算。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "Token 决定上下文容量、接口费用和响应延迟，是 Agent 成本控制的基本单位。",
          "definition": "Token 是模型处理文本的基本片段，可以是字符、词的一部分、空格或符号。",
          "explanation": [
            "中文、英文、代码、JSON 的 Token 密度不同，不能只按字符数估算。",
            "工具 Schema、历史消息和 RAG 片段都会消耗 Token。",
            "生产系统需要记录每次调用的输入 Token、输出 Token、总成本和延迟。",
            "从工程角度来看，Token、分词与成本不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Token、分词与成本可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Token、分词与成本的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "一个汉字就是一个 Token。",
            "只计算用户输入即可。",
            "上下文越大成本影响越小。",
            "只要模型足够强大，就不需要考虑Token、分词与成本了。"
          ],
          "pitfalls": [
            "工具定义过多导致成本飙升。",
            "日志和检索片段未经压缩。",
            "没有按任务记录 Token 成本。",
            "线上环境缺乏对Token、分词与成本的日志追踪。"
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
              "name": "Token",
              "summary": "模型处理文本的基本片段，不等同于字符或单词。",
              "detail": [
                "Token 是模型内部处理文本时使用的片段，可能是一个汉字、一个英文单词的一部分、空格、标点或代码片段。不同模型的切分方式不同。",
                "Token 数量会影响上下文容量、输入输出成本和响应延迟。系统提示词、工具 Schema、历史消息、RAG 证据和模型输出都会消耗预算。",
                "估算成本时不能简单用字符数代替 Token 数。生产系统应从模型接口返回值记录 input tokens、output tokens 和 total tokens。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "Tokenization / 分词",
              "summary": "把原始文本拆成模型能够处理的 Token 序列。",
              "detail": [
                "分词是模型输入前的编码步骤，不等同于中文搜索里的分词。搜索分词关注词项和倒排索引，模型分词关注如何映射到模型词表。",
                "代码、JSON、中文和英文的 Token 密度可能不同，所以长 JSON 和长工具描述也会显著消耗上下文。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "上下文成本",
              "summary": "每一轮调用携带的输入和输出都会形成成本。",
              "detail": [
                "一次调用通常包含系统指令、历史、当前问题、工具定义、工具结果和模型输出。多轮 Agent 如果每次重复携带全部历史，成本会不断累积。",
                "常见控制手段包括摘要、裁剪工具 Schema、限制检索片段、结构化保存状态和设置最大输出 Token。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            }
          ],
          "lab": {
            "title": "Token、分词与成本实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const text = 'Agent 需要上下文、工具和记忆。';\nconst roughTokens = Array.from(text).length;\nconsole.log('文本:', text);\nconsole.log('粗略 token 估算:', roughTokens);\nconsole.log('思考: 中文、英文、代码的 token 切分并不相同。');"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Token、分词与成本的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Token、分词与成本就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Token、分词与成本交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Token、分词与成本会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Token、分词与成本 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Token、分词与成本' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "logits-softmax",
          "title": "Logits、Softmax 与候选概率",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "理解候选概率，才能解释 Temperature、Top-p 为什么会影响稳定性。",
          "definition": "Logits 是模型对候选 Token 的原始分数，Softmax 会把分数转换成概率分布。",
          "explanation": [
            "模型每一步会给大量候选 Token 打分，分数越高越可能被选中。",
            "Softmax 把分数转换成概率，而采样参数会改变这个概率分布。",
            "Agent 工具调用需要稳定，通常不希望低概率工具被随机选中。",
            "从工程角度来看，Logits、Softmax 与候选概率不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Logits、Softmax 与候选概率可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Logits、Softmax 与候选概率的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "模型总是选择最高分 Token。",
            "概率高就一定正确。",
            "调采样能解决工具设计问题。",
            "只要模型足够强大，就不需要考虑Logits、Softmax 与候选概率了。"
          ],
          "pitfalls": [
            "高随机性导致工具选择漂移。",
            "没有记录采样参数，结果无法复现。",
            "把概率当成置信度直接用于业务判断。",
            "线上环境缺乏对Logits、Softmax 与候选概率的日志追踪。"
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
              "name": "Logits",
              "summary": "模型对候选 Token 给出的原始分数。",
              "detail": [
                "每一步生成时，模型会为词表中的大量候选 Token 计算一个未归一化分数，这些分数叫 Logits。Logits 只表示相对偏好，不是百分比概率。",
                "后续 Softmax 会把 Logits 转成概率分布。温度参数通常作用于这个分布的锐利程度，而不是改变模型已经学会的知识。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "Softmax",
              "summary": "把一组原始分数转换为总和为 1 的概率分布。",
              "detail": [
                "Softmax 会放大高分候选和低分候选之间的相对差异，使系统能够按概率进行采样。",
                "概率高只表示模型在当前上下文中更倾向于生成它，不等于这个候选在现实世界中一定正确。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "概率与置信度",
              "summary": "模型的下一个 Token 概率，不等于事实正确率。",
              "detail": [
                "模型可能非常流畅地生成错误事实，因此不能把 Token 概率直接当作业务置信度。",
                "关键判断应使用外部证据、规则校验、工具查询或专门的评估方法，而不是只看模型分数。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            }
          ],
          "lab": {
            "title": "Logits、Softmax 与候选概率实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const candidates = [{x:'query_order',s:5},{x:'ask_user',s:3},{x:'create_ticket',s:2}];\nfunction probs(temp){const e=candidates.map(c=>Math.exp(c.s/temp)); const sum=e.reduce((a,b)=>a+b,0); return candidates.map((c,i)=>[c.x,(e[i]/sum).toFixed(3)]);}\nfor (const t of [0.2,0.7,1.2]) console.log('temp',t,probs(t));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Logits、Softmax 与候选概率的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Logits、Softmax 与候选概率就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Logits、Softmax 与候选概率交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Logits、Softmax 与候选概率会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Logits、Softmax 与候选概率 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Logits、Softmax 与候选概率' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "天气助手为什么会逐字生成",
          "scenario": "用户问“明天北京天气如何”，模型不是查完数据库再一次性写完，而是根据上下文逐步选择下一个 Token。",
          "takeaway": "每一步都会受到前文影响，所以错误会沿着上下文继续传播。"
        },
        {
          "title": "把模型当成概率预测器",
          "scenario": "给模型同一句“订单当前状态是”，它可能接着生成“已支付”“处理中”或一段解释。",
          "takeaway": "模型给的是候选分布，不是天然可靠的数据库查询。"
        }
      ],
      "diagram": {
        "title": "从输入到下一个 Token",
        "caption": "理解这条链路后，再学习采样、工具调用和 Agent Loop 会更容易。",
        "nodes": [
          "系统规则 + 用户问题",
          "当前上下文",
          "候选 Token 概率",
          "选择一个 Token",
          "追加回上下文"
        ]
      },
      "order": "1.1",
      "routeFocus": "必学基础",
      "studyFlow": [
        "建立直觉",
        "跑最小实验",
        "用自己的话复述",
        "进入下一章"
      ],
      "goal": "本章围绕LLM 生成机制建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    },
    {
      "id": "context",
      "title": "第 2 章：上下文窗口与调用参数",
      "lessons": [
        {
          "id": "context-window",
          "title": "上下文窗口",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "上下文窗口变大，是否就不需要记忆和摘要？",
              "a": "不是。窗口仍是有限预算，长上下文有成本、噪声和注意力稀释问题；记忆负责跨轮保存，摘要负责压缩当前轨迹。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "上下文窗口是 Agent 的工作记忆容量，决定一次调用能看到多少规则、历史、工具和证据。",
          "definition": "上下文窗口是模型一次调用中输入和输出可使用的 Token 总预算。",
          "explanation": [
            "上下文窗口包括系统提示词、用户输入、历史消息、工具 Schema、工具结果、RAG 证据和输出预算。",
            "标称窗口不等于业务可用内容，因为系统规则和工具定义会占掉大量空间。",
            "长任务需要摘要、检索、状态结构化和外部记忆共同管理上下文。",
            "从工程角度来看，上下文窗口不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理上下文窗口可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保上下文窗口的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "窗口大就不用做记忆。",
            "输出不占窗口。",
            "把所有材料塞进去最安全。",
            "只要模型足够强大，就不需要考虑上下文窗口了。"
          ],
          "pitfalls": [
            "Top-K 过大导致噪声挤掉关键信息。",
            "工具结果原样回填。",
            "历史不摘要导致任务目标丢失。",
            "线上环境缺乏对上下文窗口的日志追踪。"
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
              "name": "Context Window / 上下文窗口",
              "summary": "一次模型调用能够处理的输入和输出 Token 总容量。",
              "detail": [
                "上下文窗口可以理解为模型这一轮能看到的工作台，系统规则、用户问题、历史消息、工具描述、工具结果、检索证据和输出都要放在其中。",
                "窗口越大不代表应该无条件塞入更多材料。噪声会稀释重要信息，输入变大还会增加成本和延迟。",
                "工程上要为不同内容设置预算和优先级，并在接近上限时摘要、裁剪或重新检索。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "输入预算与输出预算",
              "summary": "为上下文材料和模型回答分别预留容量。",
              "detail": [
                "输入预算控制这一轮送给模型的材料，输出预算控制模型最多生成多少内容。输出预留过小可能截断，过大则可能增加成本和等待时间。",
                "Agent 通常需要优先保留系统规则、当前状态和高可信证据，再考虑完整历史和低相关检索结果。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "上下文污染",
              "summary": "无关、冲突或错误信息进入上下文并影响后续决策。",
              "detail": [
                "污染可能来自过期历史、错误工具结果、恶意文档、重复检索片段或互相冲突的指令。它会让模型在语言上继续连贯，但在任务上逐渐偏离。",
                "解决方式包括信息分区、来源标注、状态校验、证据筛选、摘要纠错和明确的停止条件。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            }
          ],
          "lab": {
            "title": "上下文窗口实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const parts = { system: 600, tools: 1400, history: 2200, rag: 2800, output: 1200 };\nconst limit = 8192;\nconst used = Object.values(parts).reduce((a,b)=>a+b,0);\nconsole.table(parts);\nconsole.log('used=' + used + ', remaining=' + (limit-used));\nconsole.log(used > limit ? '超限，需要压缩' : '可以调用');"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于上下文窗口的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：上下文窗口就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与上下文窗口交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，上下文窗口会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 上下文窗口 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示上下文窗口' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "sampling",
          "title": "Temperature、Top-p 与稳定性",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "Temperature 和 Top-p 的区别是什么？生产 Agent 怎么设？",
              "a": "Temperature 调整分布尖锐程度，Top-p 截断候选集合；分类和工具调用偏低随机性，但稳定性仍靠 Schema、权限和测试。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "不同 Agent 子任务对稳定性要求不同，工具调用和结构化输出通常要低随机性。",
          "definition": "采样参数控制模型从候选 Token 概率分布中选择输出的随机程度。",
          "explanation": [
            "Temperature 越低，高概率候选越突出，输出更稳定。",
            "Top-p 限制候选集合，只从累计概率范围内采样。",
            "稳定任务应降低随机性，但安全仍要靠 Schema、权限和运行时校验。",
            "从工程角度来看，Temperature、Top-p 与稳定性不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Temperature、Top-p 与稳定性可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Temperature、Top-p 与稳定性的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "Temperature=0 就绝对确定。",
            "所有任务用同一参数。",
            "采样参数可以替代校验。",
            "只要模型足够强大，就不需要考虑Temperature、Top-p 与稳定性了。"
          ],
          "pitfalls": [
            "高随机性用于工具调用。",
            "没有把模型参数写入实验记录。",
            "用创意参数做分类任务。",
            "线上环境缺乏对Temperature、Top-p 与稳定性的日志追踪。"
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
              "name": "Temperature",
              "summary": "调节概率分布尖锐程度的采样参数。",
              "detail": [
                "Temperature 较低时，高概率候选更突出，输出通常更稳定；Temperature 较高时，更多候选有机会被采样，表达可能更发散。",
                "它只影响生成选择，不会增加模型知识，也不能替代 Schema、权限校验或事实核验。分类、工具选择和 JSON 输出通常需要更稳定的设置；创意写作可以适当放宽。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "Top-p / Nucleus Sampling",
              "summary": "只在累计概率达到 p 的候选集合中采样。",
              "detail": [
                "系统先按概率从高到低排列候选 Token，再取累计概率达到 p 的最小集合，最后只从这个集合里采样。p 越小，候选池通常越窄。",
                "Top-p 和 Temperature 都会改变随机性，但含义不同：Temperature 调整分布，Top-p 截断候选集合。不要在没有评估的情况下同时大幅调整两者。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "稳定性",
              "summary": "相同任务在多次运行中保持可接受一致性的程度。",
              "detail": [
                "稳定不等于永远输出同一句话，而是分类、工具选择、字段结构和关键约束不应无故漂移。",
                "稳定性来自采样参数、清晰 Prompt、结构化输出、校验、有限重试和确定性运行时的组合，而不是只把 Temperature 调到最低。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            }
          ],
          "lab": {
            "title": "Temperature、Top-p 与稳定性实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const candidates = [{x:'query_order',s:5},{x:'ask_user',s:3},{x:'create_ticket',s:2}];\nfunction probs(temp){const e=candidates.map(c=>Math.exp(c.s/temp)); const sum=e.reduce((a,b)=>a+b,0); return candidates.map((c,i)=>[c.x,(e[i]/sum).toFixed(3)]);}\nfor (const t of [0.2,0.7,1.2]) console.log('temp',t,probs(t));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Temperature、Top-p 与稳定性的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Temperature、Top-p 与稳定性就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Temperature、Top-p 与稳定性交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Temperature、Top-p 与稳定性会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Temperature、Top-p 与稳定性 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Temperature、Top-p 与稳定性' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "model-boundaries",
          "title": "模型能力边界",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "知道 LLM 擅长和不擅长什么，才能决定哪些交给模型，哪些交给代码和工具。",
          "definition": "模型能力边界是指 LLM 在推理、生成、记忆、事实性、数学和执行能力上的限制。",
          "explanation": [
            "LLM 擅长语言理解、摘要、分类、生成和模糊推理。",
            "LLM 不擅长可靠执行、精确计算、权限判断、状态持久化和事实保证。",
            "Agent 架构要把模型放在推理和决策位置，把执行、校验和存储交给确定性系统。",
            "从工程角度来看，模型能力边界不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理模型能力边界可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保模型能力边界的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "模型越强越不需要工具。",
            "模型可以可靠记住所有状态。",
            "模型能直接保证事实正确。",
            "只要模型足够强大，就不需要考虑模型能力边界了。"
          ],
          "pitfalls": [
            "让模型判断权限。",
            "让模型记住数据库状态。",
            "用自然语言代替状态机。",
            "线上环境缺乏对模型能力边界的日志追踪。"
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
              "name": "能力边界",
              "summary": "模型能力边界是指 LLM 在推理、生成、记忆、事实性、数学和执行能力上的限制。",
              "detail": [
                "先建立层级直觉：能力边界是“模型能力边界”中的一个关键概念。模型能力边界是指 LLM 在推理、生成、记忆、事实性、数学和执行能力上的限制。",
                "LLM 擅长语言理解、摘要、分类、生成和模糊推理。",
                "在 Agent 系统中，能力边界不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型越强越不需要工具。。工程坑点：让模型判断权限。。"
              ]
            },
            {
              "name": "确定性任务",
              "summary": "理解确定性任务：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：确定性任务是“模型能力边界”中的一个关键概念。模型能力边界是指 LLM 在推理、生成、记忆、事实性、数学和执行能力上的限制。",
                "LLM 不擅长可靠执行、精确计算、权限判断、状态持久化和事实保证。",
                "在 Agent 系统中，确定性任务不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型可以可靠记住所有状态。。工程坑点：让模型记住数据库状态。。"
              ]
            },
            {
              "name": "外部工具与事实",
              "summary": "理解外部工具与事实：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：外部工具与事实是“模型能力边界”中的一个关键概念。模型能力边界是指 LLM 在推理、生成、记忆、事实性、数学和执行能力上的限制。",
                "Agent 架构要把模型放在推理和决策位置，把执行、校验和存储交给确定性系统。",
                "在 Agent 系统中，外部工具与事实不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型能直接保证事实正确。。工程坑点：用自然语言代替状态机。。"
              ]
            },
            {
              "name": "模型与代码分工",
              "summary": "理解模型与代码分工：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：模型与代码分工是“模型能力边界”中的一个关键概念。模型能力边界是指 LLM 在推理、生成、记忆、事实性、数学和执行能力上的限制。",
                "LLM 擅长语言理解、摘要、分类、生成和模糊推理。",
                "在 Agent 系统中，模型与代码分工不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型越强越不需要工具。。工程坑点：让模型判断权限。。"
              ]
            }
          ],
          "lab": {
            "title": "模型能力边界实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const prompt = {\n  role: '你是客服工单分类专家',\n  task: '判断用户反馈类别',\n  context: '类别只能是 PAYMENT, LOGISTICS, AFTER_SALE, ACCOUNT',\n  format: '{ category, priority, reason }',\n  constraints: ['不确定时返回 NEED_MORE_INFO']\n};\nconsole.log(JSON.stringify(prompt,null,2));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于模型能力边界的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：模型能力边界就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与模型能力边界交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，模型能力边界会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 模型能力边界 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示模型能力边界' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "为什么第 10 轮开始忘记目标",
          "scenario": "Agent 前面已经累积了工具 Schema、历史对话、长篇日志和 RAG 片段，真正重要的任务目标被挤到了边缘。",
          "takeaway": "上下文窗口是有限工作台，需要预算、摘要和状态管理。"
        },
        {
          "title": "一次调用的预算账单",
          "scenario": "系统规则 600 Token、工具定义 1400 Token、历史 2200 Token、检索证据 2800 Token，输出只剩很少空间。",
          "takeaway": "看到总预算，才能解释为什么需要裁剪低价值信息。"
        }
      ],
      "diagram": {
        "title": "Agent 一次调用看到什么",
        "caption": "输出预算也属于上下文预算，不是额外空间。",
        "nodes": [
          "系统规则",
          "用户任务",
          "当前状态",
          "工具定义",
          "RAG 证据",
          "输出预算"
        ]
      },
      "order": "1.2",
      "routeFocus": "必学基础",
      "studyFlow": [
        "建立直觉",
        "跑最小实验",
        "用自己的话复述",
        "进入下一章"
      ],
      "goal": "本章围绕上下文窗口与调用参数建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    }
  ],
  "routeIndex": 1,
  "routeFocus": "必学基础",
  "studyFlow": [
    "建立直觉",
    "跑最小实验",
    "用自己的话复述",
    "进入下一章"
  ]
};