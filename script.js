var currentTime;
var dailyEl = $("#oneDayHolder");
var fiveDatyEl = $("#fiveDayHolder");
var cardHold = $("#cardBody");

var pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
if (pastSearches === null){
    pastSearches = ["Austin", "Dallas", "Houston", "San Antonio", "Lubbock", "El Paso"];
}


window.setInterval (function(){
    currentTime = moment().format('MM/DD/YYYY');
    $('#timeStamp').html(moment().format('dddd, MMMM YYYY || hh:mm:ss'))
  }, 1000);

//Dynamic Event Listener,  
//     parent               Event    Listen to      function
$('.recentSearchBtns').on('click',"#historyBTN" , function(event) { // code
    console.log(event.toElement.outerText);
    
    fetchForcastAPI(event.toElement.outerText);
});
$('#searchBtn').click('click', function(e) { // code
    var temp = $('#searchTextID').val();
    temp = temp.toLowerCase();
    console.log(temp);
     

    if (pastSearches.includes(fixString(temp))){
        fetchForcastAPI(fixString(temp));
    }
    else{
        pastSearches.push(fixString(temp));
        fetchForcastAPI(fixString(temp));
    }
    localStorage.setItem("pastSearches", JSON.stringify(pastSearches));

});

function historyButtons(){
    for (var x = 0; x < pastSearches.length; x++){
        $('.recentSearchBtns').append("<button class=\"btn-secondary w-100 p-1 mt-4 mb-1\" id=\"historyBTN\">"+ pastSearches[x] + "<\/button>");
        
      }
}
function fixString(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function fetchForcastAPI(city){
    var key = "b2e4aacfc90be615eb38241d3eaab93d";
    var modifyedURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + fixString(city) + "&appid=" + key;
    fetch(modifyedURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data === null) {
                alert("Not Found. Restart");
            } else {
                console.log(data);

                var date = moment().format("YYYY/MM/DD");
                /*<div>
                    <h2> Date <h2>
                    <div Temp <div>
                    <div Wind <div>
                    <div Humid <div>
                </div>
                */
                cardHold.empty();
               for(var a = 1; a <= 5; a++){
                var dateO = moment().add(a, 'd').format("YYYY-MM-DD");
                var str = String(dateO).replace(/\//g, "-") + " 12:00:00";
                for(var b = 0; b < (data.list.length); b++){
                    if(String(data.list[b].dt_txt) == str){
                        console.log("Meow");

                        var iconUrl = `https://openweathermap.org/img/w/${data.list[b].weather[0].icon}.png`;
                        var temp = "Temp: " + Math.floor((parseInt(data.list[b].main.temp) - 273.15) * (9/5) + 32) + " °F";
                        var Wind = "Wind: " +  Math.floor(parseInt(data.list[b].wind.gust) * 2.2369) + " MPH";
                        var Humid = "Humidity: " + data.list[b].main.humidity + " %" ;
                        var cardDiv = $("<div>");
                        cardDiv.addClass("card-body");
                        cardDiv.addClass("m-10");
                        var icon = "<img src=" + iconUrl + "\>"

                        cardDiv.append("<h2 class= \"pb-2 text-white\">"+ dateO + " " + icon + "<\/h2>");
                        cardDiv.append("<h4 class= \"pb-2 text-white\">"+ temp + "<\/h4>");
                        cardDiv.append("<h4 class= \"pb-2 text-white\">"+ Wind + "<\/h4>");
                        cardDiv.append("<h4 class= \"pb-2 text-white\">"+ Humid + "<\/h4>");
                        cardDiv.append("<div> <\/div>");

                    }
                }
                cardHold.append(cardDiv);
                cardHold.css("background-color","#007bff");
                cardHold.css(" border-right", "1px solid #000");

                fiveDatyEl.append(cardHold);
               }
                fetchCurrentAPI(data.city.coord.lat,data.city.coord.lon, city);
            }
        })
        .catch(function (error) {
            console.error(error);
        });

}
function fetchCurrentAPI(lat, lon, city){
    var key = "b2e4aacfc90be615eb38241d3eaab93d";
    var moddedURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + "daily" +"&appid=" + key;
    fetch(moddedURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data === null) {
                alert("Not Found. Restart");
            } else {
                console.log(data);
                dailyEl.empty();
                var iconUrl = `https://openweathermap.org/img/w/${data.current.weather[0].icon}.png`;
                var icon = "<img src=" + iconUrl + "\>"
                var locate = city + " | ("+ currentTime +") " + icon;
                var temp = "Temp: " + Math.floor((parseInt(data.current.temp) - 273.15) * (9/5) + 32) + " °F";
                var Wind = "Wind: " + Math.floor(parseInt(data.current.wind_gust) * 2.2369) + " MPH";
                var Humid = "Humidity: " + data.current.humidity + " %" ;
                var UV = "UV Index: " + data.current.uvi;

                /*<div>
                    <h2> City <h2>
                    <div Temp <div>
                    <div Wind <div>
                    <div Humid <div>
                    <div UV <div>
                </div>
                */
                dailyEl.append("<h1 class= \"pb-5\">"+ locate + "<\/h1>");
                dailyEl.append("<h2 class= \"pb-5\">"+ temp + "<\/h2>");
                dailyEl.append("<h2 class= \"pb-5\">"+ Wind + "<\/h2>");
                dailyEl.append("<h2 class= \"pb-5\">"+ Humid + "<\/h2>");
                dailyEl.append("<h2 class= \"d-md-inline-block btn-success\">"+ UV + "<\/h2>");

            }
        })
        .catch(function (error) {
            console.error(error);
        });
}
