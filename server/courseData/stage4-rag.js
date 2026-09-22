export const stage4 = {
  "id": "rag-vector",
  "title": "阶段四：RAG 与向量检索",
  "goal": "系统掌握外部知识注入、检索质量、向量数据库和混合检索。",
  "chapters": [
    {
      "id": "rag-pipeline",
      "title": "第 7 章：RAG 基础链路",
      "lessons": [
        {
          "id": "rag-overview",
          "title": "RAG 全链路",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "RAG 为什么不是简单的向量搜索？",
              "a": "还包括解析、切分、Embedding、过滤、召回、重排、压缩、引用和拒答；要区分检索错与生成错。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "RAG 不是向量库加 Prompt，而是一条从文档到证据再到答案的工程链路。",
          "definition": "RAG 是先检索外部证据，再让模型基于证据生成答案的模式。",
          "explanation": [
            "完整链路包括解析、清洗、切分、Embedding、索引、查询改写、召回、过滤、重排、压缩、生成和引用校验。",
            "任何一环出错都会影响最终答案。",
            "生产级 RAG 必须有拒答机制，检索不到证据时不能凭空回答。",
            "从工程角度来看，RAG 全链路不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理RAG 全链路可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保RAG 全链路的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "用了向量数据库就是 RAG。",
            "Top-K 越大越好。",
            "检索到相似内容就能回答。",
            "只要模型足够强大，就不需要考虑RAG 全链路了。"
          ],
          "pitfalls": [
            "证据噪声过多。",
            "引用和答案不匹配。",
            "没有权限过滤。",
            "线上环境缺乏对RAG 全链路的日志追踪。"
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
              "name": "离线索引链路",
              "summary": "RAG 是先检索外部证据，再让模型基于证据生成答案的模式。",
              "detail": [
                "先建立层级直觉：离线索引链路是“RAG 全链路”中的一个关键概念。RAG 是先检索外部证据，再让模型基于证据生成答案的模式。",
                "完整链路包括解析、清洗、切分、Embedding、索引、查询改写、召回、过滤、重排、压缩、生成和引用校验。",
                "在 Agent 系统中，离线索引链路不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：用了向量数据库就是 RAG。。工程坑点：证据噪声过多。。"
              ]
            },
            {
              "name": "在线查询链路",
              "summary": "理解在线查询链路：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：在线查询链路是“RAG 全链路”中的一个关键概念。RAG 是先检索外部证据，再让模型基于证据生成答案的模式。",
                "任何一环出错都会影响最终答案。",
                "在 Agent 系统中，在线查询链路不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Top-K 越大越好。。工程坑点：引用和答案不匹配。。"
              ]
            },
            {
              "name": "证据",
              "summary": "理解证据：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：证据是“RAG 全链路”中的一个关键概念。RAG 是先检索外部证据，再让模型基于证据生成答案的模式。",
                "生产级 RAG 必须有拒答机制，检索不到证据时不能凭空回答。",
                "在 Agent 系统中，证据不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：检索到相似内容就能回答。。工程坑点：没有权限过滤。。"
              ]
            },
            {
              "name": "拒答",
              "summary": "理解拒答：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：拒答是“RAG 全链路”中的一个关键概念。RAG 是先检索外部证据，再让模型基于证据生成答案的模式。",
                "完整链路包括解析、清洗、切分、Embedding、索引、查询改写、召回、过滤、重排、压缩、生成和引用校验。",
                "在 Agent 系统中，拒答不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：用了向量数据库就是 RAG。。工程坑点：证据噪声过多。。"
              ]
            }
          ],
          "lab": {
            "title": "RAG 全链路实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const docs = ['Tool Calling 需要权限控制','RAG 需要检索和重排','Agent Loop 需要停止条件'];\nconst q = 'RAG 为什么需要重排';\nconst ranked = docs.map(d=>({d, score:q.split('').filter(ch=>d.includes(ch)).length})).sort((a,b)=>b.score-a.score);\nconsole.log(ranked);"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于RAG 全链路的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：RAG 全链路就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与RAG 全链路交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，RAG 全链路会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 RAG 全链路 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示RAG 全链路' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "parsing-cleaning",
          "title": "文档解析与清洗",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "进入索引前的文档质量决定检索上限。",
          "definition": "文档解析与清洗是从 PDF、HTML、Markdown、表格等原始材料中提取可检索文本和结构的过程。",
          "explanation": [
            "解析要保留标题、层级、表格、代码块和来源信息。",
            "清洗要去掉导航、页脚、重复模板和无意义字符。",
            "多模态文档还需要 OCR、图片说明或表格结构化。",
            "从工程角度来看，文档解析与清洗不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理文档解析与清洗可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保文档解析与清洗的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "直接提取纯文本就够。",
            "页眉页脚不会影响检索。",
            "表格可以当普通段落。",
            "只要模型足够强大，就不需要考虑文档解析与清洗了。"
          ],
          "pitfalls": [
            "表格列关系丢失。",
            "代码块被破坏。",
            "来源 URL 丢失。",
            "线上环境缺乏对文档解析与清洗的日志追踪。"
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
              "name": "文档解析",
              "summary": "文档解析与清洗是从 PDF、HTML、Markdown、表格等原始材料中提取可检索文本和结构的过程。",
              "detail": [
                "先建立层级直觉：文档解析是“文档解析与清洗”中的一个关键概念。文档解析与清洗是从 PDF、HTML、Markdown、表格等原始材料中提取可检索文本和结构的过程。",
                "解析要保留标题、层级、表格、代码块和来源信息。",
                "在 Agent 系统中，文档解析不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：直接提取纯文本就够。。工程坑点：表格列关系丢失。。"
              ]
            },
            {
              "name": "结构保留",
              "summary": "理解结构保留：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：结构保留是“文档解析与清洗”中的一个关键概念。文档解析与清洗是从 PDF、HTML、Markdown、表格等原始材料中提取可检索文本和结构的过程。",
                "清洗要去掉导航、页脚、重复模板和无意义字符。",
                "在 Agent 系统中，结构保留不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：页眉页脚不会影响检索。。工程坑点：代码块被破坏。。"
              ]
            },
            {
              "name": "清洗",
              "summary": "理解清洗：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：清洗是“文档解析与清洗”中的一个关键概念。文档解析与清洗是从 PDF、HTML、Markdown、表格等原始材料中提取可检索文本和结构的过程。",
                "多模态文档还需要 OCR、图片说明或表格结构化。",
                "在 Agent 系统中，清洗不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：表格可以当普通段落。。工程坑点：来源 URL 丢失。。"
              ]
            },
            {
              "name": "来源元数据",
              "summary": "理解来源元数据：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：来源元数据是“文档解析与清洗”中的一个关键概念。文档解析与清洗是从 PDF、HTML、Markdown、表格等原始材料中提取可检索文本和结构的过程。",
                "解析要保留标题、层级、表格、代码块和来源信息。",
                "在 Agent 系统中，来源元数据不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：直接提取纯文本就够。。工程坑点：表格列关系丢失。。"
              ]
            }
          ],
          "lab": {
            "title": "文档解析与清洗实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const raw='导航 | 标题: Tool Calling | 正文: 工具需要权限 | 页脚';\nconst cleaned=raw.replace('导航 | ','').replace(' | 页脚','');\nconsole.log(cleaned);"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于文档解析与清洗的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：文档解析与清洗就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与文档解析与清洗交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，文档解析与清洗会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 文档解析与清洗 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示文档解析与清洗' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "chunking",
          "title": "Chunking 策略",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "切分决定知识进入索引的最小单位，切错后面很难补救。",
          "definition": "Chunking 是把文档拆成适合检索和放入上下文的片段。",
          "explanation": [
            "固定长度切分简单但可能破坏结构。",
            "按标题和段落切分更保留语义。",
            "Chunk 大小、overlap 和 metadata 要结合文档类型设计。",
            "从工程角度来看，Chunking 策略不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Chunking 策略可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Chunking 策略的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "统一 500 字即可。",
            "Overlap 越大越好。",
            "切分和权限无关。",
            "只要模型足够强大，就不需要考虑Chunking 策略了。"
          ],
          "pitfalls": [
            "代码块截断。",
            "标题上下文丢失。",
            "Chunk 过小无法回答。",
            "线上环境缺乏对Chunking 策略的日志追踪。"
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
              "name": "Chunk",
              "summary": "Chunking 是把文档拆成适合检索和放入上下文的片段。",
              "detail": [
                "先建立层级直觉：Chunk是“Chunking 策略”中的一个关键概念。Chunking 是把文档拆成适合检索和放入上下文的片段。",
                "固定长度切分简单但可能破坏结构。",
                "在 Agent 系统中，Chunk不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：统一 500 字即可。。工程坑点：代码块截断。。"
              ]
            },
            {
              "name": "Overlap",
              "summary": "理解Overlap：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Overlap是“Chunking 策略”中的一个关键概念。Chunking 是把文档拆成适合检索和放入上下文的片段。",
                "按标题和段落切分更保留语义。",
                "在 Agent 系统中，Overlap不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Overlap 越大越好。。工程坑点：标题上下文丢失。。"
              ]
            },
            {
              "name": "语义边界",
              "summary": "理解语义边界：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：语义边界是“Chunking 策略”中的一个关键概念。Chunking 是把文档拆成适合检索和放入上下文的片段。",
                "Chunk 大小、overlap 和 metadata 要结合文档类型设计。",
                "在 Agent 系统中，语义边界不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：切分和权限无关。。工程坑点：Chunk 过小无法回答。。"
              ]
            },
            {
              "name": "Metadata",
              "summary": "理解Metadata：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Metadata是“Chunking 策略”中的一个关键概念。Chunking 是把文档拆成适合检索和放入上下文的片段。",
                "固定长度切分简单但可能破坏结构。",
                "在 Agent 系统中，Metadata不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：统一 500 字即可。。工程坑点：代码块截断。。"
              ]
            }
          ],
          "lab": {
            "title": "Chunking 策略实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const text = 'Agent 需要工具调用。工具调用需要参数校验。参数校验之后还需要权限控制。';\nfunction chunk(size, overlap){ const out=[]; for(let i=0;i<text.length;i+=size-overlap) out.push(text.slice(i,i+size)); return out; }\nconsole.log(chunk(24,6));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Chunking 策略的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Chunking 策略就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Chunking 策略交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Chunking 策略会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Chunking 策略 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Chunking 策略' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "为什么上传 PDF 不等于完成 RAG",
          "scenario": "PDF 可能有页眉、目录、表格和代码块；如果解析和切分错误，向量检索得到的就是残缺证据。",
          "takeaway": "RAG 的上限首先由数据处理质量决定。"
        },
        {
          "title": "检索不到时应该拒答",
          "scenario": "用户问一个知识库没有覆盖的内部政策，系统应说“没有找到依据”，而不是凭模型记忆补全。",
          "takeaway": "拒答是可靠 RAG 的一部分，不是失败体验。"
        }
      ],
      "diagram": {
        "title": "RAG 从文档到答案",
        "caption": "答案质量取决于每一环，而不是只取决于模型。",
        "nodes": [
          "解析清洗",
          "切分 + 元数据",
          "Embedding 建索引",
          "召回 / 过滤",
          "重排 / 压缩",
          "带引用生成"
        ]
      },
      "order": "4.1",
      "routeFocus": "架构判断",
      "studyFlow": [
        "区分自由度",
        "设计状态",
        "处理恢复",
        "交付 V4"
      ],
      "goal": "本章围绕RAG 基础链路建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    },
    {
      "id": "retrieval",
      "title": "第 8 章：检索、Embedding 与重排",
      "lessons": [
        {
          "id": "embedding",
          "title": "Embedding",
          "level": "基础",
          "focus": "必学",
          "interview": [
            {
              "q": "Embedding 模型和向量数据库分别解决什么问题？",
              "a": "Embedding 把文本映射到语义空间，向量数据库负责存储、索引和近似最近邻查询；模型更换通常带来重嵌入。"
            }
          ],
          "estimatedMinutes": 35,
          "why": "Embedding 决定文本如何进入向量空间，是语义检索的基础。",
          "definition": "Embedding 是把文本、图片等内容编码成向量，使语义相近内容在向量空间中距离更近。",
          "explanation": [
            "不同 Embedding 模型的语言能力、维度、成本和领域适配不同。",
            "同一索引中应使用同一模型和维度。",
            "模型更换通常意味着重嵌入和重建索引。",
            "从工程角度来看，Embedding不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Embedding可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Embedding的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "维度越高越好。",
            "不同模型向量可以混用。",
            "Embedding 能理解所有业务术语。",
            "只要模型足够强大，就不需要考虑Embedding了。"
          ],
          "pitfalls": [
            "模型升级未重建索引。",
            "中英文能力不匹配。",
            "专有名词召回差。",
            "线上环境缺乏对Embedding的日志追踪。"
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
              "name": "向量表示",
              "summary": "Embedding 是把文本、图片等内容编码成向量，使语义相近内容在向量空间中距离更近。",
              "detail": [
                "先建立层级直觉：向量表示是“Embedding”中的一个关键概念。Embedding 是把文本、图片等内容编码成向量，使语义相近内容在向量空间中距离更近。",
                "不同 Embedding 模型的语言能力、维度、成本和领域适配不同。",
                "在 Agent 系统中，向量表示不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：维度越高越好。。工程坑点：模型升级未重建索引。。"
              ]
            },
            {
              "name": "维度",
              "summary": "理解维度：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：维度是“Embedding”中的一个关键概念。Embedding 是把文本、图片等内容编码成向量，使语义相近内容在向量空间中距离更近。",
                "同一索引中应使用同一模型和维度。",
                "在 Agent 系统中，维度不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：不同模型向量可以混用。。工程坑点：中英文能力不匹配。。"
              ]
            },
            {
              "name": "距离函数",
              "summary": "理解距离函数：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：距离函数是“Embedding”中的一个关键概念。Embedding 是把文本、图片等内容编码成向量，使语义相近内容在向量空间中距离更近。",
                "模型更换通常意味着重嵌入和重建索引。",
                "在 Agent 系统中，距离函数不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Embedding 能理解所有业务术语。。工程坑点：专有名词召回差。。"
              ]
            },
            {
              "name": "重嵌入",
              "summary": "理解重嵌入：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：重嵌入是“Embedding”中的一个关键概念。Embedding 是把文本、图片等内容编码成向量，使语义相近内容在向量空间中距离更近。",
                "不同 Embedding 模型的语言能力、维度、成本和领域适配不同。",
                "在 Agent 系统中，重嵌入不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：维度越高越好。。工程坑点：模型升级未重建索引。。"
              ]
            }
          ],
          "lab": {
            "title": "Embedding实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const a=[1,0], b=[0.8,0.2];\nfunction dot(x,y){return x.reduce((s,v,i)=>s+v*y[i],0)}\nconsole.log('similarity',dot(a,b));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Embedding的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Embedding就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Embedding交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Embedding会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Embedding 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Embedding' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "hybrid",
          "title": "混合检索",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "关键词检索和向量检索互补，生产 RAG 很少只靠一种召回。",
          "definition": "混合检索通常结合 BM25 关键词召回和向量语义召回。",
          "explanation": [
            "BM25 擅长错误码、专有名词、精确词。",
            "向量检索擅长同义表达和语义相似。",
            "融合分数需要归一化，不能简单把不同尺度分数相加。",
            "从工程角度来看，混合检索不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理混合检索可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保混合检索的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "向量能替代关键词。",
            "分数可以直接相加。",
            "Hybrid 一定更慢不可用。",
            "只要模型足够强大，就不需要考虑混合检索了。"
          ],
          "pitfalls": [
            "候选去重缺失。",
            "权重无评估。",
            "过滤在召回后导致结果不足。",
            "线上环境缺乏对混合检索的日志追踪。"
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
              "name": "BM25",
              "summary": "关键词检索的经典相关性评分算法，不是某个软件。",
              "detail": [
                "BM25 会根据查询词是否命中、词在当前文档中出现多少次、词在整个文档集合中有多稀有，以及文档长度，给每篇文档计算相关性分数。它的输出是一个分数和排序。",
                "它通常依赖分词结果、倒排索引和统计信息：倒排索引告诉系统某个词出现在哪些文档，统计信息告诉系统词频、文档频率、文档长度和平均长度。",
                "BM25 本身不依赖 GPU，也不是数据库。Lucene 实现了 BM25，Elasticsearch 和 OpenSearch 基于 Lucene 提供搜索服务；Python 或 Node.js 库也可以实现这套算法。",
                "它很擅长错误码、产品型号、专有名词和用户明确输入的关键词，但不擅长理解完全不同措辞的语义相似。中文效果还取决于分词器、同义词和停用词配置。"
              ]
            },
            {
              "name": "倒排索引",
              "summary": "从词反查文档的索引结构。",
              "detail": [
                "它保存“词 → 包含这个词的文档列表”，查询时先找到候选，再计算相关性。",
                "BM25 解决评分问题，倒排索引解决快速找候选问题，两者不是同一个层级。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "向量检索",
              "summary": "用向量距离寻找语义相近内容。",
              "detail": [
                "Embedding 模型先把文本变成向量，查询和文档在向量空间中比较距离或相似度。它能处理同义表达，但可能忽略错误码、编号和精确字符串。",
                "向量分数和 BM25 分数通常不在同一尺度，融合前需要归一化或使用经过评估的融合方法。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            },
            {
              "name": "Hybrid Search",
              "summary": "把关键词和向量两路召回合并。",
              "detail": [
                "常见流程是分别用 BM25 和向量检索取候选，按文档 ID 去重，再融合排序或交给 Rerank。它不是一个固定软件，而是一种检索架构。",
                "混合检索不是无条件更好：它会增加索引、调参和评估成本，需要用真实查询集比较召回率、延迟和答案质量。",
                "它不是孤立能力：需要和权限、校验、状态管理、观测及评估一起构成可靠链路。",
                "学习判断：能够用自己的话解释它，写出一个最小例子，并说出至少一个不适用场景。"
              ]
            }
          ],
          "lab": {
            "title": "混合检索实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const docs=[{id:1,bm25:9,vec:.6},{id:2,bm25:2,vec:.95}];\nconst max=Math.max(...docs.map(d=>d.bm25));\nconsole.log(docs.map(d=>({...d,score:.5*d.bm25/max+.5*d.vec})).sort((a,b)=>b.score-a.score));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于混合检索的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：混合检索就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与混合检索交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，混合检索会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 混合检索 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示混合检索' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "rerank",
          "title": "Rerank",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "语义相似不等于能回答问题，重排能从候选中挑出真正有用的证据。",
          "definition": "Rerank 是对粗召回候选进行更精细 query-document 相关性排序的步骤。",
          "explanation": [
            "向量召回通常快但粗，Rerank 慢但更细。",
            "常见做法是粗召回 30-100 条，再重排出 5-10 条。",
            "Rerank 需要控制成本、延迟和缓存。",
            "从工程角度来看，Rerank不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理Rerank可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保Rerank的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "Rerank 能修复没召回的问题。",
            "候选越少越省。",
            "Rerank 分数等同答案正确率。",
            "只要模型足够强大，就不需要考虑Rerank了。"
          ],
          "pitfalls": [
            "粗召回太少。",
            "重排成本失控。",
            "没有记录重排前后差异。",
            "线上环境缺乏对Rerank的日志追踪。"
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
              "name": "粗召回",
              "summary": "Rerank 是对粗召回候选进行更精细 query-document 相关性排序的步骤。",
              "detail": [
                "先建立层级直觉：粗召回是“Rerank”中的一个关键概念。Rerank 是对粗召回候选进行更精细 query-document 相关性排序的步骤。",
                "向量召回通常快但粗，Rerank 慢但更细。",
                "在 Agent 系统中，粗召回不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Rerank 能修复没召回的问题。。工程坑点：粗召回太少。。"
              ]
            },
            {
              "name": "精排",
              "summary": "理解精排：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：精排是“Rerank”中的一个关键概念。Rerank 是对粗召回候选进行更精细 query-document 相关性排序的步骤。",
                "常见做法是粗召回 30-100 条，再重排出 5-10 条。",
                "在 Agent 系统中，精排不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：候选越少越省。。工程坑点：重排成本失控。。"
              ]
            },
            {
              "name": "候选集",
              "summary": "理解候选集：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：候选集是“Rerank”中的一个关键概念。Rerank 是对粗召回候选进行更精细 query-document 相关性排序的步骤。",
                "Rerank 需要控制成本、延迟和缓存。",
                "在 Agent 系统中，候选集不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Rerank 分数等同答案正确率。。工程坑点：没有记录重排前后差异。。"
              ]
            },
            {
              "name": "延迟与成本",
              "summary": "理解延迟与成本：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：延迟与成本是“Rerank”中的一个关键概念。Rerank 是对粗召回候选进行更精细 query-document 相关性排序的步骤。",
                "向量召回通常快但粗，Rerank 慢但更细。",
                "在 Agent 系统中，延迟与成本不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Rerank 能修复没召回的问题。。工程坑点：粗召回太少。。"
              ]
            }
          ],
          "lab": {
            "title": "Rerank实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const docs = ['Tool Calling 需要权限控制','RAG 需要检索和重排','Agent Loop 需要停止条件'];\nconst q = 'RAG 为什么需要重排';\nconst ranked = docs.map(d=>({d, score:q.split('').filter(ch=>d.includes(ch)).length})).sort((a,b)=>b.score-a.score);\nconsole.log(ranked);"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于Rerank的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：Rerank就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与Rerank交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，Rerank会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 Rerank 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示Rerank' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "错误码搜索为什么需要 BM25",
          "scenario": "用户搜索 ERR_CONNECTION_RESET，关键词检索能精确命中；纯向量检索可能认为相近表达都相关。",
          "takeaway": "关键词负责精确命中，向量负责语义泛化。"
        },
        {
          "title": "Rerank 解决什么问题",
          "scenario": "粗召回找出 50 个候选，重排模型再判断哪 5 个真正回答了当前问题。",
          "takeaway": "重排只能排序已有候选，不能挽救完全没召回的文档。"
        }
      ],
      "diagram": {
        "title": "两阶段检索",
        "caption": "先用便宜方法扩大候选，再用更精细的方法排序。",
        "nodes": [
          "用户查询",
          "BM25 召回",
          "向量召回",
          "候选合并去重",
          "Rerank",
          "最终证据"
        ]
      },
      "order": "4.2",
      "routeFocus": "架构判断",
      "studyFlow": [
        "区分自由度",
        "设计状态",
        "处理恢复",
        "交付 V4"
      ],
      "goal": "本章围绕检索、Embedding 与重排建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    },
    {
      "id": "vector-db",
      "title": "第 9 章：向量数据库与选型",
      "lessons": [
        {
          "id": "ann",
          "title": "ANN、HNSW、IVF 基础",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "理解 ANN 索引才能判断速度、召回和内存的取舍。",
          "definition": "ANN 是近似最近邻搜索，用更少计算换取更快查询，但可能损失召回。",
          "explanation": [
            "精确搜索会比较所有向量，规模大时成本高。",
            "HNSW 用图结构快速导航到近邻。",
            "IVF 先分桶再搜索部分桶，适合通过候选集合减少计算。",
            "从工程角度来看，ANN、HNSW、IVF 基础不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理ANN、HNSW、IVF 基础可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保ANN、HNSW、IVF 基础的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "ANN 结果绝对正确。",
            "索引参数越大越好。",
            "召回率和 Top-K 是一回事。",
            "只要模型足够强大，就不需要考虑ANN、HNSW、IVF 基础了。"
          ],
          "pitfalls": [
            "过滤导致召回下降。",
            "索引重建成本高。",
            "只看延迟不看召回。",
            "线上环境缺乏对ANN、HNSW、IVF 基础的日志追踪。"
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
              "name": "精确最近邻",
              "summary": "ANN 是近似最近邻搜索，用更少计算换取更快查询，但可能损失召回。",
              "detail": [
                "先建立层级直觉：精确最近邻是“ANN、HNSW、IVF 基础”中的一个关键概念。ANN 是近似最近邻搜索，用更少计算换取更快查询，但可能损失召回。",
                "精确搜索会比较所有向量，规模大时成本高。",
                "在 Agent 系统中，精确最近邻不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：ANN 结果绝对正确。。工程坑点：过滤导致召回下降。。"
              ]
            },
            {
              "name": "ANN",
              "summary": "理解ANN：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：ANN是“ANN、HNSW、IVF 基础”中的一个关键概念。ANN 是近似最近邻搜索，用更少计算换取更快查询，但可能损失召回。",
                "HNSW 用图结构快速导航到近邻。",
                "在 Agent 系统中，ANN不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：索引参数越大越好。。工程坑点：索引重建成本高。。"
              ]
            },
            {
              "name": "HNSW",
              "summary": "理解HNSW：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：HNSW是“ANN、HNSW、IVF 基础”中的一个关键概念。ANN 是近似最近邻搜索，用更少计算换取更快查询，但可能损失召回。",
                "IVF 先分桶再搜索部分桶，适合通过候选集合减少计算。",
                "在 Agent 系统中，HNSW不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：召回率和 Top-K 是一回事。。工程坑点：只看延迟不看召回。。"
              ]
            },
            {
              "name": "IVF",
              "summary": "理解IVF：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：IVF是“ANN、HNSW、IVF 基础”中的一个关键概念。ANN 是近似最近邻搜索，用更少计算换取更快查询，但可能损失召回。",
                "精确搜索会比较所有向量，规模大时成本高。",
                "在 Agent 系统中，IVF不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：ANN 结果绝对正确。。工程坑点：过滤导致召回下降。。"
              ]
            }
          ],
          "lab": {
            "title": "ANN、HNSW、IVF 基础实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const exact=['A','B','C','D','E']; const ann=['A','C','F','D','G'];\nconst recall=ann.filter(x=>exact.includes(x)).length/exact.length;\nconsole.log('Recall@5=',recall);"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于ANN、HNSW、IVF 基础的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：ANN、HNSW、IVF 基础就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与ANN、HNSW、IVF 基础交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，ANN、HNSW、IVF 基础会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 ANN、HNSW、IVF 基础 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示ANN、HNSW、IVF 基础' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "engine-selection",
          "title": "pgvector / Qdrant / Elasticsearch / Meilisearch",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "四类引擎代表四种系统取舍，要能按场景选择。",
          "definition": "向量检索引擎负责向量存储、索引、相似度查询，并常结合过滤和关键词搜索。",
          "explanation": [
            "pgvector 适合已有 Postgres 和强关系数据场景。",
            "Qdrant 是专用向量库，向量检索和 payload 过滤能力更专门化。",
            "Elasticsearch 强在搜索生态和 BM25，Meilisearch 强在易用和低运维。",
            "从工程角度来看，pgvector / Qdrant / Elasticsearch / Meilisearch不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理pgvector / Qdrant / Elasticsearch / Meilisearch可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保pgvector / Qdrant / Elasticsearch / Meilisearch的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "RAG 必须用专用向量库。",
            "向量库越快越适合。",
            "Meilisearch 只适合玩具项目。",
            "只要模型足够强大，就不需要考虑pgvector / Qdrant / Elasticsearch / Meilisearch了。"
          ],
          "pitfalls": [
            "多租户过滤未评估。",
            "写入更新成本忽略。",
            "混合检索能力不匹配。",
            "线上环境缺乏对pgvector / Qdrant / Elasticsearch / Meilisearch的日志追踪。"
          ],
          "compare": [
            [
              "引擎",
              "形态",
              "优势",
              "适合"
            ],
            [
              "pgvector",
              "关系库扩展",
              "事务/SQL/业务数据近",
              "已有 Postgres SaaS"
            ],
            [
              "Qdrant",
              "专用向量库",
              "向量和过滤专门化",
              "独立 RAG 服务"
            ],
            [
              "Elasticsearch",
              "搜索平台",
              "BM25 和复杂查询",
              "搜索业务增强"
            ],
            [
              "Meilisearch",
              "易用搜索",
              "低运维快速上线",
              "中小规模知识搜索"
            ]
          ],
          "terms": [
            {
              "name": "pgvector",
              "summary": "向量检索引擎负责向量存储、索引、相似度查询，并常结合过滤和关键词搜索。",
              "detail": [
                "先建立层级直觉：pgvector是“pgvector / Qdrant / Elasticsearch / Meilisearch”中的一个关键概念。向量检索引擎负责向量存储、索引、相似度查询，并常结合过滤和关键词搜索。",
                "pgvector 适合已有 Postgres 和强关系数据场景。",
                "在 Agent 系统中，pgvector不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：RAG 必须用专用向量库。。工程坑点：多租户过滤未评估。。"
              ]
            },
            {
              "name": "Qdrant",
              "summary": "理解Qdrant：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Qdrant是“pgvector / Qdrant / Elasticsearch / Meilisearch”中的一个关键概念。向量检索引擎负责向量存储、索引、相似度查询，并常结合过滤和关键词搜索。",
                "Qdrant 是专用向量库，向量检索和 payload 过滤能力更专门化。",
                "在 Agent 系统中，Qdrant不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：向量库越快越适合。。工程坑点：写入更新成本忽略。。"
              ]
            },
            {
              "name": "Elasticsearch",
              "summary": "理解Elasticsearch：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Elasticsearch是“pgvector / Qdrant / Elasticsearch / Meilisearch”中的一个关键概念。向量检索引擎负责向量存储、索引、相似度查询，并常结合过滤和关键词搜索。",
                "Elasticsearch 强在搜索生态和 BM25，Meilisearch 强在易用和低运维。",
                "在 Agent 系统中，Elasticsearch不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：Meilisearch 只适合玩具项目。。工程坑点：混合检索能力不匹配。。"
              ]
            },
            {
              "name": "Meilisearch",
              "summary": "理解Meilisearch：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Meilisearch是“pgvector / Qdrant / Elasticsearch / Meilisearch”中的一个关键概念。向量检索引擎负责向量存储、索引、相似度查询，并常结合过滤和关键词搜索。",
                "pgvector 适合已有 Postgres 和强关系数据场景。",
                "在 Agent 系统中，Meilisearch不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：RAG 必须用专用向量库。。工程坑点：多租户过滤未评估。。"
              ]
            }
          ],
          "lab": {
            "title": "pgvector / Qdrant / Elasticsearch / Meilisearch实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "function choose(x){ if(x.hasPostgres&&!x.large)return 'pgvector'; if(x.needsBM25)return 'Elasticsearch'; if(x.lowOps)return 'Meilisearch'; return 'Qdrant';}\nconsole.log(choose({hasPostgres:true,large:false}));"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于pgvector / Qdrant / Elasticsearch / Meilisearch的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：pgvector / Qdrant / Elasticsearch / Meilisearch就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与pgvector / Qdrant / Elasticsearch / Meilisearch交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，pgvector / Qdrant / Elasticsearch / Meilisearch会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 pgvector / Qdrant / Elasticsearch / Meilisearch 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示pgvector / Qdrant / Elasticsearch / Meilisearch' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "filtering-recall",
          "title": "过滤与召回率",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "过滤条件常常是向量检索工程里最容易踩坑的地方。",
          "definition": "过滤与向量搜索的结合方式包括 pre-filter、post-filter 和索引级 filterable。",
          "explanation": [
            "Pre-filter 先缩小候选集合，可能导致向量索引可用性变化。",
            "Post-filter 先向量召回再过滤，可能结果数量不足。",
            "多租户、权限、分类过滤都必须评估召回变化。",
            "从工程角度来看，过滤与召回率不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理过滤与召回率可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保过滤与召回率的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "过滤只是 SQL where。",
            "过滤不会影响召回。",
            "先向量后过滤总是最快。",
            "只要模型足够强大，就不需要考虑过滤与召回率了。"
          ],
          "pitfalls": [
            "小租户数据太少。",
            "过滤后 Top-K 不足。",
            "权限过滤放在生成后才做。",
            "线上环境缺乏对过滤与召回率的日志追踪。"
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
              "name": "Pre-filter",
              "summary": "过滤与向量搜索的结合方式包括 pre-filter、post-filter 和索引级 filterable。",
              "detail": [
                "先建立层级直觉：Pre-filter是“过滤与召回率”中的一个关键概念。过滤与向量搜索的结合方式包括 pre-filter、post-filter 和索引级 filterable。",
                "Pre-filter 先缩小候选集合，可能导致向量索引可用性变化。",
                "在 Agent 系统中，Pre-filter不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：过滤只是 SQL where。。工程坑点：小租户数据太少。。"
              ]
            },
            {
              "name": "Post-filter",
              "summary": "理解Post-filter：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Post-filter是“过滤与召回率”中的一个关键概念。过滤与向量搜索的结合方式包括 pre-filter、post-filter 和索引级 filterable。",
                "Post-filter 先向量召回再过滤，可能结果数量不足。",
                "在 Agent 系统中，Post-filter不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：过滤不会影响召回。。工程坑点：过滤后 Top-K 不足。。"
              ]
            },
            {
              "name": "租户隔离",
              "summary": "理解租户隔离：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：租户隔离是“过滤与召回率”中的一个关键概念。过滤与向量搜索的结合方式包括 pre-filter、post-filter 和索引级 filterable。",
                "多租户、权限、分类过滤都必须评估召回变化。",
                "在 Agent 系统中，租户隔离不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：先向量后过滤总是最快。。工程坑点：权限过滤放在生成后才做。。"
              ]
            },
            {
              "name": "Recall@K",
              "summary": "理解Recall@K：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：Recall@K是“过滤与召回率”中的一个关键概念。过滤与向量搜索的结合方式包括 pre-filter、post-filter 和索引级 filterable。",
                "Pre-filter 先缩小候选集合，可能导致向量索引可用性变化。",
                "在 Agent 系统中，Recall@K不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：过滤只是 SQL where。。工程坑点：小租户数据太少。。"
              ]
            }
          ],
          "lab": {
            "title": "过滤与召回率实验",
            "runtime": "javascript",
            "objective": "用最小代码跑通概念，观察输入、状态和输出之间的关系。",
            "starterCode": "const recalled=[{id:1,t:'a'},{id:2,t:'b'},{id:3,t:'a'}];\nconst filtered=recalled.filter(x=>x.t==='b');\nconsole.log('召回数',recalled.length,'过滤后',filtered.length);"
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于过滤与召回率的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：过滤与召回率就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与过滤与召回率交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，过滤与召回率会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 过滤与召回率 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示过滤与召回率' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "四个引擎怎么做第一轮判断",
          "scenario": "已有 Postgres 且强依赖租户过滤，先看 pgvector；搜索体验和 BM25 很重，优先评估 Elasticsearch；专用向量服务则比较 Qdrant。",
          "takeaway": "选型先看约束和已有系统，不要先看单一 benchmark。"
        },
        {
          "title": "过滤为什么会让 Recall@K 下降",
          "scenario": "向量召回了 10 条，但其中 8 条不属于当前租户，post-filter 后只剩 2 条。",
          "takeaway": "过滤方式必须和索引、租户规模一起测试。"
        }
      ],
      "diagram": {
        "title": "向量检索的核心取舍",
        "caption": "速度、召回、过滤和运维复杂度需要一起看。",
        "nodes": [
          "向量数据",
          "精确搜索 / ANN",
          "结构化过滤",
          "候选结果",
          "Recall 与延迟",
          "选型结论"
        ]
      },
      "order": "4.3",
      "routeFocus": "架构判断",
      "studyFlow": [
        "区分自由度",
        "设计状态",
        "处理恢复",
        "交付 V4"
      ],
      "goal": "本章围绕向量数据库与选型建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    }
  ],
  "routeIndex": 4,
  "routeFocus": "架构判断",
  "studyFlow": [
    "区分自由度",
    "设计状态",
    "处理恢复",
    "交付 V4"
  ]
};