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

  // --- NATIVE STYLES (Zero Compiler Dependencies) ---
  const styles = {
    page: {
      backgroundColor: '#e2e8f0', // Darker slate gray background to make white cards pop
      minHeight: '100vh',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box',
    },
    headerBox: {
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '16px',
      border: '2px solid #cbd5e1',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
      maxWidth: '1100px',
      margin: '0 auto 40px auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    },
    headline: {
      margin: 0,
      fontSize: '28px',
      fontWeight: '900',
      color: '#0f172a'
    },
    updateBtn: {
      backgroundColor: '#4f46e5',
      color: '#ffffff',
      border: 'none',
      borderBottom: '4px solid #3730a3',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '15px'
    },
    /* 📌 THE CRITICAL GRID CONTAINER */
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // Rigid card slots
      gap: '32px',
      maxWidth: '1100px',
      margin: '0 auto',
      width: '100%',
      alignItems: 'start'
    },
    /* 📌 THE DISTINCT CARD SHAPE */
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '2px solid #cbd5e1',
      borderTop: '10px solid #4f46e5', // Thick dark indigo banner on top
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', // Heavy card shadow
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    cardHeader: {
      backgroundColor: '#f8fafc',
      padding: '16px',
      borderBottom: '2px solid #f1f5f9',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    timestampLabel: {
      fontSize: '10px',
      textTransform: 'uppercase',
      color: '#94a3b8',
      fontWeight: 'bold',
      letterSpacing: '1px'
    },
    timestampValue: {
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#475569',
      display: 'block',
      marginTop: '2px'
    },
    counterBadge: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      fontSize: '12px',
      fontWeight: '800',
      padding: '6px 12px',
      borderRadius: '9999px',
      border: '1px solid #bbf7d0'
    },
    cardBody: {
      padding: '20px'
    },
    sectionTitle: {
      fontSize: '11px',
      textTransform: 'uppercase',
      color: '#94a3b8',
      fontWeight: '800',
      letterSpacing: '1px',
      display: 'block',
      marginBottom: '12px'
    },
    guestRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      marginBottom: '10px'
    },
    guestName: {
      fontWeight: 'bold',
      color: '#1e293b',
      fontSize: '15px'
    },
    menuTag: {
      fontSize: '11px',
      color: '#64748b',
      marginTop: '4px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      padding: '2px 8px',
      borderRadius: '6px',
      display: 'inline-block',
      fontWeight: '600'
    },
    statusBadge: (attending) => ({
      backgroundColor: attending ? '#ecfdf5' : '#fff1f2',
      color: attending ? '#047857' : '#be123c',
      border: attending ? '1px solid #a7f3d0' : '1px solid #fecdd3',
      fontSize: '12px',
      fontWeight: 'bold',
      padding: '4px 10px',
      borderRadius: '8px'
    }),
    messageBox: {
      backgroundColor: '#fef3c7',
      border: '1px solid #fde68a',
      padding: '12px',
      margin: '0 20px 20px 20px',
      borderRadius: '12px'
    },
    messageLabel: {
      fontSize: '11px',
      fontWeight: '800',
      color: '#92400e',
      display: 'block',
      marginBottom: '2px'
    },
    messageText: {
      margin: 0,
      fontSize: '13px',
      color: '#78350f',
      fontStyle: 'italic',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.page}>
      
      {/* Dashboard Top Header Box */}
      <header style={styles.headerBox}>
        <div>
          <h1 style={styles.headline}>📋 Списък с гости</h1>
        </div>
        <button onClick={fetchLiveData} disabled={loading} style={styles.updateBtn}>
          {loading ? '⏳ Зареждане...' : '🔄 Обнови данните'}
        </button>
      </header>

      {error && (
        <div style={{ maxWidth: '1100px', margin: '0 auto 20px auto', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', borderRadius: '12px', fontWeight: 'bold' }}>
          ⚠️ Грешка: {error}
        </div>
      )}

      {/* 🚀 THE FIXED NATIVE CSS GRID CONTAINER */}
      <div style={styles.gridContainer}>
        {data.map((submission) => {
          const totalAttending = submission.guests?.filter(g => g.status === 'yes').length || 0;
          
          return (
            /* 🚀 INDEPENDENT PHYSICAL CARD BOX */
            <div key={submission._id.$oid || submission._id} style={styles.card}>
              
              {/* Card Header Layer */}
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.timestampLabel}>Изпратено на:</span>
                  <span style={styles.timestampValue}>{formatDate(submission.submittedAt)}</span>
                </div>
                <div style={styles.counterBadge}>
                  ✓ {totalAttending} идват
                </div>
              </div>

              {/* Card Body Layer */}
              <div style={styles.cardBody}>
                <span style={styles.sectionTitle}>Група поканени:</span>
                
                <div>
                  {submission.guests?.map((guest, idx) => (
                    <div key={guest._id?.$oid || idx} style={styles.guestRow}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={styles.guestName}>{guest.name}</span>
                        {guest.menu && (
                          <div>
                            <span style={styles.menuTag}>🍴 Меню: <strong>{guest.menu}</strong></span>
                          </div>
                        )}
                      </div>
                      <span style={styles.statusBadge(guest.status === 'yes')}>
                        {guest.status === 'yes' ? 'Идва' : 'Не'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Notes Layer */}
              {submission.message && submission.message.trim() !== "" && (
                <div style={styles.messageBox}>
                  <span style={styles.messageLabel}>💬 Бележка:</span>
                  <p style={styles.messageText}>"{submission.message}"</p>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}