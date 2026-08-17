/*
 * Project Board - simple Trello-style kanban for Vlad & Erin.
 * Unlisted: not linked from site nav, disallowed in robots.txt, noindex/nofollow.
 * Data lives in this browser's localStorage - there is no backend for it.
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlignLeft,
  Download,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

const LOGO_URL =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663123814280/RDBk4MGC92Zcyhd8ppAryH/Transparentlogo_ee195afe.png';

const STORAGE_KEY = 'tf-project-board-v1';

type Assignee = 'vlad' | 'erin' | 'both';

interface BoardCard {
  id: string;
  title: string;
  notes: string;
  assignee: Assignee | null;
  createdAt: number;
}

interface BoardColumn {
  id: string;
  title: string;
  cards: BoardCard[];
}

const ASSIGNEE_META: Record<Assignee, { label: string; className: string }> = {
  vlad: {
    label: 'Vlad',
    className: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  },
  erin: {
    label: 'Erin',
    className: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  },
  both: {
    label: 'Vlad + Erin',
    className: 'bg-violet-500/15 text-violet-300 border-violet-500/40',
  },
};

function defaultColumns(): BoardColumn[] {
  return [
    { id: nanoid(8), title: 'To Do', cards: [] },
    { id: nanoid(8), title: 'In Progress', cards: [] },
    { id: nanoid(8), title: 'Done', cards: [] },
  ];
}

function isBoardData(value: unknown): value is BoardColumn[] {
  return (
    Array.isArray(value) &&
    value.every(
      (col) =>
        col &&
        typeof col.id === 'string' &&
        typeof col.title === 'string' &&
        Array.isArray(col.cards) &&
        col.cards.every(
          (card: unknown) =>
            card &&
            typeof (card as BoardCard).id === 'string' &&
            typeof (card as BoardCard).title === 'string',
        ),
    )
  );
}

function loadBoard(): BoardColumn[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultColumns();
    const parsed = JSON.parse(raw);
    if (isBoardData(parsed)) return parsed;
  } catch {
    /* fall through to defaults */
  }
  return defaultColumns();
}

interface DropTarget {
  columnId: string;
  index: number;
}

export default function ProjectBoard() {
  const [columns, setColumns] = useState<BoardColumn[]>(loadBoard);
  const [dragCardId, setDragCardId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [editingCard, setEditingCard] = useState<{
    columnId: string;
    card: BoardCard;
  } | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [renamingColumn, setRenamingColumn] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Persist every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
    } catch {
      /* storage full or unavailable */
    }
  }, [columns]);

  // Keep multiple open tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (isBoardData(parsed)) setColumns(parsed);
      } catch {
        /* ignore bad payloads from other tabs */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addCard = (columnId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: [
                ...col.cards,
                {
                  id: nanoid(8),
                  title: trimmed,
                  notes: '',
                  assignee: null,
                  createdAt: Date.now(),
                },
              ],
            }
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
        return cards === col.cards ? col : { ...col, cards };
      });
    });
  };

  const addColumn = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setColumns((cols) => [...cols, { id: nanoid(8), title: trimmed, cards: [] }]);
  };

  const renameColumn = (columnId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setColumns((cols) =>
      cols.map((col) => (col.id === columnId ? { ...col, title: trimmed } : col)),
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
        const parsed = JSON.parse(String(reader.result));
        if (!isBoardData(parsed)) throw new Error('bad shape');
        setColumns(parsed);
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
            Vlad &amp; Erin · saved in this browser
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
              onCardClick={(card) => setEditingCard({ columnId: column.id, card })}
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

      {editingCard && (
        <CardDialog
          columns={columns}
          columnId={editingCard.columnId}
          card={editingCard.card}
          onClose={() => setEditingCard(null)}
          onSave={(card) => {
            updateCard(editingCard.columnId, card);
            setEditingCard(null);
          }}
          onMove={(toColumnId) => {
            const target = columns.find((c) => c.id === toColumnId);
            if (target) {
              moveCard(editingCard.card.id, toColumnId, target.cards.length);
            }
            setEditingCard(null);
          }}
          onDelete={() => {
            deleteCard(editingCard.columnId, editingCard.card.id);
            setEditingCard(null);
          }}
        />
      )}
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
  return (
    <div className="h-0.5 my-1 rounded-full bg-[oklch(0.75_0.06_80)]" />
  );
}

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
      className={`group cursor-pointer rounded-md bg-[#1d1d1d] border border-white/10 px-3 py-2 shadow-sm hover:border-white/25 transition-colors ${
        dragging ? 'opacity-40' : ''
      }`}
    >
      <div className="flex items-start gap-1.5">
        <p className="flex-1 text-sm leading-snug break-words">{card.title}</p>
        <GripVertical className="h-3.5 w-3.5 shrink-0 mt-0.5 text-white/20 group-hover:text-white/40" />
      </div>
      {(card.assignee || card.notes) && (
        <div className="mt-1.5 flex items-center gap-2">
          {card.assignee && (
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 h-4.5 font-medium ${ASSIGNEE_META[card.assignee].className}`}
            >
              {ASSIGNEE_META[card.assignee].label}
            </Badge>
          )}
          {card.notes && (
            <AlignLeft className="h-3.5 w-3.5 text-white/35" aria-label="Has notes" />
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

function CardDialog({
  columns,
  columnId,
  card,
  onClose,
  onSave,
  onMove,
  onDelete,
}: {
  columns: BoardColumn[];
  columnId: string;
  card: BoardCard;
  onClose: () => void;
  onSave: (card: BoardCard) => void;
  onMove: (toColumnId: string) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(card.title);
  const [notes, setNotes] = useState(card.notes);
  const [assignee, setAssignee] = useState<Assignee | null>(card.assignee);
  const otherColumns = columns.filter((c) => c.id !== columnId);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1a1a1a] border-white/15 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle
            className="text-white"
            style={{ fontFamily: "'Sen', sans-serif" }}
          >
            Edit card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 bg-black/30 border-white/20 text-white"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
              Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Details, links, next steps…"
              className="mt-1 min-h-[96px] bg-black/30 border-white/20 text-white placeholder:text-white/30"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
              Assigned to
            </label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {(Object.keys(ASSIGNEE_META) as Assignee[]).map((key) => (
                <button
                  key={key}
                  onClick={() =>
                    setAssignee((current) => (current === key ? null : key))
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    assignee === key
                      ? ASSIGNEE_META[key].className
                      : 'border-white/15 text-white/50 hover:text-white hover:border-white/35'
                  }`}
                >
                  {ASSIGNEE_META[key].label}
                </button>
              ))}
            </div>
          </div>

          {otherColumns.length > 0 && (
            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wide">
                Move to
              </label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {otherColumns.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      onSave({ ...card, title: title.trim() || card.title, notes, assignee });
                      onMove(col.id);
                    }}
                    className="rounded-md border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white hover:border-white/35 hover:bg-white/5 transition-colors"
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            Delete
          </Button>
          <Button
            size="sm"
            className="bg-[oklch(0.75_0.06_80)] text-black hover:bg-[oklch(0.85_0.04_80)]"
            onClick={() =>
              onSave({ ...card, title: title.trim() || card.title, notes, assignee })
            }
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
