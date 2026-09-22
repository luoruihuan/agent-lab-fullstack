import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { courseData as course } from "./courseData/index.js";
import { runCode } from "./codeRunner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = process.env.DATA_DIR || path.join(rootDir, "data");
const dbPath = process.env.DB_PATH || path.join(dataDir, "agent_lab.sqlite");
const jwtSecret = process.env.JWT_SECRET || "agent-lab-dev-secret-change-me";
const port = Number(process.env.PORT || 3000);
const defaultUsername = process.env.DEFAULT_USERNAME || "admin";
const defaultPassword = process.env.DEFAULT_PASSWORD || "AgentLab@2026";

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS progress (
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      understanding TEXT NOT NULL DEFAULT '',
      questions TEXT NOT NULL DEFAULT '',
      conclusion TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lab_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      code TEXT NOT NULL,
      output TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS checklist (
      user_id INTEGER NOT NULL,
      lesson_id TEXT NOT NULL,
      item_index INTEGER NOT NULL,
      checked INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, lesson_id, item_index),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      user_id INTEGER NOT NULL PRIMARY KEY,
      openai_base_url TEXT NOT NULL DEFAULT 'https://api.openai.com/v1',
      openai_api_key TEXT NOT NULL DEFAULT '',
      default_model TEXT NOT NULL DEFAULT 'gpt-4o-mini',
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(defaultUsername);
  if (!existing) {
    const hash = bcrypt.hashSync(defaultPassword, 10);
    db.prepare("INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)").run(
      defaultUsername,
      hash,
      "学习者"
    );
  }
}

initDb();

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(express.static(path.join(rootDir, "public")));

// ─── Auth helpers ────────────────────────────────────────────────────────────

function signUser(user) {
  return jwt.sign({ sub: user.id, username: user.username }, jwtSecret, { expiresIn: "7d" });
}

function getUserFromToken(req) {
  const token = req.cookies.agent_lab_token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const payload = jwt.verify(token, jwtSecret);
    return db.prepare("SELECT id, username, display_name FROM users WHERE id = ?").get(payload.sub) || null;
  } catch {
    return null;
  }
}

function requireAuth(req, res, next) {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "unauthorized" });
  req.user = user;
  next();
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function flattenLessons() {
  const lessons = [];
  for (const stage of course.stages) {
    for (const chapter of stage.chapters) {
      for (const lesson of chapter.lessons) {
        lessons.push({
          ...lesson,
          stageId: stage.id,
          stageTitle: stage.title,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
        });
      }
    }
  }
  return lessons;
}

function getUserSettings(userId) {
  return (
    db.prepare("SELECT * FROM user_settings WHERE user_id = ?").get(userId) || {
      openai_base_url: "https://api.openai.com/v1",
      openai_api_key: "",
      default_model: "gpt-4o-mini",
    }
  );
}

// ─── Health ───────────────────────────────────────────────────────────────────

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, version: course.version });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "username_and_password_required" });
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "invalid_credentials" });
  }
  const token = signUser(user);
  res.cookie("agent_lab_token", token, { httpOnly: true, sameSite: "lax", maxAge: 7 * 24 * 3600 * 1000 });
  res.json({ user: { id: user.id, username: user.username, displayName: user.display_name } });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("agent_lab_token");
  res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  const user = getUserFromToken(req);
  res.json({ user });
});

// ─── Course ───────────────────────────────────────────────────────────────────

app.get("/api/course", requireAuth, (_req, res) => {
  res.json(course);
});

// ─── User State ───────────────────────────────────────────────────────────────

app.get("/api/me/state", requireAuth, (req, res) => {
  const progressRows = db
    .prepare("SELECT lesson_id, completed, updated_at FROM progress WHERE user_id = ?")
    .all(req.user.id);
  const noteRows = db
    .prepare("SELECT lesson_id, understanding, questions, conclusion, updated_at FROM notes WHERE user_id = ?")
    .all(req.user.id);
  const checkRows = db
    .prepare("SELECT lesson_id, item_index, checked FROM checklist WHERE user_id = ?")
    .all(req.user.id);
  const runRows = db
    .prepare(
      `SELECT id, lesson_id, code, output, status, created_at
       FROM lab_runs WHERE user_id = ? ORDER BY id DESC LIMIT 50`
    )
    .all(req.user.id);

  res.json({
    progress: Object.fromEntries(progressRows.map((row) => [row.lesson_id, Boolean(row.completed)])),
    notes: Object.fromEntries(noteRows.map((row) => [row.lesson_id, row])),
    checklist: checkRows.reduce((acc, row) => {
      acc[row.lesson_id] ||= {};
      acc[row.lesson_id][row.item_index] = Boolean(row.checked);
      return acc;
    }, {}),
    labRuns: runRows,
  });
});

app.put("/api/me/progress/:lessonId", requireAuth, (req, res) => {
  const completed = req.body?.completed ? 1 : 0;
  db.prepare(
    `INSERT INTO progress (user_id, lesson_id, completed, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET completed = excluded.completed, updated_at = CURRENT_TIMESTAMP`
  ).run(req.user.id, req.params.lessonId, completed);
  res.json({ ok: true, completed: Boolean(completed) });
});

