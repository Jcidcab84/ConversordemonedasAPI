
const apiURL = "https://mindicador.cl/api/";
let myChart = null;

async function getCoins(url){
    try{
        const monedas = await fetch(url);
        const {dolar, ivp, euro, uf, utm } = await monedas.json();
        return [dolar, ivp, euro, uf, utm];
    }catch(error){
        console.log(error);
    }   
}

async function renderCoinOptions(url){
    try {
        const select_container = document.getElementById("select_coin");
        const coins = await getCoins(url);

        coins.forEach((coin_info)=>{
            const option = document.createElement('option');
            option.value = coin_info['codigo'];
            option.innerText = coin_info['nombre'];
            select_container.appendChild(option);
        });
    } catch (error){
        throw new Error(error);
    }
}

async function getCoinDetails(url, coinID){
    try{
        if(coinID){
            const coin = await fetch(`${url}${coinID}`);
            const {serie} = await coin.json();
            console.log(serie);
            const [{ valor: coinValue }]=serie;
            return coinValue;

            
        }else{
            alert("Selecciona una moneda")
        }
        
    }catch (error) {
        throw new Error(error);
    }
}



async function getAndCreateDataToChart(url, coinID) {
    const coin = await fetch(`${url}${coinID}`);
    const {serie} = await coin.json();


 const firstTenDays = serie.slice(0, 10);

    const labels = firstTenDays.map(({ fecha }) => {
        // Formatear la fecha usando moment.js o cualquier lógica que prefieras
        const formattedDate = moment(fecha).format('DD/MM/YYYY');
        return formattedDate;
    });
    const data = serie.map(({valor}) => {
    return valor;
    });
    const datasets = [
    {
    label: "Valores de los ultimos días",
    borderColor: "rgb(255, 99, 132)",
    data,
    },
    ];
    return { labels, datasets };
    }


    async function renderGrafica() {
        const option_selected = document.getElementById('select_coin').value;
        const data = await getAndCreateDataToChart(apiURL, option_selected);
        const config = {
        type: "line",
        data,
        };
        const canvas = document.getElementById("chart");
        // canvas.style.backgroundColor = "white";
        if(myChart){
            myChart.destroy();
        }

        myChart= new Chart(canvas, config);
        }
        

document.getElementById('search').addEventListener('click', async (event) => {
    const option_selected = document.getElementById('select_coin').value;
    const coinValue = await getCoinDetails(apiURL, option_selected);
    const inputPesos = document.getElementById("inputPesos").value;
    const answerTotal = document.getElementById("answerDivisa");
    const convertion = (inputPesos/coinValue).toFixed(2);
    answerTotal.innerHTML = `Resultado: ${convertion}`;
    renderGrafica();
    
});


renderCoinOptions(apiURL);


