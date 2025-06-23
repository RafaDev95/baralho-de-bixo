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