'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getProjects, createProject, getLeads } from '@/lib/api';
import StatusBadge from '../StatusBadge';

const SERVICE_TYPES = [
  'ai-marketing',
  'brand-seo',
  'crm-automation',
  'ai-agents',
  'content-strategy',
  'growth-consulting',
  'other',
];

const emptyForm = { title: '', client: '', serviceType: 'other', description: '', dueDate: '' };

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getProjects({ limit: 100 })
      .then((data) => setProjects(data.projects || []))
      .catch((err) => setError(err.message || 'Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const data = await getProjects({ limit: 100 });
        if (cancelled) return;
        setProjects(data.projects || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load projects');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load leads for the "client" picker when the modal opens (once).
  const openModal = async () => {
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
    if (leads.length === 0) {
      try {
        const data = await getLeads({ limit: 100 });
        setLeads(data.leads || []);
      } catch {
        /* picker will just be empty */
      }
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        client: form.client,
        serviceType: form.serviceType,
        description: form.description || undefined,
        dueDate: form.dueDate || undefined,
      };
      const { project } = await createProject(payload);
      setProjects((prev) => [project, ...prev]);
      setShowModal(false);
    } catch (err) {
      setFormError(err.details?.[0]?.message || err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="dash-page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="dash-page-title">Projects</h1>
          <p className="dash-page-sub">Active and completed client work.</p>
        </div>
        <button className="dash-btn" onClick={openModal}>
          <Plus size={15} /> New project
        </button>
      </div>

      <div className="dash-panel">
        {error && <p className="dash-error" style={{ marginBottom: 12 }}>{error}</p>}

        {loading ? (
          <p className="dash-msg">Loading projects…</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Progress</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="dash-table-empty">No projects yet.</td>
                  </tr>
                ) : (
                  projects.map((p) => (
                    <tr
                      key={p._id}
                      onClick={() => router.push(`/dashboard/projects/${p._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{p.title}</td>
                      <td>{p.client?.name || '—'}</td>
                      <td>{(p.serviceType || '').replace('-', ' ')}</td>
                      <td>{p.progress ?? 0}%</td>
                      <td>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : '—'}</td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="dash-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="dash-modal-title">New project</h2>
            <form onSubmit={handleCreate}>
              <div className="dash-form-field">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" value={form.title} onChange={handleChange} required />
              </div>

              <div className="dash-form-field">
                <label htmlFor="client">Client (lead)</label>
                <select id="client" name="client" value={form.client} onChange={handleChange} required>
                  <option value="">Select a lead…</option>
                  {leads.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name} — {l.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="dash-form-field">
                <label htmlFor="serviceType">Service type</label>
                <select id="serviceType" name="serviceType" value={form.serviceType} onChange={handleChange}>
                  {SERVICE_TYPES.map((s) => (
                    <option key={s} value={s}>{s.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>

              <div className="dash-form-field">
                <label htmlFor="dueDate">Due date</label>
                <input type="date" id="dueDate" name="dueDate" value={form.dueDate} onChange={handleChange} />
              </div>

              <div className="dash-form-field">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} />
              </div>

              {formError && <p className="dash-error">{formError}</p>}

              <div className="dash-modal-actions">
                <button type="button" className="dash-btn dash-btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-btn" disabled={saving}>
                  {saving ? 'Creating…' : 'Create project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
