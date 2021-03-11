const { Console } = require('console');
const fs = require('fs');
var arquivo = 'matrizc'
var text = fs.readFileSync(arquivo + '.txt', 'utf8')

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


var logger = fs.createWriteStream(arquivo + 'result.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
})

locais = locais.sort((a, b) => (b.latencia) - (a.latencia))
totalAntenas = totalAntenas.sort((a, b) => a.alcance - b.alcance)
logger.write(totalAntenas.length + '\n')
var posicaox
var posicaoy
var locaisIndex = 0
totalAntenas.forEach((antena, i) => {
    console.log(i);
    if (i == 0) {
        antena.position = {
            x: locais[0].x,
            y: locais[0].y,
        }
    }
    else {
        var newLocal = locais.find(local=> !local.coberto)
        antena.position = {
            x: newLocal.x,
            y: newLocal.y,
        }
    }
    locais.filter(x=>!x.coberto).forEach(local => {
            var maxRangex = antena.alcance + antena.position.x
            var maxRangey = antena.alcance + antena.position.y
            var minRangex = antena.position.x - antena.alcance
            var minRangey = antena.position.y - antena.alcance
            minRangex = minRangex < 0 ? 0 : minRangex
            minRangey = minRangey < 0 ? 0 : minRangey
            maxRangey = maxRangey >= altura ? altura - 1 : maxRangey
            maxRangex = maxRangex >= largura ? largura - 1 : maxRangex



            if (local.x >= minRangex && local.x <= maxRangex) {
                if (local.y >= minRangey && local.y <= maxRangey) {
                    local.coberto = true
                }
            }
    })
})


totalAntenas.sort((a, b) => a.id - b.id).forEach(antena => {
    logger.write(`${antena.id} ${antena.position.x} ${antena.position.y}\n`);
})