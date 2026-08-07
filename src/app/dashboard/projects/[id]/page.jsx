'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Upload, FileText, Download } from 'lucide-react';
import {
  getProject,
  updateProject,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getAssets,
  uploadAsset,
  deleteAsset,
} from '@/lib/api';
import StatusBadge from '../../StatusBadge';

const PROJECT_STATUSES = ['planning', 'in-progress', 'review', 'completed', 'on-hold'];
const MILESTONE_STATUSES = ['pending', 'in-progress', 'completed'];

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingField, setSavingField] = useState('');

  // New-milestone form.
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState('');
  const [addingMilestone, setAddingMilestone] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([getProject(id), getAssets(id).catch(() => ({ assets: [] }))])
      .then(([data, assetData]) => {
        setProject(data.project);
        setMilestones(data.milestones || []);
        setAssets(assetData.assets || []);
      })
      .catch((err) => setError(err.message || 'Failed to load project'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [data, assetData] = await Promise.all([getProject(id), getAssets(id).catch(() => ({ assets: [] }))]);
        if (cancelled) return;
        setProject(data.project);
        setMilestones(data.milestones || []);
        setAssets(assetData.assets || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load project');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const patchProject = async (field, value) => {
    setSavingField(field);
    try {
      const { project: updated } = await updateProject(id, { [field]: value });
      setProject((prev) => ({ ...prev, ...updated }));
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSavingField('');
    }
  };

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAddingMilestone(true);
    try {
      const { milestone } = await createMilestone(id, {
        title: newTitle.trim(),
        dueDate: newDue || undefined,
        order: milestones.length,
      });
      setMilestones((prev) => [...prev, milestone]);
      setNewTitle('');
      setNewDue('');
    } catch (err) {
      setError(err.details?.[0]?.message || err.message || 'Failed to add milestone');
    } finally {
      setAddingMilestone(false);
    }
  };

  const handleMilestoneStatus = async (milestoneId, status) => {
    try {
      const { milestone } = await updateMilestone(id, milestoneId, { status });
      setMilestones((prev) => prev.map((m) => (m._id === milestoneId ? milestone : m)));
    } catch (err) {
      setError(err.message || 'Failed to update milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    // Optimistic removal; reload on failure to resync.
    const prev = milestones;
    setMilestones((list) => list.filter((m) => m._id !== milestoneId));
    try {
      await deleteMilestone(id, milestoneId);
    } catch (err) {
      setError(err.message || 'Failed to delete milestone');
      setMilestones(prev);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const { asset } = await uploadAsset(id, file);
      setAssets((prev) => [asset, ...prev]);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const handleDeleteAsset = async (assetId) => {
    const prev = assets;
    setAssets((list) => list.filter((a) => a._id !== assetId));
    try {
      await deleteAsset(id, assetId);
    } catch (err) {
      setError(err.message || 'Failed to delete file');
      setAssets(prev);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (loading) return <p className="dash-msg">Loading project…</p>;
  if (error && !project) return <p className="dash-error">{error}</p>;
  if (!project) return null;

  return (
    <>
      <button className="dash-btn dash-btn-ghost" onClick={() => router.push('/dashboard/projects')} style={{ marginBottom: 18 }}>
        <ArrowLeft size={15} /> Back to projects
      </button>

      <div className="dash-page-head">
        <h1 className="dash-page-title">{project.title}</h1>
        <p className="dash-page-sub">
          {project.client?.name ? `Client: ${project.client.name}` : 'No client'}
          {project.client?.email ? ` · ${project.client.email}` : ''}
        </p>
      </div>

      {error && <p className="dash-error" style={{ marginBottom: 12 }}>{error}</p>}

      {/* Editable meta */}
      <div className="dash-panel">
        <div className="dash-panel-title">Details</div>
        <div className="dash-breakdown">
          <div className="dash-form-field">
            <label>Status</label>
            <select
              className="dash-select"
              value={project.status}
              disabled={savingField === 'status'}
              onChange={(e) => patchProject('status', e.target.value)}
            >
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="dash-form-field">
            <label>Progress: {project.progress ?? 0}%</label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={project.progress ?? 0}
              disabled={savingField === 'progress'}
              onChange={(e) => setProject((p) => ({ ...p, progress: Number(e.target.value) }))}
              onMouseUp={(e) => patchProject('progress', Number(e.target.value))}
              onTouchEnd={(e) => patchProject('progress', Number(e.target.value))}
            />
          </div>
        </div>
        {project.description && (
          <p style={{ marginTop: 14, color: 'var(--text-secondary)', fontSize: 14, whiteSpace: 'pre-wrap' }}>
            {project.description}
          </p>
        )}
      </div>

      {/* Milestones */}
      <div className="dash-panel">
        <div className="dash-panel-title">Milestones</div>

        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Due</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {milestones.length === 0 ? (
                <tr><td colSpan={4} className="dash-table-empty">No milestones yet.</td></tr>
              ) : (
                milestones.map((m) => (
                  <tr key={m._id}>
                    <td>{m.title}</td>
                    <td>{m.dueDate ? new Date(m.dueDate).toLocaleDateString() : '—'}</td>
                    <td>
                      <select
                        className="dash-select"
                        value={m.status}
                        onChange={(e) => handleMilestoneStatus(m._id, e.target.value)}
                      >
                        {MILESTONE_STATUSES.map((s) => (
                          <option key={s} value={s}>{s.replace('-', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="dash-icon-btn"
                        onClick={() => handleDeleteMilestone(m._id)}
                        aria-label="Delete milestone"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add milestone */}
        <form className="dash-milestone-add" onSubmit={handleAddMilestone}>
          <input
            type="text"
            placeholder="New milestone title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="date"
            value={newDue}
            onChange={(e) => setNewDue(e.target.value)}
          />
          <button type="submit" className="dash-btn" disabled={addingMilestone || !newTitle.trim()}>
            <Plus size={15} /> {addingMilestone ? 'Adding…' : 'Add'}
          </button>
        </form>
      </div>

      {/* Files */}
      <div className="dash-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="dash-panel-title" style={{ margin: 0 }}>Files</div>
          <label className={`dash-btn${uploading ? ' ' : ''}`} style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
            <Upload size={15} /> {uploading ? 'Uploading…' : 'Upload file'}
            <input type="file" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {assets.length === 0 ? (
          <p className="dash-msg">No files uploaded yet.</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={15} /> {a.filename}
                      </span>
                    </td>
                    <td>{formatBytes(a.bytes)}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <a
                        className="dash-icon-btn"
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Download file"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Download size={15} />
                      </a>
                      <button
                        className="dash-icon-btn"
                        onClick={() => handleDeleteAsset(a._id)}
                        aria-label="Delete file"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
