let requestURL = "http://www.7timer.info/bin/civillight.php?lon=-97.855&lat=22.214&unit=metric&output=json&tzshift=0";
let request = new XMLHttpRequest();

if ("geolocation" in navigator) {
    /* la geolocalización está disponible */
    navigator.geolocation.getCurrentPosition(function(position) {
        requestPronosticoTiempo(position.coords.latitude,position.coords.longitude);
    });
} else {
    /* la geolocalización NO está disponible */
    console.log("No");
}

function requestPronosticoTiempo(lat, lon){
    // Preparamos API
    requestURL = `http://www.7timer.info/bin/civillight.php?lon=${lon}&lat=${lat}&unit=metric&output=json&tzshift=0`;
    // Limpiamos Tabla de pronosticos
    let tablapronostico = document.querySelector("#pronostico");
    tablapronostico.innerHTML="";
    // Hacemos la solicitud al API
    request.open("GET", requestURL);
    request.responseType="json";
    request.send();
}

function formatofecha(fecha){
    let anio = fecha.substring(0,4);
    let mes = fecha.substring(4,6);
    let dia = fecha.substring(6,8);
    return `${dia}/${mes}/${anio}`;
}

function formatoclima(clima){
    // <i class="bi bi-sun"></i>
    switch (clima) {
        case 'clear':
            return `<i class="bi bi-sun"></i> Despejado`
        case 'ts':
            return `<i class="bi bi-cloud-lightning"></i> Tormenta Electrica`
        case 'pcloudy':
            return `<i class="bi bi-cloud-sun"></i> Parcialmente Nublado`
        case 'mcloudy':
            return `<i class="bi bi-cloudy"></i> Medianamente Nublado`
        case 'cloudy':
            return `<i class="bi bi-clouds"></i> Nublado`
        case 'lightrain':
            return `<i class="bi bi-cloud-drizzle"></i> LLuvia ligera`
        case 'humid':
            return `<i class="bi bi-droplet"></i> Humedo`
        default:
            return `<i class="bi bi-question-circle"></i> Desconocido`
    }
}

function formatoviento(viento){
    // <i class="bi bi-sun"></i>
    switch (viento) {
        case 1:
            return `<i class="bi bi-wind"></i> Calmado`
        case 2:
            return `<i class="bi bi-wind"></i> Ligero`
        case 3:
            return `<i class="bi bi-wind"></i> Moderado`
        case 4:
            return `<i class="bi bi-wind"></i> Fresco`
        case 5:
            return `<i class="bi bi-wind"></i> Fuerte`
        case 6:
            return `<i class="bi bi-wind"></i> Vendaval`
        case 7:
            return `<i class="bi bi-wind"></i> Tormenta`
        case 8:
            return `<i class="bi bi-wind"></i> Hurracan`
        default:
            return `<i class="bi bi-wind"></i>Desconocido`
    }
}

request.onload = function(){
    console.log(request.response);
    let respuesta = request.response;
    let tablapronostico = document.querySelector("#pronostico");
    for(let valor of respuesta.dataseries){
        let contenedor = document.createElement("div");
        contenedor.classList.add("prediccion");
        contenedor.innerHTML=`
            <span><i class="bi bi-calendar"></i>${formatofecha(""+valor.date)}</span>
            <span><i class="bi bi-thermometer"></i>${valor.temp2m.min}</span>
            <span><i class="bi bi-thermometer-high"></i>${valor.temp2m.max}</span>
            <span class="clima">${formatoclima(valor.weather)}</span>
            <span>${formatoviento(valor.wind10m_max)}</span>
        `;
        tablapronostico.appendChild(contenedor);
    }
}



document.querySelector("#btnconsulta").addEventListener("click",function(){
    let lat = document.querySelector("#lat").value;
    let lon = document.querySelector("#lon").value;
    requestPronosticoTiempo(lat,lon);
    
});

var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYWxlamFuZHJvcm9tZXJvIiwiYSI6ImNrbmphZTF6OTBsZGEzNHQxcnRscWcycXkifQ.bF2sv6Mrn_WsVZF2ALtcow'
}).addTo(mymap);

let marker;
function onMapClick(e){
    if(marker){
        marker.remove();
    }
    marker= L.marker([e.lating.lat, e.lating.lon]).addTo(mymap);
    requestPronosticoTiempo(e.lating.lat, e.lating.lon);
}

mymap.on('click', onMapClick);