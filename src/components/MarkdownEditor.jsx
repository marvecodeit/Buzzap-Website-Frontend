'use client';
import { useId, useState } from 'react';
import { Bold, Italic, Heading, Link2, Image as ImageIcon, PlayCircle, Film, List, Quote, Code } from 'lucide-react';
import { uploadBlogImage } from '@/lib/api';
import './markdown-editor.css';

// A lightweight Markdown editor: a textarea plus a toolbar that inserts Markdown
// snippets at the cursor. Images upload to Cloudinary and insert as ![](url).
// YouTube/video use a custom directive the renderer understands:
//   @youtube[VIDEO_ID_OR_URL]   @video[URL]
export default function MarkdownEditor({ value, onChange, rows = 14 }) {
  const textareaId = useId();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const getTextarea = () => document.getElementById(textareaId);

  // Insert text around/at the current selection and keep focus.
  const surround = (before, after = '', placeholder = '') => {
    const el = getTextarea();
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    // Restore selection just inside the inserted markers.
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + before.length;
      el.setSelectionRange(pos, pos + selected.length);
    });
  };

  const insertBlock = (text) => {
    const el = getTextarea();
    if (!el) return;
    const start = el.selectionStart;
    // Ensure the block sits on its own line.
    const prefix = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    const next = value.slice(0, start) + prefix + text + '\n' + value.slice(start);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + prefix.length + text.length + 1;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const { url } = await uploadBlogImage(file);
      insertBlock(`![${file.name}](${url})`);
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleYoutube = () => {
    const url = window.prompt('YouTube URL or video ID:');
    if (url) insertBlock(`@youtube[${url.trim()}]`);
  };

  const handleVideo = () => {
    const url = window.prompt('Video file URL (mp4/webm):');
    if (url) insertBlock(`@video[${url.trim()}]`);
  };

  const handleLink = () => {
    const url = window.prompt('Link URL:');
    if (url) surround('[', `](${url.trim()})`, 'link text');
  };

  const tools = [
    { icon: Bold, title: 'Bold', onClick: () => surround('**', '**', 'bold text') },
    { icon: Italic, title: 'Italic', onClick: () => surround('_', '_', 'italic text') },
    { icon: Heading, title: 'Heading', onClick: () => insertBlock('## Heading') },
    { icon: Link2, title: 'Link', onClick: handleLink },
    { icon: List, title: 'List', onClick: () => insertBlock('- List item') },
    { icon: Quote, title: 'Quote', onClick: () => insertBlock('> Quote') },
    { icon: Code, title: 'Code', onClick: () => surround('`', '`', 'code') },
    { icon: PlayCircle, title: 'YouTube', onClick: handleYoutube },
  ];

  return (
    <div className="md-editor">
      <div className="md-toolbar">
        {tools.map(({ icon: Icon, title, onClick }) => (
          <button key={title} type="button" className="md-tool" title={title} onClick={onClick}>
            <Icon size={15} />
          </button>
        ))}
        {/* Image upload via hidden input */}
        <label className="md-tool" title="Upload image" style={{ cursor: uploading ? 'wait' : 'pointer' }}>
          <ImageIcon size={15} />
          <input type="file" accept="image/*" onChange={handleImage} hidden disabled={uploading} />
        </label>
        <button type="button" className="md-tool" title="Video URL" onClick={handleVideo}>
          <Film size={15} />
        </button>
        {uploading && <span className="md-uploading">Uploading…</span>}
      </div>

      <textarea
        id={textareaId}
        className="md-textarea"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your post in Markdown. Use the toolbar to add images, videos, and links…"
      />

      {uploadError && <p className="dash-error" style={{ marginTop: 6 }}>{uploadError}</p>}
      <p className="md-hint">
        Supports Markdown. Embeds: <code>@youtube[url]</code> and <code>@video[url]</code> on their own line.
      </p>
    </div>
  );
}
