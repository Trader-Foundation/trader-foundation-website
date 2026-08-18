/*
 * Project Board - Trello-style kanban for the Trader Foundation team.
 * Unlisted: not linked from site nav, disallowed in robots.txt, noindex/nofollow.
 * Data lives in this browser's localStorage - there is no backend for it, and
 * the sign-in gate is a lightweight shared passcode, not real account security.
 */

import CardDetailDialog, {
  MemberAvatar,
} from '@/components/board/CardDetailDialog';
import {
  type BoardCard,
  type BoardColumn,
  type BoardSession,
  type MemberId,
  API_KEY_SALT,
  BOARD_PASSCODE_SHA256,
  MEMBER_IDS,
  MEMBERS,
  STORAGE_KEY,
  clearSession,
  countCards,
  dueStatus,
  fetchRemoteBoard,
  formatDue,
  loadBoard,
  loadSession,
  newCard,
  normalizeBoard,
  saveRemoteBoard,
  saveSession,
  sha256Hex,
} from '@/components/board/boardModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  CheckSquare,
  Download,
  FileText,
  LogOut,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

const LOGO_URL =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

interface DropTarget {
  columnId: string;
  index: number;
}

type SyncStatus = 'local' | 'syncing' | 'synced' | 'error';

const SAVE_DEBOUNCE_MS = 800;
const POLL_INTERVAL_MS = 8000;

