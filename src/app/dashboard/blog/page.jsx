'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, Upload, Layout, FileText, Sparkles, X } from 'lucide-react';
import { getAllPosts, createPost, updatePost, deletePost, uploadBlogImage } from '@/lib/api';
import MarkdownEditor from '@/components/MarkdownEditor';

const emptyForm = { title: '', excerpt: '', content: '', coverImage: '', tags: '', published: false };

export default function BlogAdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [editorTab, setEditorTab] = useState('structured'); // 'structured' | 'markdown'

  // Structured Builder fields
  const [sec1Title, setSec1Title] = useState('');
  const [sec1Body, setSec1Body] = useState('');
  const [sec2Title, setSec2Title] = useState('');
  const [sec2Body, setSec2Body] = useState('');
  const [takeawayList, setTakeawayList] = useState('');
  const [calloutQuote, setCalloutQuote] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getAllPosts()
      .then((data) => setPosts(data.posts || []))
      .catch((err) => setError(err.message || 'Failed to load posts'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        if (cancelled) return;
        setPosts(data.posts || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load posts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSec1Title(''); setSec1Body('');
    setSec2Title(''); setSec2Body('');
    setTakeawayList(''); setCalloutQuote('');
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (post) => {
    setEditingId(post._id);
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || '',
      tags: (post.tags || []).join(', '),
      published: !!post.published,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const data = await uploadBlogImage(file);
      if (data.url) {
        setForm((f) => ({ ...f, coverImage: data.url }));
      }
    } catch (err) {
      alert(err.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const generateMarkdownFromStructured = () => {
    let md = '';
    if (form.excerpt) md += `*${form.excerpt}*\n\n`;

    if (takeawayList.trim()) {
      md += `### Key Highlights\n`;
      takeawayList.split('\n').filter(Boolean).forEach((item) => {
        md += `- ${item.replace(/^-/, '').trim()}\n`;
      });
      md += `\n`;
    }

    if (sec1Title.trim() || sec1Body.trim()) {
      if (sec1Title.trim()) md += `## ${sec1Title}\n\n`;
      if (sec1Body.trim()) md += `${sec1Body}\n\n`;
    }

    if (calloutQuote.trim()) {
      md += `> "${calloutQuote}"\n\n`;
    }

    if (sec2Title.trim() || sec2Body.trim()) {
      if (sec2Title.trim()) md += `## ${sec2Title}\n\n`;
      if (sec2Body.trim()) md += `${sec2Body}\n\n`;
    }

    return md.trim();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const finalContent = editorTab === 'structured' && !form.content ? generateMarkdownFromStructured() : form.content;
      if (!finalContent) throw new Error('Post content is required.');

      const payload = {
        title: form.title,
        excerpt: form.excerpt || undefined,
        content: finalContent,
        coverImage: form.coverImage || '',
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        published: form.published,
      };

      if (editingId) {
        const { post } = await updatePost(editingId, payload);
        setPosts((prev) => prev.map((p) => (p._id === editingId ? post : p)));
      } else {
        const { post } = await createPost(payload);
        setPosts((prev) => [post, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err.details?.[0]?.message || err.message || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this blog post?')) return;
    const prev = posts;
    setPosts((list) => list.filter((p) => p._id !== postId));
    try {
      await deletePost(postId);
    } catch (err) {
      setError(err.message || 'Failed to delete post');
      setPosts(prev);
    }
  };

  return (
    <>
      <div className="dash-page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="dash-page-title">Blog</h1>
          <p className="dash-page-sub">Create and manage insights posts.</p>
        </div>
        <button className="dash-btn" onClick={openCreate}>
          <Plus size={15} /> New post
        </button>
      </div>

      <div className="dash-panel">
        {error && <p className="dash-error" style={{ marginBottom: 12 }}>{error}</p>}

        {loading ? (
          <p className="dash-msg">Loading posts…</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Tags</th>
                  <th>State</th>
                  <th>Updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr><td colSpan={5} className="dash-table-empty">No posts yet.</td></tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{(p.tags || []).join(', ') || '—'}</td>
                      <td>
                        <span className={`dash-badge ${p.published ? 'won' : 'new'}`}>
                          {p.published ? 'published' : 'draft'}
                        </span>
                      </td>
                      <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                      <td style={{ display: 'flex', gap: 8 }}>
                        <button className="dash-icon-btn" onClick={() => openEdit(p)} aria-label="Edit" style={{ color: 'var(--text-secondary)' }}>
                          <Pencil size={15} />
                        </button>
                        <button className="dash-icon-btn" onClick={() => handleDelete(p._id)} aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal with Gesture Dismiss Prevention */}
      {showModal && (
        <div
          className="dash-modal-overlay"
          onClick={(e) => {
            // Strictly close ONLY if user explicitly clicks backdrop element directly
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div className="dash-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, width: '100%', maxHeight: '90vh', overflowY: 'auto', background: '#080d1e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 className="dash-modal-title" style={{ margin: 0 }}>{editingId ? 'Edit Post' : 'Create Article'}</h2>
              <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(2,6,23,0.6)', padding: 4, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => setEditorTab('structured')}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: editorTab === 'structured' ? '#6366f1' : 'transparent', color: editorTab === 'structured' ? '#fff' : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Layout size={14} /> Guided Section Builder
              </button>
              <button
                type="button"
                onClick={() => setEditorTab('markdown')}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: editorTab === 'markdown' ? '#6366f1' : 'transparent', color: editorTab === 'markdown' ? '#fff' : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <FileText size={14} /> Markdown / Custom Code
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="dash-form-field" style={{ marginBottom: 14 }}>
                <label htmlFor="title" style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Header (Main Title) *</label>
                <input id="title" name="title" className="dash-input" style={{ width: '100%', padding: 10, background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8 }} value={form.title} onChange={handleChange} placeholder="e.g. How AI Lead Automation Quadrupled Sales Pipeline" required />
              </div>

              <div className="dash-form-field" style={{ marginBottom: 14 }}>
                <label htmlFor="excerpt" style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Sub-head (Subtitle / Excerpt)</label>
                <input id="excerpt" name="excerpt" className="dash-input" style={{ width: '100%', padding: 10, background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8 }} value={form.excerpt} onChange={handleChange} placeholder="A short 1-2 sentence overview of the article" />
              </div>

              {/* Cover Image URL + Local Device Upload */}
              <div className="dash-form-field" style={{ marginBottom: 14 }}>
                <label htmlFor="coverImage" style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Cover Image</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input id="coverImage" name="coverImage" className="dash-input" style={{ flex: 1, padding: 10, background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8 }} value={form.coverImage} onChange={handleChange} placeholder="https://… or upload from local device" />
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    <Upload size={14} /> {uploadingImage ? 'Uploading…' : 'Upload File'}
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                  </label>
                </div>
              </div>

              <div className="dash-form-field" style={{ marginBottom: 14 }}>
                <label htmlFor="tags" style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Tags (comma-separated)</label>
                <input id="tags" name="tags" className="dash-input" style={{ width: '100%', padding: 10, background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8 }} value={form.tags} onChange={handleChange} placeholder="ai, growth, marketing, crm" />
              </div>

              {/* Guided Builder Mode */}
              {editorTab === 'structured' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, background: 'rgba(2,6,23,0.5)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={13} /> Section Content Generator
                  </span>

                  <div>
                    <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Key Highlights (1 point per line)</label>
                    <textarea rows={2} style={{ width: '100%', padding: 8, background: '#080d1e', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 6, fontSize: 12 }} value={takeawayList} onChange={(e) => setTakeawayList(e.target.value)} placeholder="- Instant lead response under 3 mins&#10;- Integrated Meta & WhatsApp automation" />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Section 1 Title & Body</label>
                    <input style={{ width: '100%', padding: 8, background: '#080d1e', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 6, fontSize: 12, marginBottom: 6 }} value={sec1Title} onChange={(e) => setSec1Title(e.target.value)} placeholder="Section 1 Title (e.g. The Traditional Lead Leak Problem)" />
                    <textarea rows={3} style={{ width: '100%', padding: 8, background: '#080d1e', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 6, fontSize: 12 }} value={sec1Body} onChange={(e) => setSec1Body(e.target.value)} placeholder="Write Section 1 paragraphs here…" />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Featured Quote / Highlight Callout</label>
                    <input style={{ width: '100%', padding: 8, background: '#080d1e', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 6, fontSize: 12 }} value={calloutQuote} onChange={(e) => setCalloutQuote(e.target.value)} placeholder="e.g. Speed to lead is the single biggest predictor of revenue conversion." />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginBottom: 4 }}>Section 2 Title & Body</label>
                    <input style={{ width: '100%', padding: 8, background: '#080d1e', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 6, fontSize: 12, marginBottom: 6 }} value={sec2Title} onChange={(e) => setSec2Title(e.target.value)} placeholder="Section 2 Title (e.g. The Buzzap Automated Solution)" />
                    <textarea rows={3} style={{ width: '100%', padding: 8, background: '#080d1e', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: 6, fontSize: 12 }} value={sec2Body} onChange={(e) => setSec2Body(e.target.value)} placeholder="Write Section 2 paragraphs here…" />
                  </div>
                </div>
              ) : (
                /* Raw Markdown Mode */
                <div className="dash-form-field" style={{ marginBottom: 14 }}>
                  <label htmlFor="content" style={{ fontSize: 12, color: '#cbd5e1', display: 'block', marginBottom: 4 }}>Full Content (Markdown)</label>
                  <MarkdownEditor
                    value={form.content}
                    onChange={(content) => setForm((f) => ({ ...f, content }))}
                  />
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cbd5e1', marginBottom: 20 }}>
                <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
                Publish Immediately
              </label>

              {formError && <p className="dash-error" style={{ marginBottom: 14 }}>{formError}</p>}

              <div className="dash-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" className="dash-btn dash-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="dash-btn" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
