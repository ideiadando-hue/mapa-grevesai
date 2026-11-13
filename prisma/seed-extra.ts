import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type StrikeSeed = {
  city: string;
  state: string;
  category: string;
  status: string;
  confidence: string;
  confidenceScore: number;
  lat: number;
  lng: number;
  startedAt: string;
  endedAt: string | null;
  demands: string;
  entityName: string;
  sourceUrl: string;
  sourceExcerpt: string;
};

const strikes: StrikeSeed[] = [
  // ---------- SÃO PAULO (8 registros) ----------
  { city: 'São Paulo', state: 'SP', category: 'transporte', status: 'active', confidence: 'confirmed', confidenceScore: 0.9, lat: -23.5505, lng: -46.6333, startedAt: '2026-11-10', endedAt: null, demands: 'Reajuste salarial de 12% e renovação da frota de ônibus.', entityName: 'Sindicato dos Motoristas e Cobradores de SP', sourceUrl: 'https://exemplo-greve-sp-transporte-01.com', sourceExcerpt: 'Motoristas e cobradores paralisam linhas municipais na zona leste desde segunda-feira.' },
  { city: 'Campinas', state: 'SP', category: 'educação', status: 'active', confidence: 'confirmed', confidenceScore: 0.88, lat: -22.9099, lng: -47.0626, startedAt: '2026-11-08', endedAt: null, demands: 'Reajuste salarial e pagamento do piso nacional do magistério.', entityName: 'APEOESP', sourceUrl: 'https://exemplo-greve-campinas-educacao-01.com', sourceExcerpt: 'Professores da rede estadual cruzam os braços por tempo indeterminado.' },
  { city: 'Santos', state: 'SP', category: 'saúde', status: 'ended', confidence: 'confirmed', confidenceScore: 0.92, lat: -23.9608, lng: -46.3336, startedAt: '2026-10-20', endedAt: '2026-10-27', demands: 'Contratação de pessoal e melhoria das condições de trabalho.', entityName: 'Sindicato dos Enfermeiros do Estado de SP', sourceUrl: 'https://exemplo-greve-santos-saude-01.com', sourceExcerpt: 'Enfermeiros e técnicos paralisaram por sete dias no Hospital Guilherme Álvaro.' },
  { city: 'Ribeirão Preto', state: 'SP', category: 'indústria', status: 'active', confidence: 'likely', confidenceScore: 0.65, lat: -21.1704, lng: -47.8103, startedAt: '2026-11-11', endedAt: null, demands: 'Participação nos lucros e reajuste acima da inflação.', entityName: 'Sindicato dos Metalúrgicos de Ribeirão Preto', sourceUrl: 'https://exemplo-greve-ribeirao-industria-01.com', sourceExcerpt: 'Metalúrgicos param a produção em fábrica de autopeças na região.' },
  { city: 'Sorocaba', state: 'SP', category: 'comércio', status: 'suspended', confidence: 'likely', confidenceScore: 0.6, lat: -23.5015, lng: -47.4526, startedAt: '2026-11-05', endedAt: null, demands: 'Piso salarial da categoria e adicional noturno.', entityName: 'Sindicato dos Comerciários de Sorocaba', sourceUrl: 'https://exemplo-greve-sorocaba-comercio-01.com', sourceExcerpt: 'Comerciários suspendem paralisação após acordo parcial com o sindicato patronal.' },
  { city: 'Guarulhos', state: 'SP', category: 'serviço público', status: 'active', confidence: 'unverified', confidenceScore: 0.3, lat: -23.4538, lng: -46.5333, startedAt: '2026-11-12', endedAt: null, demands: 'Reajuste salarial e fornecimento de equipamentos de proteção.', entityName: 'Sindicato dos Servidores Municipais de Guarulhos', sourceUrl: 'https://exemplo-greve-guarulhos-servico-01.com', sourceExcerpt: 'Servidores da limpeza urbana relatam paralisação parcial, sem confirmação oficial.' },
  { city: 'São José dos Campos', state: 'SP', category: 'transporte', status: 'ended', confidence: 'confirmed', confidenceScore: 0.85, lat: -23.1794, lng: -45.8869, startedAt: '2026-10-15', endedAt: '2026-10-18', demands: 'Reajuste de 10% e melhoria nas escalas de trabalho.', entityName: 'Sindicato dos Rodoviários de São José dos Campos', sourceUrl: 'https://exemplo-greve-sjc-transporte-01.com', sourceExcerpt: 'Motoristas de ônibus intermunicipais paralisaram por três dias.' },
  { city: 'Osasco', state: 'SP', category: 'educação', status: 'active', confidence: 'likely', confidenceScore: 0.7, lat: -23.5325, lng: -46.7917, startedAt: '2026-11-09', endedAt: null, demands: 'Piso nacional e plano de carreira para professores municipais.', entityName: 'Sindicato dos Professores de Osasco', sourceUrl: 'https://exemplo-greve-osasco-educacao-01.com', sourceExcerpt: 'Professores da rede municipal reivindicam piso nacional e plano de carreira.' },

  // ---------- RIO DE JANEIRO ----------
  { city: 'Rio de Janeiro', state: 'RJ', category: 'transporte', status: 'active', confidence: 'confirmed', confidenceScore: 0.87, lat: -22.9068, lng: -43.1729, startedAt: '2026-11-11', endedAt: null, demands: 'Renovação da frota e reajuste salarial dos aquaviários.', entityName: 'Sindicato dos Trabalhadores em Transportes Aquaviários', sourceUrl: 'https://exemplo-greve-rio-transporte-01.com', sourceExcerpt: 'Barcas da travessia Rio-Niterói operam com frota reduzida por paralisação.' },
  { city: 'Niterói', state: 'RJ', category: 'saúde', status: 'ended', confidence: 'confirmed', confidenceScore: 0.9, lat: -22.8832, lng: -43.1034, startedAt: '2026-10-28', endedAt: '2026-11-02', demands: 'Reajuste salarial e concurso público para a rede municipal.', entityName: 'Sindicato dos Médicos do Estado do RJ', sourceUrl: 'https://exemplo-greve-niteroi-saude-01.com', sourceExcerpt: 'Médicos da rede municipal encerram paralisação após acordo de reajuste.' },

  // ---------- MINAS GERAIS ----------
  { city: 'Belo Horizonte', state: 'MG', category: 'serviço público', status: 'active', confidence: 'confirmed', confidenceScore: 0.86, lat: -19.9167, lng: -43.9345, startedAt: '2026-11-07', endedAt: null, demands: 'Data-base, reajuste salarial e reestruturação de carreiras.', entityName: 'Sindicato dos Servidores Públicos de MG', sourceUrl: 'https://exemplo-greve-bh-servico-01.com', sourceExcerpt: 'Servidores da educação e saúde paralisam por data-base e reajuste.' },
  { city: 'Uberlândia', state: 'MG', category: 'indústria', status: 'suspended', confidence: 'likely', confidenceScore: 0.62, lat: -18.9186, lng: -48.2772, startedAt: '2026-11-03', endedAt: null, demands: 'Reajuste salarial e melhoria das condições no frigorífico.', entityName: 'Sindicato dos Trabalhadores da Alimentação de Uberlândia', sourceUrl: 'https://exemplo-greve-uberlandia-industria-01.com', sourceExcerpt: 'Trabalhadores de frigorífico suspendem greve durante negociação coletiva.' },

  // ---------- BAHIA ----------
  { city: 'Salvador', state: 'BA', category: 'educação', status: 'active', confidence: 'confirmed', confidenceScore: 0.89, lat: -12.9777, lng: -38.5016, startedAt: '2026-11-06', endedAt: null, demands: 'Reajuste salarial e realização de concurso público.', entityName: 'APLB Sindicato', sourceUrl: 'https://exemplo-greve-salvador-educacao-01.com', sourceExcerpt: 'Professores da rede estadual mantêm greve por reajuste e concurso público.' },
  { city: 'Feira de Santana', state: 'BA', category: 'comércio', status: 'ended', confidence: 'likely', confidenceScore: 0.68, lat: -12.2664, lng: -38.9663, startedAt: '2026-10-12', endedAt: '2026-10-16', demands: 'Reajuste de 6% e piso salarial da categoria.', entityName: 'Sindicato dos Comerciários de Feira de Santana', sourceUrl: 'https://exemplo-greve-feira-comercio-01.com', sourceExcerpt: 'Comerciários encerram paralisação após reajuste de 6%.' },

  // ---------- RIO GRANDE DO SUL ----------
  { city: 'Porto Alegre', state: 'RS', category: 'transporte', status: 'active', confidence: 'confirmed', confidenceScore: 0.84, lat: -30.0346, lng: -51.2177, startedAt: '2026-11-10', endedAt: null, demands: 'Redução das taxas das plataformas e regulamentação da categoria.', entityName: 'Associação dos Motoristas de Aplicativo do RS', sourceUrl: 'https://exemplo-greve-poa-transporte-01.com', sourceExcerpt: 'Motoristas de aplicativo fazem paralisação de 24h contra aumento de taxas.' },
  { city: 'Caxias do Sul', state: 'RS', category: 'indústria', status: 'active', confidence: 'likely', confidenceScore: 0.66, lat: -29.1685, lng: -51.1796, startedAt: '2026-11-09', endedAt: null, demands: 'Participação nos lucros e reajuste salarial.', entityName: 'Sindicato dos Metalúrgicos de Caxias do Sul', sourceUrl: 'https://exemplo-greve-caxias-industria-01.com', sourceExcerpt: 'Metalúrgicos paralisam fábrica de implementos agrícolas por PLR.' },

  // ---------- PARANÁ ----------
  { city: 'Curitiba', state: 'PR', category: 'educação', status: 'active', confidence: 'confirmed', confidenceScore: 0.88, lat: -25.4284, lng: -49.2733, startedAt: '2026-11-05', endedAt: null, demands: 'Reajuste salarial e valorização do magistério.', entityName: 'APP Sindicato', sourceUrl: 'https://exemplo-greve-curitiba-educacao-01.com', sourceExcerpt: 'Professores da rede estadual em greve por reajuste e valorização.' },
  { city: 'Londrina', state: 'PR', category: 'saúde', status: 'suspended', confidence: 'unverified', confidenceScore: 0.35, lat: -23.3045, lng: -51.1696, startedAt: '2026-11-08', endedAt: null, demands: 'Piso salarial dos agentes comunitários de saúde.', entityName: 'Sindicato dos Agentes Comunitários de Saúde do PR', sourceUrl: 'https://exemplo-greve-londrina-saude-01.com', sourceExcerpt: 'Agentes comunitários de saúde relatam paralisação parcial não confirmada.' },

  // ---------- PERNAMBUCO ----------
  { city: 'Recife', state: 'PE', category: 'serviço público', status: 'active', confidence: 'confirmed', confidenceScore: 0.87, lat: -8.0476, lng: -34.877, startedAt: '2026-11-04', endedAt: null, demands: 'Reajuste salarial e reestruturação das carreiras.', entityName: 'Sindicato dos Servidores Públicos de PE', sourceUrl: 'https://exemplo-greve-recife-servico-01.com', sourceExcerpt: 'Servidores do estado paralisam por reajuste e reestruturação de carreiras.' },

  // ---------- CEARÁ ----------
  { city: 'Fortaleza', state: 'CE', category: 'transporte', status: 'ended', confidence: 'confirmed', confidenceScore: 0.91, lat: -3.7319, lng: -38.5267, startedAt: '2026-10-22', endedAt: '2026-10-25', demands: 'Reajuste salarial e renovação da frota.', entityName: 'Sindicato dos Rodoviários do Ceará', sourceUrl: 'https://exemplo-greve-fortaleza-transporte-01.com', sourceExcerpt: 'Rodoviários encerram greve após acordo com empresas de ônibus.' },

  // ---------- DISTRITO FEDERAL ----------
  { city: 'Brasília', state: 'DF', category: 'serviço público', status: 'active', confidence: 'likely', confidenceScore: 0.63, lat: -15.7939, lng: -47.8828, startedAt: '2026-11-11', endedAt: null, demands: 'Reajuste salarial e revisão dos auxílios.', entityName: 'Sindicato dos Servidores do GDF', sourceUrl: 'https://exemplo-greve-brasilia-servico-01.com', sourceExcerpt: 'Servidores do GDF discutem paralisação por reajuste e auxílios.' },

  // ---------- GOIÁS ----------
  { city: 'Goiânia', state: 'GO', category: 'comércio', status: 'active', confidence: 'confirmed', confidenceScore: 0.85, lat: -16.6869, lng: -49.2648, startedAt: '2026-11-07', endedAt: null, demands: 'Piso salarial e adicional por trabalho em feriados.', entityName: 'Sindicato dos Comerciários de Goiânia', sourceUrl: 'https://exemplo-greve-goiania-comercio-01.com', sourceExcerpt: 'Comerciários paralisam shoppings e lojas de rua por piso salarial.' },

  // ---------- SANTA CATARINA ----------
  { city: 'Florianópolis', state: 'SC', category: 'educação', status: 'ended', confidence: 'confirmed', confidenceScore: 0.89, lat: -27.5954, lng: -48.548, startedAt: '2026-10-18', endedAt: '2026-10-24', demands: 'Reajuste salarial aprovado após negociação.', entityName: 'Sindicato dos Trabalhadores em Educação de SC', sourceUrl: 'https://exemplo-greve-floripa-educacao-01.com', sourceExcerpt: 'Professores da rede municipal encerram greve após reajuste aprovado.' },

  // ---------- PARÁ ----------
  { city: 'Belém', state: 'PA', category: 'saúde', status: 'active', confidence: 'likely', confidenceScore: 0.69, lat: -1.4558, lng: -48.4902, startedAt: '2026-11-09', endedAt: null, demands: 'Piso salarial da enfermagem e redução da jornada.', entityName: 'Sindicato dos Trabalhadores da Saúde do Pará', sourceUrl: 'https://exemplo-greve-belem-saude-01.com', sourceExcerpt: 'Técnicos de enfermagem paralisam por piso salarial e jornada.' },

  // ---------- AMAZONAS ----------
  { city: 'Manaus', state: 'AM', category: 'indústria', status: 'active', confidence: 'unverified', confidenceScore: 0.32, lat: -3.119, lng: -60.0217, startedAt: '2026-11-12', endedAt: null, demands: 'Reajuste salarial e melhoria das condições no polo industrial.', entityName: 'Sindicato dos Metalúrgicos do Amazonas', sourceUrl: 'https://exemplo-greve-manaus-industria-01.com', sourceExcerpt: 'Trabalhadores do polo industrial relatam paralisação em linha de montagem.' },
];

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

