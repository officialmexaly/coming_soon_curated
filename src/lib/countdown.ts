import { promises as fs } from 'node:fs';
import path from 'node:path';

const countdownDurationMs = 5 * 24 * 60 * 60 * 1000;
const storageDir = path.join(process.cwd(), 'server-data');
const storageFile = path.join(storageDir, 'countdown.json');

export interface CountdownState {
  createdAt: number;
  launchAt: number;
}

export interface CountdownPayload {
  launchAt: number;
  serverNow: number;
}

async function ensureCountdownState(): Promise<CountdownState> {
  await fs.mkdir(storageDir, { recursive: true });

  try {
    const raw = await fs.readFile(storageFile, 'utf8');
    const parsed = JSON.parse(raw) as Partial<CountdownState>;

    if (
      typeof parsed.createdAt === 'number' &&
      Number.isFinite(parsed.createdAt) &&
      typeof parsed.launchAt === 'number' &&
      Number.isFinite(parsed.launchAt)
    ) {
      return parsed as CountdownState;
    }
  } catch {
    // Create a fresh shared launch time below.
  }

  const createdAt = Date.now();
  const state: CountdownState = {
    createdAt,
    launchAt: createdAt + countdownDurationMs
  };

  await fs.writeFile(storageFile, JSON.stringify(state, null, 2), 'utf8');
  return state;
}

export async function getCountdownPayload(): Promise<CountdownPayload> {
  const state = await ensureCountdownState();

  return {
    launchAt: state.launchAt,
    serverNow: Date.now()
  };
}
