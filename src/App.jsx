import React, { useState, useEffect } from 'react';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLiveData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/rsvps');
      if (!response.ok) {
        throw new Error('Възникна грешка при връзката със сървъра.');
      }
      const liveData = await response.json();
      setData(liveData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
  }, []);

  const formatDate = (dateInput) => {
    if (!dateInput) return 'Неизвестна дата';
    const actualDateStr = dateInput.$date ? dateInput.$date : dateInput;
    const date = new Date(actualDateStr);
    if (isNaN(date.getTime())) return 'Невалидна дата';

    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-12 font-sans text-slate-800 antialiased">
      
      {/* Premium Dashboard Header */}
      <header className="mb-12 max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl border-2 border-slate-200/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Панел за управление
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mt-2">
            📋 Списък с гости
          </h1>
          <p className="text-slate-500 mt-1 text-base">
            Обновени отговори от поканите в реално време.
          </p>
        </div>
        
        <button
          onClick={fetchLiveData}
          disabled={loading}
          className={`px-6 py-3.5 rounded-xl font-bold text-white shadow-md tracking-wide transition-all duration-200 active:scale-95 whitespace-nowrap ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 border-b-4 border-indigo-800'
          }`}
        >
          {loading ? '⏳ Зареждане...' : '🔄 Обнови данните'}
        </button>
      </header>

      {/* Error View */}
      {error && (
        <div className="max-w-6xl mx-auto mb-8 p-4 bg-rose-50 border-2 border-rose-200 text-rose-700 rounded-xl font-semibold shadow-sm">
          ⚠️ Грешка: {error}
        </div>
      )}

      {/* Empty Database View */}
      {!loading && data.length === 0 && !error && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300 max-w-6xl mx-auto text-slate-400 font-medium text-lg">
          📭 Няма намерени записи в базата данни.
        </div>
      )}

      {/* Main Grid Layout for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {data.map((submission) => {
          const totalAttending = submission.guests?.filter(g => g.status === 'yes').length || 0;
          
          return (
            <div 
              key={submission._id.$oid || submission._id} 
              className="bg-white rounded-2xl border-2 border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Header Layer */}
              <div className="p-5 bg-gradient-to-r from-slate-50 to-indigo-50/20 border-b-2 border-slate-100 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Получено на:
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {formatDate(submission.submittedAt)}
                  </span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-full border border-emerald-200/60 whitespace-nowrap shadow-xs">
                  🟢 {totalAttending} присъстващи
                </span>
              </div>

              {/* Card Body - Segmented Guest Rows */}
              <div className="p-5 flex-grow">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Членове на групата
                </h3>
                
                <div className="space-y-3">
                  {submission.guests?.map((guest, idx) => (
                    <div 
                      key={guest._id?.$oid || idx} 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 shadow-xs"
                    >
                      <div className="flex flex-col pr-2">
                        <span className="font-bold text-slate-800 text-base">{guest.name}</span>
                        {guest.menu && (
                          <span className="text-xs text-slate-500 mt-1 inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-md w-fit font-medium">
                            🍴 Меню: <span className="font-bold text-indigo-600">{guest.menu}</span>
                          </span>
                        )}
                      </div>
                      
                      <span className={`text-xs font-bold px-3 py-1 rounded-lg border shrink-0 ${
                        guest.status === 'yes' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {guest.status === 'yes' ? 'Идва' : 'Няма да идва'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer - Prominent Message Box */}
              {submission.message && (
                <div className="p-4 bg-amber-50/50 border-t-2 border-amber-100 m-4 mt-0 rounded-xl border border-amber-200/40">
                  <span className="text-xs font-extrabold text-amber-800 flex items-center gap-1 mb-1">
                    💬 Важна бележка / Алергии:
                  </span>
                  <p className="text-sm text-amber-900 font-medium italic leading-relaxed">
                    "{submission.message}"
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}