'use client';
import { useEffect, useState, useCallback } from 'react';
import { getLeads, updateLead } from '@/lib/api';

const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getLeads({ status: statusFilter, limit: 100 })
      .then((data) => setLeads(data.leads || []))
      .catch((err) => setError(err.message || 'Failed to load leads'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const data = await getLeads({ status: statusFilter, limit: 100 });
        if (cancelled) return;
        setLeads(data.leads || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load leads');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    setSavingId(id);
    try {
      const { lead } = await updateLead(id, { status });
      setLeads((prev) => prev.map((l) => (l._id === id ? lead : l)));
    } catch (err) {
      setError(err.message || 'Failed to update lead');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <div className="dash-page-head">
        <h1 className="dash-page-title">Leads</h1>
        <p className="dash-page-sub">Inquiries captured from the site.</p>
      </div>

      <div className="dash-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="dash-panel-title" style={{ margin: 0 }}>
            {leads.length} lead{leads.length === 1 ? '' : 's'}
          </div>
          <select
            className="dash-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {error && <p className="dash-error" style={{ marginBottom: 12 }}>{error}</p>}

        {loading ? (
          <p className="dash-msg">Loading leads…</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Service</th>
                  <th>Source</th>
                  <th>Received</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="dash-table-empty">No leads yet.</td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.company || '—'}</td>
                      <td>{lead.service || '—'}</td>
                      <td>{(lead.source || '').replace('_', ' ') || '—'}</td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="dash-select"
                          value={lead.status}
                          disabled={savingId === lead._id}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
