export const stage8 = {
  "id": "projects",
  "title": "阶段八：贯穿项目实战",
  "goal": "把知识点串成可交付作品，从订单助手到 RAG Agent 再到生产级 Workflow。",
  "chapters": [
    {
      "id": "project-line",
      "title": "第 17 章：项目主线",
      "lessons": [
        {
          "id": "project-ticket-classifier",
          "title": "项目一：工单分类器",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "用最小项目打通 Prompt、结构化输出、Schema 校验和评估。",
          "definition": "工单分类器把用户反馈映射为类别、优先级、置信度和处理建议。",
          "explanation": [
            "第一版只做结构化输出和校验。",
            "第二版加入失败重试和人工审核。",
            "第三版加入评估集，防止 Prompt 退化。",
            "从工程角度来看，项目一：工单分类器不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理项目一：工单分类器可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保项目一：工单分类器的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "分类器只是 Prompt。",
            "返回 JSON 就完成。",
            "不需要失败样例。",
            "只要模型足够强大，就不需要考虑项目一：工单分类器了。"
          ],
          "pitfalls": [
            "类别边界不清。",
            "置信度滥用。",
            "缺少 NEED_MORE_INFO。",
            "线上环境缺乏对项目一：工单分类器的日志追踪。"
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
              "name": "分类标签",
              "summary": "工单分类器把用户反馈映射为类别、优先级、置信度和处理建议。",
              "detail": [
                "先建立层级直觉：分类标签是“项目一：工单分类器”中的一个关键概念。工单分类器把用户反馈映射为类别、优先级、置信度和处理建议。",
                "第一版只做结构化输出和校验。",
                "在 Agent 系统中，分类标签不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：分类器只是 Prompt。。工程坑点：类别边界不清。。"
              ]
            },
            {
              "name": "置信度",
              "summary": "理解置信度：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：置信度是“项目一：工单分类器”中的一个关键概念。工单分类器把用户反馈映射为类别、优先级、置信度和处理建议。",
                "第二版加入失败重试和人工审核。",
                "在 Agent 系统中，置信度不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：返回 JSON 就完成。。工程坑点：置信度滥用。。"
              ]
            },
            {
              "name": "拒答与补充信息",
              "summary": "理解拒答与补充信息：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：拒答与补充信息是“项目一：工单分类器”中的一个关键概念。工单分类器把用户反馈映射为类别、优先级、置信度和处理建议。",
                "第三版加入评估集，防止 Prompt 退化。",
                "在 Agent 系统中，拒答与补充信息不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：不需要失败样例。。工程坑点：缺少 NEED_MORE_INFO。。"
              ]
            },
            {
              "name": "验收指标",
              "summary": "理解验收指标：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：验收指标是“项目一：工单分类器”中的一个关键概念。工单分类器把用户反馈映射为类别、优先级、置信度和处理建议。",
                "第一版只做结构化输出和校验。",
                "在 Agent 系统中，验收指标不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：分类器只是 Prompt。。工程坑点：类别边界不清。。"
              ]
            }
          ],
          "lab": {
            "title": "项目一：工单分类器实验",
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于项目一：工单分类器的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：项目一：工单分类器就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与项目一：工单分类器交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，项目一：工单分类器会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 项目一：工单分类器 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示项目一：工单分类器' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "project-order-agent",
          "title": "项目二：订单助手 Agent",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "订单助手能串起工具调用、权限、高风险确认和 Agent Loop。",
          "definition": "订单助手根据用户诉求查询订单、判断异常、必要时创建工单或请求确认。",
          "explanation": [
            "它需要分类用户诉求，调用订单和退款工具，处理工具错误。",
            "退款等高风险动作必须 Human-in-the-loop。",
            "所有轨迹都应记录用于评估。",
            "从工程角度来看，项目二：订单助手 Agent不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理项目二：订单助手 Agent可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保项目二：订单助手 Agent的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "客服机器人就是 Agent。",
            "能查订单就够。",
            "退款可以自动执行。",
            "只要模型足够强大，就不需要考虑项目二：订单助手 Agent了。"
          ],
          "pitfalls": [
            "越权查订单。",
            "重复创建工单。",
            "工具失败后编造结果。",
            "线上环境缺乏对项目二：订单助手 Agent的日志追踪。"
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
              "name": "订单查询",
              "summary": "订单助手根据用户诉求查询订单、判断异常、必要时创建工单或请求确认。",
              "detail": [
                "先建立层级直觉：订单查询是“项目二：订单助手 Agent”中的一个关键概念。订单助手根据用户诉求查询订单、判断异常、必要时创建工单或请求确认。",
                "它需要分类用户诉求，调用订单和退款工具，处理工具错误。",
                "在 Agent 系统中，订单查询不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：客服机器人就是 Agent。。工程坑点：越权查订单。。"
              ]
            },
            {
              "name": "工具编排",
              "summary": "理解工具编排：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：工具编排是“项目二：订单助手 Agent”中的一个关键概念。订单助手根据用户诉求查询订单、判断异常、必要时创建工单或请求确认。",
                "退款等高风险动作必须 Human-in-the-loop。",
                "在 Agent 系统中，工具编排不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：能查订单就够。。工程坑点：重复创建工单。。"
              ]
            },
            {
              "name": "高风险动作",
              "summary": "理解高风险动作：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：高风险动作是“项目二：订单助手 Agent”中的一个关键概念。订单助手根据用户诉求查询订单、判断异常、必要时创建工单或请求确认。",
                "所有轨迹都应记录用于评估。",
                "在 Agent 系统中，高风险动作不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：退款可以自动执行。。工程坑点：工具失败后编造结果。。"
              ]
            },
            {
              "name": "幂等工单",
              "summary": "理解幂等工单：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：幂等工单是“项目二：订单助手 Agent”中的一个关键概念。订单助手根据用户诉求查询订单、判断异常、必要时创建工单或请求确认。",
                "它需要分类用户诉求，调用订单和退款工具，处理工具错误。",
                "在 Agent 系统中，幂等工单不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：客服机器人就是 Agent。。工程坑点：越权查订单。。"
              ]
            }
          ],
          "lab": {
            "title": "项目二：订单助手 Agent实验",
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于项目二：订单助手 Agent的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：项目二：订单助手 Agent就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与项目二：订单助手 Agent交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，项目二：订单助手 Agent会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 项目二：订单助手 Agent 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示项目二：订单助手 Agent' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "project-doc-rag",
          "title": "项目三：文档问答 RAG Agent",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "RAG Agent 是最常见的知识型 Agent 项目。",
          "definition": "文档问答 RAG Agent 从知识库检索证据，基于证据回答并给出引用。",
          "explanation": [
            "它需要文档解析、切分、Embedding、检索、重排、引用和拒答。",
            "要评估召回率和引用准确率。",
            "后续可接入 pgvector、Qdrant、Elasticsearch、Meilisearch 做横向对比。",
            "从工程角度来看，项目三：文档问答 RAG Agent不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理项目三：文档问答 RAG Agent可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保项目三：文档问答 RAG Agent的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "上传文档就能回答准。",
            "只要向量库即可。",
            "引用一定正确。",
            "只要模型足够强大，就不需要考虑项目三：文档问答 RAG Agent了。"
          ],
          "pitfalls": [
            "Chunk 策略差。",
            "权限过滤缺失。",
            "检索不到仍回答。",
            "线上环境缺乏对项目三：文档问答 RAG Agent的日志追踪。"
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
              "name": "知识库",
              "summary": "文档问答 RAG Agent 从知识库检索证据，基于证据回答并给出引用。",
              "detail": [
                "先建立层级直觉：知识库是“项目三：文档问答 RAG Agent”中的一个关键概念。文档问答 RAG Agent 从知识库检索证据，基于证据回答并给出引用。",
                "它需要文档解析、切分、Embedding、检索、重排、引用和拒答。",
                "在 Agent 系统中，知识库不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：上传文档就能回答准。。工程坑点：Chunk 策略差。。"
              ]
            },
            {
              "name": "证据链",
              "summary": "理解证据链：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：证据链是“项目三：文档问答 RAG Agent”中的一个关键概念。文档问答 RAG Agent 从知识库检索证据，基于证据回答并给出引用。",
                "要评估召回率和引用准确率。",
                "在 Agent 系统中，证据链不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：只要向量库即可。。工程坑点：权限过滤缺失。。"
              ]
            },
            {
              "name": "引用",
              "summary": "理解引用：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：引用是“项目三：文档问答 RAG Agent”中的一个关键概念。文档问答 RAG Agent 从知识库检索证据，基于证据回答并给出引用。",
                "后续可接入 pgvector、Qdrant、Elasticsearch、Meilisearch 做横向对比。",
                "在 Agent 系统中，引用不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：引用一定正确。。工程坑点：检索不到仍回答。。"
              ]
            },
            {
              "name": "无证据拒答",
              "summary": "理解无证据拒答：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：无证据拒答是“项目三：文档问答 RAG Agent”中的一个关键概念。文档问答 RAG Agent 从知识库检索证据，基于证据回答并给出引用。",
                "它需要文档解析、切分、Embedding、检索、重排、引用和拒答。",
                "在 Agent 系统中，无证据拒答不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：上传文档就能回答准。。工程坑点：Chunk 策略差。。"
              ]
            }
          ],
          "lab": {
            "title": "项目三：文档问答 RAG Agent实验",
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于项目三：文档问答 RAG Agent的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：项目三：文档问答 RAG Agent就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与项目三：文档问答 RAG Agent交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，项目三：文档问答 RAG Agent会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 项目三：文档问答 RAG Agent 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示项目三：文档问答 RAG Agent' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        },
        {
          "id": "project-research-workflow",
          "title": "项目四：研究报告 Workflow Agent",
          "level": "基础",
          "focus": "必学",
          "interview": [],
          "estimatedMinutes": 35,
          "why": "复杂内容生产需要 Workflow 控制主流程，局部交给 Agent 探索。",
          "definition": "研究报告 Workflow Agent 用图结构组织搜索、抽取、验证、写作和引用检查。",
          "explanation": [
            "主流程应固定：计划、搜索、抽取、交叉验证、大纲、正文、引用检查。",
            "搜索和抽取可以使用 Agent 子循环。",
            "引用检查和导出应由确定性节点控制。",
            "从工程角度来看，项目四：研究报告 Workflow Agent不仅是一个理论概念，更是系统设计中的核心约束。",
            "在多轮对话和复杂任务编排中，正确处理项目四：研究报告 Workflow Agent可以大幅降低系统崩溃率和维护成本。",
            "团队在实践中往往需要建立专门的监控和评估机制，确保项目四：研究报告 Workflow Agent的表现符合预期，避免在线上环境中引发连锁反应。"
          ],
          "misconceptions": [
            "报告生成只要一个长 Prompt。",
            "模型会自动校验引用。",
            "纯 Agent 比 Workflow 好。",
            "只要模型足够强大，就不需要考虑项目四：研究报告 Workflow Agent了。"
          ],
          "pitfalls": [
            "引用来源丢失。",
            "搜索结果未交叉验证。",
            "长任务无 checkpoint。",
            "线上环境缺乏对项目四：研究报告 Workflow Agent的日志追踪。"
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
              "name": "研究计划",
              "summary": "研究报告 Workflow Agent 用图结构组织搜索、抽取、验证、写作和引用检查。",
              "detail": [
                "先建立层级直觉：研究计划是“项目四：研究报告 Workflow Agent”中的一个关键概念。研究报告 Workflow Agent 用图结构组织搜索、抽取、验证、写作和引用检查。",
                "主流程应固定：计划、搜索、抽取、交叉验证、大纲、正文、引用检查。",
                "在 Agent 系统中，研究计划不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：报告生成只要一个长 Prompt。。工程坑点：引用来源丢失。。"
              ]
            },
            {
              "name": "交叉验证",
              "summary": "理解交叉验证：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：交叉验证是“项目四：研究报告 Workflow Agent”中的一个关键概念。研究报告 Workflow Agent 用图结构组织搜索、抽取、验证、写作和引用检查。",
                "搜索和抽取可以使用 Agent 子循环。",
                "在 Agent 系统中，交叉验证不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：模型会自动校验引用。。工程坑点：搜索结果未交叉验证。。"
              ]
            },
            {
              "name": "引用检查",
              "summary": "理解引用检查：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：引用检查是“项目四：研究报告 Workflow Agent”中的一个关键概念。研究报告 Workflow Agent 用图结构组织搜索、抽取、验证、写作和引用检查。",
                "引用检查和导出应由确定性节点控制。",
                "在 Agent 系统中，引用检查不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：纯 Agent 比 Workflow 好。。工程坑点：长任务无 checkpoint。。"
              ]
            },
            {
              "name": "导出闸门",
              "summary": "理解导出闸门：看清它的作用、边界和工程落点。",
              "detail": [
                "先建立层级直觉：导出闸门是“项目四：研究报告 Workflow Agent”中的一个关键概念。研究报告 Workflow Agent 用图结构组织搜索、抽取、验证、写作和引用检查。",
                "主流程应固定：计划、搜索、抽取、交叉验证、大纲、正文、引用检查。",
                "在 Agent 系统中，导出闸门不能脱离上下文使用；需要和 Prompt、状态、工具、数据或评估机制配合。",
                "常见误区：报告生成只要一个长 Prompt。。工程坑点：引用来源丢失。。"
              ]
            }
          ],
          "lab": {
            "title": "项目四：研究报告 Workflow Agent实验",
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
          "scenario": "你在负责重构公司的核心业务系统时，发现经常遇到关于项目四：研究报告 Workflow Agent的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。",
          "levels": [
            {
              "label": "入门理解",
              "content": "类比生活中的常见现象：项目四：研究报告 Workflow Agent就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。"
            },
            {
              "label": "原理解析",
              "content": "深入机制分析：大模型在底层如何与项目四：研究报告 Workflow Agent交互？数据是如何在内存、上下文和模型权重之间流动的。"
            },
            {
              "label": "工程落地",
              "content": "生产实践建议：在并发、重试、错误处理等真实工程场景下，项目四：研究报告 Workflow Agent会遇到哪些坑，应该如何防御。"
            }
          ],
          "realCode": "import OpenAI from 'openai';\n\nconst client = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',\n});\n\nconst model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';\n\nasync function main() {\n  // 实战示例：演示 项目四：研究报告 Workflow Agent 的调用\n  try {\n    const response = await client.chat.completions.create({\n      model,\n      messages: [{ role: 'user', content: '演示项目四：研究报告 Workflow Agent' }],\n    });\n    console.log(response.choices[0].message.content);\n  } catch (error) {\n    console.error('API Error:', error);\n  }\n}\n\nmain().catch(console.error);"
        }
      ],
      "examples": [
        {
          "title": "为什么项目要按四次交付",
          "scenario": "先做能校验的分类器，再接只读工具，再接知识库，最后才进入复杂 Workflow。每一步都能运行、评估和回滚。",
          "takeaway": "逐步交付比一开始做“大而全 Agent”更适合学习和工程验证。"
        },
        {
          "title": "每次交付都复用上一阶段资产",
          "scenario": "工单分类器的 Schema 变成订单助手的意图分类；订单助手的工具运行时变成 RAG Agent 的检索工具；最终统一进入 Workflow。",
          "takeaway": "主线项目不是四个孤立 Demo，而是一条能力升级链。"
        }
      ],
      "diagram": {
        "title": "四次项目交付路线",
        "caption": "每一步都新增一种能力，同时保留上一阶段的可运行成果。",
        "nodes": [
          "V1 工单分类器",
          "V2 订单助手",
          "V3 文档问答 RAG",
          "V4 研究 Workflow",
          "生产级 Agent"
        ]
      },
      "projectMilestones": [
        {
          "version": "V1",
          "title": "工单分类器",
          "learns": "Prompt、JSON Schema、校验、评估",
          "deliverable": "输入反馈，输出可校验的分类结果",
          "acceptance": [
            "类别和优先级有枚举",
            "非法输出会被拦截",
            "至少 10 条评估用例"
          ]
        },
        {
          "version": "V2",
          "title": "订单助手 Agent",
          "learns": "Tool Calling、权限、错误处理、人工确认",
          "deliverable": "查询订单并在高风险动作前暂停",
          "acceptance": [
            "只读工具可自动调用",
            "越权请求被拒绝",
            "退款必须确认",
            "失败不会编造结果"
          ]
        },
        {
          "version": "V3",
          "title": "文档问答 RAG Agent",
          "learns": "解析、Chunking、Embedding、Hybrid、Rerank、引用",
          "deliverable": "基于知识库证据回答并支持拒答",
          "acceptance": [
            "答案包含来源",
            "检索不到时拒答",
            "支持租户或分类过滤",
            "记录 Recall@K"
          ]
        },
        {
          "version": "V4",
          "title": "研究报告 Workflow Agent",
          "learns": "Graph、State、Checkpoint、评估、导出",
          "deliverable": "可暂停、可恢复、可审计的研究报告流程",
          "acceptance": [
            "主流程有固定节点",
            "搜索和抽取可由 Agent 子任务完成",
            "中断后可恢复",
            "引用检查失败会阻断导出"
          ]
        }
      ],
      "order": "8.1",
      "routeFocus": "进阶专题",
      "studyFlow": [
        "理解",
        "实验",
        "复盘",
        "交付"
      ],
      "goal": "本章围绕项目主线建立直觉，完成一个最小实验，并学会在真实 Agent 系统中判断何时使用它。"
    }
  ],
  "routeIndex": 8,
  "routeFocus": "进阶专题",
  "studyFlow": [
    "理解",
    "实验",
    "复盘",
    "交付"
  ]
};