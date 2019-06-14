const jsonfile = require('jsonfile')
const file = 'airplanes_crash.json'
var fs = require("fs")

jsonfile.readFile(file)
    .then(obj => {
        var atores = [];
        var generos = [];
        var gene = 0
        voos = ''

        for(var i =0; i<obj.length; i++){
            gene = gene+1

            var baixas = ''
            baixas += '###  http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#baixas' + gene + '\n';
            baixas += ':baixas' + gene + ' rdf:type owl:NamedIndividual ,\n';
            baixas += '\t\t:Baixas ;\n';
            baixas += '\t:saoProvocadasPor :voo' + gene + ' ;\n';
            baixas += '\t:baixasDoAviao ' + obj[i].Fatalities + ' ;\n';
            baixas += '\t:baixasColaterais ' + obj[i].Ground + ' .';

            voos += baixas + '\n\n'
        }

        gene = 0

        for(var i =0; i<obj.length; i++){
            gene = gene+1

            var companhia = ''
            companhia += '###  http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#comp' + gene + '\n';
            companhia += ':comp' + gene + ' rdf:type owl:NamedIndividual ,\n';
            companhia += '\t\t:Companhia ;\n';
            companhia += '\t:faz :voo' + gene + ' ;\n';
            companhia += '\t:descrAcontecimento \"' + obj[i].Summary + '\" ;\n';
            companhia += '\t:nome \"' + obj[i].Operator + '\" .';

            voos += companhia + '\n\n'
        }

        gene = 0

        for(var i =0; i<obj.length; i++){
            gene = gene+1

            var voo = ''
            voo += '###  http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#voo' + gene + '\n';
            voo += ':voo' + gene + ' rdf:type owl:NamedIndividual ,\n';
            voo += '\t\t:Voo ;\n';
            voo += '\t:feitoPor :comp' + gene + ' ;\n';
            voo += '\t:provoca :baixas' + gene + ' ;\n';
            voo += '\t:data \"' + obj[i].Date + '\" ;\n';
            voo += '\t:hora \"' + obj[i].Time + '\" ;\n';
            voo += '\t:localDoAcidente \"' + obj[i].Location + '\" ;\n';
            voo += '\t:nrPessoas ' + obj[i].Aboard + ' ;\n';
            voo += '\t:rota \"' + obj[i].Route + '\" ;\n';
            voo += '\t:tipoDeAviao \"' + obj[i].Type + '\" .';

            voos += voo + '\n\n'
        }


        fs.writeFile("voo.txt", voos, (err) => {
            if (err) console.log(err);
            console.log("Successfully Written to File.");
          });
    })
    .catch(error => console.log(error))