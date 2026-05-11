import { TYPE_META, DIFF_META } from '@/utils/constants';
import type { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  index: number;
}

export function VideoCard({ video, index }: VideoCardProps) {
  const tm = TYPE_META[video.type] ?? TYPE_META['concept']!;
  const dm = DIFF_META[video.difficulty] ?? DIFF_META['intermediate']!;

  return (
    <article
      className="video-card"
      style={{ borderLeftColor: tm.color, animationDelay: `${index * 60}ms` }}
    >
      <div className="video-card-top">
        <div className="video-card-main">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="video-title"
            aria-label={`${video.title} by ${video.channel} (opens YouTube)`}
          >
            {video.title}
          </a>
          <p className="video-channel">{video.channel}</p>
        </div>
        <div className="video-badges">
          <span
            className="badge"
            style={{ background: tm.bg, color: tm.color, borderColor: `${tm.color}30` }}
          >
            {video.type}
          </span>
          <span
            className="badge badge-diff"
            style={{ color: dm.color }}
          >
            {video.difficulty}
          </span>
        </div>
      </div>
      {video.why_useful && (
        <p className="video-why">{video.why_useful}</p>
      )}
    </article>
  );
}
