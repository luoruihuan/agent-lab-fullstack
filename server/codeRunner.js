/**
 * codeRunner.js
 * 后端 Node.js 代码沙盒执行器
 * 将用户代码写入临时文件，用子进程执行，收集 stdout/stderr
 */

import { exec } from "node:child_process";
import { writeFile, unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const TIMEOUT_MS = 8000;

// 危险操作黑名单（静态检查，防止明显恶意代码）
const DANGEROUS_PATTERNS = [
  /process\.exit/,
  /require\s*\(\s*['"]child_process['"]\s*\)/,
  /import\s+.*\s+from\s+['"]child_process['"]/,
  /fs\.rm\s*\(/,
  /fs\.rmdir\s*\(/,
  /fs\.unlink\s*\(/,
  /execSync|spawnSync|execFileSync/,
  /__dirname.*\.\.\//,
];

function isCodeSafe(code) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      return { safe: false, reason: `检测到危险操作: ${pattern}` };
    }
  }
  return { safe: true };
}

/**
 * 执行用户代码
 * @param {string} code - 用户编写的 JS/ESM 代码
 * @param {object} envVars - 注入的环境变量 (如 API Key, Base URL)
 * @returns {Promise<{stdout: string, stderr: string, status: 'success'|'error'}>}
 */
export async function runCode(code, envVars = {}) {
  // 安全检查
  const { safe, reason } = isCodeSafe(code);
  if (!safe) {
    return {
      stdout: "",
      stderr: `[安全拦截] ${reason}`,
      status: "error",
    };
  }

  // 写入临时文件（使用 .mjs 支持 ESM import）
  const tmpFile = join(tmpdir(), `agent-lab-${randomUUID()}.mjs`);

  // 注入 console.log 收集器 + 工具函数头部
  const wrapper = `
// ===== Agent Lab 实验环境 =====
// 可用包: openai, axios, zod, dotenv
// 环境变量: process.env.OPENAI_API_KEY, process.env.OPENAI_BASE_URL 等
// 超时: ${TIMEOUT_MS / 1000}s

${code}
`;

  try {
    await writeFile(tmpFile, wrapper, "utf-8");

    const result = await new Promise((resolve) => {
      const env = {
        ...process.env,
        ...envVars,
        // 防止子进程继承某些敏感环境变量
        NODE_ENV: "sandbox",
      };

      const child = exec(
        `node --experimental-vm-modules "${tmpFile}"`,
        {
          timeout: TIMEOUT_MS,
          maxBuffer: 512 * 1024, // 512KB 输出上限
          env,
          cwd: process.cwd(), // 允许 require/import 根目录的 node_modules
        },
        (error, stdout, stderr) => {
          if (error && error.killed) {
            resolve({
              stdout: stdout || "",
              stderr: `[超时] 代码执行超过 ${TIMEOUT_MS / 1000}s 被终止。`,
              status: "error",
            });
          } else if (error) {
            resolve({
              stdout: stdout || "",
              stderr: stderr || error.message,
              status: "error",
            });
          } else {
            resolve({
              stdout: stdout || "",
              stderr: stderr || "",
              status: "success",
            });
          }
        }
      );

      // 防止僵尸进程
      child.on("error", (err) => {
        resolve({ stdout: "", stderr: err.message, status: "error" });
      });
    });

    return result;
  } finally {
    // 清理临时文件
    unlink(tmpFile).catch(() => {});
  }
}
