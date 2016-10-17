angular.module('InboxApp').directive('bottomScroll', ['$window', '$document', function($window, $document) {
    return {
        scope: {
            loadHandler: '&'
        },
        link: function(scope) {
            angular.element($window).bind('scroll', function() {
                if ($window.scrollY + $window.innerHeight === $document.height()) {
                    scope.loadHandler()();
                }
            });
        }
    };
}]);
