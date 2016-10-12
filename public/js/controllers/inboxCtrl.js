angular.module('InboxApp').controller('inboxCtrl', ['$scope', 'googleApiService', 'ConstantService', function($scope, googleApi, constants) {
    function init() {
        googleApi.checkAuth(function(authStatus) {
            if (!authStatus) {
                googleApi.renderAuthButton(constants.signInButtonId, function(auth) {
                    googleApi.accessToken = auth.access_token;
                    $scope.appStatus.init = true;
                    initPersonalData();
                });
            } else {
                $scope.appStatus.init = true;
                initPersonalData();
            }
        });
    };

    function initPersonalData() {
        googleApi.getUserInfo(function(user) {
            $scope.$apply(function() {
                $scope.name = user.name;
                googleApi.getMessageList(function(result) {
                    var list = result.messages;
                    $scope.messages = [];

                    var getMessages = function self() {
                        var message = list.shift();
                        if (message) {
                            googleApi.getMessage(message.id, function(message) {
                                if (!message.error) {
                                    $scope.$apply(function() {
                                        $scope.messages.push(message);
                                    })
                                }
                                self();
                            })
                        } else {
                            console.log('done')
                        }
                    };

                    getMessages();
                })
            })
        });
    }

    $scope.startInit = function() {
        init();
    };

    $scope.appStatus = { init: false };
}]);
