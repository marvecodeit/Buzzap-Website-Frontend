'use client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './markdown-content.css';

// Extract a YouTube video id from a full URL or a bare id.
function youtubeId(input) {
  const s = input.trim();
  const m = s.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (m) return m[1];
  if (/^[\w-]{11}$/.test(s)) return s;
  return null;
}

// Split content into segments: plain markdown chunks and embed directives
// (@youtube[...] / @video[...]) that each sit on their own line.
function parseSegments(content) {
  const lines = content.split('\n');
  const segments = [];
  let buffer = [];

  const flush = () => {
    if (buffer.length) {
      segments.push({ type: 'md', value: buffer.join('\n') });
      buffer = [];
    }
  };

  for (const line of lines) {
    const yt = line.match(/^@youtube\[(.+)\]\s*$/);
    const vid = line.match(/^@video\[(.+)\]\s*$/);
    if (yt) {
      flush();
      segments.push({ type: 'youtube', value: yt[1] });
    } else if (vid) {
      flush();
      segments.push({ type: 'video', value: vid[1] });
    } else {
      buffer.push(line);
    }
  }
  flush();
  return segments;
}

// react-markdown renders sanitized output (no raw HTML) by default → XSS-safe.
// We add target/rel to links and lazy-load images.
const mdComponents = {
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer nofollow" />,
  img: ({ node, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} loading="lazy" alt={props.alt || ''} className="md-img" />
  ),
};

export default function MarkdownContent({ content }) {
  if (!content) return null;
  const segments = parseSegments(content);

  return (
    <div className="md-content">
      {segments.map((seg, i) => {
        if (seg.type === 'youtube') {
          const id = youtubeId(seg.value);
          if (!id) return null;
          return (
            <div className="md-embed" key={i}>
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          );
        }
        if (seg.type === 'video') {
          return (
            <div className="md-embed" key={i}>
              <video src={seg.value} controls preload="metadata" />
            </div>
          );
        }
        return (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={mdComponents}>
            {seg.value}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
