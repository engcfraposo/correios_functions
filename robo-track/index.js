const axios = require('axios');
const Telegraf = require('telegraf').Telegraf;

const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = async function (context, myTimer) {
    const { data: products } = await axios.get(process.env.RASTREADORES_URL);
    
    products.map(product => {
        axios.get(`https://proxyapp.correios.com.br/v1/sro-rastro/${product.code}`)
        .then(response => {
            let message = ""
            message = `<b>Name:</b>`+`<code>${product.name}</code>` + `\n`
            +`<b>Código:</b>`+`<code>${response.data.objetos[0].codObjeto}</code>` + `\n` 
            + `<b>Status:</b>`+`<code>${response.data.objetos[0].eventos[0].descricao}</code>` + `\n`
            + `<b>Origem: </b>`+`<code>${response.data.objetos[0].eventos[0].unidade.nome}</code>` + `\n`
            + `<b>Destino: </b>`+`<code>${response.data.objetos[0].eventos[0].unidadeDestino.nome}</code>` + `\n`;
            bot.telegram.sendMessage(process.env.CHAT_ID_KEY, message , {parse_mode: "HTML"});
        })
    })
};