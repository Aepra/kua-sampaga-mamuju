// ============================================================
// Users Data Access Layer
// ============================================================

import { User, UserPublic } from '@/lib/types';
import { readJsonFile, writeJsonFile } from './json-helper';

const FILE = 'users.json';

export async function getAllUsers(): Promise<User[]> {
  return readJsonFile<User[]>(FILE);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getAllUsers();
  return users.find(u => u.id === id);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getAllUsers();
  return users.find(u => u.email === email);
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
  const users = await getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  await writeJsonFile(FILE, users);
  return users[index];
}

export async function getUserCount(): Promise<number> {
  const users = await getAllUsers();
  return users.length;
}
