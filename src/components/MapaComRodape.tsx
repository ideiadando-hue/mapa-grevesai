import StrikeMapClient from '@/components/StrikeMapClient';

export default function MapaComRodape() {
  return (
    <main style={{ padding: '24px' }}>
      <StrikeMapClient />
      <footer
        style={{
          textAlign: 'right',
          padding: '16px 0',
          fontSize: 13,
          color: '#666',
        }}
      >
        por dandoideia
      </footer>
    </main>
  );
}