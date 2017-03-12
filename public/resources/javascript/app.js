angular.module('Portfolio', [])
    .controller('PortfolioController', function ($scope, $http, $location, $anchorScroll) {
        $scope.projects = [];
        $scope.repositories = {};
        $scope.filters = [];
        $scope.githubURL = 'https://github.com/AceXintense';
        $scope.copyrightYear = new Date().getFullYear();
        $scope.cache = [];
        $scope.repositoryCount = 0;
        $scope.repositoryCurrentCount = 0;
        $scope.selectedTab = 0;

        $scope.results = [];

        $scope.tabs = [
            {
                name: 'Experience',
                selected: true,
                icon: 'fa-book'
            },
            {
                name: 'Projects',
                selected: false,
                icon: 'fa-code-fork'
            },
            {
                name: 'Gallery',
                selected: false,
                icon: 'fa-picture-o'
            },
            {
                name: 'Contact',
                selected: false,
                icon: 'fa-envelope'
            }
        ];

        $scope.skills = [
            {
                language: 'PHP',
                experience: '1.5 Year\'s',
                value: 50,
                id: 'php'
            },
            {
                language: 'HTML',
                experience: '4 Year\'s',
                value: 90,
                id: 'html'
            },
            {
                language: 'CSS',
                experience: '2 Year\'s',
                value: 80,
                id: 'css'
            },
            {
                language: 'Javascript',
                experience: '2 Year\'s',
                value: 80,
                id: 'javascript'
            },
            {
                language: 'Angular',
                experience: '1 Month',
                value: 5,
                id: 'angular'
            },
            {
                language: 'Python',
                experience: '1 Year\'s',
                value: 30,
                id: 'python'
            },
            {
                language: 'Visual Basic',
                experience: '3 Year\'s',
                value: 70,
                id: 'visual_basic'
            },
            {
                language: 'MySQL',
                experience: '2 Year\'s',
                value: 50,
                id: 'mysql'
            },
            {
                language: 'Postgres SQL',
                experience: '1 Year\'s',
                value: 25,
                id: 'postgres_sql'
            }
        ];

        $(function(){
            $(".header-info span").typed({
                strings: [
                    "Software Engineer.",
                    "Game Developer.",
                    "Web Developer."
                ],
                loop: true,
                loopCount: null,
                typeSpeed: 25,
                backSpeed: 25,
                backDelay: 1000,
                shuffle: false,
                showCursor: false
            });
        });

        $scope.scrollToId = function (id) {

            $scope.selectTab(0);

            $location.hash(id);
            $anchorScroll();

        };

        $scope.enterToSearch = function(keyEvent) {
            if (keyEvent.which === 13) {
                $scope.results = [];
                $scope.searchFor($scope.search);
            }
        }


        $scope.searchFor = function (text) {

            $scope.results = [];

            if (text === undefined) {
                $scope.results.push({
                    language: 'No Results found'
                });
                return true;
            }

            text = text.toLowerCase();

            for (var i = 0; i < $scope.skills.length; i++) {

                if ($scope.skills[i].language.toLowerCase().indexOf(text) !== -1) {

                    var skill = {
                        language: $scope.skills[i].language + ' - ' + $scope.skills[i].experience + ' experience click for more information.',
                        id: $scope.skills[i].id
                    }

                    $scope.results.push(skill);
                }

            }

            if ($scope.results.length === 0) {
                $scope.results.push({
                    language: 'No Results found for ' + text
                });
                return true;
            }

        };

        $scope.isTabSelected = function (tabId) {
            return $scope.tabs[tabId].selected;
        };

        $scope.selectTab = function (tabId) {

            for (var i = 0; i < $scope.tabs.length; i++) {
                $scope.tabs[i].selected = false;
            }

            $scope.tabs[tabId].selected = true;
            $scope.selectedTab = tabId;

        };

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
                    $scope.repositoryCount = $scope.repositories.total_count;
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
                //Get the results from the cache.
                if ($scope.cache[language] != null) {
                    $scope.projects = $scope.cache[language];
                    $scope.repositoryCurrentCount = $scope.projects.length;
                    return true;
                }

                $http({
                    method: 'GET',
                    url: 'https://api.github.com/search/repositories?q=language:' + language + '+user:acexintense'
                }).then(
                    function successCallback(response) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.projects = response.data['items'];
                        $scope.cache[language] = $scope.projects;
                        $scope.repositoryCurrentCount = response.data.total_count;

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
                        $scope.repositoryCurrentCount = response.data.length

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