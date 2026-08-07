'use client';
import { useEffect, useState } from 'react';
import { getOverview, getLeadsTimeseries, getTraffic } from '@/lib/api';

const KPI_CONFIG = [
  { key: 'totalLeads', label: 'Total leads' },
  { key: 'newLeadsToday', label: 'New today' },
  { key: 'conversionRate', label: 'Conversion rate', suffix: '%' },
  { key: 'activeProjects', label: 'Active projects' },
  { key: 'completedProjects', label: 'Completed projects' },
  { key: 'wonLeads', label: 'Won leads' },
];

export default function DashboardOverview() {
  const [data, setData] = useState(null);
  const [series, setSeries] = useState([]);
  const [traffic, setTraffic] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOverview(), getLeadsTimeseries(30), getTraffic(30)])
      .then(([overview, ts, tr]) => {
        setData(overview);
        setSeries(ts.series || []);
        setTraffic(tr);
      })
      .catch((err) => setError(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="dash-msg">Loading analytics…</p>;
  if (error) return <p className="dash-error">{error}</p>;

  const maxCount = Math.max(1, ...series.map((d) => d.count));

  return (
    <>
      <div className="dash-page-head">
        <h1 className="dash-page-title">Overview</h1>
        <p className="dash-page-sub">Your agency at a glance.</p>
      </div>

      <div className="dash-kpi-grid">
        {KPI_CONFIG.map(({ key, label, suffix }) => (
          <div className="dash-kpi" key={key}>
            <div className="dash-kpi-label">{label}</div>
            <div className="dash-kpi-value">
              {data.kpis[key]}
              {suffix || ''}
            </div>
          </div>
        ))}
      </div>

      <div className="dash-panel">
        <div className="dash-panel-title">Leads — last 30 days</div>
        <div className="dash-chart">
          {series.map((d) => (
            <div className="dash-chart-bar-wrap" key={d.date} title={`${d.date}: ${d.count}`}>
              <div
                className="dash-chart-bar"
                style={{ height: `${(d.count / maxCount) * 100}%` }}
              />
              {/* Show every 5th day label to avoid crowding */}
              <span className="dash-chart-label">
                {new Date(d.date).getDate() % 5 === 0 ? new Date(d.date).getDate() : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {traffic && (
        <>
          <div className="dash-kpi-grid">
            <div className="dash-kpi">
              <div className="dash-kpi-label">Page views (30d)</div>
              <div className="dash-kpi-value">{traffic.totalViews}</div>
            </div>
            <div className="dash-kpi">
              <div className="dash-kpi-label">Unique visitors (30d)</div>
              <div className="dash-kpi-value">{traffic.uniqueVisitors}</div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-title">Page views — last 30 days</div>
            <div className="dash-chart">
              {(() => {
                const maxViews = Math.max(1, ...traffic.series.map((d) => d.count));
                return traffic.series.map((d) => (
                  <div className="dash-chart-bar-wrap" key={d.date} title={`${d.date}: ${d.count}`}>
                    <div className="dash-chart-bar" style={{ height: `${(d.count / maxViews) * 100}%` }} />
                    <span className="dash-chart-label">
                      {new Date(d.date).getDate() % 5 === 0 ? new Date(d.date).getDate() : ''}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-title">Top pages (30d)</div>
            {traffic.topPages.length === 0 ? (
              <p className="dash-msg">No page views recorded yet.</p>
            ) : (
              traffic.topPages.map((p) => (
                <div className="dash-breakdown-row" key={p.path}>
                  <span>{p.path}</span>
                  <span>{p.count}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <div className="dash-panel">
        <div className="dash-panel-title">Breakdowns</div>
        <div className="dash-breakdown">
          <div>
            <div className="dash-kpi-label" style={{ marginBottom: 8 }}>Leads by status</div>
            {Object.entries(data.leads.byStatus).map(([k, v]) => (
              <div className="dash-breakdown-row" key={k}>
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="dash-kpi-label" style={{ marginBottom: 8 }}>Leads by source</div>
            {Object.entries(data.leads.bySource).map(([k, v]) => (
              <div className="dash-breakdown-row" key={k}>
                <span>{k.replace('_', ' ')}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
