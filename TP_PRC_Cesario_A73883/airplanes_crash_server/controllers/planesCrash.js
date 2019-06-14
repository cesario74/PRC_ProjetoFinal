const axios = require('axios');
const PlanesCrash = module.exports;

normalize = function(response) {
    return response.results.bindings.map(obj =>
        Object.entries(obj)
            .reduce((new_obj, [k,v]) => (new_obj[k] = v.value, new_obj),
                    new Object()));
};

async function execQuery(q){
    try{
        var encoded = encodeURIComponent(q);
        response = await axios.get("http://localhost:7200/repositories/prc-tp" + '?query=' + encoded);
        return(normalize(response.data));
    }
    catch(error) {
        return('ERRO: ' + error)
    }
}

PlanesCrash.fatalidades = async () => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>
    select (Sum(?d) as ?FatPlane) (Sum(?e) as ?FatGround) WHERE{
        ?p a :Baixas.
        ?p  :baixasDoAviao ?d.
        ?p  :baixasColaterais ?e.
    }`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.allDisasters = async () => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>

    select ?p ?data ?locAc ?nomeCompa ?tipoDeAviao ?baixAvi ?baixCol WHERE{
        ?p :feitoPor ?s.
        ?p :data ?data.
        ?p :localDoAcidente ?locAc.
        ?p :tipoDeAviao ?tipoDeAviao.
        ?s :nome ?nomeCompa.
        ?p :provoca ?t.
        ?t :baixasDoAviao ?baixAvi.
        ?t :baixasColaterais ?baixCol.
    }`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.top10 = async () => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>

    select ?nomeCompanhia (count(?nomeCompanhia) as ?count) WHERE{
        ?p a :Companhia.
        ?p :nome ?nomeCompanhia.
    } group by ?nomeCompanhia
    order by DESC(count(?nomeCompanhia))
    limit 10`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.infoVoo = async (id) => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>

    select ?data ?hora ?locAc ?nomeCompa ?rota ?nrPessoas ?tipoDeAviao ?baixAvi ?baixCol ?descrAcontecimento WHERE{
            :voo${id} :data ?data.
            :voo${id} :hora ?hora.
            :voo${id} :localDoAcidente ?locAc.
            :voo${id} :nrPessoas ?nrPessoas.
            :voo${id} :rota ?rota.
            :voo${id} :tipoDeAviao ?tipoDeAviao.
            :baixas${id} :baixasDoAviao ?baixAvi.
            :baixas${id} :baixasColaterais ?baixCol.
            :comp${id} :nome ?nomeCompa.
            :comp${id} :descrAcontecimento ?descrAcontecimento.
        }`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.nrComp = async () => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>
    
    select (count(distinct ?o) as ?nrCompanhias) WHERE{
		?p a :Companhia.
    	?p :nome ?o.
    }`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.nomeComp = async () => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>
    
    select (sum(?t) as ?BaixasAviao)  (sum(?q) as ?BaixasColaterais) (count(?nomeCompanhias) as ?TotalDesastres) ?nomeCompanhias WHERE{
		?p a :Companhia.
    	?p :nome ?nomeCompanhias.
    	?p :faz ?b.
    	?b :provoca ?c.
    	?c :baixasDoAviao ?t.
    	?c :baixasColaterais ?q.
    }
    group by (?nomeCompanhias)
	order by asc (?nomeCompanhias)`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.infoComp = async (id) => {
    console.log(id)
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>
    
    select ?voo ?data ?localDoAcidente ?tipoDeAviao ?baixAvi ?baixCol WHERE{
        ?voo :feitoPor ?comp.
        ?voo :provoca ?baixas.
        ?voo :data ?data.
        ?voo :localDoAcidente ?localDoAcidente.
        ?voo :tipoDeAviao ?tipoDeAviao.
        ?comp :nome "${id}".
        ?baixas :baixasDoAviao ?baixAvi.
        ?baixas :baixasColaterais ?baixCol.
    }`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.anoMaisAci = async () => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>
    
    select ?ano (count(?ano) as ?nrAcidentes) WHERE{
        ?voo :data ?data.
    	bind( strbefore( ?data, "/" ) as ?ano )
    } group by (?ano)
    order by desc (?nrAcidentes)
    limit 1`;

    var res = await execQuery(query);
    return res;
};

PlanesCrash.tipoAvMaisAc = async () => {
    const query = `PREFIX : <http://www.semanticweb.org/cp74/ontology/TP/PRC2019/Airplanes_Crash#>
    
    select ?tipoDeAviao (count(?tipoDeAviao) as ?nrAcidentes) WHERE{
        ?voo :tipoDeAviao ?tipoDeAviao.
    } group by (?tipoDeAviao)
    order by desc (?nrAcidentes)
    limit 1`;

    var res = await execQuery(query);
    return res;
};