async function main() {
  console.log(`Inserindo ${strikes.length} greves adicionais...`);

  let created = 0;
  let skipped = 0;

  for (const s of strikes) {
    const existing = await prisma.strike.findFirst({
      where: {
        city: s.city,
        state: s.state,
        category: s.category,
        startedAt: new Date(s.startedAt),
      },
    });

    if (existing) {
      console.log(`  pulando (já existe): ${s.city}/${s.state} - ${s.category}`);
      skipped++;
      continue;
    }

    await prisma.strike.create({
      data: {
        title: `Greve em ${s.city} - ${capitalize(s.category)}`,
        city: s.city,
        state: s.state,
        category: s.category,
        status: s.status,
        confidence: s.confidence,
        confidenceScore: s.confidenceScore,
        lat: s.lat,
        lng: s.lng,
        startedAt: new Date(s.startedAt),
        endedAt: s.endedAt ? new Date(s.endedAt) : null,
        demands: s.demands,
        entityName: s.entityName,
        published: true,
        updatedAt: new Date(),
        sources: {
          create: [
            {
              url: s.sourceUrl,
              publisher: s.entityName,
              excerpt: s.sourceExcerpt,
              sourceType: 'news',
              publishedAt: new Date(s.startedAt),
            },
          ],
        },
      },
    });

    created++;
  }

  console.log(`Concluído: ${created} criadas, ${skipped} puladas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });