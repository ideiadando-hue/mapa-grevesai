import StrikeMapClient from '@/components/StrikeMapClient';

export default function Home() {
  return (
    <main style={{ padding: 16 }}>
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