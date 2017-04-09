angular.module('starter.controllers', ['ionic', 'ngCordova', 'ionic-ratings'])


.factory('uuidFactory', function() {
return{
   val: 0

  };
})

.controller('InicioCtrl', function($scope, $state, $ionicPlatform, $ionicPopup, $cordovaDevice, uuidFactory, PuntuacionesEstabl, puntuaciones) {
var deregisterFirst = $ionicPlatform.registerBackButtonAction(

      function() {
       
        $ionicPopup.confirm({
        title: 'Cerrar Food Trucks',
        template: '¿Está seguro de cerrar la aplicación?',
        cancelText: "Volver",
         okText:"Salir",
         okType:"button-assertive"
      }).then(function(res) {
        if (res) {

          ionic.Platform.exitApp();
        }
      })
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst); 


$scope.irAUbicame=function(){
$state.go('app.ubicame');	

}

$scope.irALista=function(){
$state.go('app.lista'); 
}




var score = PuntuacionesEstabl.getScore().then(function(scores){

  puntuaciones.val = clone(scores.data);
  console.log(puntuaciones.val)
});




//Funcion que clona el objeto 
function clone( obj ) {
    if ( obj === null || typeof obj  !== 'object' ) {
        return obj;
    }
 
    var temp = obj.constructor();
    for ( var key in obj ) {
        temp[ key ] = clone( obj[ key ] );
    }
    
    return temp;
}





})

.controller('UbicameCtrl', function($scope, $state, $cordovaGeolocation, Markers, $ionicLoading, $cordovaNetwork, ConnectivityMonitor, $ionicPopover, MarcadoresActuales, SearchService, $timeout, $ionicPlatform, PromocionesActuales, Promociones, direction, uuidFactory) {

var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         $state.go("app.inicio");
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);

init("AIzaSyADmv84EoKoAKX6_HfV8YRR7Glt27mnADU");

  var markerCache = [];
  var apiKey = false;
  var map = null;
  //Array con marcadores creados y activos en el mapa
  var markersActivos = []; 
  

  
function initMap(){

  
    var options = {timeout: 10000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    
    // var latLng = new google.maps.LatLng(7.910537, -72.492747);
      var mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scaleControl: true,
        mapTypeControl: false
      };

      map = new google.maps.Map(document.getElementById("map"), mapOptions);

     
      myMarkerPosition();

     

       

        $scope.globalLatLng = latLng;

     
       // $scope.trazarRuta();
   

        // var onChangeHandler = function() {
        //   calculateAndDisplayRoute(
        //       directionsDisplay, directionsService, markersActivos, stepDisplay, map);
        // };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function RadioControl(controlDiv, map) {

  var control = this;
  controlDiv.style.clear = 'both';

  var radio5kmUI = document.createElement('div');
  radio5kmUI.id = 'radio5kmUI';
  radio5kmUI.title = 'Muestra establecimientos a 5 Km';
  controlDiv.appendChild(radio5kmUI);

  var radio5kmText = document.createElement('div');
  radio5kmText.id = 'radio5kmText';
  radio5kmText.innerHTML = '5 Kms';
  radio5kmUI.appendChild(radio5kmText);

  var radio10kmUI = document.createElement('div');
  radio10kmUI.id = 'radio10kmUI';
  radio10kmUI.title = 'Muestra establecimientos a 10 Km';
  controlDiv.appendChild(radio10kmUI);

  var radio10kmText = document.createElement('div');
  radio10kmText.id = 'radio10kmText';
  radio10kmText.innerHTML = '10 Kms';
  radio10kmUI.appendChild(radio10kmText);


    var radio15kmUI = document.createElement('div');
  radio15kmUI.id = 'radio15kmUI';
  radio15kmUI.title = 'Muestra establecimientos a 15 Km';
  controlDiv.appendChild(radio15kmUI);

  var radio15kmText = document.createElement('div');
  radio15kmText.id = 'radio15kmText';
  radio15kmText.innerHTML = '15 Kms';
  radio15kmUI.appendChild(radio15kmText);

  //Evento que muestra establecimientos en 5km alrededor
  radio5kmUI.addEventListener('click', function() {
     //14.299999;
    map.setZoom(14);
   
   for (var i = 0; i < markersActivos.length; i++) {
             markersActivos[i].setMap(null);
             //alert("map "+i);
              }
              markersActivos = [];
   loadMarkersByValor(5000);
  
  });

  //Evento que muestra establecimientos en 10km alrededor
  radio10kmUI.addEventListener('click', function() {
     map.setZoom(12);//13.29999
    
    for (var i = 0; i < markersActivos.length; i++) {
             markersActivos[i].setMap(null);
             //alert("map2 "+i);
              }
              markersActivos = [];
   loadMarkersByValor(10000);

  });

   //Evento que muestra establecimientos en 10km alrededor
  radio15kmUI.addEventListener('click', function() {
    map.setZoom(11); //12.29999
    
    for (var i = 0; i < markersActivos.length; i++) {
             markersActivos[i].setMap(null);
             //alert("map3 "+i);
              }
              markersActivos = [];
   loadMarkersByValor(15000);
   
   
  });
  }

  $scope.cargarMarcadoresPorEstado=function(estado){

    for (var i = 0; i < markersActivos.length; i++) {
             markersActivos[i].setMap(null);
             //alert("map "+i);
              }
    //1 2 3
    markersActivos = [];
    loadMarkersByEstado(estado)
  }
  var radioControlDiv = document.createElement('div');
  var centerControl = new RadioControl(radioControlDiv, map);

  radioControlDiv.index = 1;
  radioControlDiv.style['padding-top'] = '10px';
  if(!direction.val[0]){
  map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(radioControlDiv);
  }
 

////////////////////////////////////////////////////EVENTOS SOBRE EL MAPA////////////////////////////////////////////////////////
       google.maps.event.addListenerOnce(map, 'idle', function(){
       loadMarkers();
     
        //Reload markers every time the map moves
        google.maps.event.addListener(map, 'dragend', function(){
          console.log("moved!");
          //loadMarkers();
        });

        //Reload markers every time the zoom changes
        google.maps.event.addListener(map, 'zoom_changed', function(){
          console.log("zoomed!");
          //loadMarkers();
        });

        google.maps.event.addListener(map, 'center_changed', function(){
          console.log("bound changed!");
          //loadMarkers();
        });

        enableMap();

      });

}, function(error){
  console.log("Could not get location");
});    
//Funcion que se encarga de centrar el mapa en unos valores recibidos.
       $scope.centrarEn=function(lat, lng, marcador){
        
          map.setCenter({lat:lat, lng:lng});        

          for (var i = 0; i < markersActivosRespaldo.length; i++) {
             markersActivosRespaldo[i].setMap(null);
             //alert("map "+i);
              }

          marcador.setMap(map);
          marcador.setAnimation(google.maps.Animation.BOUNCE);
          
           $timeout(function() {
              marcador.setAnimation(null);
              
            }, 5000);
       }
}

