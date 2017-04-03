// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    //GoogleMaps.init();
  })
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle("center");
  $stateProvider

  .state('app.inicio', {
    url: '/inicio',
    views:{
       'menuContent':{
         templateUrl: 'templates/inicio.html',
         controller: 'InicioCtrl'
       }
    }
   
  })


.state('app', {
                  url: '/app',
                  abstract: true,
                  templateUrl: 'templates/tabs.html',
                  controller: 'TabsCtrl'
                })

             

  .state('app.ubicame', {
    url: '/ubicame',
    cache: false,
        views: {
        'menuContent':{
               templateUrl: 'templates/ubicame.html',
               controller: 'UbicameCtrl'
        }  
      } 
  })


.state('app.lista', {
    url: '/lista',
    views: {
      'menuContent':{
          templateUrl: 'templates/lista.html',
          controller: 'ListaCtrl'
      }
    }
  
  })


   .state('app.detalleMarcador', {

    url: '/detalleMarcador/:markId',
    views: {
        'menuContent':{
           templateUrl: 'templates/detalleMarcador.html',
            controller: 'DetalleMarcadorCtrl'
        }
    }
   
  })


.state('app.modalMenu', {
    url: '/modalMenu/:markId',
    views: {
        'menuContent':{
             templateUrl: 'templates/modalMenu.html',
             controller: 'MenuMarcadorCtrl'
        }
    }
   
  })

.state('app.modalPromocion', {
    url: '/modalPromocion/:markId',
    views: {
       'menuContent': {
          templateUrl: 'templates/modalPromocion.html',
          controller: 'PromocionMarcadorCtrl'
       }
    }
    
  })



  


  $urlRouterProvider.otherwise("/app/inicio");

})


.factory('Markers', function($http, loadingService, $ionicPopup) {

  var markers = [];

//var urlBase="http://sandbox1.ufps.edu.co:8080/ufps_13-Food_trucks_final/";
 var urlBase="http://localhost:8080/Food_trucks_final/";


//http://sandbox1.ufps.edu.co:8080/ufps_13-Food_trucks_final/
  return {
    getMarkers: function(){
        loadingService.show();
      return $http.get(urlBase+"servletEstablecimiento").success(function(response){
       loadingService.hide();
          console.log(response);
          markers = response;
          return markers;
      }).error(function(err){
      loadingService.hide();
        console.log(err);
        // An alert dialog
        
           var alertPopup = $ionicPopup.alert({
             title: 'Aviso',
             template: 'No se encontraron establecimientos',
             okText: 'Entendido',
             okType: 'button-stable'
           });

      })

    }
  }

})


.factory('Promociones', function($http, loadingService, $ionicPopup) {

//var urlBase="http://sandbox1.ufps.edu.co:8080/ufps_13-Food_trucks_final/";
 var urlBase="http://localhost:8080/Food_trucks_final/";
  var pro = [];

  return {
    getPromo: function(){
        loadingService.show();
      return $http.get(urlBase+"servletPromocion").success(function(response){
        loadingService.hide();
          console.log(response);
         
          pro = response;
          return pro;
      }).error(function(err){
      loadingService.hide();
        console.log(err);
      

      })

    }
  }

})



.factory('TiposComida', function($http, loadingService, $ionicPopup) {

  var tc = [];

//var urlBase="http://sandbox1.ufps.edu.co:8080/ufps_13-Food_trucks_final/";
 var urlBase="http://localhost:8080/Food_trucks_final/";
  return {
    getTipos: function(){
        loadingService.show();
      return $http.get(urlBase+"servletTipoComida").success(function(response){
        loadingService.hide();
          console.log(response);
         
          tc = response;
          return tc;
      }).error(function(err){
      loadingService.hide();
        console.log(err);
      

      })

    }
  }

})

//////////////////////////////////////////////////////////////////////////////////////////////////////



.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){

  return {
    isOnline: function(){

      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }

    },
    ifOffline: function(){

      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }

    }
  }
})

.factory('MarcadoresActuales', function() {
return{
   arrayM:[]

  };
})

.factory('PromocionesActuales', function() {
return{
   arrayP:[]

  };
})

.factory('TiposComidasActuales', function() {
return{
   arrayT:[]

  };
})


.factory('direction', function() {
return{
   
      val:[]
  };
})


.factory('SearchService', function($q, $timeout, Markers, MarcadoresActuales) {
var sitios = [];

sitios=MarcadoresActuales.arrayM;

sitios = sitios.sort(function(a, b) {

  var sitioA = a.nombre.toLowerCase();
  var sitioB = b.nombre.toLowerCase();

  if(sitioA > sitioB) return 1;
  if(sitioA < sitioB) return -1;
  return 0;
});
console.log(sitios);
    var searchSitios = function(searchFilter) {
         
        console.log('Searching airlines for ' + searchFilter);

        var deferred = $q.defer();

        console.log("air "+sitios)

        var matches = sitios.filter( function(sitio) {
            if(sitio.nombre.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1 ) return true;
        })

        $timeout( function(){
        
           deferred.resolve( matches );

        }, 100);

        return deferred.promise;

    };

    return {

        searchSitios : searchSitios

    }
})


 .service('loadingService', function($ionicLoading){
        this.show= function() {
          
                 $ionicLoading.show({
                     //templateUrl: '../templates/toast.html'
                     template: '<ion-spinner icon="bubbles" class="spinner"></ion-spinner>'
                }).then(function(){

                        //console.log("The loading indicator is now displayed");
                });
        }

        this.hide= function(){
                $ionicLoading.hide().then(function(){
                    console.log("The loading indicator is now hidden");
                });
        }

     })




