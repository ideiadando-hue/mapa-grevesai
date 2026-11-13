import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre o Mapa de Greves',
  description: 'Entenda o que é o mapa, de onde vêm as informações e como ler cada registro.',
};

export default function SobrePage() {
  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Sobre o Mapa de Greves</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        O que é, de onde vêm os dados e como ler cada informação.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Para que serve este mapa</h2>
        <p>
          O Mapa de Greves reúne, em um só lugar, as paralisações e greves que acontecem no Brasil.
          A ideia é simples: mostrar onde estão acontecendo, em que categoria e desde quando.
        </p>
        <p>
          Hoje, quem quer acompanhar greves precisa procurar notícia por notícia, em sites
          diferentes, sem saber se aquilo é grande ou pequeno, se já acabou ou continua. O mapa
          organiza essa informação e permite comparar meses, estados e categorias.
        </p>
        <p>
          É uma ferramenta de acompanhamento, não de previsão. Ela mostra o que já aconteceu e o
          que está em curso, com base no que foi publicado.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>De onde vêm as informações</h2>
        <p>
          Todos os registros vêm de notícias e comunicados publicados na internet: jornais,
          portais regionais, sites de sindicatos e centrais. Cada greve no mapa tem um link para
          a fonte original, que você pode abrir e conferir.
        </p>
        <p>
          Nada é inventado. Se a notícia não diz a cidade, o mapa não mostra cidade. Se não diz
          quando começou, o registro fica sem data. Quando falta uma informação, ela aparece como
          &quot;não informado&quot; em vez de ser preenchida por suposição.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Como ler cada registro</h2>

        <h3 style={{ fontSize: 17, marginTop: 16, marginBottom: 6 }}>Alcance</h3>
        <p>
          <strong>Municipal</strong> é uma greve de uma cidade ou de cidades vizinhas da mesma
          região. <strong>Estadual</strong> é quando atinge várias cidades do mesmo estado.{' '}
          <strong>Nacional</strong> é quando atinge cidades de dois ou mais estados diferentes.
        </p>

        <h3 style={{ fontSize: 17, marginTop: 16, marginBottom: 6 }}>Situação</h3>
        <p>
          <strong>Ativa</strong> é a greve em andamento. <strong>Encerrada</strong> é a que já
          terminou. <strong>Suspensa</strong> é a que parou temporariamente, mas pode voltar — não
          é o mesmo que ter acabado. <strong>Sem término confirmado</strong> é quando a greve
          começou há mais de um mês e ainda não há notícia dizendo que acabou.
        </p>

        <h3 style={{ fontSize: 17, marginTop: 16, marginBottom: 6 }}>Confiança</h3>
        <p>
          Indica o quanto a informação é sólida. <strong>Confirmada</strong> vem de veículo de
          imprensa reconhecido. <strong>Provável</strong> vem de sindicato ou central, que é fonte
          direta mas pode ter interesse no tema. <strong>Não verificada</strong> vem de redes
          sociais ou publicações sem checagem.
        </p>
        <p>
          Uma greve marcada como &quot;não verificada&quot; não é falsa — é apenas uma informação
          que ainda não foi confirmada por outra fonte.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Por que uma greve pode não aparecer</h2>
        <p>Existem três motivos comuns:</p>
        <ul style={{ paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>Foi anunciada, mas ainda não começou.</strong> Greves aprovadas em assembleia
            e marcadas para o futuro não entram no mapa até o início de fato.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Não tem localização.</strong> Se a notícia não informa cidade ou estado, o
            registro existe mas não pode ser colocado no mapa.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>Ainda não foi encontrada.</strong> O mapa depende de notícias publicadas.
            Greves sem cobertura na imprensa não aparecem.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Limitações</h2>
        <p>
          O mapa não é um censo de greves. Ele reflete o que foi publicado e encontrado. Greves
          curtas, em cidades pequenas ou sem cobertura jornalística podem não aparecer, mesmo
          tendo acontecido.
        </p>
        <p>
          Por isso, os números servem para acompanhar tendências e comparar períodos, não para
          afirmar quantas greves existiram de fato no país.
        </p>
      </section>

<section>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>Encontrou um erro?</h2>
        <p>
          Cada registro tem o link da fonte original. Se você identificar uma informação
          incorreta, ou precisar de algum suporte nos avise:{' '}
          <a
            href="mailto:ideiadando@gmail.com"
            style={{ color: '#7c3aed', textDecoration: 'underline' }}
          >
            ideiadando@gmail.com
          </a>
        </p>
      </section>
    </main>
  );
}