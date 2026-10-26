import { DatabaseSync } from 'node:sqlite';

// Executes real SQLite; only adapts its synchronous API to Expo's async shape.
export function connect(path = ':memory:') {
  const sqlite = new DatabaseSync(path);
  const db = {
    async execAsync(sql) {
      sqlite.exec(sql);
    },
    async getFirstAsync(sql, ...params) {
      return sqlite.prepare(sql).get(...params);
    },
    async getAllAsync(sql, ...params) {
      return sqlite.prepare(sql).all(...params);
    },
    async runAsync(sql, ...params) {
      const result = sqlite.prepare(sql).run(...params);
      return {
        changes: result.changes,
        lastInsertRowId: result.lastInsertRowid,
      };
    },
    async withExclusiveTransactionAsync(task) {
      sqlite.exec('BEGIN IMMEDIATE');
      try {
        await task(db);
        sqlite.exec('COMMIT');
      } catch (error) {
        sqlite.exec('ROLLBACK');
        throw error;
      }
    },
  };
  return { db, close: () => sqlite.close() };
}
