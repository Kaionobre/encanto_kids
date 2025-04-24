import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Slice { nome: string; value: number; }
interface Props { data: Slice[]; }

const COLORS = ['#9276B0', '#7A76B0', '#AB76B0'];

export const GraficoPacotes: React.FC<Props> = ({ data }) => (
  <PieChart width={240} height={240}>
    <Pie
      data={data}
      dataKey="value"
      nameKey="nome"
      cx="50%"
      cy="50%"
      outerRadius={80}
      label
      labelLine={false}
    >
      {data.map((_, index) => (
        <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip formatter={(value: number) => `${value} crianças`} />
    <Legend />
  </PieChart>
);
