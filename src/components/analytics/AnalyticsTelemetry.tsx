import { Card, CardHeader } from '@/components/ui/Card';

export function AnalyticsTelemetry() {
  const stats = [
    { label: 'Uptime', value: '99.98%', desc: 'Soroban RPC Nodes status' },
    { label: 'Avg Block Time', value: '4.87s', desc: 'Stellar Testnet speed' },
    { label: 'RPC Roundtrip Latency', value: '142ms', desc: 'Horizon query time' },
    { label: 'Failed Payments Rate', value: '0.04%', desc: 'Simulated merchant logs' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-black text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader
            title="System Diagnostics & Logs"
            subtitle="Real-time error tracking and telemetry"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            }
          />
          <div className="space-y-3 font-mono text-[11px] text-slate-300">
            <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
              <span className="text-emerald-400">[INFO] 15:47:24</span>
              <span>Loaded Freighter Extension standard provider</span>
              <span className="text-slate-500">2ms</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
              <span className="text-emerald-400">[INFO] 15:47:25</span>
              <span>Fetched native balances from Horizon endpoint</span>
              <span className="text-slate-500">128ms</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
              <span className="text-yellow-400">[WARN] 15:47:29</span>
              <span>Checked auth state: user balance below threshold</span>
              <span className="text-slate-500">14ms</span>
            </div>
            <div className="flex justify-between items-center bg-slate-950/60 p-2.5 rounded-xl border border-slate-900">
              <span className="text-emerald-400">[INFO] 15:47:32</span>
              <span>Re-synchronized Live Poll event log filter</span>
              <span className="text-slate-500">202ms</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Transaction Throughput"
            subtitle="Mocked real-world analytics & volume"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M18 20V10M12 20V4M6 20v-6" />
              </svg>
            }
          />
          <div className="h-44 w-full flex items-end justify-between gap-2 px-2 pt-4">
            {[45, 60, 30, 80, 50, 95, 75, 40, 65, 85, 70, 110].map((height, i) => (
              <div key={i} className="group relative flex-1 flex flex-col items-center">
                <div
                  style={{ height: `${height}px` }}
                  className="w-full rounded-t bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-300 hover:from-emerald-500 hover:to-emerald-400"
                />
                <span className="mt-2 text-[9px] text-slate-500 font-semibold">H{i+1}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
