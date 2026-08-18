import { User, UserPublic } from '@/lib/types';
import { prisma } from '@/lib/prisma';

export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() })) as User[];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) return undefined;
  return { ...user, createdAt: user.createdAt.toISOString() } as User;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) return undefined;
  return { ...user, createdAt: user.createdAt.toISOString() } as User;
}

export function getUserPublic(user: User): UserPublic {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    const updated = await prisma.user.update({
      where: { id },
      data: updates
    });
    return { ...updated, createdAt: updated.createdAt.toISOString() } as User;
  } catch (error) {
    return null;
  }
}

export async function getUserCount(): Promise<number> {
  return prisma.user.count();
}
