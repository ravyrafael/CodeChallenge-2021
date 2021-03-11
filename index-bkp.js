const fs = require('fs');

var text = fs.readFileSync('map.txt','utf8')
var lines = occurrences(text, "_")
var manager = occurrences(text, "M")
var devs = fs.readFileSync('devs.txt','utf8')
var managers = fs.readFileSync('manager.txt','utf8')
 

var managerArray = managers.split('\n').map((x, y )=>{
    var i = x.split(' ');
    var manager = new Object();
    manager.id = y;
    manager.company = i[0];
    manager.points = i[1];
    return manager;
})
var devArray = devs.split('\n').map((x, y )=>{
    var i = x.split(' ');
    var desenv = new Object();
    desenv.id = y;
    desenv.company = i[0];
    desenv.points = i[1];
    desenv.skills = i.slice(3,i.length)
    desenv.skills.map(x=> x.replace('\r', '').replace('\n', ''))
    return desenv;
})
var largura = 100;
var altura = 100;
var mapa = text.split('\n')
var locais = [];
for (var i = 0; i < mapa.length; i++) {
    for (var j = 0; j < mapa[0].length; j++) {
        locais.push({id:j+((i)*mapa[0].length),positionY: i, positionX:j, skills:[], company: [],char: mapa[i][j]})
    }
}

locais.forEach((x, i)=>{
    if(x.char == "_"){
        if(locais[i].skills.length == 0){
            var dev = devArray.filter(y=>y.positionY == undefined).map(x=>x).sort((a,b)=> b.points - a.points)
            .sort((a,b)=> b.skills.length - a.skills.length)[0]
            devArray[dev.id].positionX = x.positionX;
            devArray[dev.id].positionY = x.positionY;
            var localY = locais.filter(y=>y.positionX == x.positionX && y.positionY == (x.positionY+ 1))[0]
            var localX = locais.filter(y=>y.positionX == (x.positionX+ 1) && (y.positionY == x.positionY))[0]
            var localYant = locais.filter(y=>y.positionX == x.positionX && (y.positionY == x.positionY- 1))[0]
            var localXant = locais.filter(y=>y.positionX == (x.positionX- 1) && y.positionY == x.positionY)[0]
            if(localY){
                locais[localY.id].skills = locais[localY.id].skills.concat(devArray[dev.id].skills);
                locais[localY.id].company = locais[localY.id].company.concat(devArray[dev.id].company);
            }
            if(localX){
                locais[localX.id].skills= locais[localX.id].skills.concat(devArray[dev.id].skills)
                locais[localX.id].company = locais[localX.id].company.concat(devArray[dev.id].company)
            }
            if(localYant){
                locais[localYant.id].skills = locais[localYant.id].skills.concat(devArray[dev.id].skills);
                locais[localYant.id].company = locais[localYant.id].company.concat(devArray[dev.id].company);
            }
            if(localXant){
                locais[localXant.id].skills=   locais[localXant.id].skills.concat(devArray[dev.id].skills);
                locais[localXant.id].company = locais[localXant.id].company.concat(devArray[dev.id].company);
            }       
        }
        else{
            var arraySkills = devArray.filter(y=>y.positionY == undefined).map(y =>({ 
                id:y.id,
                positionY:y.positionY,
                positionX:y.positionY,
                sim: similarity(x.skills, y.skills)}));

            var dev = arraySkills.sort((a,b)=> b.sim-a.sim)[0]; 
            devArray[dev.id].positionX = x.positionX;
            devArray[dev.id].positionY = x.positionY;
            var localY = locais.filter(y=>y.positionX == x.positionX && y.positionY == x.positionX++)[0];
            var localX = locais.filter(y=>y.positionX == x.positionX++ && y.positionY == x.positionX)[0];
            var localYant = locais.filter(y=>y.positionX == x.positionX && y.positionY == x.positionX--)[0];
            var localXant = locais.filter(y=>y.positionX == x.positionX-- && y.positionY == x.positionX)[0];
            if(localY){
                locais[localY.id].skills = locais[localY.id].skills.concat(devArray[dev.id].skills);
                locais[localY.id].company = locais[localY.id].company.concat(devArray[dev.id].company);
            }
            if(localX){
                locais[localX.id].skills= locais[localX.id].skills.concat(devArray[dev.id].skills)
                locais[localX.id].company = locais[localX.id].company.concat(devArray[dev.id].company)
            }
            if(localYant){
                locais[localYant.id].skills = locais[localYant.id].skills.concat(devArray[dev.id].skills);
                locais[localYant.id].company = locais[localYant.id].company.concat(devArray[dev.id].company);
            }
            if(localXant){
                locais[localXant.id].skills=   locais[localXant.id].skills.concat(devArray[dev.id].skills);
                locais[localXant.id].company = locais[localXant.id].company.concat(devArray[dev.id].company);
            }        

        }

    }
    if(x.char == "M"){
        if(locais[i].company.length == 0){
            var manager = managerArray.filter(y=>y.positionY == undefined)[0]
            managerArray[manager.id].positionX = x.positionX;
            managerArray[manager.id].positionY = x.positionY;
        }
        else{
            var arraySkills = managerArray.filter(y=>y.positionY == undefined).map(y =>({ 
                id:y.id,
                positionY:y.positionY,
                positionX:y.positionY,
                sim: similarity(x.company, y.company)}));
            var manager = arraySkills.sort((a,b)=> a.sim-b.sim).reverse()[0]; 
            managerArray[manager.id].positionX = x.positionX;
            managerArray[manager.id].positionY = x.positionY;
        }
    }
})
var logger = fs.createWriteStream('result.txt', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
devArray.forEach(x=>{
    if(x.positionX)   {
        logger.write(`${x.positionX} ${x.positionY}\n`);
    }
        else{
            logger.write(`X\n`);
        }
})
managerArray.forEach(x=>{
    if(x.positionX)   {
        logger.write(`${x.positionX} ${x.positionY}\n`)
    }
        else{
           logger.write("X\n")
        }
})
function similarity(arrayX, arrayY){
    var similarity = 0
    arrayX.forEach(x=>{
        if(arrayY.includes(x)){
            similarity++
        }
    })
    if(similarity == 0)
        return 0
    return similarity/arrayX.length;

}

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}