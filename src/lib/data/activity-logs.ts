import { ActivityLog } from '@/lib/types';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function getAllLogs(): Promise<ActivityLog[]> {
  const logs = await prisma.activityLog.findMany({
    orderBy: { timestamp: 'desc' }
  });
  return logs.map(l => ({ ...l, timestamp: l.timestamp.toISOString() }));
}

export async function getRecentLogs(limit: number = 10): Promise<ActivityLog[]> {
  const logs = await prisma.activityLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit
  });
  return logs.map(l => ({ ...l, timestamp: l.timestamp.toISOString() }));
}

export async function addLog(
  action: string,
  detail: string,
  userId: string,
  userName: string
): Promise<ActivityLog> {
  const log = await prisma.activityLog.create({
    data: {
      id: uuidv4(),
      action,
      detail,
      userId,
      userName,
    }
  });

  // Prisma does not automatically trim logs, but we can do a cleanup query
  // to keep only the last 100 logs.
  const logsCount = await prisma.activityLog.count();
  if (logsCount > 100) {
    const oldestToKeep = await prisma.activityLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      skip: 99
    });
    if (oldestToKeep.length > 0) {
      await prisma.activityLog.deleteMany({
        where: {
          timestamp: {
            lt: oldestToKeep[0].timestamp
          }
        }
      });
    }
  }

  return { ...log, timestamp: log.timestamp.toISOString() };
}
