import React, { useEffect, useRef } from 'react';
import { translations } from '../types';

interface ChartsProps {
  principal: number;
  interest: number;
  yearlySchedule: { label: string; principalPaid: number; interestPaid: number }[];
  currentLang: 'en' | 'hi';
}

export default function LoanCharts({ principal, interest, yearlySchedule, currentLang }: ChartsProps) {
  const doughnutRef = useRef<HTMLCanvasElement | null>(null);
  const barRef = useRef<HTMLCanvasElement | null>(null);
  
  const doughnutChartInstance = useRef<any>(null);
  const barChartInstance = useRef<any>(null);

  useEffect(() => {
    const Chart = (window as any).Chart;
    if (!Chart) return;

    // Create / Update Doughnut Chart
    if (doughnutRef.current) {
      if (doughnutChartInstance.current) {
        doughnutChartInstance.current.destroy();
      }

      const total = principal + interest;
      const formattedTotal = total.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

      doughnutChartInstance.current = new Chart(doughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: currentLang === 'en' ? ['Principal', 'Interest'] : ['मूलधन', 'ब्याज'],
          datasets: [{
            data: [principal, interest],
            backgroundColor: ['#6366f1', '#f59e0b'],
            hoverBackgroundColor: ['#4f46e5', '#d97706'],
            borderWidth: 2.5,
            borderColor: document.body.classList.contains('dark') ? '#0f172a' : '#ffffff',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: document.body.classList.contains('dark') ? '#94A3B8' : '#64748B',
                font: { family: 'Inter', size: 12, weight: 'bold' }
              }
            },
            tooltip: {
              backgroundColor: document.body.classList.contains('dark') ? '#1e293b' : '#0f172a',
              titleFont: { family: 'Inter', size: 11, weight: 'bold' },
              bodyFont: { family: 'Inter', size: 12 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (context: any) => {
                  const val = context.raw;
                  const pct = ((val / total) * 100).toFixed(1);
                  return ` ₹${Math.round(val).toLocaleString('en-IN')} (${pct}%)`;
                }
              }
            }
          },
          cutout: '72%'
        },
        plugins: [{
          id: 'centerText',
          beforeDraw: (chart: any) => {
            const { width, height, ctx } = chart;
            ctx.restore();
            
            // Draw Subtext
            ctx.font = '650 11px Inter';
            ctx.fillStyle = document.body.classList.contains('dark') ? '#94A3B8' : '#64748B';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(currentLang === 'en' ? 'Total Outflow' : 'कुल भुगतान', width / 2, height / 2 - 12);

            // Draw Amount Value
            ctx.font = 'bold 16px Outfit';
            ctx.fillStyle = document.body.classList.contains('dark') ? '#F1F5F9' : '#0F172A';
            ctx.fillText(formattedTotal, width / 2, height / 2 + 10);
            ctx.save();
          }
        }]
      });
    }

    // Create / Update Bar Chart
    if (barRef.current) {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }

      const labels = yearlySchedule.map(item => item.label);
      const principalData = yearlySchedule.map(item => item.principalPaid);
      const interestData = yearlySchedule.map(item => item.interestPaid);

      barChartInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: currentLang === 'en' ? 'Principal Paid' : 'चुकाया गया मूलधन',
              data: principalData,
              backgroundColor: '#6366f1',
              stack: 'Stack 0',
            },
            {
              label: currentLang === 'en' ? 'Interest Paid' : 'चुकाया गया ब्याज',
              data: interestData,
              backgroundColor: '#f59e0b',
              stack: 'Stack 0',
            },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: document.body.classList.contains('dark') ? '#94A3B8' : '#64748B',
                font: { family: 'Inter', size: 11, weight: 'bold' }
              }
            },
            tooltip: {
              backgroundColor: document.body.classList.contains('dark') ? '#1e293b' : '#0f172a',
              titleFont: { family: 'Inter', size: 11, weight: 'bold' },
              bodyFont: { family: 'Inter', size: 12 },
              padding: 10,
              cornerRadius: 8,
              mode: 'index',
              intersect: false,
              callbacks: {
                label: (context: any) => {
                  return ` ${context.dataset.label}: ₹${Math.round(context.raw).toLocaleString('en-IN')}`;
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: { color: document.body.classList.contains('dark') ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 10, weight: 'bold' } }
            },
            y: {
              stacked: true,
              grid: { color: document.body.classList.contains('dark') ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 0.8)' },
              ticks: { color: document.body.classList.contains('dark') ? '#94A3B8' : '#64748B', font: { family: 'Inter', size: 10 } }
            }
          }
        }
      });
    }

    return () => {
      if (doughnutChartInstance.current) doughnutChartInstance.current.destroy();
      if (barChartInstance.current) barChartInstance.current.destroy();
    };
  }, [principal, interest, yearlySchedule, currentLang]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-6">
      <div className="glass-panel rounded-3xl p-5 glow-card-indigo transition-all duration-300">
        <h4 className="text-center font-display text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">
          {translations[currentLang].principalvsInterest}
        </h4>
        <div className="relative h-[260px] w-full">
          <canvas ref={doughnutRef} />
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5 glow-card-indigo transition-all duration-300">
        <h4 className="text-center font-display text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">
          {currentLang === 'en' ? 'Yearly Repayment Outflow Breakdown' : 'वार्षिक पुनर्भुगतान आउटफ्लो का विवरण'}
        </h4>
        <div className="relative h-[260px] w-full">
          <canvas ref={barRef} />
        </div>
      </div>
    </div>
  );
}
