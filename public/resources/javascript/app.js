angular.module('Portfolio', [])
    .controller('PortfolioController', function ($scope, $http) {
        $scope.projects = [];

        $scope.skills = [
            {
                language: 'PHP',
                experience: '1.5 Year\'s',
                value: 100
            },
            {
                language: 'HTML',
                experience: '4 Year\'s',
                value: 200
            },
            {
                language: 'CSS',
                experience: '2 Year\'s',
                value: 140
            },
            {
                language: 'Javascript',
                experience: '2 Year\'s',
                value: 120
            },
            {
                language: 'Angular',
                experience: '1 Month',
                value: 20
            },
            {
                language: 'Python',
                experience: '1 Year\'s',
                value: 90
            },
            {
                language: 'Visual Basic',
                experience: '3 Year\'s',
                value: 180
            }
        ];

        $scope.getRandomBetween = function (min, max) {
            return Math.ceil(Math.random() * (max - min) + min);
        };

        $scope.getUser = function () {
            $http({
                method: 'GET',
                url: 'https://api.github.com/users/acexintense'
            }).then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.user = response.data;

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                }
            );
        };

        $scope.getRepository = function (language) {
            if (language !== null) {
                $http({
                    method: 'GET',
                    url: 'https://api.github.com/search/repositories?q=language:' + language + '+user:acexintense'
                }).then(
                    function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.projects = response.data['items'];

                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    }
                );
            } else {
                $http({
                    method: 'GET',
                    url: 'https://api.github.com/users/acexintense/repos'
                }).then(
                    function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.projects = response.data;

                    }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    }
                );
            }
        };

        $scope.getRepository(null);
        $scope.getUser();

    });

angular.element(function() {
    angular.bootstrap(document, ['Portfolio']);
});