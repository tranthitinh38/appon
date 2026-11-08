import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const AdminChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Fetch metrics data from server
    fetch('/api/admin/metrics')
      .then((res) => res.json())
      .then((data) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        // Destroy previous chart instance if exists
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingChart = (window as any).adminChart as Chart | undefined;
        if (existingChart) existingChart.destroy();

        const chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Page Views', 'Quiz Requests'],
            datasets: [
              {
                label: 'Metrics',
                data: [data.metrics.pageViews, data.metrics.quizRequests],
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.2)',
                tension: 0.4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
        (window as any).adminChart = chart;
      })
      .catch((err) => console.error('Failed to load admin metrics', err));
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-750 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-100">Platform Analytics (Page Views & Quiz Requests)</h3>
        <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-full font-medium">Live Metrics</span>
      </div>
      <div className="h-64 flex items-center justify-center relative bg-slate-900/50 rounded-lg border border-slate-700">
        <canvas id="adminMetricsChart" ref={canvasRef} aria-label="Admin metrics line chart" role="img" className="w-full h-full max-h-60" />
      </div>
    </div>
  );
};

export default AdminChart;
