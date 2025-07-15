import "./App.css"
import React, { useState, useCallback } from 'react';


const Nav=()=>{
  return(<div>
    <nav>AI Based BackGround Remover</nav>
  </div>)
}


function App() {
  const [file, setFile] = useState(null);
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const gridSize = 50; // px

  const handleFile = useCallback(e => {
    setFile(e.target.files[0]);
    setResultUrl('');
    setError('');
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const resp = await fetch('http://localhost:4000/api/remove-bg', {
        method: 'POST',
        body: fd,
      });
      if (!resp.ok) {
        const { error } = await resp.json();
        throw new Error(error || 'Upload failed');
      }
      const blob = await resp.blob();
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'no-bg-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(resultUrl), 1000);
  }, [resultUrl]);

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: 20,
      backgroundColor: '#f6f8fa',
      fontFamily: 'Segoe UI, sans-serif',
    },
    container: {
      
      marginTop:"5rem",
      width: "80%",
      height: '80vh',
      padding: 40,
      borderRadius: 12,
      backgroundColor: '#fff',
      boxShadow: '0 8px 30px rgba(12, 12, 12, 0.02)',
      textAlign: 'center',
      position: 'relative',
      overflowY: 'auto',
      backgroundImage: [
        `linear-gradient(to right, rgba(0, 0, 0, 0.10) 1px, transparent 1px)`,
        `linear-gradient(to bottom, rgba(0,0,0,0.10) 1px, transparent 1px)`,
      ].join(','),
      backgroundSize: `${gridSize}px ${gridSize}px`,
      backgroundPosition: `-1px -1px`,
    },
    title: { fontSize: 24, marginTop:10,marginBottom: 10, fontWeight: 600 },
    subtitle: { fontSize: 16, color: '#666',marginTop:30, marginBottom: 20 },
    input: {
      
      marginTop:"5rem",
      textAlign: 'center',
      width: '50%',
      padding: '20px 10px',
      fontSize: '15px',
      border: '1.5px solid #d1d5db',
      borderRadius: '12px',
      marginBottom: '20px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
    },
    button: {
      width: '50%',
      padding: '12px',
      fontSize: 16,
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      transition: '0.3s ease',
      '@media(max-width:500px)':{
        width:"80%"
      }
    },
    loader: {
      margin: '20px auto',
      border: '5px solid #eee',
      borderTop: '5px solid #007bff',
      borderRadius: '50%',
      width: 36,
      height: 36,
      animation: 'spin 1s linear infinite',
    },
    error: { color: 'red', marginTop: 10 },
    preview: { marginTop: 30 },
    image: {
      maxWidth: '100%',
      borderRadius: 10,
      marginBottom: 15,
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    downloadButton: {
      padding: '10px 20px',
      backgroundColor:"crimson",
      color: '#fff',
      border: 'none',
      borderRadius: 8,
      fontSize: 15,
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <p className='we'>We Make BackGround Ghost !!!</p>
        <h3 style={styles.title}>Remove Background without any water mark</h3>
        <p style={styles.subtitle}>Upload an image to remove its background.</p>

        <input type="file" accept="image/*" onChange={handleFile} style={styles.input} />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            ...styles.button,
            opacity: !file || loading ? 0.6 : 1,
            cursor: !file || loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Remove Background'}
        </button>

        {loading && <div style={styles.loader} />}
        {error && <p style={styles.error}>{error}</p>}

        {resultUrl && !loading && (
          <div style={styles.preview}>
            <img src={resultUrl} alt="Result" style={styles.image} />
            <button onClick={handleDownload} style={styles.downloadButton}>
              Download PNG
            </button>
          </div>
        )}

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default App;