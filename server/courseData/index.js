// 汇总导出所有阶段
import { stage1 } from './stage1-foundation.js';
import { stage2 } from './stage2-prompt.js';
import { stage3 } from './stage3-structured.js';
import { stage4 } from './stage4-rag.js';
import { stage5 } from './stage5-agents-workflow.js';
import { stage6 } from './stage6-memory-mcp-skills.js';
import { stage7 } from './stage7-evaluation-production.js';
import { stage8 } from './stage8-projects.js';
import { stage9 } from './stage9-frameworks.js';
import { stage10 } from './stage10-practice.js';

export const courseData = {
  version: "2026.09.21-all-terms",
  title: "Agent Lab：Agent 开发完整学习路线",
  reference: {
  "title": "JavaGuide：AI 核心概念总览",
  "url": "https://javaguide.cn/ai/ai-core-concepts.html#prompt",
  "note": "课程借鉴其 LLM、Prompt、结构化输出、Tool Calling、Agent、RAG、MCP、Skills 与 Harness 的概念分层，并用自己的例子和实验重新组织。"
},
  description: "面向全栈开发者的 Agent 开发系统课程。沿着“模型如何生成 → 如何组织上下文 → 如何形成可靠契约 → 如何调用工具和知识 → 如何编排多步任务 → 如何评估与上线”的主线学习；每个概念都标注必学、进阶或面试重点，并落到 V1～V4 逐步交付项目。",
  learningRoute: [
  {
    "id": "model",
    "title": "1. 建立模型心智模型",
    "question": "模型到底如何生成？",
    "outcome": "能解释 Token、上下文和采样。"
  },
  {
    "id": "contract",
    "title": "2. 把输入输出变成契约",
    "question": "如何让模型结果可被程序使用？",
    "outcome": "能设计 Prompt、Schema、校验和重试。"
  },
  {
    "id": "action",
    "title": "3. 让模型安全行动",
    "question": "模型如何获取信息并调用工具？",
    "outcome": "能实现 Tool Calling、RAG 和权限边界。"
  },
  {
    "id": "orchestration",
    "title": "4. 处理多步任务",
    "question": "什么时候用 Agent，什么时候用 Workflow？",
    "outcome": "能管理状态、计划、记忆和恢复。"
  },
  {
    "id": "production",
    "title": "5. 做成可靠系统",
    "question": "怎么知道它真的变好了？",
    "outcome": "能评估、安全控制、观测、灰度和回滚。"
  },
  {
    "id": "projects",
    "title": "6. 通过项目交付",
    "question": "如何把知识串成作品？",
    "outcome": "完成 V1 分类器 → V4 Workflow Agent。"
  }
],
  conceptMap: {
  "intro": "把 JavaGuide 的概念放回一条真实的 Agent 链路：模型负责理解和决策，代码负责约束、执行、记忆、评估与恢复。学习时沿着学习主线走，不需要一开始记住所有术语。",
  "layers": [
    {
      "id": "model",
      "label": "模型基础",
      "description": "模型如何生成、如何受到上下文和采样影响",
      "color": "#9b6b2f"
    },
    {
      "id": "input",
      "label": "输入与契约",
      "description": "把模糊任务变成清晰、可校验的输入和输出",
      "color": "#7b5aa6"
    },
    {
      "id": "action",
      "label": "行动与知识",
      "description": "让 Agent 使用工具、检索外部知识并获得反馈",
      "color": "#1f6f5b"
    },
    {
      "id": "orchestration",
      "label": "编排与记忆",
      "description": "控制多步任务、状态、记忆和能力扩展",
      "color": "#2879a8"
    },
    {
      "id": "production",
      "label": "可靠性与交付",
      "description": "评估、安全、观测和最终项目交付",
      "color": "#b84e4e"
    }
  ],
  "projects": [
    {
      "id": "V1",
      "title": "工单分类器",
      "subtitle": "先让模型稳定输出可用结果",
      "deliverable": "结构化分类结果 + 校验 + 评估集",
      "lessonIds": [
        "rtcf",
        "few-shot",
        "json-mode",
        "json-schema",
        "structured-retry",
        "eval-dataset"
      ]
    },
    {
      "id": "V2",
      "title": "订单助手 Agent",
      "subtitle": "让模型安全调用真实工具",
      "deliverable": "查询、判断、确认、创建工单",
      "lessonIds": [
        "tool-schema",
        "tool-runtime",
        "tool-errors",
        "react",
        "permission",
        "human-confirm"
      ]
    },
    {
      "id": "V3",
      "title": "文档问答 RAG Agent",
      "subtitle": "让回答基于外部证据",
      "deliverable": "检索、重排、引用、拒答",
      "lessonIds": [
        "parsing-cleaning",
        "chunking",
        "embedding",
        "hybrid",
        "rerank",
        "filtering-recall",
        "rag-eval"
      ]
    },
    {
      "id": "V4",
      "title": "研究报告 Workflow Agent",
      "subtitle": "让长任务可控、可恢复、可审计",
      "deliverable": "计划、搜索、验证、写作、导出",
      "lessonIds": [
        "context-window",
        "context-blocks",
        "history-summary",
        "react",
        "plan-execute",
        "workflow-vs-agent",
        "state-graph",
        "checkpoint",
        "memory-types",
        "function-mcp-agent-skill",
        "harness",
        "observability",
        "deployment"
      ]
    }
  ],
  "concepts": [
    {
      "id": "llm",
      "name": "LLM / 大语言模型",
      "layer": "model",
      "plain": "像一个根据前文继续补全内容的概率预测器，不是天然可靠的数据库或执行器。",
      "lessonId": "autoregressive",
      "projects": [
        "V1",
        "V2",
        "V3",
        "V4"
      ],
      "use": "所有版本都用它理解任务、生成分类、决定工具或组织答案。",
      "output": "从“会聊天”升级为可被系统约束的推理组件。",
      "prerequisites": []
    },
    {
      "id": "token",
      "name": "Token",
      "layer": "model",
      "plain": "模型处理文本的基本片段，决定上下文容量、成本和延迟。",
      "lessonId": "tokens",
      "projects": [
        "V1",
        "V2",
        "V3",
        "V4"
      ],
      "use": "V1 记录输入输出成本；V2-V4 用 Token 预算控制工具、历史和检索内容。",
      "output": "能解释为什么不能把所有历史和工具结果都塞给模型。",
      "prerequisites": [
        "llm"
      ]
    },
    {
      "id": "context-window",
      "name": "上下文窗口",
      "layer": "model",
      "plain": "模型当前能看到的工作台，规则、任务、历史、工具和输出都会占空间。",
      "lessonId": "context-window",
      "projects": [
        "V2",
        "V3",
        "V4"
      ],
      "use": "V2 保留任务和工具结果；V3 控制 RAG 证据；V4 压缩长流程轨迹。",
      "output": "一份可观测的上下文预算表。",
      "prerequisites": [
        "token"
      ]
    },
    {
      "id": "sampling",
      "name": "Logits / Softmax / Temperature / Top-p",
      "layer": "model",
      "plain": "模型先给候选 Token 打分，再把分数变成概率并抽取；参数是在控制抽签池。",
      "lessonId": "sampling",
      "projects": [
        "V1",
        "V2"
      ],
      "use": "分类和工具选择偏低随机性，创意报告可以放宽，但不能替代校验。",
      "output": "能根据任务选择稳定或发散的采样策略。",
      "prerequisites": [
        "llm",
        "token"
      ]
    },
    {
      "id": "prompt",
      "name": "Prompt Engineering",
      "layer": "input",
      "plain": "把角色、任务、背景和格式说清楚，缩小模型需要猜的范围。",
      "lessonId": "rtcf",
      "projects": [
        "V1",
        "V2",
        "V3",
        "V4"
      ],
      "use": "V1 定义分类边界；V2 描述工具使用条件；V3 规定基于证据回答；V4 约束各节点产物。",
      "output": "可复用的任务 Prompt，而不是一段越写越长的指令。",
      "prerequisites": [
        "llm"
      ]
    },
    {
      "id": "few-shot",
      "name": "Few-shot 示例",
      "layer": "input",
      "plain": "给模型几个输入输出样例，让它看到什么是正常、边界和拒答。",
      "lessonId": "few-shot",
      "projects": [
        "V1",
        "V2"
      ],
      "use": "补充工单分类的正常例、边界例和 NEED_MORE_INFO 例。",
      "output": "覆盖边界的示例集。",
      "prerequisites": [
        "prompt"
      ]
    },
    {
      "id": "structured-output",
      "name": "Structured Outputs / JSON Schema",
      "layer": "input",
      "plain": "把模型的自然语言变成程序可以检查和消费的数据契约。",
      "lessonId": "json-schema",
      "projects": [
        "V1",
        "V2",
        "V3",
        "V4"
      ],
      "use": "V1 输出分类对象；V2 输出工具参数；V3 输出引用对象；V4 输出节点状态。",
      "output": "Schema、校验器、失败重试和降级策略。",
      "prerequisites": [
        "prompt"
      ]
    },
    {
      "id": "tool-calling",
      "name": "Function Calling / Tool Calling",
      "layer": "action",
      "plain": "模型只表达“我想调用哪个工具和参数”，真正执行由运行时完成。",
      "lessonId": "tool-runtime",
      "projects": [
        "V2",
        "V3",
        "V4"
      ],
      "use": "V2 调订单工具；V3 调检索和重排工具；V4 调搜索、文件和导出工具。",
      "output": "工具注册、参数校验、执行、结果回填和审计链路。",
      "prerequisites": [
        "structured-output"
      ]
    },
    {
      "id": "agent",
      "name": "Agent",
      "layer": "action",
      "plain": "LLM 加上规划、记忆、工具和反馈后的任务执行系统，不只是聊天机器人。",
      "lessonId": "react",
      "projects": [
        "V2",
        "V3",
        "V4"
      ],
      "use": "从 V2 的订单决策开始，逐步加入检索、子任务和恢复。",
      "output": "一个有目标、有状态、有边界的执行循环。",
      "prerequisites": [
        "tool-calling",
        "context-window"
      ]
    },
    {
      "id": "react",
      "name": "ReAct / Agent Loop",
      "layer": "action",
      "plain": "推理一步、行动一次、观察结果，再决定下一步；像边走边看地图。",
      "lessonId": "react",
      "projects": [
        "V2",
        "V3",
        "V4"
      ],
      "use": "V2 查订单后决定下一步；V3 检索后决定是否补查；V4 搜索过程中根据反馈更新计划。",
      "output": "最大轮次、停止条件、工具失败恢复和轨迹日志。",
      "prerequisites": [
        "agent",
        "tool-calling"
      ]
    },
    {
      "id": "rag",
      "name": "RAG / 检索增强生成",
      "layer": "action",
      "plain": "先找外部证据，再让模型基于证据回答，而不是只靠参数里的旧知识。",
      "lessonId": "rag-overview",
      "projects": [
        "V3",
        "V4"
      ],
      "use": "V3 做技术文档问答；V4 给研究报告提供可引用资料。",
      "output": "解析、切分、召回、重排、压缩、引用和拒答链路。",
      "prerequisites": [
        "context-window",
        "tool-calling"
      ]
    },
    {
      "id": "embedding",
      "name": "Embedding / 向量表示",
      "layer": "action",
      "plain": "把文字映射成向量，让语义相近的内容在空间里更接近。",
      "lessonId": "embedding",
      "projects": [
        "V3",
        "V4"
      ],
      "use": "把文档和查询变成向量，作为语义召回的基础。",
      "output": "固定模型、维度、距离函数和重嵌入策略。",
      "prerequisites": [
        "rag"
      ]
    },
    {
      "id": "hybrid-rerank",
      "name": "Hybrid Search / Rerank",
      "layer": "action",
      "plain": "关键词擅长精确命中，向量擅长语义泛化，重排再挑出真正能回答问题的片段。",
      "lessonId": "rerank",
      "projects": [
        "V3",
        "V4"
      ],
      "use": "V3 混合召回错误码和语义内容；V4 对研究资料做候选合并和重排。",
      "output": "Recall@K、P95、引用准确率和候选对比记录。",
      "prerequisites": [
        "embedding",
        "rag"
      ]
    },
    {
      "id": "workflow",
      "name": "Workflow / Graph",
      "layer": "orchestration",
      "plain": "用节点、边和状态提前规定流程；不是所有事情都交给模型自由决定。",
      "lessonId": "state-graph",
      "projects": [
        "V4"
      ],
      "use": "固定研究报告的计划、验证、写作、引用检查和导出顺序。",
      "output": "可测试的状态图、条件分支、重试和人工确认节点。",
      "prerequisites": [
        "agent",
        "structured-output"
      ]
    },
    {
      "id": "planning",
      "name": "Planning / Plan-and-Execute",
      "layer": "orchestration",
      "plain": "先把复杂目标拆成步骤，再逐步执行；计划不是永远不变的清单。",
      "lessonId": "plan-execute",
      "projects": [
        "V2",
        "V4"
      ],
      "use": "V2 拆查询和处理步骤；V4 生成研究计划并根据资料结果更新。",
      "output": "带依赖、状态和重新规划能力的任务计划。",
      "prerequisites": [
        "agent"
      ]
    },
    {
      "id": "memory",
      "name": "Memory / 记忆系统",
      "layer": "orchestration",
      "plain": "短期记住当前任务，长期保存被确认、可复用的事实和经验。",
      "lessonId": "memory-types",
      "projects": [
        "V4"
      ],
      "use": "保存研究任务状态、用户偏好、历史决策和可复用流程，但不把所有聊天都永久记住。",
      "output": "写入、检索、注入、纠错和遗忘策略。",
      "prerequisites": [
        "context-window"
      ]
    },
    {
      "id": "mcp-skills",
      "name": "MCP / Skills",
      "layer": "orchestration",
      "plain": "MCP 解决工具如何接入，Skill 解决某类任务应该怎样做；它们不是 Agent 的替代品。",
      "lessonId": "function-mcp-agent-skill",
      "projects": [
        "V4"
      ],
      "use": "V4 通过 MCP 接入搜索或文件能力，通过 Skill 加载研究、审查和引用检查经验。",
      "output": "清晰的协议层、工具层、运行时层和经验层。",
      "prerequisites": [
        "tool-calling",
        "agent"
      ]
    },
    {
      "id": "context-engineering",
      "name": "Context Engineering",
      "layer": "orchestration",
      "plain": "不只写 Prompt，而是决定这一轮模型到底应该看到哪些规则、状态、证据和历史。",
      "lessonId": "context-blocks",
      "projects": [
        "V2",
        "V3",
        "V4"
      ],
      "use": "控制工具描述、RAG 证据、记忆和轨迹的优先级与压缩方式。",
      "output": "分块、预算、来源和可信度明确的上下文组装器。",
      "prerequisites": [
        "prompt",
        "context-window"
      ]
    },
    {
      "id": "evaluation",
      "name": "Evaluation / 评估",
      "layer": "production",
      "plain": "用固定用例和指标判断 Agent 是否真的变好，而不是凭某一次回答感觉。",
      "lessonId": "eval-dataset",
      "projects": [
        "V1",
        "V2",
        "V3",
        "V4"
      ],
      "use": "V1 评分类别；V2 评工具和权限；V3 评 Recall 与引用；V4 评轨迹、成本和完成率。",
      "output": "可回归的评估集、指标和失败样本库。",
      "prerequisites": [
        "structured-output"
      ]
    },
    {
      "id": "security-harness",
      "name": "Security / Harness Engineering",
      "layer": "production",
      "plain": "模型之外的系统负责权限、沙箱、状态、观测、成本、恢复和回滚。",
      "lessonId": "harness",
      "projects": [
        "V2",
        "V3",
        "V4"
      ],
      "use": "V2 阻止越权和高风险自动执行；V3 做租户过滤；V4 做 checkpoint、trace、灰度和回滚。",
      "output": "能解释、能暂停、能恢复、能审计的生产运行时。",
      "prerequisites": [
        "agent",
        "workflow",
        "evaluation"
      ]
    }
  ]
},
  stages: [
    stage1,
    stage2,
    stage3,
    stage4,
    stage5,
    stage6,
    stage7,
    stage8,
    stage9,
    stage10
  ]
};