// fin Funcion initMap 
  
    function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map, id_mark_destinity) {
                   // Retrieve the start and end locations and create a DirectionsRequest using
                  // WALKING directions.
                directionsService.route({
                    origin: $scope.globalLatLng,
                    destination: $scope.destinationMarker,
                    travelMode: google.maps.TravelMode.DRIVING
                  }, function(response, status) {
                    // Route the directions and pass the response to a function to create
                    // markers for each step.
                    if (status === google.maps.DirectionsStatus.OK) {
                         
                          directionsDisplay.setDirections(response);
                  
                    } else {
                      window.alert('Directions request failed due to ' + status);
                    }

                   
               });
                //Limpio los demas marcadores y solo dejo los de Inicio y Destino
                  for (var j = 0; j < markerArray.length; j++) {
                          if(markerArray[j].id != -1 && (markerArray[j].id != id_mark_destinity)){
                              markerArray[j].setMap(null);
                             }                 
                       }


  }

$scope.mapa={}
$scope.mapa.style="75%!important";

   $scope.trazarRuta=function(){
      var directionsService = new google.maps.DirectionsService;
       // Create a renderer for directions and bind it to the map.
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map, suppressMarkers: true});

        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;


          if(direction.val[0]){
         
          for (var i = 0; i < MarcadoresActuales.arrayM.length; i++) {
           
           if(MarcadoresActuales.arrayM[i].id == direction.val[1]){


                  var aux = new google.maps.LatLng(MarcadoresActuales.arrayM[i].latitud, MarcadoresActuales.arrayM[i].longitud)
                  $scope.destinationMarker = aux;
                   calculateAndDisplayRoute(directionsDisplay, directionsService, markersActivos, stepDisplay, map, direction.val[1]);
            }else{
                $scope.destinationMarker = 0;
                }
          }

          $scope.ocultaBarSearch=true;      
          $scope.mapa.style="85%!important";
        }else{
          directionsDisplay.setMap(null);
          $scope.ocultaBarSearch=false;
        }  

      }







  function enableMap(){
    $ionicLoading.hide();
  }

  

  function disableMap(){
    $ionicLoading.show({
      template: '<h5>Debes tener conexión a internet para ver los establecimientos en el mapa</h5><button class="button  button-stable button-small icon ion-arrow-return-left" ui-sref="inicio"> Atras</button>',
      hideOnStateChange: true
    });


  }

  function loadGoogleMaps(){

    $ionicLoading.show({
      template: 'Cargando Google Maps'
    });

    //This function will be called once the SDK has been loaded
    window.mapInit = function(){
      initMap();
    };  

    //Create a script element to insert into the page
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "googleMaps";

    //Note the callback function in the URL is the one we created above
    if(apiKey){
      script.src = 'http://maps.google.com/maps/api/js?key=' + apiKey + '&callback=mapInit';
    }
    else {
      script.src = 'http://maps.google.com/maps/api/js?sensor=true&callback=mapInit';
    }

    document.body.appendChild(script);


  }

  function checkLoaded(){
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      loadGoogleMaps();
    } else {
      enableMap();
    }       
  }



// ############################################CARGAR MI POSICIÓN########################################################
function myMarkerPosition(){
   var options = {timeout: 10000, enableHighAccuracy: true};
   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
           var pinImage={
                  url: "img/chartRed" +".png",
                  size: new google.maps.Size(21, 34),
                  origin: new google.maps.Point(0,0),
                  archor: new google.maps.Point(10, 34)
                }

              

          $scope.globalLatLng= latLng;
      
       var markerMe = addMarker(latLng, pinImage, -1);

        addInfoMyPosition(markerMe); 
     })
}


