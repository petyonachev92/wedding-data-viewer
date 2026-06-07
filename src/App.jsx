import React, { useState, useEffect } from 'react';

export default function App() {
  // State to hold our live database entries
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch data from our backend server
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

  // Fetch data automatically once when the page first loads
  useEffect(() => {
    fetchLiveData();
  }, []);

  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj.$date) return 'Неизвестна дата';
    const date = new Date(dateObj.$date);
    return date.toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-800">
      
      {/* Dashboard Header */}
      <header className="mb-10 max-w-6xl mx-auto border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            📋 Списък с гости (RSVP Dashboard)
          </h1>
          <p className="text-slate-500 mt-1">
            Преглед на получените отговори в реално време.
          </p>
        </div>
        
        {/* The Update Button */}
        <button
          onClick={fetchLiveData}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-bold text-white shadow-sm transition-all duration-150 active:scale-95 ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100 shadow-md'
          }`}
        >
          {loading ? 'Обновяване...' : '🔄 Обнови данните'}
        </button>
      </header>

      {/* Error Message Visualizer */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
          ⚠️ Грешка: {error}. Уверете се, че backend сървърът работи.
        </div>
      )}

      {/* Empty Database State */}
      {!loading && data.length === 0 && !error && (
        <div className="text-center py-12 text-slate-400">
          Няма намерени записи в базата данни. Скриптът работи, но колекцията е празна.
        </div>
      )}

      {/* Grid Layout for Live Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {data.map((submission) => {
          const totalAttending = submission.guests?.filter(g => g.status === 'yes').length || 0;
          
          return (
            <div 
              key={submission._id.$oid || submission._id} 
              className="bg-white rounded-2xl shadow-md shadow-slate-100 border border-slate-100 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {formatDate(submission.submittedAt)}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100">
                  {totalAttending} присъстващи
                </span>
              </div>

              <div className="p-5 flex-grow">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Група / Гости
                </h3>
                <ul className="space-y-3">
                  {submission.guests?.map((guest, idx) => (
                    <li 
                      key={guest._id?.$oid || idx} 
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">{guest.name}</span>
                        {guest.menu && (
                          <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            🍴 Меню: <span className="font-bold text-indigo-600">{guest.menu}</span>
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        guest.status === 'yes' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}>
                        {guest.status === 'yes' ? 'Идва' : 'Не идва'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {submission.message && (
                <div className="p-4 bg-amber-50/60 border-t border-amber-100/80 m-4 rounded-xl">
                  <span className="text-xs font-bold text-amber-800 block mb-1">💬 Бележка / Алергии:</span>
                  <p className="text-sm text-amber-900 italic">"{submission.message}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}