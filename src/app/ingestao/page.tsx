'use client';

import { useState } from 'react';

export default function IngestaoPage() {
  const [json, setJson] = useState('');
  const [result, setResult] = useState<string>('');
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    setEnviando(true);
    setResult('Enviando...');
    try {
      const payload = JSON.parse(json);
      const res = await fetch('/api/ingest/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult('Erro: ' + (e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Ingestao em lote</h1>
      <p style={{ color: '#6b7280', marginBottom: 20 }}>
        Cole o JSON completo devolvido pelo prompt de busca. O pipeline processa todas as noticias de uma vez.
      </p>

      <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
        JSON do prompt de busca
      </label>
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        rows={20}
        placeholder='{"runAt":"2026-11-12T08:00:00","items":[...]}'
        style={{
          width: '100%',
          padding: 12,
          marginBottom: 16,
          fontFamily: 'monospace',
          fontSize: 12,
          border: '1px solid #d1d5db',
          borderRadius: 6,
        }}
      />

      <button
        onClick={enviar}
        disabled={enviando || !json.trim()}
        style={{
          padding: '10px 24px',
          background: enviando ? '#9ca3af' : '#2563eb',
          color: '#fff',
          border: 0,
          borderRadius: 6,
          cursor: enviando ? 'not-allowed' : 'pointer',
          fontWeight: 600,
        }}
      >
        {enviando ? 'Enviando...' : 'Processar lote'}
      </button>

      {result && (
        <pre style={{
          marginTop: 20,
          background: '#f3f4f6',
          padding: 16,
          borderRadius: 6,
          fontSize: 12,
          overflow: 'auto',
        }}>
          {result}
        </pre>
      )}
    </div>
  );
}