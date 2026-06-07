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
    <div className="min-h-screen bg-slate-200 p-4 md:p-12 font-sans text-slate-800 antialiased">
      
      {/* Dashboard Header Box */}
      <header className="mb-12 max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-slate-300 shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
            Система за управление
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-2">
            📋 Списък с гости
          </h1>
        </div>
        
        <button
          onClick={fetchLiveData}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-bold text-white tracking-wide transition-all duration-200 active:scale-95 ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-md border-b-4 border-indigo-800'
          }`}
        >
          {loading ? '⏳ Зареждане...' : '🔄 Обнови данните'}
        </button>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-5xl mx-auto mb-8 p-4 bg-rose-50 border border-rose-300 text-rose-700 rounded-xl font-semibold">
          ⚠️ Грешка: {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && data.length === 0 && !error && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300 max-w-5xl mx-auto text-slate-400 font-medium">
          📭 Няма намерени записи.
        </div>
      )}

      {/* Card Container Layout */}
      {/* flex-wrap ensures they line up side-by-side like real blocks instead of long rows */}
      <div className="flex flex-wrap gap-8 justify-center max-w-5xl mx-auto">
        {data.map((submission) => {
          const totalAttending = submission.guests?.filter(g => g.status === 'yes').length || 0;
          
          return (
            <div 
              key={submission._id.$oid || submission._id} 
              className="w-full sm:w-[350px] bg-white rounded-2xl shadow-xl border border-slate-300 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden border-t-8 border-t-indigo-600"
            >
              {/* Card Header Layer */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Изпратено на:
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {formatDate(submission.submittedAt)}
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full shadow-xs">
                  ✓ {totalAttending} идват
                </span>
              </div>

              {/* Card Body - Content Inside the Card */}
              <div className="p-5 flex-grow">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
                  Група поканени:
                </span>
                
                <div className="space-y-2.5">
                  {submission.guests?.map((guest, idx) => (
                    <div 
                      key={guest._id?.$oid || idx} 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{guest.name}</span>
                        {guest.menu && (
                          <span className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            🍴 Меню: <span className="font-bold text-indigo-600">{guest.menu}</span>
                          </span>
                        )}
                      </div>
                      
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        guest.status === 'yes' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {guest.status === 'yes' ? 'Идва' : 'Не'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Notes/Allergies */}
              {submission.message && (
                <div className="p-3 bg-amber-50 border border-amber-200 m-4 mt-0 rounded-xl">
                  <span className="text-[10px] font-extrabold text-amber-800 block mb-0.5">
                    💬 Бележка:
                  </span>
                  <p className="text-xs text-amber-900 italic font-medium">
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