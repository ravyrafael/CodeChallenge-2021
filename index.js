const fs = require('fs');
var arquivo = 'matriza'
var text = fs.readFileSync(arquivo+ '.txt', 'utf8')

var mapa = text.split('\n')
var altura = mapa[0].split(' ')[0]
var largura = mapa[0].split(' ')[1].replace('\r', '')

var antenaId = 0

var construcoes = Number.parseInt(mapa[1].split(' ')[0])
var antenas = Number.parseInt(mapa[1].split(' ')[1])
var pontuacao = Number.parseInt(mapa[1].split(' ')[2])
var locais = []
var totalAntenas = []
for (var i = 2; i < 2 + construcoes; i++) {
    var linha = mapa[i].split(' ')
    locais.push({
        x: Number.parseInt(linha[0]),
        y: Number.parseInt(linha[1]),
        latencia: linha[2],
        velocidade: linha[3].replace('\r', '')
    })
}

for (var i = 2 + construcoes;
    i < 2 + construcoes + antenas; i++) {
    var linha = mapa[i].split(' ')
    totalAntenas.push({
        id: antenaId,
        alcance: Number.parseInt(linha[0]),
        velocidadeConexao: linha[1].replace('\r', '')
    })
    antenaId++
}


var logger = fs.createWriteStream(arquivo+'result.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

locais = locais.sort((a, b) => (a.x + a.y) - (b.x + b.y))
totalAntenas = totalAntenas.sort((a, b) => b.alcance - a.alcance)
logger.write(totalAntenas.length + '\n')
var posicaox
var posicaoy

totalAntenas.forEach((antena, i) => {
    try {
console.log(i)
        var tryRandonPosition = ()=>
        {
            proximaPosX = Math.floor(Math.random() * largura)
            proximaPosY = Math.floor(Math.random() * altura)
            proximaPosX = proximaPosX < 0 ? 0 : proximaPosX
            proximaPosY = proximaPosY < 0 ? 0 : proximaPosY
            if (!totalAntenas.some(ant => {
                return ant.position && ant.position.x == proximaPosX && ant.position.y == proximaPosY
            }
            )) {
                antena.position = {
                    x: proximaPosX,
                    y: proximaPosY
                }
            }
            else{
                tryRandonPosition()
            }
        }

         tryRandonPosition();

    }
    catch{
        console.log(i)
    }
})


totalAntenas.sort((a,b) => a.id - b.id).forEach(antena =>{
    logger.write(`${antena.id} ${antena.position.x} ${antena.position.y}\n`);
})