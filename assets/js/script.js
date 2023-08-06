const calculate = document.getElementById("convert");
const graphics = document.getElementById("myChart");
let myGraph;

const getCurrencies = async (codigo) => {
    try {
        const res = await fetch(`https://mindicador.cl/api/${codigo}`);
        const currencies = await res.json();
        console.log(currencies);
    
        return currencies.serie;
    } catch (error) {
        alert(error.message);
    }
};

getCurrencies();

const getTotalAmount = (valor, data) => {
    const currencyValue = data[0].valor;
    const total = valor / currencyValue;
    return Math.round(total*100)/100;
};

const totalDOM = (total) => {
    document.getElementById("total").innerHTML = total;
};

const calculateCurrencyValue = async (valor, codigo) => {
    const data = await getCurrencies(codigo);
    renderChart(data, valor);
};

function cleanChartDOM() {
    if (myGraph) {
        myGraph.destroy();
    }
};    

const renderChart = (data, valor) => {
    const total = getTotalAmount(valor, data);
    totalDOM(total);

    const getValues = (values) => {
    const currencyValue = values.map((value) => value.valor)

    return currencyValue.slice(0, 10);
    }; 

    const getDates = (dates) => {
    const serie = dates.map((date) => new Date(date.fecha).toLocaleDateString("en-US"));

    return serie.slice(0, 10);
    };

    const dates = getDates(data);
    const values = getValues(data);

    const typeOfChart = "line";
    const title = "Moneda";
    const lineColor = "rgb(119, 238, 0)";
    
    const config = {
        type: typeOfChart,
        data: {
            labels: dates,
            datasets: [{
                label: title,
                backgroundColor : lineColor,
                data: values
            }]
        }
    };

    cleanChartDOM();
          
    graphics.style.backgroundColor = "rgb(226, 226, 226)";
    graphics.style.boxShadow = "5px 5px 10px";
    
    myGraph = new Chart(graphics, config);   
};

calculate.addEventListener("click", async () => {
    const value = document.getElementById("amount").value;
    const codigo = document.getElementById("codigo").value;

     if (!value) {
        alert("Ingrese un valor")
        return
     }
     if (!codigo) {
        alert("Seleccione una moneda")
        return
     }
    
    await calculateCurrencyValue(value, codigo);
});