app.put("/api/me/notes/:lessonId", requireAuth, (req, res) => {
  const understanding = String(req.body?.understanding || "");
  const questions = String(req.body?.questions || "");
  const conclusion = String(req.body?.conclusion || "");
  db.prepare(
    `INSERT INTO notes (user_id, lesson_id, understanding, questions, conclusion, updated_at)
     VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET
       understanding = excluded.understanding,
       questions = excluded.questions,
       conclusion = excluded.conclusion,
       updated_at = CURRENT_TIMESTAMP`
  ).run(req.user.id, req.params.lessonId, understanding, questions, conclusion);
  res.json({ ok: true });
});

app.put("/api/me/checklist/:lessonId/:itemIndex", requireAuth, (req, res) => {
  const checked = req.body?.checked ? 1 : 0;
  db.prepare(
    `INSERT INTO checklist (user_id, lesson_id, item_index, checked, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id, lesson_id, item_index) DO UPDATE SET checked = excluded.checked, updated_at = CURRENT_TIMESTAMP`
  ).run(req.user.id, req.params.lessonId, Number(req.params.itemIndex), checked);
  res.json({ ok: true });
});

// ─── Lab Runs ─────────────────────────────────────────────────────────────────

app.post("/api/me/lab-runs", requireAuth, (req, res) => {
  const { lessonId, code, output, status } = req.body || {};
  if (!lessonId || typeof code !== "string") return res.status(400).json({ error: "lessonId_and_code_required" });
  const result = db
    .prepare("INSERT INTO lab_runs (user_id, lesson_id, code, output, status) VALUES (?, ?, ?, ?, ?)")
    .run(req.user.id, lessonId, code, String(output || ""), status === "error" ? "error" : "success");
  res.json({ ok: true, id: result.lastInsertRowid });
});

// ─── Code Runner（NEW）────────────────────────────────────────────────────────

app.post("/api/me/run-code", requireAuth, async (req, res) => {
  const { code, lessonId } = req.body || {};
  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "code_required" });
  }

  // 获取用户配置的 API Key & Base URL
  const settings = getUserSettings(req.user.id);
  const envVars = {};
  if (settings.openai_api_key) {
    envVars.OPENAI_API_KEY = settings.openai_api_key;
    envVars.OPENAI_BASE_URL = settings.openai_base_url || "https://api.openai.com/v1";
    envVars.DEFAULT_MODEL = settings.default_model || "gpt-4o-mini";
  }

  try {
    const result = await runCode(code, envVars);

    // 保存运行记录
    if (lessonId) {
      const output = [result.stdout, result.stderr].filter(Boolean).join("\n").slice(0, 8000);
      db.prepare("INSERT INTO lab_runs (user_id, lesson_id, code, output, status) VALUES (?, ?, ?, ?, ?)").run(
        req.user.id,
        lessonId,
        code.slice(0, 10000),
        output,
        result.status
      );
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

// ─── Settings（NEW）──────────────────────────────────────────────────────────

app.get("/api/me/settings", requireAuth, (req, res) => {
  const s = getUserSettings(req.user.id);
  // 不返回完整 Key，只返回掩码
  const maskedKey = s.openai_api_key ? s.openai_api_key.slice(0, 7) + "****" + s.openai_api_key.slice(-4) : "";
  res.json({
    openaiBaseUrl: s.openai_base_url,
    openaiApiKeyMasked: maskedKey,
    hasApiKey: Boolean(s.openai_api_key),
    defaultModel: s.default_model,
  });
});

app.put("/api/me/settings", requireAuth, (req, res) => {
  const baseUrl = String(req.body?.openaiBaseUrl || "https://api.openai.com/v1").trim();
  const apiKey = String(req.body?.openaiApiKey || "").trim();
  const model = String(req.body?.defaultModel || "gpt-4o-mini").trim();

  // 如果 apiKey 是掩码（包含****），保留原有 key
  const existing = getUserSettings(req.user.id);
  const finalKey = apiKey.includes("****") ? existing.openai_api_key : apiKey;

  db.prepare(
    `INSERT INTO user_settings (user_id, openai_base_url, openai_api_key, default_model, updated_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(user_id) DO UPDATE SET
       openai_base_url = excluded.openai_base_url,
       openai_api_key = excluded.openai_api_key,
       default_model = excluded.default_model,
       updated_at = CURRENT_TIMESTAMP`
  ).run(req.user.id, baseUrl, finalKey, model);

  res.json({ ok: true });
});

// ─── Search ───────────────────────────────────────────────────────────────────

app.get("/api/search", requireAuth, (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();
  if (!q) return res.json({ results: [] });
  const results = flattenLessons()
    .filter((lesson) => {
      const text = [lesson.title, lesson.why, lesson.definition, ...(lesson.explanation || []), ...(lesson.pitfalls || [])]
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    })
    .map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      chapterTitle: lesson.chapterTitle,
      stageTitle: lesson.stageTitle,
    }));
  res.json({ results });
});

// ─── SPA Fallback ─────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(rootDir, "public", "index.html"));
  }
  next();
});

app.listen(port, () => {
  console.log(`Agent Lab listening on http://0.0.0.0:${port}`);
  console.log(`Default login: ${defaultUsername} / ${defaultPassword}`);
});
