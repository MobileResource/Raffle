angular.module('starter')

.controller('LoginCtrl', function($scope, AuthService, $state, $ionicPopup, ngFB, $rootScope) {
        $scope.user = {
          username: "lijin",
          password: "sheqjrh1991"
        };
        var vm=this;
        
        $scope.onLogin = function(data) {
          if (data.username == '' || data.password == '') 
          {
            console.log("dfsdf");
            $ionicPopup.alert({
                  title: 'Error',
                  template: 'Please fill out the form.'
              });
          }else{
            AuthService.login(data.username, data.password);
          };
        };
        
        $scope.gotoSignup = function() {
          $state.go('signup');
        };

        $scope.onForgetPassword = function() {
          $state.go('forget');
        };

        $scope.fbLogin = function() {
          ngFB.login({scope: 'email, public_profile'}).then(
            function (response) {
                if (response.status === 'connected') {
                    console.log('Facebook login succeeded');
                    console.log(response);

                   ngFB.api({
                        path: '/me',
                        params: {fields: 'id,name'}
                    }).then(
                        function (user) {
                            $scope.user = user;
                            console.log("myvalue = " + $scope.user);
                            console.log("myvalue = " + JSON.stringify($scope.user));
                            $rootScope.username = $scope.user.name;
                            $rootScope.user_id = $scope.user.id;

                            console.log($rootScope.username);
                            console.log($rootScope.user_id);
                        },
                        function (error) {
                        alert('Facebook error: ' + error.error_description);
                    });

                    $state.go('sidemenu.category');
                } else {
                    alert('Facebook login failed');
                }

            });
          };
})

.controller('SignupCtrl', function($scope, AuthService, $ionicHistory, $state, $ionicPopup) {
    $scope.gotoLogin = function() {
       $state.go('login');
    };

    $scope.data = {
      username: "",
      email: "",
      phonenumber: "",
      password: "",
    };

    $scope.signup = function(data) {
      if (data.username == '' || data.email == '' || data.phonenumber == '' || data.password == '') 
      {
          $ionicPopup.alert({
              title: 'Error',
              template: 'Please fill out the form.'
          });
      }else{
          AuthService.signup(data.username, data.email, data.phonenumber, data.password);  
      }      
    };
})

.controller('ForgetCtrl', function($scope, AuthService, $ionicHistory, $state, $ionicPopup) {
  //   $scope.resetPassword = function(data) {
  //     console.log("1111111");
  //     var email = {
  //       "to" : "lijin1991820@gmail.com",
  //       "from" : "test@raffle.com",
  //       "subject" : "Test verified mail",
  //       "html" : "<h1>Your verification code is 12345</h1>",
  //       "text" : "Your verification code is 12345"
  //     };

  //     sendgrid.send(email, function(result){
  //           // openSuccessDialog();
  //       }, function(error){
  //           // openFailureDialog();
  //     });
  //   };
 
  // var openSuccessDialog = function() {
  //     var myPopup = $ionicPopup.show({
  //         template: 'Your message has been sent and a member of our team will be in touch.',
  //         title: 'Success!',
  //         cssClass: 'email-popup',
  //         buttons: [
  //             { text: 'CLOSE' }
  //         ]
  //     });
  //       myPopup.then(function(res) {
  //         console.log('Tapped!', res);
  //       });
  //   }

  //   var openFailureDialog = function() {
  //     var myPopup = $ionicPopup.show({
  //         template: 'Your message has been failed to send.',
  //         title: 'Failure!',
  //         cssClass: 'email-popup',
  //         buttons: [
  //             { text: 'CLOSE' }
  //         ]
  //     });
  //       myPopup.then(function(res) {
  //         console.log('Tapped!', res);
  //       });
  //   }

    $scope.resetPassword = function(data) {
      console.log(data.retrivemailtext);
    };

    $scope.gotoLogin = function(data) {
        $state.go('login');
    };
})

.controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
        path: '/me',
        params: {fields: 'id,name'}
    }).then(
        function (user) {
          console.log(user);
            $scope.user = user;
        },
        function (error) {
            alert('Facebook error: ' + error.error_description);
        });
})

