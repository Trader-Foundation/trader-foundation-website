/**
 * <Picture> — renders a <picture> with webp/jpg fallback and required
 * width/height so layout doesn't shift on load.
 *
 * Pass the .jpg path as `src`; the .webp sibling is derived automatically.
 * If a companion .webp doesn't exist, pass `webp={null}` to disable it.
 */

import { CSSProperties } from 'react';

type PictureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  /** Set to 'high' only on the page's LCP image (usually the hero). */
  fetchPriority?: 'high' | 'low' | 'auto';
  webp?: string | null;
};

export default function Picture({
  src,
  alt,
  width,
  height,
  className,
  style,
  loading = 'lazy',
  fetchPriority,
  webp,
}: PictureProps) {
  const webpSrc = webp === null ? null : webp ?? src.replace(/\.(jpe?g|png)$/i, '.webp');
  return (
    <picture>
      {webpSrc && <source type="image/webp" srcSet={webpSrc} />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchPriority}
        className={className}
        style={style}
      />
    </picture>
  );
}
