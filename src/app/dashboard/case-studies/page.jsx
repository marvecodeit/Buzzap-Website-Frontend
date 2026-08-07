'use client';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Edit3, Upload, CheckCircle, TrendingUp } from 'lucide-react';
import { getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy, uploadBlogImage } from '@/lib/api';

export default function DashboardCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    company: '',
    industry: '',
    headline: '',
    challenge: '',
    solution: '',
    quote: '',
    author: '',
    coverImage: '',
    tag: 'Full AI System',
    color: '#818cf8',
    isFeatured: true,
  });

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

  const loadCaseStudies = useCallback(() => {
    setLoading(true);
    getCaseStudies()
      .then((data) => {
        setCaseStudies(data.caseStudies || []);
        setError('');
      })
      .catch((err) => setError(err.message || 'Failed to load case studies'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadCaseStudies();
  }, [loadCaseStudies]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      company: '',
      industry: '',
      headline: '',
      challenge: '',
      solution: '',
      quote: '',
      author: '',
      tag: 'Full AI System',
      color: '#818cf8',
      isFeatured: true,
    });
    setShowModal(true);
  };

  const openEditModal = (cs) => {
    setEditingItem(cs);
    setForm({
      company: cs.company || '',
      industry: cs.industry || '',
      headline: cs.headline || '',
      challenge: cs.challenge || '',
      solution: cs.solution || '',
      quote: cs.quote || '',
      author: cs.author || '',
      tag: cs.tag || 'Case Study',
      color: cs.color || '#818cf8',
      isFeatured: cs.isFeatured !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateCaseStudy(editingItem._id, form);
      } else {
        await createCaseStudy(form);
      }
      setShowModal(false);
      loadCaseStudies();
    } catch (err) {
      alert(err.message || 'Error saving case study');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this case study?')) return;
    try {
      await deleteCaseStudy(id);
      loadCaseStudies();
    } catch (err) {
      alert(err.message || 'Error deleting case study');
    }
  };

  return (
    <>
      <div className="dash-page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="dash-page-title">Case Studies</h1>
          <p className="dash-page-sub">Manage client success stories and documented results.</p>
        </div>
        <button className="dash-btn" onClick={openCreateModal}>
          <Plus size={15} /> Add Case Study
        </button>
      </div>

      {error && <p className="dash-error" style={{ marginBottom: 16 }}>{error}</p>}

      {loading ? (
        <div className="dash-bell-empty">Loading case studies…</div>
      ) : caseStudies.length === 0 ? (
        <div className="dash-bell-empty" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ marginBottom: 16, color: '#94a3b8' }}>No custom case studies added to the database yet.</p>
          <button className="dash-btn" onClick={openCreateModal}>
            <Plus size={15} /> Create your first case study
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {caseStudies.map((cs) => (
            <div
              key={cs._id}
              style={{
                background: 'rgba(10, 17, 40, 0.75)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: `${cs.color}15`, color: cs.color, border: `1px solid ${cs.color}30` }}>
                  {cs.industry}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEditModal(cs)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => handleDelete(cs._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9' }}>{cs.company}</h3>
              <p style={{ fontSize: '14px', color: '#818cf8', fontWeight: '700' }}>{cs.headline}</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>{cs.challenge?.substring(0, 120)}…</p>

              {cs.quote && (
                <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#cbd5e1', borderLeft: '2px solid #6366f1', paddingLeft: '10px', marginTop: 'auto' }}>
                  &ldquo;{cs.quote}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <form onSubmit={handleSubmit} style={{ background: '#080d1e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '32px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '20px' }}>
              {editingItem ? 'Edit Case Study' : 'New Case Study'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Company Name</label>
                <input required className="dash-input" style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Industry</label>
                <input required className="dash-input" style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Headline / Key Result</label>
              <input required className="dash-input" style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. $4.2M in new pipeline generated in 90 days." />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>The Challenge</label>
              <textarea required rows={3} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} value={form.challenge} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>What We Built (Solution)</label>
              <textarea required rows={3} style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Client Quote</label>
                <input className="dash-input" style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Author Name / Title</label>
                <input className="dash-input" style={{ width: '100%', padding: '10px', background: '#020617', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', borderRadius: '10px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="dash-btn" style={{ padding: '10px 24px' }}>Save Case Study</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
