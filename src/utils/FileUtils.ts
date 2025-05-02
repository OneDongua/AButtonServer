import fs from "fs-extra";
import path from "path";

export default class FileUtils {
  static PATH_USERS = "src/data/users.json";
  static PATH_NOTIFICATIONS = "src/data/notifications.json";
  static PATH_GLOBAL_NOTIFICATIONS = "src/data/global_notifications.json";
  static PATH_POSTS = "src/data/posts.json";
  static PATH_CHATS = "src/data/chats.json";
  static PATH_POSTS_FOLDER = "src/data/posts";
  static PATH_CHATS_FOLDER = "src/data/chats";
  static PATH_LOG = "src/logs/app.log";

  // 读取文件
  static async readFile(filePath: string) {
    return fs.readFile(filePath, { encoding: "utf-8" });
  }

  // 写入文件（如果文件不存在会创建）
  static async writeFile(filePath: string, content: string) {
    await this.mkdirs(path.dirname(filePath));
    await fs.writeFile(filePath, content, { encoding: "utf-8" });
  }

  // 读取 json 文件
  static async readJson(filePath: string, defaultStr?: string) {
    if (!(await FileUtils.exists(filePath))) {
      await FileUtils.writeFile(filePath, defaultStr || "{}");
    }
    return fs.readJson(filePath);
  }

  // 写入 json 文件
  static async writeJson(filePath: string, content: object) {
    await fs.writeJson(filePath, content, { spaces: 2 });
  }

  // 追加内容到文件
  static async appendToFile(filePath: string, content: string) {
    await fs.appendFile(filePath, content, { encoding: "utf-8" });
  }

  // 删除文件/目录
  static async delete(filePath: string) {
    await fs.remove(filePath);
  }

  // 检查文件是否存在
  static async exists(filePath: string) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // 创建目录
  static async mkdirs(dirPath: string) {
    await fs.mkdirs(dirPath);
  }

  // 复制文件或目录
  static async copy(source: string, destination: string) {
    await fs.copy(source, destination);
  }

  // 获取目录下的文件列表
  static async list(dirPath: string) {
    return fs.readdir(dirPath);
  }
}
