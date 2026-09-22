export const compareBasics = [
  ["维度", "要点", "工程判断", "常见风险"],
  ["原理", "先理解它解决的问题", "能解释为什么需要它", "只记 API 名称"],
  ["实践", "用最小代码验证", "能独立改参数观察结果", "只复制示例"],
  ["评估", "用指标或用例验证", "能判断是否变好", "凭感觉优化"]
];

export function labFor(title, code) {
  return { title: title + "实验", runtime: "javascript", objective: "用最小代码跑通概念，观察输入、状态和输出之间的关系。", starterCode: code };
}

export function L({ id, title, level = "基础", focus = "必学", interview = [], minutes = 40, scenario, why, definition, explanation, levels, misconceptions, pitfalls, compare = compareBasics, labCode, realCode, taskTitle, taskDesc, checklist, terms = [] }) {
  return {
    id, title, level, focus, interview, estimatedMinutes: minutes, scenario, why, definition, explanation, levels, misconceptions, pitfalls, compare, terms, labCode, realCode,
    lab: labFor(title, labCode),
    task: {
      title: taskTitle || "完成本知识点复盘",
      description: taskDesc || "用自己的话解释这个知识点，并写出一个适合它的工程场景。",
      checklist: checklist || ["能说清它解决的问题", "能运行示例代码", "能写出至少一个工程坑点"]
    }
  };
}
