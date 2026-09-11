/*
 * Trello-style card detail modal for the internal Project Board.
 * All edits apply to board state immediately (no explicit save step).
 */

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlignLeft,
  Calendar,
  CheckSquare,
  ExternalLink,
  FileText,
  Link2,
  MessageSquare,
  Paperclip,
  Plus,
  Trash2,
  Users,
  Video,
  X,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import {
  type BoardCard,
  type BoardColumn,
  type MemberId,
  MEMBER_IDS,
  MEMBERS,
  loomEmbedUrl,
  timeAgo,
} from './boardModel';

const SECTION_LABEL =
  'flex items-center gap-1.5 text-xs font-semibold text-white/50 uppercase tracking-wide';
const FIELD_INPUT =
  'bg-black/30 border-white/20 text-white placeholder:text-white/30';

export function MemberAvatar({
  memberId,
  size = 'md',
}: {
  memberId: MemberId;
  size?: 'sm' | 'md';
}) {
  const member = MEMBERS[memberId];
  const sizeClass = size === 'sm' ? 'h-5 w-5 text-[10px]' : 'h-7 w-7 text-xs';
  return (
    <span
      title={`${member.name} · ${member.email}`}
      className={`inline-flex items-center justify-center rounded-full font-bold ${sizeClass} ${member.avatarClass}`}
    >
      {member.initials}
    </span>
  );
}

interface CardDetailDialogProps {
  columns: BoardColumn[];
  columnId: string;
  card: BoardCard;
  currentUser: MemberId;
  onChange: (card: BoardCard) => void;
  onMove: (toColumnId: string) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function CardDetailDialog({
  columns,
  columnId,
  card,
  currentUser,
  onChange,
  onMove,
  onDelete,
  onClose,
}: CardDetailDialogProps) {
  const column = columns.find((c) => c.id === columnId);
  const otherColumns = columns.filter((c) => c.id !== columnId);
  const patch = (changes: Partial<BoardCard>) => onChange({ ...card, ...changes });

  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [newComment, setNewComment] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentLabel, setAttachmentLabel] = useState('');

  const doneCount = card.checklist.filter((i) => i.done).length;
  const checklistPct =
    card.checklist.length === 0
      ? 0
      : Math.round((doneCount / card.checklist.length) * 100);
  const loomEmbed = loomEmbedUrl(card.loomUrl);

  const addChecklistItem = () => {
    const text = newChecklistItem.trim();
    if (!text) return;
    patch({
      checklist: [...card.checklist, { id: nanoid(8), text, done: false }],
    });
    setNewChecklistItem('');
  };

  const addComment = () => {
    const text = newComment.trim();
    if (!text) return;
    patch({
      comments: [
        { id: nanoid(8), author: currentUser, text, createdAt: Date.now() },
        ...card.comments,
      ],
    });
    setNewComment('');
  };