function addInfoMyPosition(markerMe){
  var infoWindowContent = "<div class='info-myMarker'>"+ 
              "<h4 style='text-align:center; color:orange; !important;'>Tú</h4> "+
              
             "</div>";          

              addInfoWindow(markerMe, infoWindowContent);
}



  // ####################################################################################################

  function loadMarkers(){


      var center = map.getCenter();
      var bounds = map.getBounds();
      var zoom = map.getZoom();
    
      //Convert objects returned by Google to be more readable
      var centerNorm = {
          lat: center.lat(),
          lng: center.lng()
      };
      //Carga inicial de promociones de todos los establecimientos
            var pr = Promociones.getPromo().then(function(pr){
            var p=pr.data;

               PromocionesActuales.arrayP.splice(0,PromocionesActuales.arrayP.length);

                for (var j = 0; j < p.length; j++) {
                            var pro = p[j];
                           
                            PromocionesActuales.arrayP.push(p[j]);
                            //console.log(pro);             
                      }
        })
     var markers = Markers.getMarkers().then(function(markers){
        //console.log("Markers: ", markers);
      var records = markers.data;
      MarcadoresActuales.arrayM.splice(0,MarcadoresActuales.arrayM.length);
        for (var i = 0; i < records.length; i++) {

              var record = records[i];
              //Inserto en la factory array los marcadores que llegan en la variable records
              MarcadoresActuales.arrayM.push(records[i]);

              console.log(record);

              record.latitud=parseFloat(record.latitud);
              record.longitud=parseFloat(record.longitud);

              // Check if the marker has already been added
                  if (!markerExists(record.latitud, record.longitud)) {
                          var myLatLng = {lat: record.latitud, lng: record.longitud};
                          var colorMark=changeColorMarker(record.status); 

                            $scope.promosOk=[];
                            for (var j = 0; j < PromocionesActuales.arrayP.length; j++) {                                

                                if(PromocionesActuales.arrayP[j].establecimiento.id==record.id && PromocionesActuales.arrayP[j].estado==1){
                                        
                                        //Si el id de establecimiento se encuentra dentro de las promociones,
                                        //Establezco el colorMark en 2 para que se coloree en verde
                                        //Siempre y cuando el establecimiento este abierto
                                        if(record.status==1){
                                          colorMark=changeColorMarker(2);
                                        }
                                        
                                        $scope.promosOk.push(PromocionesActuales.arrayP[j]);
                                        //console.log($scope.promosOk);
                                        //console.log(colorMark);
                                }
                              
                            };
                    var markerCreado= addMarker(myLatLng, colorMark, record.id);                                        
                    // Add the marker to the markerCache so we know not to add it again later
                    var markerData = {
                      lat: record.latitud,
                      lng: record.longitud,
                      marker: markerCreado
                    };
                            markerCache.push(markerData);

                            //Agrego ventana de info al marcador
                            addInfoMarker(markerCreado, record, $scope.promosOk);                        
                  }          
        }

        $scope.trazarRuta();
      });
         
}






//Array que cntiene los marcadores de respaldo. 
//Sirve para lograr ubicar en el mapa cuando se busque un establecimiento
var markersActivosRespaldo = [];  


//Muestra los marcadores ocultos
function showMarkers() {
  setMapOnAll(map);
}

//Llena el mapa con todos los marcadores del array
function setMapOnAll(map) {
  
  for (var i = 0; i < markersActivos.length; i++) {
    markersActivos[i].setMap(map);

  }
}

//Agrega un marcador al mapa
function addMarker(location, colorMarker, id) {

   var marker = new google.maps.Marker({
                  map: map,
                  animation: google.maps.Animation.DROP,
                  position: location,
                  icon: colorMarker
              });
   if (!markerExists(location.lat, location.lng)) {
       markersActivos.push(marker);
     markersActivosRespaldo.push(marker);
  //
}
  //Le asigno un id al obj marcador para reconocerlo de los demas
  marker.id=id;
  //console.log(marker);
  
   return marker;
}

//Elimina marcadores del mapa
function clearMarkers() {
  setMapOnAll(null);
}

//Oculta y elimina el array de marcadores del array markersActivos
function deleteMarkers() {
  clearMarkers();
  markersActivos = [];
}

//Agrega la ventana de informacion a cada marcador
function addInfoMarker(marcador, record, promos){
 /// console.log(promos);
var horarios=record.horarioCollection;  
var horarioListo="";
var promosListas="";

//console.log(horarios);
for (var i = 0; i < horarios.length; i++) {
if(horarios[i].dia==1){
  horarios[i].dia="Lunes";
}else if(horarios[i].dia==2){
  horarios[i].dia="Martes";
}
else if(horarios[i].dia==3){
  horarios[i].dia="Miercoles";
}
else if(horarios[i].dia==4){
  horarios[i].dia="Jueves";
}
else if(horarios[i].dia==5){
  horarios[i].dia="Viernes";
}
else if(horarios[i].dia==6){
  horarios[i].dia="Sábado";
}
else if(horarios[i].dia==7){
  horarios[i].dia="Domingo";
}

var z=horarios[i].horaInicio.substring(9,11);
var x=horarios[i].horaFin.substring(9,11);


horarios[i].horaInicio2=horarios[i].horaInicio.substring(0, 5)+" "+z;

horarios[i].horaFin2=horarios[i].horaFin.substring(0, 5)+" "+x;

  horarioListo+=""+horarios[i].dia+" "+horarios[i].horaInicio2+" - "+horarios[i].horaFin2+"<br>";
};

var textPromo="";
for (var k = 0; k < promos.length; k++) {
    promosListas+=promos[k].nombre+" ";
};
if(promos.length>0){
  textPromo="<label>Promoción: </label>";
}

var infoWindowContent = "<div class='info-marker'> <img src='"+record.imglogo+"' style='height:30%;width:40%;border-radius:50px;'>"+ 
              "<h4 style='float:right; color:black !important;'>" + record.nombre+ "</h4> <br>"+
              
              "<br> <label>Dirección: </label>"+record.direccion+
              "<br> <label>Horario: </label>"+
              "<br>"+horarioListo+
              
              "<br>"+ textPromo+
              promosListas+
               
               
               "<center> <br><a class='button button-balanced ' href='#/app/detalleMarcador/"+record.id+"'>Saber mas</a>"
               +"</center> </div>";          

              addInfoWindow(marcador, infoWindowContent);

}