export default function ProjectBoard() {
  const [session, setSession] = useState<BoardSession | null>(loadSession);
  const user = session?.member ?? null;
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [columns, setColumns] = useState<BoardColumn[]>(loadBoard);
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [editing, setEditing] = useState<{
    columnId: string;
    cardId: string;
  } | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [renamingColumn, setRenamingColumn] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // --- live sync plumbing ---
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const columnsRef = useRef(columns);
  columnsRef.current = columns;
  const apiAvailableRef = useRef(false);
  const applyingRemoteRef = useRef(false);
  const dirtyRef = useRef(false);
  const lastRemoteAtRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyRemote = (remoteColumns: BoardColumn[]) => {
    applyingRemoteRef.current = true;
    setColumns(remoteColumns);
  };

  const handleAuthFail = () => {
    apiAvailableRef.current = false;
    toast.error('The team passcode changed — sign in again');
    clearSession();
    setSession(null);
  };

  const doSave = async () => {
    const activeSession = sessionRef.current;
    if (!activeSession || !apiAvailableRef.current) return;
    dirtyRef.current = false;
    setSyncStatus('syncing');
    const result = await saveRemoteBoard(
      activeSession.key,
      columnsRef.current,
      MEMBERS[activeSession.member].name,
    );
    if (result.ok) {
      lastRemoteAtRef.current = result.data;
      if (!dirtyRef.current) setSyncStatus('synced');
    } else if (result.status === 401) {
      handleAuthFail();
    } else {
      dirtyRef.current = true; // retried by the next local change or poll
      setSyncStatus('error');
    }
  };

  // Persist every change; push user-made changes to the shared board
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    } catch {
      /* storage full or unavailable */
    }
    if (applyingRemoteRef.current) {
      applyingRemoteRef.current = false;
      return;
    }
    if (!apiAvailableRef.current || !sessionRef.current) return;
    dirtyRef.current = true;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(doSave, SAVE_DEBOUNCE_MS);
  }, [columns]);

  // Initial sync + polling while signed in
  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    const initialSync = async () => {
      const result = await fetchRemoteBoard(session.key);
      if (cancelled) return;
      if (!result.ok) {
        if (result.status === 401) handleAuthFail();
        else setSyncStatus('local'); // no storage configured yet
        return;
      }
      apiAvailableRef.current = true;
      const remote = result.data;
      if (remote && countCards(remote.columns) > 0) {
        lastRemoteAtRef.current = remote.updatedAt;
        const localJson = JSON.stringify(columnsRef.current);
        if (
          countCards(columnsRef.current) > 0 &&
          JSON.stringify(remote.columns) !== localJson
        ) {
          // keep a backup of the solo board this replaces
          try {
            localStorage.setItem(`${STORAGE_KEY}-backup-${Date.now()}`, localJson);
          } catch {
            /* ignore */
          }
          toast.info('Loaded the shared team board');
        }
        applyRemote(remote.columns);
        setSyncStatus('synced');
      } else {
        // shared board empty or missing: seed it with this browser's board
        await doSave();
      }
    };

    const poll = async () => {
      const activeSession = sessionRef.current;
      if (!activeSession || !apiAvailableRef.current) return;
      if (dirtyRef.current) return; // our own save is about to run
      const result = await fetchRemoteBoard(activeSession.key);
      if (cancelled || dirtyRef.current) return;
      if (!result.ok) {
        if (result.status === 401) handleAuthFail();
        else setSyncStatus('error');
        return;
      }
      const remote = result.data;
      if (remote && remote.updatedAt > lastRemoteAtRef.current) {
        lastRemoteAtRef.current = remote.updatedAt;
        if (
          JSON.stringify(remote.columns) !== JSON.stringify(columnsRef.current)
        ) {
          applyRemote(remote.columns);
        }
      }
      setSyncStatus('synced');
    };

    initialSync();
    const interval = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Keep multiple open tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const board = normalizeBoard(JSON.parse(e.newValue));
        if (board) setColumns(board);
      } catch {
        /* ignore bad payloads from other tabs */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const signOut = () => {
    clearSession();
    apiAvailableRef.current = false;
    setSyncStatus('local');
    setSession(null);
  };

  const addCard = (columnId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, newCard(trimmed)] }
          : col,
      ),
    );
  };

  const updateCard = (columnId: string, card: BoardCard) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((c) => (c.id === card.id ? card : c)),
            }
          : col,
      ),
    );
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col,
      ),
    );
  };

  const moveCard = (cardId: string, toColumnId: string, toIndex: number) => {
    setColumns((cols) => {
      const fromCol = cols.find((c) => c.cards.some((k) => k.id === cardId));
      if (!fromCol) return cols;
      const card = fromCol.cards.find((k) => k.id === cardId)!;
      const fromIndex = fromCol.cards.indexOf(card);

      let insertAt = toIndex;
      if (fromCol.id === toColumnId && fromIndex < toIndex) insertAt -= 1;

      return cols.map((col) => {
        const cards =
          col.id === fromCol.id
            ? col.cards.filter((k) => k.id !== cardId)
            : [...col.cards];
        if (col.id === toColumnId) cards.splice(insertAt, 0, card);
        return { ...col, cards };
      });
    });
  };

  const addColumn = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setColumns((cols) => [
      ...cols,
      { id: nanoid(8), title: trimmed, cards: [] },
    ]);
  };

  const renameColumn = (columnId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId ? { ...col, title: trimmed } : col,
      ),
    );
  };

  const deleteColumn = (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    if (!col) return;
    if (
      col.cards.length > 0 &&
      !window.confirm(
        `Delete "${col.title}" and its ${col.cards.length} card(s)?`,
      )
    ) {
      return;
    }
    setColumns((cols) => cols.filter((c) => c.id !== columnId));
  };

  const exportBoard = () => {
    const blob = new Blob([JSON.stringify(columns, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-board-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBoard = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const board = normalizeBoard(JSON.parse(String(reader.result)));
        if (!board) throw new Error('bad shape');
        setColumns(board);
        toast.success('Board imported');
      } catch {
        toast.error("That file doesn't look like a board export");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = () => {
    if (dragCardId && dropTarget) {
      moveCard(dragCardId, dropTarget.columnId, dropTarget.index);
    }
    setDragCardId(null);
    setDropTarget(null);
  };

  if (!session || !user) {
    return <LoginScreen onLogin={setSession} />;
  }

  const editingColumn = editing
    ? columns.find((c) => c.id === editing.columnId)
    : undefined;
  const editingCard = editingColumn?.cards.find(
    (c) => c.id === editing?.cardId,
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-[#111] text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Helmet>
        <title>Project Board | Trader Foundation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="flex items-center gap-4 px-4 md:px-6 py-4 border-b border-white/10">
        <img src={LOGO_URL} alt="Trader Foundation" className="h-8 w-auto" />
        <div className="min-w-0">
          <h1
            className="text-lg md:text-xl font-extrabold tracking-tight leading-none"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Project Board
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Vlad, Erin &amp; Ariana · <SyncBadge status={syncStatus} />
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={exportBoard}
          >
            <Download className="h-4 w-4 md:mr-1.5" />
            <span className="hidden md:inline">Export</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => importInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 md:mr-1.5" />
            <span className="hidden md:inline">Import</span>
          </Button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importBoard(file);
              e.target.value = '';
            }}
          />
          <div className="ml-1 flex items-center gap-2 border-l border-white/10 pl-3">
            <MemberAvatar memberId={user} />
            <span className="hidden sm:inline text-sm text-white/80">
              {MEMBERS[user].name}
            </span>
            <button
              className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/10"
              onClick={signOut}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto">
        <div className="flex items-start gap-4 p-4 md:p-6 min-h-full">
          {columns.map((column) => (
            <ColumnView
              key={column.id}
              column={column}
              dragCardId={dragCardId}
              dropTarget={dropTarget}
              renaming={renamingColumn === column.id}
              adding={addingToColumn === column.id}
              onStartRename={() => setRenamingColumn(column.id)}
              onRename={(title) => {
                renameColumn(column.id, title);
                setRenamingColumn(null);
              }}
              onDelete={() => deleteColumn(column.id)}
              onStartAdd={() => setAddingToColumn(column.id)}
              onAddCard={(title) => addCard(column.id, title)}
              onStopAdd={() => setAddingToColumn(null)}
              onCardClick={(card) =>
                setEditing({ columnId: column.id, cardId: card.id })
              }
              onDragStartCard={(cardId) => setDragCardId(cardId)}
              onDragEndCard={() => {
                setDragCardId(null);
                setDropTarget(null);
              }}
              onDropHint={(index) =>
                setDropTarget({ columnId: column.id, index })
              }
              onDrop={handleDrop}
            />
          ))}

          {/* Add list */}
          <div className="w-72 shrink-0">
            {addingColumn ? (
              <NewItemForm
                placeholder="List name…"
                submitLabel="Add list"
                onSubmit={(title) => {
                  addColumn(title);
                  setAddingColumn(false);
                }}
                onCancel={() => setAddingColumn(false)}
              />
            ) : (
              <button
                className="w-full rounded-lg border border-dashed border-white/20 px-3 py-2.5 text-left text-sm text-white/50 hover:text-white hover:border-white/40 hover:bg-white/5 transition-colors"
                onClick={() => setAddingColumn(true)}
              >
                <Plus className="inline h-4 w-4 mr-1.5 -mt-0.5" />
                Add another list
              </button>
            )}
          </div>
        </div>
      </main>

      {editing && editingCard && (
        <CardDetailDialog
          columns={columns}
          columnId={editing.columnId}
          card={editingCard}
          currentUser={user}
          onChange={(card) => updateCard(editing.columnId, card)}
          onMove={(toColumnId) => {
            const target = columns.find((c) => c.id === toColumnId);
            if (target) {
              moveCard(editingCard.id, toColumnId, target.cards.length);
              setEditing({ columnId: toColumnId, cardId: editingCard.id });
            }
          }}
          onDelete={() => {
            deleteCard(editing.columnId, editingCard.id);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

function SyncBadge({ status }: { status: SyncStatus }) {
  const meta: Record<SyncStatus, { dot: string; label: string; title: string }> =
    {
      synced: {
        dot: 'bg-emerald-400',
        label: 'live team sync',
        title: 'Everyone sees this board — changes sync automatically',
      },
      syncing: {
        dot: 'bg-amber-400 animate-pulse',
        label: 'saving…',
        title: 'Saving your changes to the shared board',
      },
      local: {
        dot: 'bg-white/30',
        label: 'saved in this browser',
        title:
          'Shared storage is not connected yet — this board is only saved on this device',
      },
      error: {
        dot: 'bg-red-400',
        label: 'sync error — saved locally',
        title:
          'Could not reach the shared board; your changes are kept in this browser and will retry',
      },
    };
  const { dot, label, title } = meta[status];
  return (
    <span className="inline-flex items-center gap-1.5" title={title}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function LoginScreen({ onLogin }: { onLogin: (session: BoardSession) => void }) {
  const [selected, setSelected] = useState<MemberId | null>(null);
  const [passcode, setPasscode] = useState('');
  const [checking, setChecking] = useState(false);

  const submit = async () => {
    if (!selected || !passcode || checking) return;
    setChecking(true);
    try {
      const hash = await sha256Hex(passcode);
      if (hash === BOARD_PASSCODE_SHA256) {
        const key = await sha256Hex(API_KEY_SALT + passcode);
        const session: BoardSession = { member: selected, key };
        saveSession(session);
        onLogin(session);
      } else {
        toast.error('Wrong passcode');
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#111] text-white px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Helmet>
        <title>Project Board | Trader Foundation</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <img src={LOGO_URL} alt="Trader Foundation" className="h-12 w-auto mb-6" />
      <h1
        className="text-2xl font-extrabold tracking-tight"
        style={{ fontFamily: "'Sen', sans-serif" }}
      >
        Project Board
      </h1>
      <p className="mt-1 text-sm text-white/50">Who's working?</p>

      <div className="mt-6 w-full max-w-sm space-y-2">
        {MEMBER_IDS.map((id) => {
          const member = MEMBERS[id];
          const active = selected === id;
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                active
                  ? 'border-[oklch(0.75_0.06_80)] bg-white/[0.07]'
                  : 'border-white/15 hover:border-white/35 hover:bg-white/5'
              }`}
            >
              <MemberAvatar memberId={id} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {member.name}
                </span>
                <span className="block text-xs text-white/45 truncate">
                  {member.email}
                </span>
              </span>
            </button>
          );
        })}

        <div className="pt-2">
          <Input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Team passcode"
            className="bg-black/30 border-white/20 text-white placeholder:text-white/30"
          />
          <Button
            className="mt-2 w-full bg-[oklch(0.75_0.06_80)] text-black hover:bg-[oklch(0.85_0.04_80)] disabled:opacity-40"
            disabled={!selected || !passcode || checking}
            onClick={submit}
          >
            Open the board
          </Button>
          <p className="mt-3 text-center text-xs text-white/35">
            One shared passcode for the team — ask Vlad if you don't have it.
          </p>
        </div>
      </div>
    </div>
  );
}

interface ColumnViewProps {
  column: BoardColumn;
  dragCardId: string | null;
  dropTarget: DropTarget | null;
  renaming: boolean;
  adding: boolean;
  onStartRename: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onStartAdd: () => void;
  onAddCard: (title: string) => void;
  onStopAdd: () => void;
  onCardClick: (card: BoardCard) => void;
  onDragStartCard: (cardId: string) => void;
  onDragEndCard: () => void;
  onDropHint: (index: number) => void;
  onDrop: () => void;
}

function ColumnView({
  column,
  dragCardId,
  dropTarget,
  renaming,
  adding,
  onStartRename,
  onRename,
  onDelete,
  onStartAdd,
  onAddCard,
  onStopAdd,
  onCardClick,
  onDragStartCard,
  onDragEndCard,
  onDropHint,
  onDrop,
}: ColumnViewProps) {
  const isDropColumn = dropTarget?.columnId === column.id;

  return (
    <div
      className={`w-72 shrink-0 rounded-lg bg-white/[0.06] border transition-colors ${
        isDropColumn ? 'border-[oklch(0.75_0.06_80)]/60' : 'border-white/10'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDropHint(column.cards.length);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
    >
      <div className="flex items-center gap-2 px-3 pt-3 pb-1">
        {renaming ? (
          <RenameInput initial={column.title} onDone={onRename} />
        ) : (
          <button
            className="min-w-0 flex-1 text-left text-sm font-bold truncate hover:text-white/80"
            style={{ fontFamily: "'Sen', sans-serif" }}
            onClick={onStartRename}
            title="Rename list"
          >
            {column.title}
            <span className="ml-2 font-normal text-white/40">
              {column.cards.length}
            </span>
          </button>
        )}
        <button
          className="shrink-0 p-1 rounded text-white/30 hover:text-red-400 hover:bg-white/10"
          onClick={onDelete}
          title="Delete list"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="px-2 pb-2 flex flex-col gap-1.5">
        {column.cards.map((card, index) => (
          <div key={card.id}>
            {isDropColumn && dropTarget?.index === index && dragCardId && (
              <DropIndicator />
            )}
            <CardView
              card={card}
              dragging={dragCardId === card.id}
              onClick={() => onCardClick(card)}
              onDragStart={() => onDragStartCard(card.id)}
              onDragEnd={onDragEndCard}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const before = e.clientY < rect.top + rect.height / 2;
                onDropHint(before ? index : index + 1);
              }}
            />
          </div>
        ))}
        {isDropColumn &&
          dropTarget?.index === column.cards.length &&
          dragCardId && <DropIndicator />}

        {adding ? (
          <NewItemForm
            placeholder="Card title…"
            submitLabel="Add card"
            keepOpen
            onSubmit={onAddCard}
            onCancel={onStopAdd}
          />
        ) : (
          <button
            className="rounded-md px-2 py-1.5 text-left text-sm text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            onClick={onStartAdd}
          >
            <Plus className="inline h-4 w-4 mr-1 -mt-0.5" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}

function DropIndicator() {
  return <div className="h-0.5 my-1 rounded-full bg-[oklch(0.75_0.06_80)]" />;
}

const DUE_CHIP_CLASSES = {
  overdue: 'bg-red-500/20 text-red-300',
  today: 'bg-amber-500/20 text-amber-300',
  upcoming: 'bg-white/10 text-white/60',
} as const;

interface CardViewProps {
  card: BoardCard;
  dragging: boolean;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

function CardView({
  card,
  dragging,
  onClick,
  onDragStart,
  onDragEnd,
  onDragOver,
}: CardViewProps) {
  const doneCount = card.checklist.filter((i) => i.done).length;
  const hasBadges =
    card.dueDate ||
    card.checklist.length > 0 ||
    card.comments.length > 0 ||
    card.googleDocUrl ||
    card.loomUrl ||
    card.attachments.length > 0 ||
    card.assignees.length > 0;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onClick={onClick}
      className={`cursor-pointer rounded-md bg-[#1d1d1d] border border-white/10 px-3 py-2 shadow-sm hover:border-white/25 transition-colors ${
        dragging ? 'opacity-40' : ''
      }`}
    >
      <p className="text-sm leading-snug break-words">{card.title}</p>
      {hasBadges && (
        <div className="mt-1.5 flex items-center gap-x-2 gap-y-1 flex-wrap text-white/45">
          {card.dueDate && (
            <span
              className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${DUE_CHIP_CLASSES[dueStatus(card.dueDate)]}`}
            >
              <Calendar className="h-3 w-3" />
              {formatDue(card.dueDate)}
            </span>
          )}
          {card.checklist.length > 0 && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] ${
                doneCount === card.checklist.length
                  ? 'text-emerald-300'
                  : ''
              }`}
            >
              <CheckSquare className="h-3 w-3" />
              {doneCount}/{card.checklist.length}
            </span>
          )}
          {card.comments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <MessageSquare className="h-3 w-3" />
              {card.comments.length}
            </span>
          )}
          {card.googleDocUrl && <FileText className="h-3 w-3" />}
          {card.loomUrl && <Video className="h-3 w-3" />}
          {card.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px]">
              <Paperclip className="h-3 w-3" />
              {card.attachments.length}
            </span>
          )}
          {card.assignees.length > 0 && (
            <span className="ml-auto inline-flex -space-x-1">
              {card.assignees.map((id) => (
                <MemberAvatar key={id} memberId={id} size="sm" />
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function RenameInput({
  initial,
  onDone,
}: {
  initial: string;
  onDone: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <Input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => onDone(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onDone(value);
        if (e.key === 'Escape') onDone(initial);
      }}
      className="h-7 flex-1 bg-black/30 border-white/20 text-sm text-white"
    />
  );
}

function NewItemForm({
  placeholder,
  submitLabel,
  keepOpen = false,
  onSubmit,
  onCancel,
}: {
  placeholder: string;
  submitLabel: string;
  keepOpen?: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState('');

  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
    if (!keepOpen) onCancel();
  };

  return (
    <div className="rounded-lg bg-white/[0.06] border border-white/10 p-2">
      <Textarea
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
          if (e.key === 'Escape') onCancel();
        }}
        className="min-h-[56px] bg-black/30 border-white/20 text-sm text-white placeholder:text-white/30 resize-none"
      />
      <div className="mt-2 flex items-center gap-2">
        <Button
          size="sm"
          className="h-7 bg-[oklch(0.75_0.06_80)] text-black hover:bg-[oklch(0.85_0.04_80)]"
          onClick={submit}
        >
          {submitLabel}
        </Button>
        <button
          className="p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10"
          onClick={onCancel}
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
