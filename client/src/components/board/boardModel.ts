/*
 * Data model + helpers for the internal Project Board (/board).
 * Board state lives in localStorage; the sign-in gate is a lightweight
 * client-side passcode, not real account security.
 */

import { nanoid } from 'nanoid';

export const STORAGE_KEY = 'tf-project-board-v2';
export const LEGACY_STORAGE_KEY = 'tf-project-board-v1';
export const SESSION_KEY = 'tf-board-session-v1';

// sha256("foundation2026") - change the passcode by replacing this hash
// (node -e "console.log(require('crypto').createHash('sha256').update('NEW').digest('hex'))")
export const BOARD_PASSCODE_SHA256 =
  '7698fa87c657f2ae3cdf20703915d3ee2c35c88da7a73a2c90567bb70c5295a9';

export type MemberId = 'vlad' | 'erin' | 'ariana';

export interface Member {
  id: MemberId;
  name: string;
  email: string;
  initials: string;
  chipClass: string;
  avatarClass: string;
}

export const MEMBERS: Record<MemberId, Member> = {
  vlad: {
    id: 'vlad',
    name: 'Vlad',
    email: 'vlad@traderfoundation.com',
    initials: 'V',
    chipClass: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    avatarClass: 'bg-amber-400 text-black',
  },
  erin: {
    id: 'erin',
    name: 'Erin',
    email: 'erin@traderfoundation.com',
    initials: 'E',
    chipClass: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    avatarClass: 'bg-sky-400 text-black',
  },
  ariana: {
    id: 'ariana',
    name: 'Ariana',
    email: 'ariana@traderfoundation.com',
    initials: 'A',
    chipClass: 'bg-violet-500/15 text-violet-300 border-violet-500/40',
    avatarClass: 'bg-violet-400 text-black',
  },
};

export const MEMBER_IDS: MemberId[] = ['vlad', 'erin', 'ariana'];

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface CardComment {
  id: string;
  author: MemberId;
  text: string;
  createdAt: number;
}

export interface CardAttachment {
  id: string;
  label: string;
  url: string;
}

export interface BoardCard {
  id: string;
  title: string;
  notes: string;
  assignees: MemberId[];
  dueDate: string | null; // YYYY-MM-DD
  googleDocUrl: string;
  loomUrl: string;
  attachments: CardAttachment[];
  checklist: ChecklistItem[];
  comments: CardComment[];
  createdAt: number;
}

export interface BoardColumn {
  id: string;
  title: string;
  cards: BoardCard[];
}

export function newCard(title: string): BoardCard {
  return {
    id: nanoid(8),
    title,
    notes: '',
    assignees: [],
    dueDate: null,
    googleDocUrl: '',
    loomUrl: '',
    attachments: [],
    checklist: [],
    comments: [],
    createdAt: Date.now(),
  };
}

export function defaultColumns(): BoardColumn[] {
  return [
    { id: nanoid(8), title: 'To Do', cards: [] },
    { id: nanoid(8), title: 'In Progress', cards: [] },
    { id: nanoid(8), title: 'Done', cards: [] },
  ];
}

function isMemberId(value: unknown): value is MemberId {
  return value === 'vlad' || value === 'erin' || value === 'ariana';
}

/* Accepts v1 cards (single `assignee`) and v2 cards; fills defaults for
   anything missing so old boards and exports keep working. */
function normalizeCard(raw: unknown): BoardCard | null {
  if (!raw || typeof raw !== 'object') return null;
  const card = raw as Record<string, unknown>;
  if (typeof card.id !== 'string' || typeof card.title !== 'string') {
    return null;
  }

  let assignees: MemberId[] = [];
  if (Array.isArray(card.assignees)) {
    assignees = card.assignees.filter(isMemberId);
  } else if (card.assignee === 'both') {
    assignees = ['vlad', 'erin'];
  } else if (isMemberId(card.assignee)) {
    assignees = [card.assignee];
  }

  return {
    id: card.id,
    title: card.title,
    notes: typeof card.notes === 'string' ? card.notes : '',
    assignees,
    dueDate:
      typeof card.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(card.dueDate)
        ? card.dueDate
        : null,
    googleDocUrl: typeof card.googleDocUrl === 'string' ? card.googleDocUrl : '',
    loomUrl: typeof card.loomUrl === 'string' ? card.loomUrl : '',
    attachments: Array.isArray(card.attachments)
      ? card.attachments.filter(
          (a: unknown): a is CardAttachment =>
            !!a &&
            typeof (a as CardAttachment).id === 'string' &&
            typeof (a as CardAttachment).label === 'string' &&
            typeof (a as CardAttachment).url === 'string',
        )
      : [],
    checklist: Array.isArray(card.checklist)
      ? card.checklist.filter(
          (i: unknown): i is ChecklistItem =>
            !!i &&
            typeof (i as ChecklistItem).id === 'string' &&
            typeof (i as ChecklistItem).text === 'string' &&
            typeof (i as ChecklistItem).done === 'boolean',
        )
      : [],
    comments: Array.isArray(card.comments)
      ? card.comments.filter(
          (c: unknown): c is CardComment =>
            !!c &&
            typeof (c as CardComment).id === 'string' &&
            typeof (c as CardComment).text === 'string' &&
            isMemberId((c as CardComment).author) &&
            typeof (c as CardComment).createdAt === 'number',
        )
      : [],
    createdAt: typeof card.createdAt === 'number' ? card.createdAt : Date.now(),
  };
}

export function normalizeBoard(value: unknown): BoardColumn[] | null {
  if (!Array.isArray(value)) return null;
  const columns: BoardColumn[] = [];
  for (const raw of value) {
    if (
      !raw ||
      typeof raw.id !== 'string' ||
      typeof raw.title !== 'string' ||
      !Array.isArray(raw.cards)
    ) {
      return null;
    }
    const cards: BoardCard[] = [];
    for (const rawCard of raw.cards) {
      const card = normalizeCard(rawCard);
      if (card) cards.push(card);
    }
    columns.push({ id: raw.id, title: raw.title, cards });
  }
  return columns;
}

export function loadBoard(): BoardColumn[] {
  for (const key of [STORAGE_KEY, LEGACY_STORAGE_KEY]) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const board = normalizeBoard(JSON.parse(raw));
      if (board) return board;
    } catch {
      /* try the next key */
    }
  }
  return defaultColumns();
}

export function loadSessionUser(): MemberId | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return isMemberId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/* https://www.loom.com/share/<id> or /embed/<id> -> embeddable URL */
export function loomEmbedUrl(url: string): string | null {
  const match = url.match(
    /^https?:\/\/(?:www\.)?loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/,
  );
  return match ? `https://www.loom.com/embed/${match[1]}` : null;
}

export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDue(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export type DueStatus = 'overdue' | 'today' | 'upcoming';

export function dueStatus(dateStr: string): DueStatus {
  const today = todayISO();
  if (dateStr < today) return 'overdue';
  if (dateStr === today) return 'today';
  return 'upcoming';
}

export function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