////////////////////////////////Carga marcadores de acuerdo a Rangos 5KM, 10KM y 15KM//////////////////////
function loadMarkersByValor(valor){
           var center = map.getCenter();
           var centerNorm = {
                  lat: center.lat(),
                  lng: center.lng()
              };
                 myMarkerPosition();
           for (var i = 0; i < MarcadoresActuales.arrayM.length; i++) {

                var record = MarcadoresActuales.arrayM[i];
                //MarcadoresActuales.arrayM.push(records[i]);

                record.latitud=parseFloat(record.latitud);
                record.longitud=parseFloat(record.longitud);

                var LatLngMark = {lat: record.latitud, lng: record.longitud};

                console.log(record);
                console.log("la distancia es "+getDistanceBetweenPoints(centerNorm, LatLngMark, 'km')*1000);

                    if((getDistanceBetweenPoints(centerNorm, LatLngMark, 'km')*1000)<valor){
                        //alert("veces");
                              var pinImage=changeColorMarker(record.status);

                              var markerCreado= addMarker(LatLngMark, pinImage, record.id);
                            
                                $scope.promosOk=[];
                              for (var j = 0; j < PromocionesActuales.arrayP.length; j++) {
                                  

                                  if(PromocionesActuales.arrayP[j].establecimiento.id==record.id && PromocionesActuales.arrayP[j].estado==1){
                                          
                                          if(record.status==1){
                                            pinImage=changeColorMarker(2);
                                          }
                                          $scope.promosOk.push(PromocionesActuales.arrayP[j]);
                                          console.log($scope.promosOk);
                                  }
                                
                              };
                                  var markerCreado= addMarker(LatLngMark, pinImage, record.id);
                              //Agrego ventana de info al marcador
                              addInfoMarker(markerCreado, record, $scope.promosOk);  
                    }    
  }
}




////////////////////////////////Carga marcadores de acuerdo a Rangos 5KM, 10KM y 15KM//////////////////////
function loadMarkersByEstado(estado){
           var center = map.getCenter();
           var centerNorm = {
                  lat: center.lat(),
                  lng: center.lng()
              };
                 myMarkerPosition();
           for (var i = 0; i < MarcadoresActuales.arrayM.length; i++) {

                var record = MarcadoresActuales.arrayM[i];
                //MarcadoresActuales.arrayM.push(records[i]);

                record.latitud=parseFloat(record.latitud);
                record.longitud=parseFloat(record.longitud);

                var LatLngMark = {lat: record.latitud, lng: record.longitud};

                console.log(record);
                

                    if(record.status && estado==1){
                        //alert("veces");
                              
                              var tienePromo=false;
                                $scope.promosOk=[];
                              for (var j = 0; j < PromocionesActuales.arrayP.length; j++) {
                                  

                                  if(PromocionesActuales.arrayP[j].establecimiento.id==record.id && PromocionesActuales.arrayP[j].estado==1){
                                          
                                          tienePromo=true;
                                  }
                                
                              };
                               if(tienePromo){
                                continue
                               }else{
                                    //Agrego ventana de info al marcador
                                    var pinImage=changeColorMarker(record.status);
                                    var markerCreado= addMarker(LatLngMark, pinImage, record.id);
                                    addInfoMarker(markerCreado, record, $scope.promosOk); 
                               }  
                               
                    }

                    else if(!record.status && estado==0){
                        //alert("veces");
                              var pinImage=changeColorMarker(record.status);

                              var markerCreado= addMarker(LatLngMark, pinImage, record.id);
                            
                                $scope.promosOk=[];
                              for (var j = 0; j < PromocionesActuales.arrayP.length; j++) {
                                  

                                  if(PromocionesActuales.arrayP[j].establecimiento.id==record.id && PromocionesActuales.arrayP[j].estado==1){
                                          
                                          if(record.status==1){
                                            pinImage=changeColorMarker(2);
                                          }
                                          $scope.promosOk.push(PromocionesActuales.arrayP[j]);
                                          console.log($scope.promosOk);
                                  }
                                
                              };
                                  var markerCreado= addMarker(LatLngMark, pinImage, record.id);
                              //Agrego ventana de info al marcador
                              addInfoMarker(markerCreado, record, $scope.promosOk);  
                    } 
                    else if(estado == 2){
                               
                         
                             // if(promo.data[i].establecimiento.id == record.id){
                                       $scope.promosOk=[];
                                        for (var j = 0; j < PromocionesActuales.arrayP.length; j++) {
                                            

                                            if(PromocionesActuales.arrayP[j].establecimiento.id==record.id && PromocionesActuales.arrayP[j].estado==1){
                                                    
                                                    if(record.status==1){
                                                      pinImage=changeColorMarker(2);
                                                    }
                                                    $scope.promosOk.push(PromocionesActuales.arrayP[j]);
                                                    console.log($scope.promosOk);
                                                     
                                                    var markerCreado= addMarker(LatLngMark, pinImage, record.id);
                                                    var markerCreado= addMarker(LatLngMark, pinImage, record.id);
                                                    //Agrego ventana de info al marcador
                                                    addInfoMarker(markerCreado, record, $scope.promosOk); 
                                                    
                                            }
                                          
                                        };
                                     
                       
                     }
              }                                     
        
}


