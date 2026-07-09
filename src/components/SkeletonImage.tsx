import { useState } from 'react';

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Class applied to the outer wrapper div */
  wrapperClassName?: string;
  /** Aspect ratio hint so skeleton has correct height before image loads */
  aspectRatio?: string;
}

/**
 * Drop-in <img> replacement that shows a shimmer skeleton placeholder
 * until the image finishes loading, then crossfades to the real image.
 */
export default function SkeletonImage({
  src,
  alt,
  className,
  wrapperClassName,
  aspectRatio,
  style,
  ...props
}: SkeletonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`skeleton-image-wrapper ${wrapperClassName ?? ''}`}
      style={{ aspectRatio, position: 'relative', overflow: 'hidden', ...style }}
    >
      {/* Shimmer skeleton — hidden once image loads */}
      {!loaded && !error && (
        <div className="skeleton-shimmer" aria-hidden="true" />
      )}

      {/* Actual image — invisible until loaded */}
      <img
        src={src}
        alt={alt}
        className={`skeleton-real-img ${loaded ? 'skeleton-real-img--loaded' : ''} ${className ?? ''}`}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoaded(true); setError(true); }}
        {...props}
      />
    </div>
  );
}