.controller('SideMenuCtrl', function($scope, $state, $rootScope, $ionicPopup, $ionicSideMenuDelegate, ngFB) {
  // console.log("slidemenu come..");
  $scope.goLogout = function() {
      console.log($rootScope.user_id);
      // $rootScope.user_id = null;
      // $rootScope.username = null;
      var confirmPopup = $ionicPopup.confirm({
             title: 'Confirm',
             template: 'Do you want to log out?',
     });
      confirmPopup.then(function(res) {
          if(res) {
            $state.go('login');
          } else {
            console.log('You are not sure');
          }
      });
  };

  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

})

.controller('CategoryCtrl', function($scope, $state, AuthService, $ionicHistory, $ionicPopup, $rootScope, $timeout, $ionicSideMenuDelegate, ngFB) {
  console.log("slidemenu come..");
    $scope.data = {}
    $scope.goLogout = function() {
      console.log($rootScope.user_id);
      var confirmPopup = $ionicPopup.confirm({
             title: 'Delete',
             template: 'Are you sure you want to delete this item?',
     });
      confirmPopup.then(function(res) {
          if(res) {
            console.log('You are not sure');
          } else {
            console.log('You are not sure');
          }
      });
    };

    $scope.toggleLeft = function() {
      console.log("bbbbbbb");
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.goToArt = function() {
      $rootScope.categoryname = "Collectible/Art";
      $state.go('sidemenu.postitem');
    };

    $scope.goToElectro = function() {
      $rootScope.categoryname = "Electronics";
       $state.go('sidemenu.postitem');
    };

    $scope.goToFashion = function() {
      $rootScope.categoryname = "Fashion";
       $state.go('sidemenu.postitem');
    };

    $scope.goToSport = function() {
      $rootScope.categoryname = "Sporting goods";
       $state.go('sidemenu.postitem');
    };

    $scope.goToToy = function() {
      $rootScope.categoryname = "Toys";
       $state.go('sidemenu.postitem');
    };

    $scope.goToGift = function() {
      $rootScope.categoryname = "Deals/Gift";
       $state.go('sidemenu.postitem');
    };

})

.controller('PostItemCtrl', function($scope, $state, $rootScope, $ionicHistory, $cordovaCamera, DataService, BACKEND_URL, $ionicPopup, AuthService, UploadService) {
  $scope.goLogout = function() {
      var confirmPopup = $ionicPopup.confirm({
             title: 'Delete',
             template: 'Are you sure you want to delete this item?',
     });
      confirmPopup.then(function(res) {
          if(res) {
            console.log('You are not sure');
          } else {
            console.log('You are not sure');
          }
      });

      $state.go('login');
  };

  $scope.cameracount = 0;
  $rootScope.cameraImages = [];
  
  $scope.onClickCameraButton = function() {
    $scope.cameracount++;
      var options = {
          quality : 80,
          destinationType : Camera.DestinationType.DATA_URL,
          destinationType : Camera.DestinationType.FILE_URI,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 1000,
          targetHeight: 1000,
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : true,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
      };
    
      $cordovaCamera.getPicture(options).then(function(imageData) {
          $rootScope.cameraImages.push(imageData);
          $rootScope.imgURI = imageData;
          console.log($rootScope.cameraImages);
      }, function(err) {
          
      });
  };

  $scope.data = {
      itemname: "",
      itemdescription:"",
      itemkeyword:"",
      raffleduration:"",
      numberofslots:"",
      priceperslot:""
  };

  var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    $scope.todayDate = dd + "-" + mm + "-" + yyyy;
    $rootScope.dateStr = $scope.todayDate;

  $scope.onClickNextButton = function(data) {
    if ($scope.data.itemname == '' || $scope.data.itemdescription == '' || $scope.data.itemkeyword == '' || $scope.data.raffleduration == '') 
    {
      $ionicPopup.alert({
          title: 'Error',
          template: 'Please fill out the form.'
      });
    }else{
      // console.log($rootScope.categoryname);
      console.log($scope.imgURI);
      // UploadService.uploadImage($rootScope.user_id, $scope.imgURI, $scope.todayDate, data.category, data.description, data.amount);
  
      for (var i = $rootScope.cameraImages.length - 1; i >= 0; i--) {
        UploadService.uploadImage($rootScope.user_id, $rootScope.categoryname, $scope.todayDate, $scope.data.itemname, $scope.data.itemdescription, $scope.data.itemkeyword, $scope.data.raffleduration, $scope.data.category1, $scope.data.category2, $rootScope.cameraImages[i]);
        console.log($rootScope.cameraImages[i]);
      };
    };
  };
})

.controller('ItemPreviewCtrl', function($scope, $state, $rootScope, $ionicHistory, $cordovaCamera, DataService, BACKEND_URL, $ionicPopup, AuthService, UploadService) {
  console.log("ItemPreview controller");
  
    $scope.goToBuyRaffle = function(){
      $state.go('sidemenu.payment');
    };

})

.controller('PaymentCtrl', function($scope, $state, $rootScope, $ionicHistory, $cordovaCamera, DataService, BACKEND_URL, $ionicPopup, AuthService, UploadService) {
  console.log("Payment controller");

    $scope.AddCart = function(){
      console.log("add cart button clicked!!!");
    };

    $scope.createPayment = function() {
        alert($rootScope.priceperslot + $rootScope.itemname);
        var paymentDetails = new PayPalPaymentDetails($rootScope.priceperslot, "0.00", "0.00");
        var payment = new PayPalPayment($rootScope.priceperslot, "USD", $rootScope.itemname, "Sale",paymentDetails);
            return payment;
        }
            
    $scope.selectedPaypal = function(){
            
            PayPalMobile.renderSinglePaymentUI($scope.createPayment(), function( res ){
                                                alert(JSON.stringify(res))
                                               },
                                               function(){
                                               
                                               });
    };


})

.controller('SubListCtrl', function($scope, $state, $rootScope, $ionicHistory, $cordovaCamera, DataService, BACKEND_URL, $ionicPopup, AuthService) {
    $scope.goBack = function(){
    AuthService.logout();
    };
    
    $scope.clearSearch = function(){
    $scope.searchForce = "";
    };
    
    var loadData = function(){
      DataService.getSubListData(function(response) {
           $scope.items = new Array();
           if(response == "null")
             return;
           else {
             var itemCount = response.length;
             for(i=0; i<itemCount; i++)
             {
               var item = JSON.parse(JSON.stringify(response[i]));
               item.image_path = BACKEND_URL.baseURL + item.image_path;
               item.amountstr = parseFloat(item.amount).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
               $scope.items.push(item);
             }
           }
     });
   };
    
    loadData();
    $rootScope.refreshList = loadData;
    
    $scope.deleteItem = function(item) {
    var confirmPopup = $ionicPopup.confirm({
                                           title: 'Delete',
                                           template: 'Are you sure you want to delete this item?'
                                           });
    confirmPopup.then(function(res) {
                      if(res) {
                      DataService.removeItem(item.id, function(response) {
                                             if(response == "success") {
                                             var index = $scope.items.indexOf(item);
                                             $scope.items.splice(index, 1);
                                             }
                                             });
                      } else {
                      console.log('You are not sure');
                      }
                      });
    };
    
    $scope.takePhoto = function() {
    var options = {
    quality : 80,
    destinationType : Camera.DestinationType.DATA_URL,
    destinationType : Camera.DestinationType.FILE_URI,
    //sourceType : Camera.PictureSourceType.CAMERA,
    //allowEdit : true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 1000,
    targetHeight: 1000,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false
    };
    
    $cordovaCamera.getPicture(options).then(function(imageData) {
        $rootScope.imgURI = imageData;
        
        $state.go('upload');
        //$state.go('crop');
        }, function(err) {
        });
    };
    
    $scope.itemClicked = function(item){
    $rootScope.selIndex = $scope.items.indexOf(item);
    $rootScope.galleryItems = $scope.items;
    
    $state.go("slideshow");
    };
})

.controller('SlideCtrl', function($scope, $rootScope, $ionicHistory, $state, $ionicSlideBoxDelegate) {
            
    $scope.goBack = function(){
    $ionicHistory.goBack();
    };
    
    $scope.items = $rootScope.galleryItems;
    $scope.myActiveSlide = $rootScope.selIndex;
    
    $scope.showFullScreen = function(url) {
    $rootScope.fullscreenImgURL = url;
    $state.go("fullscreen");
    };
    
    $scope.slideVisible = function(index){
    //index = index + 1;
    var currentIndex = $ionicSlideBoxDelegate.currentIndex();
    if(  index < $ionicSlideBoxDelegate.currentIndex() -1
       || index > $ionicSlideBoxDelegate.currentIndex() + 1){
    return false;
    }
    return true;
    }
})

.controller('CropCtrl', function($state, $scope, $rootScope, $ionicHistory) {
    //console.log($rootScope.capturedImgURI);
    
    $scope.goBack = function() {
    $ionicHistory.goBack();
    };
    
    $scope.imageCropResult = '';
    
    $scope.useImage = function(base64Img) {
    $rootScope.imgURI = base64Img;
    if($rootScope.loadUploadImage)
    {
    $rootScope.loadUploadImage();
    }
    $state.go('upload');
    };
    
    $scope.cancelImage = function() {
    $state.go('sublist');
    };
})

.controller('FullScreenCtrl', function($scope, $rootScope, $ionicHistory) {
            
    $scope.goBack = function(){
    $ionicHistory.goBack();
    };
    $scope.imgURL = $rootScope.fullscreenImgURL;
    (document.getElementById('page')).style.width = (screen.width - 20) + "px";
    (document.getElementById('page')).style.position = "absolute";
    (document.getElementById('page')).style.transform = "translateY(30%)";
    var nav_height = $(".bar-header").outerHeight();
    var pane_height = (screen.height - nav_height - 15) + "px";
    (document.getElementById('scrolly')).style.height = pane_height;
})

.controller('UploadCtrl', function($state, $rootScope, $scope, $ionicHistory, $cordovaDatePicker, UploadService, DataService, $ionicPopup) {
            
    var loadImage = function() {
        $scope.imageURI = $rootScope.imgURI;
    };
    
    loadImage();
    
    $scope.data = {
    description: "",
    amount:""
    };
    
    DataService.getCategory(function(response) {
                            $scope.categories = new Array();
                            if(response == "null")
                            return;
                            else {
                            var itemCount = response.length;
                            console.log("Categories: " + itemCount)
                            for(i=0; i<itemCount; i++)
                            {
                            var category = JSON.parse(JSON.stringify(response[i]));
                            category.order = i;
                            $scope.categories.push(category);
                            }
                            }
                            });
    
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    $scope.todayDate = dd + "-" + mm + "-" + yyyy;
    $rootScope.dateStr = $scope.todayDate;
    
    
    
    
    $scope.upload = function(data) {
    UploadService.uploadImage($rootScope.user_id, $scope.imgURI, $scope.todayDate, data.category, data.description, data.amount);
    };
    
    $scope.showDatePicker = function() {
    var dt_options = {
    date: new Date(),
    mode: 'date'/*, // or 'time'
                 minDate: new Date() - 10000,
                 allowOldDates: true,
                 allowFutureDates: false,
                 doneButtonLabel: 'DONE',
                 doneButtonColor: '#F2F3F4',
                 cancelButtonLabel: 'CANCEL',
                 cancelButtonColor: '#000000'*/
    };
    
    $cordovaDatePicker.show(dt_options)
    .then(function(date){
          today = new Date(date);
          dd = today.getDate();
          mm = today.getMonth()+1; //January is 0!
          yyyy = today.getFullYear();
          $scope.todayDate = dd + "-" + mm + "-" + yyyy;
          $rootScope.dateStr = $scope.todayDate;
          });
    }
    
    $scope.goBack = function(){
    $scope.imageURI = "";
    $state.go('sublist');
    //$ionicHistory.goBack();
    };
});