function changeColorMarker(estado){
  var pinColor;
    if(estado==0){
              pinColor = "Gray";
        }else if(estado==1){
                pinColor = "Blue";
            }

            else if(estado==2){
                pinColor = "Green";
            }

    /*var pinImage = new google.maps.MarkerImage("../img/chart" + pinColor+".png",
    new google.maps.Size(21, 34),
    new google.maps.Point(0,0),
    new google.maps.Point(10, 34));*/

var pinImage={
  url: "img/chart" + pinColor+".png",
  size: new google.maps.Size(21, 34),
  origin: new google.maps.Point(0,0),
  archor: new google.maps.Point(10, 34)
}

    return pinImage;
}
/////////////////////////////////////////////////////////////



  function markerExists(lat, lng){
      var exists = false;
     // var cache = markerCache;
     var cache = markersActivos;
      for(var i = 0; i < cache.length; i++){
        if(cache[i].lat === lat && cache[i].lng === lng){
          exists = true;
        }
      }
      
      return exists;
  }

  function getBoundingRadius(center, bounds){
    return getDistanceBetweenPoints(center, bounds.northeast, 'km');    
  }

  function getDistanceBetweenPoints(pos1, pos2, units){

    var earthRadius = {
        miles: 3958.8,
        km: 6371
    };
    
    var R = earthRadius[units || 'km'];
    var lat1 = pos1.lat;
    var lon1 = pos1.lng;
    var lat2 = pos2.lat;
    var lon2 = pos2.lng;
    
    var dLat = toRad((lat2 - lat1));
    var dLon = toRad((lon2 - lon1));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    
    return d;

  }

  function toRad(x){
      return x * Math.PI / 180;
  }



  $scope.prev_infowindow =false; 

  function addInfoWindow(marker, message) {



      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

     

       google.maps.event.addListener(marker, 'click', function(){
        if($scope.prev_infowindow) {
        
           $scope.prev_infowindow.close();
        }
      });

         

      google.maps.event.addListener(marker, 'click', function () {
        $scope.prev_infowindow = infoWindow;
          infoWindow.open(map, marker);
      });

      

      
  }

  function addConnectivityListeners(){

    if(ionic.Platform.isWebView()){

      // Check if the map is already loaded when the user comes online, if not, load it
      $scope.$on('$cordovaNetwork:online', function(event, networkState){
        checkLoaded();

      });

      // Disable the map when the user goes offline
      $scope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableMap();
      });
     
    }
    else {

      //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
        checkLoaded();

      }, false);    

      window.addEventListener("offline", function(e) {
        disableMap();

      }, false);  
    }

  }

  
    function init(key){

      if(typeof key != "undefined"){
        apiKey = key;
      }

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.warn("Google Maps SDK needs to be loaded");

        disableMap();

        if(ConnectivityMonitor.isOnline()){
          loadGoogleMaps();

        }
      }
      else {
        if(ConnectivityMonitor.isOnline()){
          initMap();
          enableMap();
        } else {
          disableMap();
        }
      }

      addConnectivityListeners();

    }
  

//Codigo que se encarga de filtrar la busqueda de los marcadores en el mapa



$scope.data = { "establecimientos" : [], "search" : '' };

    $scope.search = function() {
      

      SearchService.searchSitios($scope.data.search).then(
        function(matches) {

          $scope.data.establecimientos = matches;
         
        }
      )
    }

    //funcion que se encarga de centrar la vista del mapa en el marcador que esta siendo buscado
      $scope.ubicarSitio=function(index){
        

        console.log("Sitio encontrado: "+index.nombre);

        index.latitud=parseFloat(index.latitud);
        index.longitud=parseFloat(index.longitud);

        for (var i = 0; i < markersActivosRespaldo.length; i++) {
          if(markersActivosRespaldo[i].id==index.id){
            var marcadorBuscado=markersActivosRespaldo[i];
            console.log(marcadorBuscado);
          }
        };
        $scope.centrarEn(index.latitud, index.longitud, marcadorBuscado);

        $scope.limpiar();
      }


      $scope.limpiar=function(){
        var tam=$scope.data.establecimientos.length;
        $scope.data.establecimientos.splice(0,tam);

        $scope.data.search="";
      }





})


