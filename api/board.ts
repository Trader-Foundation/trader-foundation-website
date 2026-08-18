/*
 * Shared storage for the internal Project Board (/board).
 * Stores the whole board as a JSON blob in Vercel Blob; every save writes a
 * new timestamped blob (stable URLs would be CDN-cached and serve stale
 * reads) and prunes old ones. Requires a Blob store connected to the
 * project (BLOB_READ_WRITE_TOKEN) - returns 501 until one exists.
 *
 * Auth: clients send x-board-key = sha256("tfboard|" + team passcode).
 * The expected hash lives only here (server-side), so the browser bundle
 * never contains a usable API credential.
 */

import { del, list, put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const EXPECTED_KEY =
  process.env.BOARD_API_KEY_SHA256 ??
  '7e422f3082b9aa440f42cee0e65eb1f778b7321d42353259f44b29d67b51c363';

const PREFIX = 'project-board/';
const KEEP_VERSIONS = 5;
const MAX_BODY_BYTES = 900_000;

function blobTimestamp(pathname: string): number {
  const match = pathname.match(/board-(\d+)/);
  return match ? Number(match[1]) : 0;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(501).json({ error: 'storage_not_configured' });
    return;
  }

  const key = req.headers['x-board-key'];
  if (typeof key !== 'string' || key !== EXPECTED_KEY) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: PREFIX, limit: 100 });
      if (blobs.length === 0) {
        res.status(200).json({ board: null });
        return;
      }
      const newest = blobs.reduce((a, b) =>
        blobTimestamp(b.pathname) > blobTimestamp(a.pathname) ? b : a,
      );
      const blobRes = await fetch(newest.url);
      if (!blobRes.ok) throw new Error(`blob fetch ${blobRes.status}`);
      const board = await blobRes.json();
      res.status(200).json({ board });
      return;
    }

    if (req.method === 'PUT') {
      const body = req.body;
      if (!body || !Array.isArray(body.columns)) {
        res.status(400).json({ error: 'bad_request' });
        return;
      }
      const board = {
        updatedAt: Date.now(),
        savedBy:
          typeof body.savedBy === 'string' ? body.savedBy.slice(0, 32) : null,
        columns: body.columns,
      };
      const text = JSON.stringify(board);
      if (text.length > MAX_BODY_BYTES) {
        res.status(413).json({ error: 'board_too_large' });
        return;
      }

      await put(`${PREFIX}board-${board.updatedAt}.json`, text, {
        access: 'public',
        addRandomSuffix: true,
        contentType: 'application/json',
      });

      const { blobs } = await list({ prefix: PREFIX, limit: 100 });
      const stale = blobs
        .sort((a, b) => blobTimestamp(b.pathname) - blobTimestamp(a.pathname))
        .slice(KEEP_VERSIONS);
      if (stale.length > 0) {
        await del(stale.map((b) => b.url));
      }

      res.status(200).json({ ok: true, updatedAt: board.updatedAt });
      return;
    }

    res.setHeader('Allow', 'GET, PUT');
    res.status(405).json({ error: 'method_not_allowed' });
  } catch (error) {
    console.error('board api error', error);
    res.status(500).json({ error: 'server_error' });
  }
}
