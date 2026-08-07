'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { getAllPricing, createPlan, updatePlan, deletePlan } from '@/lib/api';

const emptyForm = {
  name: '',
  description: '',
  monthlyPrice: '',
  yearlyPrice: '',
  priceSuffix: '/month',
  features: '',
  ctaLabel: 'Get started',
  popular: false,
  active: true,
  order: 0,
};

export default function PricingAdminPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getAllPricing();
        if (!cancelled) setPlans(data.plans || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load plans');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditingId(plan._id);
    setForm({
      name: plan.name || '',
      description: plan.description || '',
      monthlyPrice: plan.monthlyPrice ?? '',
      yearlyPrice: plan.yearlyPrice ?? '',
      priceSuffix: plan.priceSuffix || '/month',
      features: (plan.features || []).join('\n'),
      ctaLabel: plan.ctaLabel || 'Get started',
      popular: !!plan.popular,
      active: plan.active !== false,
      order: plan.order ?? 0,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        monthlyPrice: Number(form.monthlyPrice),
        yearlyPrice: Number(form.yearlyPrice),
        priceSuffix: form.priceSuffix || undefined,
        features: form.features
          ? form.features.split('\n').map((f) => f.trim()).filter(Boolean)
          : [],
        ctaLabel: form.ctaLabel || undefined,
        popular: form.popular,
        active: form.active,
        order: Number(form.order) || 0,
      };
      if (editingId) {
        const { plan } = await updatePlan(editingId, payload);
        setPlans((prev) => prev.map((p) => (p._id === editingId ? plan : p)));
      } else {
        const { plan } = await createPlan(payload);
        setPlans((prev) => [...prev, plan]);
      }
      setShowModal(false);
    } catch (err) {
      setFormError(err.details?.[0]?.message || err.message || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (planId) => {
    const prev = plans;
    setPlans((list) => list.filter((p) => p._id !== planId));
    try {
      await deletePlan(planId);
    } catch (err) {
      setError(err.message || 'Failed to delete plan');
      setPlans(prev);
    }
  };

  return (
    <>
      <div className="dash-page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="dash-page-title">Pricing</h1>
          <p className="dash-page-sub">Manage the plans shown on the public pricing page.</p>
        </div>
        <button className="dash-btn" onClick={openCreate}>
          <Plus size={15} /> New plan
        </button>
      </div>

      <div className="dash-panel">
        {error && <p className="dash-error" style={{ marginBottom: 12 }}>{error}</p>}

        {loading ? (
          <p className="dash-msg">Loading plans…</p>
        ) : (
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Monthly</th>
                  <th>Yearly</th>
                  <th>Popular</th>
                  <th>State</th>
                  <th>Order</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 ? (
                  <tr><td colSpan={7} className="dash-table-empty">No plans yet.</td></tr>
                ) : (
                  plans.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>${p.monthlyPrice}</td>
                      <td>${p.yearlyPrice}</td>
                      <td>{p.popular ? 'Yes' : '—'}</td>
                      <td>
                        <span className={`dash-badge ${p.active ? 'won' : 'new'}`}>
                          {p.active ? 'active' : 'hidden'}
                        </span>
                      </td>
                      <td>{p.order ?? 0}</td>
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

      {showModal && (
        <div className="dash-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <h2 className="dash-modal-title">{editingId ? 'Edit plan' : 'New plan'}</h2>
            <form onSubmit={handleSave}>
              <div className="dash-form-field">
                <label htmlFor="name">Plan name</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="dash-form-field">
                <label htmlFor="description">Description</label>
                <input id="description" name="description" value={form.description} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="dash-form-field" style={{ flex: 1 }}>
                  <label htmlFor="monthlyPrice">Monthly price ($)</label>
                  <input type="number" min="0" step="1" id="monthlyPrice" name="monthlyPrice" value={form.monthlyPrice} onChange={handleChange} required />
                </div>
                <div className="dash-form-field" style={{ flex: 1 }}>
                  <label htmlFor="yearlyPrice">Yearly price ($)</label>
                  <input type="number" min="0" step="1" id="yearlyPrice" name="yearlyPrice" value={form.yearlyPrice} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="dash-form-field" style={{ flex: 1 }}>
                  <label htmlFor="priceSuffix">Price suffix</label>
                  <input id="priceSuffix" name="priceSuffix" value={form.priceSuffix} onChange={handleChange} placeholder="/month" />
                </div>
                <div className="dash-form-field" style={{ flex: 1 }}>
                  <label htmlFor="order">Display order</label>
                  <input type="number" min="0" step="1" id="order" name="order" value={form.order} onChange={handleChange} />
                </div>
              </div>
              <div className="dash-form-field">
                <label htmlFor="ctaLabel">Button label</label>
                <input id="ctaLabel" name="ctaLabel" value={form.ctaLabel} onChange={handleChange} placeholder="Get started" />
              </div>
              <div className="dash-form-field">
                <label htmlFor="features">Features (one per line)</label>
                <textarea id="features" name="features" rows={5} value={form.features} onChange={handleChange} placeholder={'Unlimited emails\n3 seats\nPriority support'} />
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" name="popular" checked={form.popular} onChange={handleChange} />
                  Popular
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                  Active (visible publicly)
                </label>
              </div>

              {formError && <p className="dash-error" style={{ marginTop: 10 }}>{formError}</p>}

              <div className="dash-modal-actions">
                <button type="button" className="dash-btn dash-btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="dash-btn" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