.controller('DetalleMarcadorCtrl', function($scope, $state, $stateParams, MarcadoresActuales, $ionicModal, $ionicPlatform, PromocionesActuales, direction, puntuaciones, $cordovaDevice, loadingService, $http, $ionicPopup) {


var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);


$scope.idMarcador= $stateParams.markId;
console.log($scope.idMarcador);


for (var i = 0; i < MarcadoresActuales.arrayM.length; i++) {

      if(MarcadoresActuales.arrayM[i].id==$scope.idMarcador){

            $scope.marcadorSeleccionado=MarcadoresActuales.arrayM[i];
            console.log($scope.marcadorSeleccionado);

            $scope.especialidad = $scope.marcadorSeleccionado.tipocomidaCollection;
      }
  
};

$scope.isFb=false;
$scope.isTw=false;
$scope.isWWW=false;

if($scope.marcadorSeleccionado.facebook==""){
  $scope.isFb=true;
}

if($scope.marcadorSeleccionado.twitter==""){
  $scope.isTw=true;
}

if($scope.marcadorSeleccionado.web==""){
  $scope.isWWW=true;
}

$scope.horario=$scope.marcadorSeleccionado.horarioCollection;
$scope.menuInfo=$scope.marcadorSeleccionado.menuCollection;
var horarioListo="";

console.log($scope.menuInfo);
console.log($scope.horario);
for (var j = 0; j < $scope.horario.length; j++) {


           if($scope.horario[j].dia=="Lunes" || $scope.horario[j].dia==1){
               $scope.horario[j].diaListo="Lunes";

              }else if($scope.horario[j].dia=="Martes" || $scope.horario[j].dia==2){
               $scope.horario[j].diaListo="Martes";
              }
              else if($scope.horario[j].dia=="Miercoles" || $scope.horario[j].dia==3){
               $scope.horario[j].diaListo="Miercoles";
              }
              else if($scope.horario[j].dia=="jueves" || $scope.horario[j].dia==4){
               $scope.horario[j].diaListo="Jueves";
              }
              else if($scope.horario[j].dia=="Viernes" || $scope.horario[j].dia==5){
               $scope.horario[j].diaListo="Viernes";
              }
              else if($scope.horario[j].dia=="Sábado" || $scope.horario[j].dia==6){
               $scope.horario[j].diaListo="Sábado";
              }
              else if($scope.horario[j].dia=="Domingo" || $scope.horario[j].dia==7){
               $scope.horario[j].diaListo="Domingo";
              }
              var z=$scope.horario[j].horaInicio.substring(9,11);
              var x=$scope.horario[j].horaFin.substring(9,11);


              $scope.horario[j].horaInicio2=$scope.horario[j].horaInicio.substring(0, 5)+" "+z;

              $scope.horario[j].horaFin2=$scope.horario[j].horaFin.substring(0, 5)+" "+x;

              horarioListo+=""+$scope.horario[j].dia+" "+$scope.horario[j].horaInicio2+" - "+$scope.horario[j].horaFin2+"<br>";
             
    };
 
console.log($scope.horario);
if($scope.marcadorSeleccionado.status==0){
$scope.colorStatus="dark"

    }else if($scope.marcadorSeleccionado.status==1){
    $scope.colorStatus="calm"

          }

  for (var k = 0; k < PromocionesActuales.arrayP.length; k++) {
                    
                    if(PromocionesActuales.arrayP[k].establecimiento.id==$scope.marcadorSeleccionado.id && PromocionesActuales.arrayP[k].estado==1){

                      if($scope.marcadorSeleccionado.status==1){
                         $scope.colorStatus="balanced"
                      }
                    }


                  };




 $scope.GotoLink = function (url) {
    window.open(url,'_system', 'location=yes');
  }

direction.val[0] = false;
$scope.navegarARuta=function(){
     direction.val[0] = true;
     direction.val[1] = $scope.idMarcador;
     $state.go('app.ubicame');
}  

// ######################################## Puntuaciones Establecimientos ##################################################

//Funcion que clona el objeto 
function clone( obj ) {
    if ( obj === null || typeof obj  !== 'object' ) {
        return obj;
    }
 
    var temp = obj.constructor();
    for ( var key in obj ) {
        temp[ key ] = clone( obj[ key ] );
    }
    
    return temp;
}


$scope.puntuacionesE = clone(puntuaciones.val);
var cont = 0;
var sum = 0;
console.log($scope.puntuacionesE.length);
for (var i = 0; i < $scope.puntuacionesE.length; i++) {
  
  if($scope.puntuacionesE[i].idEstablecimiento == $scope.idMarcador){
    cont ++;
      sum += $scope.puntuacionesE[i].stars;    
  }
};
var puntaje = sum/cont;
console.log(puntaje);

   $scope.rating = { name: 'Calificación de usuarios', number: puntaje }; 
  // $scope.rating = { name: 'Calificación de usuarios', number: '4.5' };
 
  $scope.getStars = function(rating) {
    // Get the value
    var val = parseFloat(rating);
    // Turn value into number/100
    var size = val/5*100;
    return size + '%';
  }

$scope.isVisible=true;

 var uuid = $cordovaDevice.getUUID();
 localStorage.setItem("uuid", uuid);
 console.log( localStorage.getItem("uuid"));
//alert(uuid);

// ###################### HABILITAR CALIFICACIÓN ###########################
for (var i = 0; i < $scope.puntuacionesE.length; i++) {
  
  if( $scope.puntuacionesE[i].uuid == uuid && $scope.puntuacionesE[i].idEstablecimiento == $scope.idMarcador){
    $scope.isVisible=false;

  }
};

// Codigo para dar una calificacion //////////////////////////////////////////

$scope.calificarAhora=function(){

  
var urlBase="http://sandbox1.ufps.edu.co:8080/ufps_13-Food_trucks_final/";
 //var urlBase="http://localhost:8080/Food_trucks_final/";
  loadingService.show();
   
  $.ajax({
      url: urlBase+'servletStars',
      type:'post',
      datatype:'json',
      data:{puntaje:$scope.valCalificado,uuid:uuid,id_establecimiento:$scope.idMarcador},
      success:function(resultado){
        loadingService.hide();
        console.log(resultado);
          if(resultado==1){
              var alertPopup = $ionicPopup.alert({
                     title: 'Exito',
                     template: 'Su calificación fue guardada correctamente'
               });
         $scope.isVisible=false;
              
          }else{
           var alertPopup = $ionicPopup.alert({
                     title: 'Error',
                     template: 'Ya calificaste este establecimiento'
               });
          }
              
      }
   });

}
$scope.ratingsObject = {
        iconOn : 'ion-android-star',
        iconOff : 'ion-android-star-outline',
        iconOnColor: 'rgb(238, 221, 7)',
        iconOffColor:  'rgb(190, 190, 190)',
        rating:  5,
        minRating:0,
        callback: function(rating) {
          $scope.ratingsCallback(rating);
        }
      };

      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
        $scope.valCalificado = rating;
      };


})


