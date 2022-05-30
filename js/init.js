// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':5};

let englishFirst = L.featureGroup();
let nonEnglishFirst = L.featureGroup();

let layers = {
	"English as First Language <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='green' /></svg>": englishFirst,
	"Non-English as First Language <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='red' /></svg>": nonEnglishFirst
}

// add variables for keeping track of the count for the charts
let countEnglish = 0;
let countNonEnglish = 0;


let circleOptions = {
    radius: 4,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2WyfKTyZJ-_ja3GGrxoAXwranavyDGXYsxeFUO4nvHpCJrkKhChymXQqUEyhdGLnz9VN6BJv5tOjp/pub?gid=1560504149&single=true&output=csv";

const englishFirstLegendHTML = document.getElementById("englishFirstLegend");
const nonEnglishFirstLegendHtml = document.getElementById("nonEnglishFirstLegend");

const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);


let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);

function addMarker(data){
    if(data['Is your English your first language?'] == "Yes"){
        circleOptions.fillColor = "red"
        englishFirst.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>English First Language</h2>`))
        // add to the running total of English as first language speajers
        countEnglish += 1;
        }
    else{
        circleOptions.fillColor = "blue"
        nonEnglishFirst.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Non-English First Language</h2>`))
        // add to the running total of non-English 
        countNonEnglish +=1;
    }
    return data
};


function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
};

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
    })
    englishFirst.addTo(map) 
    nonEnglishFirst.addTo(map)  
    let allLayers = L.featureGroup([englishFirst,nonEnglishFirst]);
    map.fitBounds(allLayers.getBounds());
    addChart() // call the addChart function after the data is added
};

loadData(dataUrl)

englishFirstLegendHTML.addEventListener("click",toggleEnglishLayer) 

function toggleEnglishLayer(){
    if(map.hasLayer(englishFirst)){
        map.removeLayer(englishFirst)
    }
    else{
        map.addLayer(englishFirst)
    }
}

nonEnglishFirstLegendHtml.addEventListener("click",toggleNonEnglishLayer) 

function toggleNonEnglishLayer(){
    if(map.hasLayer(nonEnglishFirst)){
        map.removeLayer(nonEnglishFirst)
    }
    else{
        map.addLayer(nonEnglishFirst)
    }
}

//function to add chart after the data gets created

function addChart(){
    // create the new chart here, target the id in the html called "chart"
    new Chart(document.getElementById("chart"), {
        type: 'pie', //can change to 'bar','line' chart or others
        data: {
            // labels for data here
        labels: ["English as First Language","Non-English as First Language"],
        datasets: [
            {
            label: "Count",
            backgroundColor: ["green", "red"],
            data: [countEnglish,countNonEnglish]
            }
        ]
        },
        options: {
            responsive: true, //turn on responsive mode changes with page size
            maintainAspectRatio: false, // if `true` causes weird layout issues
            legend: { display: true },
            title: {
                display: true,
                text: 'Survey Respondants'
            }
        }
    });
}