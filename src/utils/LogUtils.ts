import fs from "fs-extra";
import FileUtils from "./FileUtils";
import path from "path";

fs.mkdirsSync(path.dirname(FileUtils.PATH_LOG));

let inited = false;

// 创建写入流
const logStream = fs.createWriteStream(FileUtils.PATH_LOG, { flags: "a" }); // "a" 表示追加模式

// 保存原始的 console 方法
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

// 通用日志写入函数
const writeLog = (level: string, args: any[]) => {
  const timestamp = new Date().toISOString();
  const message = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg) : String(arg))).join(" ");

  // 写入日志文件
  logStream.write(`[${timestamp}] [${level.toUpperCase()}]: ${message}\n`);
};

// 重写 console.log
console.log = (...args: any[]) => {
  if (!inited) {
    logStream.write("\n");
    inited = true;
  }
  writeLog("log", args);
  originalConsoleLog(...args); // 保留原始行为
};

// 重写 console.error
console.error = (...args: any[]) => {
  writeLog("error", args);
  originalConsoleError(...args);
};

// 重写 console.warn
console.warn = (...args: any[]) => {
  writeLog("warn", args);
  originalConsoleWarn(...args);
};

// 重写 console.info
console.info = (...args: any[]) => {
  writeLog("info", args);
  originalConsoleInfo(...args);
};