.controller('MenuMarcadorCtrl', function($scope, $state, $stateParams, MarcadoresActuales, $ionicPlatform) {

var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);


$scope.idMarcador= $stateParams.markId;
console.log($scope.idMarcador);


for (var i = 0; i < MarcadoresActuales.arrayM.length; i++) {

      if(MarcadoresActuales.arrayM[i].id==$scope.idMarcador){

            $scope.marcadorSeleccionado=MarcadoresActuales.arrayM[i];
            console.log($scope.marcadorSeleccionado);
      }
  
};


$scope.menuInfo=$scope.marcadorSeleccionado.menuCollection;

//$scope.menuPlatos=$scope.marcadorSeleccionado.menuCollection.platoCollection;

//console.log($scope.menuPlatos);
console.log($scope.menuInfo);

// $scope.isEntrade=false;
// $scope.isPrincipal=false;
// $scope.isPostre=false;
// $scope.isBebida=false;

// for (var j = 0; j < $scope.menuInfo.length; j++) {
  
//       for (var k = 0; k <  $scope.menuInfo[j].platoCollection.length; k++) {
//               if($scope.menuInfo[j].platoCollection[k].tipo == 1){
//                 $scope.isEntrade=true;
//               }

//               if($scope.menuInfo[j].platoCollection[k].tipo == 2){
//                 $scope.isPrincipal=true;
//               }

//               if($scope.menuInfo[j].platoCollection[k].tipo == 3){
//                 $scope.isPostre=true;
//               }

//               if($scope.menuInfo[j].platoCollection[k].tipo == 4){
//                 $scope.isBebida=true;
//               }


//       };
 
// };




})


.controller('ListaCtrl', function($scope, $state, MarcadoresActuales, Markers, SearchService, $ionicPlatform, $ionicLoading, $cordovaNetwork, ConnectivityMonitor, Promociones, PromocionesActuales, TiposComida, TiposComidasActuales) {



var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
          $state.go("app.inicio");
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);



//Funcion que clona el objeto 
function clone( obj ) {
    if ( obj === null || typeof obj  !== 'object' ) {
        return obj;
    }
 
    var temp = obj.constructor();
    for ( var key in obj ) {
        temp[ key ] = clone( obj[ key ] );
    }
    
    return temp;
}





//Funcion que revisa si hay internet y da el inicio ala carga de los marcadores
$scope.starter=function(){

   if(ConnectivityMonitor.isOnline()){   
          $scope.iniciar();       
          enableVista();
         
        } else {
          disableVista();
        
        }
addConnectivityListeners();
}




$scope.iniciar=function(){

  //Obtengo marcadores de la base de datos
var markers = Markers.getMarkers().then(function(markers){
       var records = markers.data;

 MarcadoresActuales.arrayM.splice(0,MarcadoresActuales.arrayM.length);
  
              for (var i = 0; i < records.length; i++) {
                  var record = records[i];
                  //Inserto en la factory array los marcadores que llegan en la variable records
                  MarcadoresActuales.arrayM.push(records[i]);
                  //console.log(record);             
            }
            $scope.clonarMarcadores();
            $scope.cargarCategorias();

        
      });

var pr = Promociones.getPromo().then(function(pr){
            var p=pr.data;

     PromocionesActuales.arrayP.splice(0,PromocionesActuales.arrayP.length);

      for (var j = 0; j < p.length; j++) {
                  var pro = p[j];
                 
                  PromocionesActuales.arrayP.push(p[j]);
                  console.log(pro);             
            }
           

})


}

$scope.starter(); // RUN!!!


$scope.cargarCategorias=function(){
  var tcs = TiposComida.getTipos().then(function(tpos){
            var tiposC=tpos.data;

     TiposComidasActuales.arrayT.splice(0,TiposComidasActuales.arrayT.length);

      for (var k = 0; k < tiposC.length; k++) {
                  var tipCom = tiposC[k];
                 
                  TiposComidasActuales.arrayT.push(tiposC[k]);
                  console.log(tipCom);             
            }
           
           $scope.clonarTiposComida();

})

}

$scope.clonarTiposComida=function(){  

  $scope.arrayTP=[];
  $scope.arrayTP=clone(TiposComidasActuales.arrayT);
    $scope.groups = [];

   for (var i=0; i<$scope.arrayTP.length; i++) {
    $scope.groups[i] = {
      name: $scope.arrayTP[i].nombre,
      items: []
    };

    for (var j=0; j<MarcadoresActuales.arrayM.length; j++) {

      for (var k = 0; k < MarcadoresActuales.arrayM[j].tipocomidaCollection.length; k++) {
        
         if(MarcadoresActuales.arrayM[j].tipocomidaCollection[k].id==$scope.arrayTP[i].id){
                 $scope.groups[i].items.push(MarcadoresActuales.arrayM[j]);

                 
          }
      
      }

    }

  }
 console.log($scope.groups);
 
}


 $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };



$scope.clonarMarcadores=function(){

$scope.items=[];
  $scope.items=clone(MarcadoresActuales.arrayM);


      for(var i = 0; i < $scope.items.length; i++) {

        var horarios=$scope.items[i].horarioCollection;

        var horarioListo="";
              //console.log(horarios);

            for (var j = 0; j < horarios.length; j++) {

              if(horarios[j].dia==1){
                horarios[j].dia="Lunes";
              }else if(horarios[j].dia==2){
                horarios[j].dia="Martes";
              }
              else if(horarios[j].dia==3){
                horarios[j].dia="Miercoles";
              }
              else if(horarios[j].dia==4){
                horarios[j].dia="Jueves";
              }
              else if(horarios[j].dia==5){
                horarios[j].dia="Viernes";
              }
              else if(horarios[j].dia==6){
                horarios[j].dia="Sabado";
              }
              else if(horarios[j].dia==7){
                horarios[j].dia="Domingo";
              }

                        var z=horarios[j].horaInicio.substring(9,11);
                        var x=horarios[j].horaFin.substring(9,11);


                        horarios[j].horaInicio2=horarios[j].horaInicio.substring(0, 5)+" "+z;

                        horarios[j].horaFin2=horarios[j].horaFin.substring(0, 5)+" "+x;

                horarioListo="Día: "+horarios[j].dia+" Abre: "+horarios[j].horaInicio2+" - Cierra: "+horarios[j].horaFin2;
                $scope.items[i].horarioCollection[j]=horarioListo;
              };
            


            if($scope.items[i].status==0){
              $scope.items[i].colorStatus="dark"

                  }else if($scope.items[i].status==1){
                  $scope.items[i].colorStatus="calm"

                        }

                  for (var k = 0; k < PromocionesActuales.arrayP.length; k++) {
                    
                    if(PromocionesActuales.arrayP[k].establecimiento.id==$scope.items[i].id && PromocionesActuales.arrayP[k].estado==1){

                      if($scope.items[i].status==1){
                        $scope.items[i].colorStatus="balanced";
                      }
                    }


                  };

                         
      };
          
    

}


