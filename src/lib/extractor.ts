export type StrikeScope = 'national' | 'state' | 'municipal';
export type StrikeStatus = 'active' | 'ended' | 'suspended';
export type StrikeConfidence = 'confirmed' | 'likely' | 'unverified';

export interface ExtractedStrike {
  title: string;
  scope: StrikeScope;
  city: string | null;
  state: string | null;
  category: string;
  entityName: string | null;
  lat: number | null;
  lng: number | null;
  startedAt: string | null;
  endedAt: string | null;
  status: StrikeStatus;
  demands: string | null;
  confidence: StrikeConfidence;
  confidenceScore: number;
  excerpt: string;
}

export interface ExtractionResult {
  isAnnounced: boolean;
  strikes: ExtractedStrike[];
}

export const EXTRACTION_PROMPT = `Voce e um extrator de dados de greves no Brasil. Recebe o texto de uma noticia ou comunicado sindical e devolve JSON estruturado.

REGRAS OBRIGATORIAS

R1 - NAO INVENTE. Se um dado nao esta literalmente no texto, o campo vem null. Nunca complete com conhecimento externo. Exemplo: se o texto diz "o sindicato da categoria" sem nomear, entityName = null.

R2 - SUSPENSAO NAO E ENCERRAMENTO. "Suspensa ate o dia 11" = status "suspended" e endedAt null. So preencha endedAt quando o texto afirmar encerramento definitivo.

R3 - MULTIPLAS CIDADES. Se o texto lista varias cidades, nunca escolha uma silenciosamente. Aplique R6.

R4 - TERMO COMPOSTO. A categoria vem do contexto da entidade, nao da palavra isolada. "Greve Ambiental" nos Correios e termo proprio da categoria, NAO e categoria "meio ambiente".

R5 - PESO DA FONTE define confidence e confidenceScore:
- Jornal grande (G1, Folha, Estadao, Agencia Brasil): 0.85-0.95, confidence "confirmed"
- Portal regional: 0.75-0.85, confidence "confirmed"
- Sindicato/central: 0.60-0.75, confidence "likely"
- Rede social/post: 0.30-0.50, confidence "unverified"

R6 - ESCOPO (campo scope):
- "national": mais de 3 cidades em 2 ou mais UFs diferentes. city = null, state = null.
- "state": varias cidades dentro de uma unica UF. city = null, state preenchido.
- "municipal": uma cidade ou municipios da mesma regiao metropolitana. city preenchida.
Atencao: 8 municipios da Grande Sao Paulo sao "municipal", nao "national" - o criterio e UF, nao contagem de cidades.

R7 - GREVE ANUNCIADA NAO ENTRA. Se o texto diz que a greve foi "aprovada", "decidida", "marcada para comecar" e ainda nao iniciou, marque isAnnounced = true.

R8 - MULTIPLOS EVENTOS. Se o texto descreve eventos distintos (ex.: greve nacional da Caixa + paralisacao parcial do BB), crie um objeto por evento no array "strikes".

FORMATO DE SAIDA

{
  "isAnnounced": false,
  "strikes": [
    {
      "title": "string",
      "scope": "national | state | municipal",
      "city": "string | null",
      "state": "UF | null",
      "category": "string",
      "entityName": "string | null",
      "startedAt": "YYYY-MM-DD | null",
      "endedAt": "YYYY-MM-DD | null",
      "status": "active | ended | suspended",
      "demands": "string | null",
      "confidence": "confirmed | likely | unverified",
      "confidenceScore": 0.0,
      "excerpt": "trecho literal de ate 300 caracteres que comprova a extracao"
    }
  ]
}

CATEGORIAS PADRONIZADAS (minusculo)
transporte, educacao, saude, industria, comercio, servico publico, bancario, seguranca publica, construcao civil, agricultura, tecnologia

Se nenhuma se aplica, use a categoria que o texto nomeia, em minusculo.

EXEMPLOS DE CASOS-LIMITE

Exemplo 1 (R1): "A greve dos rodoviarios em Manaus pode atingir 70% da frota" -> entityName = null, porque o texto nao nomeia o sindicato.

Exemplo 2 (R2): "A greve foi suspensa ate o dia 11" -> status "suspended", endedAt null.

Exemplo 3 (R6): "Sao Paulo, Osasco, Barueri, Carapicuiba, Cotia" -> scope "municipal", city "Sao Paulo", porque todos sao da mesma UF e regiao metropolitana.

Exemplo 4 (R7): "greve aprovada para comecar nesta quinta (10)" -> isAnnounced = true.

Exemplo 5 (R8): "Caixa entra em greve nacional; BB tem paralisacao parcial" -> dois objetos no array strikes.

FORMATO DE ENTREGA - OBRIGATORIO

1. Devolva um unico objeto JSON, comecando com { e terminando com }.
2. Nao use blocos de codigo markdown. Nao escreva crase tripla nem a palavra json antes do objeto.
3. Nao escreva nenhum texto antes ou depois do JSON. Sem introducao, sem comentario, sem despedida.
4. Nao use comentarios dentro do JSON.
5. Se o texto nao descreve nenhuma greve, devolva exatamente: {"isAnnounced": false, "strikes": []}
6. Se o texto descreve greve anunciada mas nao iniciada, devolva: {"isAnnounced": true, "strikes": []}
7. Todos os campos do objeto em "strikes" devem estar presentes. Campo sem informacao recebe null, nunca e omitido.
8. Datas sempre no formato YYYY-MM-DD. Nunca escreva "12 de novembro" ou "quinta-feira".
9. confidenceScore sempre numerico entre 0 e 1, com ponto decimal. Nunca string, nunca virgula.
10. excerpt sempre entre 100 e 300 caracteres, copiado literalmente do texto original.

CHECKLIST ANTES DE RESPONDER

- O JSON abre com { e fecha com }?
- Existe alguma crase tripla no texto? Se sim, remova.
- Existe algum campo faltando em "strikes"? Se sim, adicione com null.
- Alguma data esta fora do formato YYYY-MM-DD? Se sim, corrija.
- Algum confidenceScore esta como texto ou com virgula? Se sim, corrija.
- O excerpt esta entre 100 e 300 caracteres? Se nao, ajuste.

CLASSIFICACAO DO TIPO DE EVENTO (campo eventType):
- Use "paralisacao" quando o texto indicar data de termino explicita ou duracao definida. Exemplos: "paralisacao nos dias 03 e 04 de outubro", "paralisacao de 24 horas", "paralisacao por dois dias", "paralisacao ate sexta-feira", "paralisacao entre os dias 10 e 12".
- Use "greve" quando o movimento for por tempo indeterminado, sem data de fim declarada. Exemplos: "greve por tempo indeterminado", "servidores entram em greve", "greve a partir de segunda-feira", "greve continua".
- Se o texto usar a palavra "paralisacao" mas indicar continuidade sem prazo, classifique como "greve".
- Se o texto usar "greve" mas indicar data de termino, classifique como "paralisacao".
- Na duvida, use "greve" e reduza o confidenceScore.
- Para eventType = "paralisacao", endedAt e OBRIGATORIO: calcule a data de termino a partir do texto. Se o texto disser "dias 03 e 04 de outubro", startedAt = 03/10 e endedAt = 04/10.
- Para eventType = "greve", endedAt deve ser null, exceto se o texto informar explicitamente o fim.
E adicione o campo na descrição do JSON de saída. Localize o bloco que descreve os campos e inclua:

"eventType": "greve" ou "paralisacao",

Responda apenas com o JSON.`;

// MODO TESTE: devolve dados fixos, sem chamar nenhum modelo.
// Trocar por extractStrikeReal() quando a chave estiver configurada.
export async function extractStrike(rawText: string): Promise<ExtractionResult> {
  await new Promise((r) => setTimeout(r, 300));

  return {
    isAnnounced: false,
    strikes: [
      {
        title: 'Greve dos motoristas de onibus',
        scope: 'municipal',
        city: 'Campinas',
        state: 'SP',
        category: 'transporte',
        entityName: 'Sindicato dos Motoristas',
        lat: -22.9099,
        lng: -47.0626,
        startedAt: new Date().toISOString().slice(0, 10),
        endedAt: null,
        status: 'active',
        demands: 'Reajuste salarial de 10% e melhores condicoes de trabalho',
        confidence: 'likely',
        confidenceScore: 0.75,
        excerpt:
          'Motoristas de onibus de Campinas iniciaram greve por tempo indeterminado, com reajuste salarial e melhoria nas condicoes de trabalho entre as reivindicacoes.',
      },
    ],
  };
}