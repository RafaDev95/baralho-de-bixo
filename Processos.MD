A ideia inicial era desenvolver algo para estudar/praticar um pouco sobre design pattern e OOP. Lembrei que também precisava estudar sobre MCP e a Fuels...
Depois de alguns brainstorms a decisão foi fazer um TCG. 


- Inicialmente tava totalmente focado na criação de cartas e decks mas ao decorrer do projeto alguns pontos importantes foram surgindo: Quais as regras de um jogo de cartas? Como funcionam os turnos? Quais tipos de cartas existem? Como funciona para o player sacar uma carta aleatória do deck? 
- Dentre esses e alguns outros questionamentos eu decidi baixar e jogar o tutorial de **Magic the gathering**. Um TCG antigo e bem conhecido por amantes do gênero. Então nada melhor para usar como referência e aprender como funciona esse mundo.
- Além de aprender sobre MTG (Magic the gathering) me surgiu a curiosidade de pesquisar sobre *RNG* (Random Number Generator) um termo muito conhecido nos jogos em que envolve "sorte" para conseguir algo. Por citar Pokémon e sua "sorte" para encontrar um Pokémon Shiny.

- Após jogar MTG eu consegui entender sobre o sistema de *Mana pool*, tipos de cartas e em qual momento os turnos acabavam e um outro ponto importante: O player pode escolher atacar ou não.
Beleza, agora preciso setar algumas prioridades e retomar o desenvolvimento:
 - Encontrar uma forma definir minha cartas e que seja simples adicionar novas futuramente
 - Criar as cartas e decks inciais
- Lembrando que um dos objetivos inicais era estudar sobre design pattern, nada melhor do que pensar em um para resolver os 2 pontos citados acima. Onde cheguei na conclusão de: 
 - Criar uma *Factory* para criar cartas e outra para criar os decks
 - *Builder pattern* também me parece bem interessante caso eu pretendar deixar com que o usuário consiga criar alguma carta. 
- Após entender um pouco mais sobre factory e build, criei testes para vailidar esses dois patterns e recebi uma sugestão para ver sobre **Strategy Patter**.
- Strategy Pattern trata-se de criar vários algorítimos, normalmente classes, para tratar/executar determinada lógica, sendo cada um deles tendo apenas uma responsabilidade. (Criar cartas apenas do tipo criatura, por exemplo.) E aí decidi fazer isso: Criei uma classe para ser responsável para criação de cada tipo de carta mas ainda não estava me agradando por conta dos switch's. 
Daí então decidi pesquisar por formas melhores de direcionar a criação de cada carta.
Um exemplo visual de como estava com switch:
`
abstract Class CardFactory {
    protected abstract createCard(): CardBase;

    create(): CardBase {
		const card = this.createCard();
		this.validateCard(card);
		return card;
	}

    protected validateCard(card:CardBase):void {
        validações :thumbsup
    }
}

Class CreateCreatureCardStrategy extends CardFactory {
    ... lógica pra criar uma criatura :thumbsup
}

... CreateSpellCardStrategy, CreateArtifactCardStrategy, EnchantmentCardStrategy (4 classes no total)

static createFactory(type: CardType, cardData: CardFactoryData): CardFactory {
	switch (type) {
		case CardFactoryType.CREATURE:
			return new CreatureCardStrategy(cardData as Omit<CreatureCard, "type">);
		case CardFactoryType.SPELL:
			return new SpellCardStrategy(cardData as Omit<SpellCard, "type">);
		case CardFactoryType.ENCHANTMENT:
			return new EnchantmentCardStrategy(cardData as Omit<EnchantmentCard, "type">);
		case CardFactoryType.ARTIFACT:
			return new ArtifactCardStrategy(cardData as Omit<ArtifactCard, "type">);
		default:
			throw new Error(`Card type ${type} not supported`);
	}
}
`

- Estava funcionando? Sim, tecnicamente simples de entender? também. Mas ainda sim estava incomodando. Encontrei um conceito chamado **Lookup table** que nada mais é do que uma tabela de consulta. É uma estratégia usada para simplificar a busca de dados ao invés de criar algum cáculo ou algum if/switch. E existe um Design Pattern chamado de **Registry** que literalmente usa esse conceito. E aplicando esse carinha, ficou muito mais limpo e legível. 


```
const strategyRegistry = {
	creature: (cardData: CardFactoryData) =>
		new CreatureCardStrategy(cardData as Omit<CreatureCard, "type">),
	spell: (cardData: CardFactoryData) =>
		new SpellCardStrategy(cardData as Omit<SpellCard, "type">),
	enchantment: (cardData: CardFactoryData) =>
		new EnchantmentCardStrategy(cardData as Omit<EnchantmentCard, "type">),
	artifact: (cardData: CardFactoryData) =>
		new ArtifactCardStrategy(cardData as Omit<ArtifactCard, "type">),
} satisfies Record<CardType, (cardData: CardFactoryData) => CardFactory>;


class CardFactoryCreator {
	static createFactory(type: CardType, cardData: CardFactoryData): CardFactory {
		const strategyFactory = strategyRegistry[type];

		if (!strategyFactory) {
			throw new Error(`Card type ${type} not supported`);
		}

		return strategyFactory(cardData);
	}
}
```

- Além disso, com essa implementação de strategy e registry patterns eu pude também melhorar minha classe `card-loader`