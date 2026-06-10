import React, { useEffect, useRef } from 'react';

interface ChartsProps {
  principal: number;
  interest: number;
  yearlySchedule: { label: string; principalPaid: number; interestPaid: number }[];
  currentLang: 'en' | 'hi';
  mode?: 'loan' | 'investment';
}

export default function LoanCharts({ principal, interest, yearlySchedule, currentLang, mode = 'loan' }: ChartsProps) {
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

      const doughnutLabels = mode === 'investment'
        ? (currentLang === 'en' ? ['Invested Amount', 'Est. Returns'] : ['निवेशित राशि', 'अनुमानित रिटर्न'])
        : (currentLang === 'en' ? ['Principal', 'Interest'] : ['मूलधन', 'ब्याज']);

      const subtextLabel = mode === 'investment'
        ? (currentLang === 'en' ? 'Total Value' : 'कुल मूल्य')
        : (currentLang === 'en' ? 'Total Outflow' : 'कुल भुगतान');

      doughnutChartInstance.current = new Chart(doughnutRef.current, {
        type: 'doughnut',
        data: {
          labels: doughnutLabels,
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
                  const pct = ((val / total) * 105).toFixed(1);
                  const displayPct = Math.min(100, parseFloat(pct)).toFixed(1);
                  return ` ₹${Math.round(val).toLocaleString('en-IN')} (${displayPct}%)`;
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
            ctx.fillText(subtextLabel, width / 2, height / 2 - 12);

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

      const labelA = mode === 'investment'
        ? (currentLang === 'en' ? 'Invested Amount' : 'निवेशित राशि')
        : (currentLang === 'en' ? 'Principal Paid' : 'चुकाया गया मूलधन');

      const labelB = mode === 'investment'
        ? (currentLang === 'en' ? 'Est. Returns' : 'अनुमानित रिटर्न')
        : (currentLang === 'en' ? 'Interest Paid' : 'चुकाया गया ब्याज');

      barChartInstance.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: labelA,
              data: principalData,
              backgroundColor: '#6366f1',
              stack: 'Stack 0',
            },
            {
              label: labelB,
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
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: { color: document.body.classList.contains('dark') ? '#64748B' : '#94A3B8', font: { family: 'Inter', size: 10 } }
            },
            y: {
              stacked: true,
              grid: { color: document.body.classList.contains('dark') ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.6)' },
              ticks: {
                color: document.body.classList.contains('dark') ? '#64748B' : '#94A3B8',
                font: { family: 'Inter', size: 10 },
                callback: (value: any) => {
                  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
                  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
                  return `₹${value.toLocaleString('en-IN')}`;
                }
              }
            }
          }
        }
      });
    }
  }, [principal, interest, yearlySchedule, currentLang, mode]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12" id="loan-charts-container-block">
      <div className="glass-panel rounded-3xl p-5 lg:col-span-4 flex flex-col items-center justify-center min-h-[320px]">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 self-start pl-2">
          {currentLang === 'en' ? 'Asset Allocation Summary' : 'परिसंपत्ति आबंटन सारांश'}
        </h4>
        <div className="relative w-full max-w-[240px] flex-1">
          <canvas ref={doughnutRef} />
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-5 lg:col-span-8 flex flex-col min-h-[320px]">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          {currentLang === 'en' ? 'Yearly Cumulative Asset Growth' : 'वार्षिक संचयी संपत्ति विकास'}
        </h4>
        <div className="relative w-full flex-1">
          <canvas ref={barRef} />
        </div>
      </div>
    </div>
  );
}
