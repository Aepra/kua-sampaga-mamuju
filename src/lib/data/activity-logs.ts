// ============================================================
// Activity Logs Data Access Layer
// ============================================================

import { ActivityLog } from '@/lib/types';
import { readJsonFile, writeJsonFile } from './json-helper';
import { v4 as uuidv4 } from 'uuid';

const FILE = 'activity-logs.json';

export async function getAllLogs(): Promise<ActivityLog[]> {
  return readJsonFile<ActivityLog[]>(FILE);
}

export async function getRecentLogs(limit: number = 10): Promise<ActivityLog[]> {
  const logs = await getAllLogs();
  return logs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export async function addLog(
  action: string,
  detail: string,
  userId: string,
  userName: string
): Promise<ActivityLog> {
  const logs = await getAllLogs();
  const log: ActivityLog = {
    id: uuidv4(),
    action,
    detail,
    userId,
    userName,
    timestamp: new Date().toISOString(),
  };
  logs.push(log);

  // Keep only last 100 logs
  const trimmed = logs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 100);

  await writeJsonFile(FILE, trimmed);
  return log;
}
