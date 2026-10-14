import React from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const AlertBanner = ({ alerts = [], onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert, idx) => {
        const isWarning = alert.severity === 'Warning';
        const isWatch = alert.severity === 'Watch';
        
        let bgStyle = 'bg-amber-50 border-amber-200 text-amber-900';
        let Icon = AlertTriangle;
        let iconColor = 'text-amber-600';

        if (isWarning) {
          bgStyle = 'bg-rose-50 border-rose-200 text-rose-950';
          Icon = AlertCircle;
          iconColor = 'text-rose-600';
        } else if (!isWatch) {
          bgStyle = 'bg-blue-50 border-blue-200 text-blue-900';
          Icon = Info;
          iconColor = 'text-blue-600';
        }

        return (
          <div
            key={idx}
            className={`flex items-start justify-between p-3.5 rounded-xl border ${bgStyle} shadow-sm animate-fadeIn`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{alert.title}</span>
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-white/80 border border-current/20">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-700 leading-relaxed">{alert.description}</p>
                {alert.farming_precaution && (
                  <p className="text-xs mt-1.5 font-medium text-slate-900 bg-white/60 p-2 rounded-lg border border-black/5">
                    💡 <strong>Action:</strong> {alert.farming_precaution}
                  </p>
                )}
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(idx)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
