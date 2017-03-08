angular.module('Portfolio', [])
    .controller('PortfolioController', function ($scope, $http) {
        $scope.projects = [];
        $scope.repositories = {};
        $scope.filters = [];
        $scope.githubURL = 'https://github.com/AceXintense';
        $scope.copyrightYear = new Date().getFullYear();

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

        $scope.getLanguageFilters = function () {
            //Prefilter array structure.
            var preFilters = [{
                title: 'All',
                searchName: null
            }];
            //Loop over the repositories and add all the languages to an array.
            for (var i = 0; i < $scope.repositories.items.length; i++) {
                var language = $scope.repositories.items[i].language;
                var filter = {
                    title: language,
                    searchName: language.replace(' ', '-')
                };
                preFilters.push(filter);
            }

            var sortObjArray = function(arr, field) {
                arr.sort(
                    function compare(a,b) {
                        if (a[field] < b[field])
                            return -1;
                        if (a[field] > b[field])
                            return 1;
                        return 0;
                    }
                );
            };

            var removeDuplicatesFromObjArray = function(arr, field) {
                var u = [];
                arr.reduce(function (a, b) {
                    if (a[field] !== b[field]) u.push(b);
                    return b;
                }, []);
                return u;
            };

            sortObjArray(preFilters, "title");
            $scope.filters  = removeDuplicatesFromObjArray(preFilters, "title");
        };

        $scope.setSelectedFilter = function(filter) {
            $scope.selectedFilter = filter;
        };

        $scope.getRepositories = function () {
            $http({
                method: 'GET',
                url: 'https://api.github.com/search/repositories?q=user:acexintense'
            }).then(
                function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.repositories = response.data;
                    $scope.getLanguageFilters();

                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                }
            );
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

        $scope.getRepositories();
        $scope.getRepository(null);
        $scope.getUser();

    });

angular.element(function() {
    angular.bootstrap(document, ['Portfolio']);
});