  const addAttachment = () => {
    const url = attachmentUrl.trim();
    if (!url) return;
    const label = attachmentLabel.trim() || url.replace(/^https?:\/\//, '');
    patch({
      attachments: [...card.attachments, { id: nanoid(8), label, url }],
    });
    setAttachmentUrl('');
    setAttachmentLabel('');
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#1a1a1a] border-white/15 text-white sm:max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle asChild>
            <Input
              value={card.title}
              onChange={(e) => patch({ title: e.target.value })}
              className="border-transparent bg-transparent px-0 text-lg font-bold text-white focus-visible:border-white/20 focus-visible:bg-black/30 focus-visible:px-2"
              style={{ fontFamily: "'Sen', sans-serif" }}
              aria-label="Card title"
            />
          </DialogTitle>
          <p className="text-xs text-white/40">
            in list <span className="text-white/60">{column?.title}</span>
          </p>
        </DialogHeader>

        <div className="space-y-5">
          {/* List + due date */}
          <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
            {otherColumns.length > 0 && (
              <div>
                <span className={SECTION_LABEL}>Move to</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {otherColumns.map((col) => (
                    <button
                      key={col.id}
                      onClick={() => onMove(col.id)}
                      className="rounded-md border border-white/15 px-3 py-1 text-xs text-white/70 hover:text-white hover:border-white/35 hover:bg-white/5 transition-colors"
                    >
                      {col.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span className={SECTION_LABEL}>
                <Calendar className="h-3.5 w-3.5" />
                Due date
              </span>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Input
                  type="date"
                  value={card.dueDate ?? ''}
                  onChange={(e) => patch({ dueDate: e.target.value || null })}
                  className={`h-8 w-40 text-sm ${FIELD_INPUT} [color-scheme:dark]`}
                />
                {card.dueDate && (
                  <button
                    className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"
                    onClick={() => patch({ dueDate: null })}
                    title="Clear due date"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <span className={SECTION_LABEL}>
              <Users className="h-3.5 w-3.5" />
              Members
            </span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {MEMBER_IDS.map((id) => {
                const active = card.assignees.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() =>
                      patch({
                        assignees: active
                          ? card.assignees.filter((a) => a !== id)
                          : [...card.assignees, id],
                      })
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      active
                        ? MEMBERS[id].chipClass
                        : 'border-white/15 text-white/50 hover:text-white hover:border-white/35'
                    }`}
                  >
                    {MEMBERS[id].name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <span className={SECTION_LABEL}>
              <AlignLeft className="h-3.5 w-3.5" />
              Description
            </span>
            <Textarea
              value={card.notes}
              onChange={(e) => patch({ notes: e.target.value })}
              placeholder="Details, context, next steps…"
              className={`mt-1.5 min-h-[80px] ${FIELD_INPUT}`}
            />
          </div>

          {/* Google Doc */}
          <div>
            <span className={SECTION_LABEL}>
              <FileText className="h-3.5 w-3.5" />
              Google Doc
            </span>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Input
                value={card.googleDocUrl}
                onChange={(e) => patch({ googleDocUrl: e.target.value })}
                placeholder="Paste a Google Doc / Sheet link…"
                className={`h-8 text-sm ${FIELD_INPUT}`}
              />
              {card.googleDocUrl && (
                <a
                  href={card.googleDocUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10"
                  title="Open doc"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Loom */}
          <div>
            <span className={SECTION_LABEL}>
              <Video className="h-3.5 w-3.5" />
              Loom video
            </span>
            <div className="mt-1.5 flex items-center gap-1.5">
              <Input
                value={card.loomUrl}
                onChange={(e) => patch({ loomUrl: e.target.value })}
                placeholder="Paste a Loom share link…"
                className={`h-8 text-sm ${FIELD_INPUT}`}
              />
              {card.loomUrl && (
                <a
                  href={card.loomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 p-1.5 rounded text-white/50 hover:text-white hover:bg-white/10"
                  title="Open in Loom"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            {loomEmbed && (
              <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-black">
                <iframe
                  src={loomEmbed}
                  title="Loom video"
                  className="h-full w-full"
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              </div>
            )}
            {card.loomUrl && !loomEmbed && (
              <p className="mt-1.5 text-xs text-amber-300/80">
                That doesn't look like a Loom link — expected
                loom.com/share/…
              </p>
            )}
          </div>

          {/* Attachments */}
          <div>
            <span className={SECTION_LABEL}>
              <Paperclip className="h-3.5 w-3.5" />
              Attachments
            </span>
            {card.attachments.length > 0 && (
              <ul className="mt-1.5 space-y-1">
                {card.attachments.map((attachment) => (
                  <li
                    key={attachment.id}
                    className="group flex items-center gap-2 rounded-md bg-white/[0.05] border border-white/10 px-2.5 py-1.5"
                  >
                    <Link2 className="h-3.5 w-3.5 shrink-0 text-white/40" />
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="min-w-0 flex-1 truncate text-sm text-sky-300 hover:underline"
                      title={attachment.url}
                    >
                      {attachment.label}
                    </a>
                    <button
                      className="shrink-0 p-1 rounded text-white/30 hover:text-red-400 hover:bg-white/10"
                      onClick={() =>
                        patch({
                          attachments: card.attachments.filter(
                            (a) => a.id !== attachment.id,
                          ),
                        })
                      }
                      title="Remove attachment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-1.5 flex flex-col sm:flex-row gap-1.5">
              <Input
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                placeholder="Link URL (Drive, Dropbox, image…)"
                className={`h-8 text-sm ${FIELD_INPUT}`}
                onKeyDown={(e) => e.key === 'Enter' && addAttachment()}
              />
              <Input
                value={attachmentLabel}
                onChange={(e) => setAttachmentLabel(e.target.value)}
                placeholder="Name (optional)"
                className={`h-8 text-sm sm:w-44 ${FIELD_INPUT}`}
                onKeyDown={(e) => e.key === 'Enter' && addAttachment()}
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 shrink-0 border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                onClick={addAttachment}
              >
                <Plus className="h-4 w-4 mr-1" />
                Attach
              </Button>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <span className={SECTION_LABEL}>
              <CheckSquare className="h-3.5 w-3.5" />
              Checklist
              {card.checklist.length > 0 && (
                <span className="normal-case font-normal text-white/40">
                  {doneCount}/{card.checklist.length}
                </span>
              )}
            </span>
            {card.checklist.length > 0 && (
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[oklch(0.75_0.06_80)] transition-all"
                  style={{ width: `${checklistPct}%` }}
                />
              </div>
            )}
            <ul className="mt-2 space-y-1">
              {card.checklist.map((item) => (
                <li key={item.id} className="group flex items-center gap-2.5 px-1">
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={(checked) =>
                      patch({
                        checklist: card.checklist.map((i) =>
                          i.id === item.id ? { ...i, done: checked === true } : i,
                        ),
                      })
                    }
                    className="border-white/30 data-[state=checked]:bg-[oklch(0.75_0.06_80)] data-[state=checked]:border-[oklch(0.75_0.06_80)] data-[state=checked]:text-black"
                  />
                  <span
                    className={`flex-1 text-sm ${
                      item.done ? 'text-white/35 line-through' : 'text-white/85'
                    }`}
                  >
                    {item.text}
                  </span>
                  <button
                    className="p-1 rounded text-white/0 group-hover:text-white/30 hover:!text-red-400 hover:bg-white/10"
                    onClick={() =>
                      patch({
                        checklist: card.checklist.filter((i) => i.id !== item.id),
                      })
                    }
                    title="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-1.5 flex gap-1.5">
              <Input
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add an item…"
                className={`h-8 text-sm ${FIELD_INPUT}`}
                onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
              />
              <Button
                size="sm"
                variant="outline"
                className="h-8 shrink-0 border-white/20 bg-transparent text-white/80 hover:bg-white/10 hover:text-white"
                onClick={addChecklistItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div>
            <span className={SECTION_LABEL}>
              <MessageSquare className="h-3.5 w-3.5" />
              Comments
              {card.comments.length > 0 && (
                <span className="normal-case font-normal text-white/40">
                  {card.comments.length}
                </span>
              )}
            </span>
            <div className="mt-2 flex items-start gap-2">
              <MemberAvatar memberId={currentUser} />
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment…"
                  className={`min-h-[60px] ${FIELD_INPUT}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      addComment();
                    }
                  }}
                />
                {newComment.trim() && (
                  <Button
                    size="sm"
                    className="mt-1.5 h-7 bg-[oklch(0.75_0.06_80)] text-black hover:bg-[oklch(0.85_0.04_80)]"
                    onClick={addComment}
                  >
                    Comment
                  </Button>
                )}
              </div>
            </div>
            <ul className="mt-3 space-y-3">
              {card.comments.map((comment) => (
                <li key={comment.id} className="flex items-start gap-2">
                  <MemberAvatar memberId={comment.author} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs">
                      <span className="font-semibold text-white/90">
                        {MEMBERS[comment.author].name}
                      </span>{' '}
                      <span className="text-white/35">
                        {timeAgo(comment.createdAt)}
                      </span>
                    </p>
                    <div className="mt-1 rounded-md bg-white/[0.06] border border-white/10 px-3 py-2">
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {comment.text}
                      </p>
                    </div>
                    {comment.author === currentUser && (
                      <button
                        className="mt-0.5 text-[11px] text-white/30 hover:text-red-400 underline-offset-2 hover:underline"
                        onClick={() =>
                          patch({
                            comments: card.comments.filter(
                              (c) => c.id !== comment.id,
                            ),
                          })
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Danger zone */}
          <div className="border-t border-white/10 pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={() => {
                if (window.confirm(`Delete card "${card.title}"?`)) onDelete();
              }}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete card
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
