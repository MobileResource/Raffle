angular.module('starter')
 
.service('AuthService', function($q, $rootScope, $http, $state, USER_CREDENTIAL, BACKEND_URL, $ionicLoading, $ionicPopup) {
  var username;
  var user_id = -1;
  var fullname = '';
  var email = '';
 
  function loadUserCredentials() {
    username = window.localStorage.getItem(USER_CREDENTIAL.user_key);
    var password = window.localStorage.getItem(USER_CREDENTIAL.pass_key);
    if (username) {
      login(username, password);
    }
  }
 
  function storeUserCredentials(username, password) {
    window.localStorage.setItem(USER_CREDENTIAL.user_key, username);
    window.localStorage.setItem(USER_CREDENTIAL.pass_key, password);
  }
 
  function destroyUserCredentials() {
    $rootScope.user_id = -1;
    window.localStorage.removeItem(USER_CREDENTIAL.user_key);
    window.localStorage.removeItem(USER_CREDENTIAL.pass_key);
  }
 
  var login = function(name, pw) {
         show_spinner();
         $http({
               url: BACKEND_URL.baseURL+BACKEND_URL.loginURL,
               method: "POST",
               headers: {"Content-Type": "application/x-www-form-urlencoded"},
               data: $.param({username:name, password:pw})
               }).success(function(data, status, headers, config) {
                          hide_spinner();
                          var responseData = JSON.parse(JSON.stringify(data));
                          if(responseData.isValid == "invalid")
                          {
                            //alert("Username and password are not valid. Please try again.");
                            $ionicPopup.alert({
                                title: 'Failure',
                                template: 'Username and password are not valid. Please try again.'
                            });
                          }
                          else{
                            console.log(responseData);
                            var userData = responseData.user;
                            console.log(userData);

                            $ionicPopup.alert({
                                title: 'Welcome',
                                template: 'Thanks for using our Raffle application.'
                            });

                            $rootScope.user_id = userData.id;
                            $rootScope.username = userData.username;
                            storeUserCredentials(name, pw);
                            $state.go("sidemenu.category");
                          }
               }).error(function(data, status, headers, config) {
                        hide_spinner();
                        $ionicPopup.alert({
                          title: 'Error',
                          template: data
                });                      
          });
  };
       
var signup = function(username, email, phonenumber, pw) {
        show_spinner();
        console.log(BACKEND_URL.baseURL+BACKEND_URL.signupURL);
        console.log(username + ", " + pw + ", " + email + ", " + phonenumber);
         
        $http({
              url: BACKEND_URL.baseURL+BACKEND_URL.signupURL,
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              data: $.param({username : username,
                            email : email,
                            phonenumber : phonenumber,
                            password : pw
                          })
              }).success(function(data, status, headers, config) {
                    hide_spinner();
                    var responseData = JSON.parse(JSON.stringify(data));
                          if(responseData.msg == "fail")
                          {
                            $ionicPopup.alert({
                                title: 'Failure',
                                template: 'Unfortunately, your information was not registered. Please try again.'
                            });
                          }
                          else{
                            console.log(responseData);
                            // $ionicPopup.alert({
                            //     title: 'Success',
                            //     template: 'You are successfully registered. Thank you.'
                            // });
                            $rootScope.user_id = responseData.id;
                            $state.go("sidemenu.category");
                          }
               }).error(function(data, status, headers, config) {
                    hide_spinner();
                    $ionicPopup.alert({
                      title: 'Error',
                      template: data
                    });
        });
    };

    var logout = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Logout',
        template: 'Are you sure you want to logout?'
      });
      confirmPopup.then(function(res) {
        if(res) {
          destroyUserCredentials();
          $state.go("login");
        } else {
          console.log('You are not sure');
        }
      });
    };

    var show_spinner = function() {
      //$("#spinnerdiv").css("visibility","visible");
      $ionicLoading.show({
        template : "<ion-spinner></ion-spinner>"
      });
    };

    var hide_spinner = function() {
      //$("#spinnerdiv").css("visibility","hidden");
      $ionicLoading.hide();
    };

  return {
    login: login,
    signup: signup,
    logout: logout,
    show_spinner : show_spinner,
    hide_spinner : hide_spinner,
    username: function() {return username;},
    email: function() {return email;},
    fullname: function() {return fullname;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

.service('DataService', function($q, $rootScope, $http, $state, BACKEND_URL, AuthService) {
         
    var getSubListData = function(callback){
        AuthService.show_spinner();
        user_id = $rootScope.user_id;
        $http({
              url: BACKEND_URL.baseURL+BACKEND_URL.subListURL,
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              data: $.param({user_id : user_id})
        }).
        success(function(data, status, headers, config) {
              AuthService.hide_spinner();
              if(data == "fail") {
                callback("null");
                return;
              }
              callback(JSON.parse(JSON.stringify(data)));
        }).
        error(function(data, status, headers, config) {
              AuthService.hide_spinner();
              $ionicPopup.alert({
                title: 'Error',
                template: data
              });
        });
    };
         
    var getCategory = function(callback){
         AuthService.show_spinner();
         user_id = $rootScope.user_id;
         $http({
               url: BACKEND_URL.baseURL+BACKEND_URL.categoryURL,
               method: "POST",
               headers: {"Content-Type": "application/x-www-form-urlencoded"},
               data: $.param({user_id : user_id})
         }).
         success(function(data, status, headers, config) {
                 AuthService.hide_spinner();
                 if(data == "fail") {
                    callback("null");
                    return;
                 }
                 callback(JSON.parse(JSON.stringify(data)));
         }).
         error(function(data, status, headers, config) {
               AuthService.hide_spinner();
               $ionicPopup.alert({
                    title: 'Error',
                    template: data
               });
         });
    };
    
    var removeItem = function(item_id, callback) {
         AuthService.show_spinner();
         $http({
               url: BACKEND_URL.baseURL+BACKEND_URL.deleteItemURL,
               method: "POST",
               headers: {"Content-Type": "application/x-www-form-urlencoded"},
               data: $.param({item_id : item_id})
         }).
         success(function(data, status, headers, config) {
                AuthService.hide_spinner();
                callback(data);
         }).
         error(function(data, status, headers, config) {
               AuthService.hide_spinner();
               $ionicPopup.alert({
                    title: 'Error',
                    template: data
                });
         });
    };
         
         return {
            getSubListData : getSubListData,
            removeItem : removeItem,
            getCategory : getCategory
         };
})

.service('UploadService', function($q, $http, $state, $rootScope, USER_CREDENTIAL, BACKEND_URL, AuthService, $ionicPopup) {
    var uploadImage = function(userid, categoryname, todaydate, itemname, itemdescription, itemkeyword, raffleduration, numberofslots, priceperslot, imgURI) {
        AuthService.show_spinner();
        var ft = new FileTransfer();
        var server_url = BACKEND_URL.baseURL + BACKEND_URL.uploadURL;

        ft.onprogress = function(progressEvent) {
        };

        var options = new FileUploadOptions();
     
        options.fileKey="file";
        options.fileName="photo.jpg";
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;
        options.httpMethod = "POST";
        options.ContentLength = '1';
     
        var params = {};
        params.userid = 1;
        params.categoryname = categoryname;
        params.todaydate = todaydate;
        params.itemname = itemname;
        params.itemdescription = itemdescription;
        params.itemkeyword = itemkeyword;
        params.raffleduration = raffleduration;
        params.numberofslots = numberofslots;
        params.priceperslot = priceperslot;

        options.params = params;
        console.log(imgURI);
        ft.upload(imgURI, encodeURI(server_url),
              function(result) {
                  AuthService.hide_spinner();
                  $rootScope.itemname = itemname;
                  $rootScope.priceperslot = priceperslot;
                  $state.go('sidemenu.itempreview');
        console.log("Result: " + JSON.stringify(result))
              },
              function(error) {
                  AuthService.hide_spinner();
                  $ionicPopup.alert({
                    title: 'Error',
                    template: 'Error uploading file ' + imgURI + ': ' + error.code
                  });
                  console.log('Error uploading file ' + imgURI + ': ' + error.code);
              },
              options);
     };
     
    var uploadBase64 = function(user, imageData, uploadDate, category, description, amount, callback) {
     AuthService.show_spinner();
     $http({
           url: BACKEND_URL.baseURL+BACKEND_URL.upload64URL,
           method: "POST",
           headers: {"Content-Type": "application/x-www-form-urlencoded"},
           data: $.param({
                         user_id : user,
                         date : uploadDate,
                         description : description,
                         amount : amount,
                         category : category,
                         imageData : imageData
                         })
           }).
     success(function(data, status, headers, config) {
             AuthService.hide_spinner();
             callback(data);
             }).
     error(function(data, status, headers, config) {
           AuthService.hide_spinner();
           $ionicPopup.alert({
                             title: 'Error',
                             template: data
                             });
           });
    };
    return {
      uploadImage : uploadImage,
      uploadBase64 : uploadBase64
    };
});