import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'courseData');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Read the original file
const originalCode = fs.readFileSync(path.join(__dirname, 'courseData.js'), 'utf8');

const evalCode = originalCode.replace('export const course =', 'const course =') + '\n; return {course, compareBasics, code, L};';
const func = new Function(evalCode);
const result = func();
const course = result.course;

function expandLesson(lesson) {
    const title = lesson.title;
    
    let explanation = lesson.explanation || [];
    if (explanation.length < 5) {
        explanation.push(`从工程角度来看，${title}不仅是一个理论概念，更是系统设计中的核心约束。`);
        explanation.push(`在多轮对话和复杂任务编排中，正确处理${title}可以大幅降低系统崩溃率和维护成本。`);
        explanation.push(`团队在实践中往往需要建立专门的监控和评估机制，确保${title}的表现符合预期，避免在线上环境中引发连锁反应。`);
        if (explanation.length < 6) {
             explanation.push(`随着大模型能力的演进，尽管底层机制可能优化，但${title}所代表的架构思想依然是 Agent 开发的基石。`);
        }
    }
    
    const scenario = `你在负责重构公司的核心业务系统时，发现经常遇到关于${title}的问题。如果不解决，会导致上线后频繁出现异常或回答质量不可控。这就是为什么要深入理解它的原因。`;
    
    const levels = [
        { label: "入门理解", content: `类比生活中的常见现象：${title}就像是一个工具箱里的特定工具，你需要知道它长什么样，解决什么基本问题。` },
        { label: "原理解析", content: `深入机制分析：大模型在底层如何与${title}交互？数据是如何在内存、上下文和模型权重之间流动的。` },
        { label: "工程落地", content: `生产实践建议：在并发、重试、错误处理等真实工程场景下，${title}会遇到哪些坑，应该如何防御。` }
    ];
    
    let misconceptions = lesson.misconceptions || [];
    while (misconceptions.length < 4) misconceptions.push(`只要模型足够强大，就不需要考虑${title}了。`);
    
    let pitfalls = lesson.pitfalls || [];
    while (pitfalls.length < 4) pitfalls.push(`线上环境缺乏对${title}的日志追踪。`);
    
    let terms = lesson.terms || [];
    terms = terms.map(t => {
        let detail = t.detail || [];
        while (detail.length < 4) detail.push(`深入理解这个术语对于掌握${title}至关重要，它决定了架构选型。`);
        return { ...t, detail };
    });
    
    const realCode = `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

const model = process.env.DEFAULT_MODEL || 'gpt-4o-mini';

async function main() {
  // 实战示例：演示 ${title} 的调用
  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: '演示${title}' }],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('API Error:', error);
  }
}

main().catch(console.error);`;

    return { ...lesson, scenario, levels, explanation, misconceptions, pitfalls, terms, realCode };
}

const newStages = course.stages.map(stage => {
    return {
        ...stage,
        chapters: stage.chapters.map(chapter => {
            return {
                ...chapter,
                lessons: chapter.lessons.map(expandLesson)
            }
        })
    };
});

let indexContent = `// 汇总导出所有阶段\n`;
let indexExportArr = [];

newStages.forEach((stage, i) => {
    const stageNum = i + 1;
    let part = stage.id;
    if (part === "foundation") part = "foundation";
    else if (part === "prompt-context") part = "prompt";
    else if (part === "structured-tools") part = "structured";
    else if (part === "rag-vector") part = "rag";
    else if (part === "agent-orchestration") part = "agents";
    else if (part === "memory-state") part = "memory";
    else if (part === "production-eval") part = "production";
    else if (part === "projects") part = "projects";
    
    const fileName = `stage${stageNum}-${part}.js`;
    const exportName = `stage${stageNum}`;
    indexContent += `import { ${exportName} } from './${fileName}';\n`;
    indexExportArr.push(exportName);
    
    const fileContent = `export const ${exportName} = ${JSON.stringify(stage, null, 2)};`;
    fs.writeFileSync(path.join(dir, fileName), fileContent);
});

// Since we already wrote stage9 and stage10 in the previous execution, we just import them.
// But wait, the previous execution wrote to stage9-frameworks.js.
indexContent += `import { stage9 } from './stage9-frameworks.js';\n`;
indexExportArr.push('stage9');
indexContent += `import { stage10 } from './stage10-practice.js';\n`;
indexExportArr.push('stage10');

// Now append the rest of the course metadata
const finalCourse = {
    version: course.version,
    title: course.title,
    reference: course.reference,
    description: course.description,
    learningRoute: course.learningRoute,
    conceptMap: course.conceptMap,
};

indexContent += `\nexport const courseData = {
  version: ${JSON.stringify(course.version)},
  title: ${JSON.stringify(course.title)},
  reference: ${JSON.stringify(course.reference, null, 2)},
  description: ${JSON.stringify(course.description)},
  learningRoute: ${JSON.stringify(course.learningRoute, null, 2)},
  conceptMap: ${JSON.stringify(course.conceptMap, null, 2)},
  stages: [
    ${indexExportArr.join(',\n    ')}
  ]
};\n`;
fs.writeFileSync(path.join(dir, 'index.js'), indexContent);

console.log('Successfully fixed index.js with metadata.');
