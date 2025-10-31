import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BudgetChart({ products, expenses, i18n }) {
  const L = i18n || {};
  const priceLabel = L.chart?.price ?? 'Price';
  const costLabel  = L.chart?.cost  ?? 'Cost';
  const title      = L.chart?.title ?? 'Quick Profit View';
  const tip        = L.chart?.tip   ?? 'Tip: keep a simple tiered price structure and test bundles.';

  const data = (products || []).map(p => ({
    name: p.name || '',
    [priceLabel]: Number(p.price || 0),
    [costLabel]: Number(p.cost || 0),
  }));

  return (
    <section className="card">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={priceLabel} />
          <Bar dataKey={costLabel} />
        </BarChart>
      </ResponsiveContainer>
      <p style={{ textAlign: 'end', opacity: .8 }}>{tip}</p>
    </section>
  );
}
