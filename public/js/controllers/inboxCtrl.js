angular.module('InboxApp').controller('inboxCtrl', ['$scope', 'googleApiService', 'ConstantService', function($scope, googleApi, constants) {
    var nextPageToken = '';
    var loading = false;

    function init() {
        loading = true;
        googleApi.checkAuth(function(authToken) {
            if (!authToken) {
                googleApi.renderAuthButton(constants.signInButtonId, function() {
                    googleApi.checkAuth(function(authToken) {
                        if (authToken) {
                            googleApi.accessToken = authToken;
                            $scope.$apply(function() {
                                $scope.init = true;
                            });
                            initPersonalData();
                        }
                    });
                });
            } else {
                $scope.$apply(function() {
                    $scope.init = true;
                });
                initPersonalData();
            }
        });
    };

    function initPersonalData() {
        googleApi.getUserInfo(function(user) {
            $scope.$apply(function() {
                $scope.name = user.name;
            });
            $scope.loadBunchOfMessages(true);
        });
    }

    $scope.loadBunchOfMessages = function(initial) {
        if ((nextPageToken && !loading) || initial) {
            loading = true;
            $scope.$apply(function() {
                $scope.messageLoading = !initial && loading;
            });

            googleApi.getMessageList(nextPageToken, function(result) {
                var list = result.messages;
                nextPageToken = result.nextPageToken;

                googleApi.getMessages(list.map(el => el.id), function(messages) {
                    $scope.$apply(function() {
                        $scope.messages.push.apply($scope.messages, messages);

                        loading = false;
                        $scope.messageLoading = false;
                    });
                })
            })
        }
    };

    $scope.toggleMessage = function(message) {
        message.opened = !message.opened;
    };

    $scope.startInit = function() {
        init();
    };

    $scope.init = false;
    $scope.messages = [];
}]);