//Codigo que se encarga de filtrar la busqueda de los marcadores en el mapa
$scope.data = { "establecimientos" : [], "search" : '' };

    $scope.search = function() {

      SearchService.searchSitios($scope.data.search).then(
        function(matches) {
          $scope.data.establecimientos = matches;
         
        }
      )
    }

$scope.limpiar=function(){
        var tam=$scope.data.establecimientos.length;
        $scope.data.establecimientos.splice(0,tam);

        $scope.data.search="";
      }


//Controlar el filtro

$scope.filter = new Object();
$scope.filter.c="nombre";
$scope.valorFiltrado=false;

    $scope.$watch('filter.c', function() {

      if($scope.filter.c=="nombre"){
        $scope.valorFiltrado=false;
      }else if($scope.filter.c=="tipoComida"){
        $scope.valorFiltrado=true;
      }
       
       console.log($scope.valorFiltrado);
    });





function enableVista(){
 
  //  $ionicLoading.hide();
  }


 function disableVista(){
    $ionicLoading.show({
      template: '<h5>Debes tener conexión a internet para ver los establecimientos</h5><button class="button  button-stable button-small icon ion-arrow-return-left" ui-sref="inicio"> Atras</button>',
      hideOnStateChange: true
    });


  }


   function addConnectivityListeners(){

    if(ionic.Platform.isWebView()){

      // Check if the map is already loaded when the user comes online, if not, load it
      $scope.$on('$cordovaNetwork:online', function(event, networkState){
        $scope.iniciar();


      });

      // Disable the map when the user goes offline
      $scope.$on('$cordovaNetwork:offline', function(event, networkState){
        disableVista();
      });
     
    }
    else {

      //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
        $scope.iniciar();

      }, false);    

      window.addEventListener("offline", function(e) {
        disableVista();

      }, false);  
    }

  }

})

.controller('PromocionMarcadorCtrl', function($scope, $state, $stateParams, MarcadoresActuales, $ionicPlatform, PromocionesActuales) {

var deregisterFirst = $ionicPlatform.registerBackButtonAction(
      function() {
         navigator.app.backHistory();
      }, 100
    );
    $scope.$on('$destroy', deregisterFirst);


$scope.idMarcador= $stateParams.markId;
console.log($scope.idMarcador);


for (var i = 0; i < MarcadoresActuales.arrayM.length; i++) {

      if(MarcadoresActuales.arrayM[i].id==$scope.idMarcador){

            $scope.marcadorSeleccionado=MarcadoresActuales.arrayM[i];
            console.log($scope.marcadorSeleccionado);
      }
  
};

$scope.idEstablecimiento=$scope.marcadorSeleccionado.id;
$scope.promocionesSeleccionadas=[];
console.log(PromocionesActuales.arrayP);

for (var j = 0; j < PromocionesActuales.arrayP.length; j++) {
    console.log("llego");

    if(PromocionesActuales.arrayP[j].establecimiento.id==$scope.idEstablecimiento && PromocionesActuales.arrayP[j].estado==1){
            console.log(PromocionesActuales.arrayP[j]);
            var diasArray=PromocionesActuales.arrayP[j].dias.split(":");
            var diasListos="";
            console.log(diasArray);

            for (var w = 0; w < diasArray.length; w++) {
              if(diasArray[w]=="1"){
               
               diasListos+="Lunes "
              
              }else if(diasArray[w]=="2"){
               diasListos+="Martes "
              }
              else if(diasArray[w]=="3"){
               diasListos+="Miercoles "
              }
              else if(diasArray[w]=="4"){
               diasListos+="Jueves "
              }
              else if(diasArray[w]=="5"){
               diasListos+="Viernes "
              }
              else if(diasArray[w]=="6"){
               diasListos+="Sábado "
              }
              else if(diasArray[w]=="7"){
               diasListos+="Domingo "
              }

            };

                        var z=PromocionesActuales.arrayP[j].horaIni.substring(9,11);
                        var x=PromocionesActuales.arrayP[j].horaFin.substring(9,11);


                        PromocionesActuales.arrayP[j].horaIni2=PromocionesActuales.arrayP[j].horaIni.substring(0, 5)+" "+z;

                        PromocionesActuales.arrayP[j].horaFin2=PromocionesActuales.arrayP[j].horaFin.substring(0, 5)+" "+x;

                


             PromocionesActuales.arrayP[j].dias=diasListos;

            console.log(PromocionesActuales.arrayP[j].platoCollection);
            $scope.promocionesSeleccionadas.push(PromocionesActuales.arrayP[j]);
            console.log($scope.promocionesSeleccionadas);
    }
  
};

})

.controller('mi_foodtruckCtrl', function($scope, $state, $stateParams, MarcadoresActuales, $ionicPlatform, PromocionesActuales) {


  })

.controller('acercadeCtrl', function($scope, $state, $stateParams, MarcadoresActuales, $ionicPlatform, PromocionesActuales) {


  })