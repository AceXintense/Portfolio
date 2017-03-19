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
        $scope.searchType = 'skills';

        $scope.previewWindow = false;

        $scope.searchTypeHelpers = {
            skills: 'PHP, MySQL, Postgres, HTML...',
            projects: 'PHPCast, Python, PHP, Portfolio...',
            galleries: 'PHPCast, PHP-Server-Monitoring...'
        };

        $scope.results = [];

        $scope.galleries = [];

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
                language: 'Git',
                experience: '2 Year\'s',
                value: 60,
                id: 'git'
            },
            {
                language: 'Vagrant',
                experience: '1 Year\'s',
                value: 30,
                id: 'vagrant'
            },
            {
                language: 'Java',
                experience: '2 Month\'s',
                value: 10,
                id: 'java'
            },
            {
                language: 'NPM',
                experience: '2 Year\'s',
                value: 60,
                id: 'npm'
            },
            {
                language: 'Google Analytics',
                experience: '1 Year\'s',
                value: 30,
                id: 'ga'
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

        $scope.accounts = [
            {
                serviceName: 'Twitter',
                name: 'AceXintense',
                websiteURL: 'https://twitter.com/AceXintense'
            },
            {
                serviceName: 'Facebook',
                name: 'Sam Grew',
                websiteURL: 'https://www.facebook.com/sam.grew'
            },
            {
                serviceName: 'LinkedIn',
                name: 'Sam Grew',
                websiteURL: 'https://www.linkedin.com/in/AceXintense'
            },
        ];

        $(function(){

            $(".header-info span").typed({
                strings: [
                    "Software Engineer.",
                    "Game Developer.",
                    "Web Developer.",
                    "Linux Enthusiast.",
                    "Server Engineer.",
                    "Stack Developer."
                ],
                loop: true,
                loopCount: null,
                typeSpeed: 25,
                backSpeed: 25,
                backDelay: 1000,
                shuffle: false,
                showCursor: false
            });

            $("#header-tabs").hide(); // hide the fixed navbar initially
            $(window).scroll(function(){
                var topofDiv = $("#content-tabs").offset().top - $(".header").height();
                if($(window).scrollTop() >= topofDiv){
                    $("#header-tabs").show();
                    $("#header-row").hide();
                }
                else{
                    $("#header-tabs").hide();
                    $("#header-row").show();
                }
            });
        });

        //https://portfolio-resources.s3.eu-west-2.amazonaws.com
        AWS.config.region = 'eu-west-2';
        AWS.config.accessKeyId = 'AKIAJTA4Y4XHCLYIJRUA';
        AWS.config.secretAccessKey = '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';

        var baseURL = 'https://portfolio-resources.s3.eu-west-2.amazonaws.com';
        var s3 = new AWS.S3();
        var params = {
            Bucket: 'portfolio-resources',
            EncodingType: 'url'
        };

        String.prototype.replaceAll = function(search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };

        $scope.closePreviewer = function () {
            $scope.previewWindow = false;
        };

        $scope.openInPreviewer = function (url) {
            $scope.previewURL = url;
            $scope.previewWindow = true;
        };

        $scope.getGalleries = function (objects) {

            for (var i = 0; i < objects.Contents.length; i++) {


                if (objects.Contents[i].Key.split("/").length === 3 && objects.Contents[i].Key.split("/")[2] != '') {

                    var splits = objects.Contents[i].Key.split("/");
                    var groups = function () {
                        var names = [];

                        for (var g = 0; g < $scope.galleries.length; g++) {
                            names.push($scope.galleries[g].name);
                        }

                        return names;
                    };

                    if (inArray(splits[1], groups())) { //If group found create gallery inside of the group.
                        for (var g = 0; g < $scope.galleries.length; g++) {
                            if ($scope.galleries[g].name == splits[1]) {
                                var gallery = createGallery(baseURL, splits);
                                $scope.galleries[g].objects.push(gallery);
                            }
                        }
                    } else { //Create group to allow creation of galleries under.
                        var galleryGroup = createGalleryGroup(splits);
                        var gallery = createGallery(baseURL, splits);
                        galleryGroup.objects.push(gallery);
                        $scope.galleries.push(galleryGroup);
                    }
                }
            }

        };

        function inArray(needle, haystack) {
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] == needle) return true;
            }
            return false;
        }

        function createGallery(baseURL, splits) {

            return {
                pictureURL: baseURL + '/' + splits[0] + '/' + splits[1] + '/' + splits[2]
            };

        }

        function createGalleryGroup(splits) {

            for (var i = 0; i < $scope.projects.length; i++) {
                if ($scope.projects[i].name == splits[1]) {
                    return {
                        name: splits[1],
                        objects: [],
                        description: $scope.projects[i].description,
                        github: true,
                        githubURL: $scope.projects[i].html_url
                    };
                }
            }

            return {
                name: splits[1],
                objects: [],
                description: 'No description available for ' + splits[1],
                github: false,
                githubURL: ''
            };

        }

        $scope.scrollToId = function (id, tab) {

            if (tab == undefined) {
                if ($scope.searchType === 'skills') {
                    $scope.selectTab(0);
                } else if ($scope.searchType === 'projects') {
                    id = 'p-' + id;
                    $scope.selectTab(1);
                } else if ($scope.searchType === 'galleries') {
                    id = 'g-' + id;
                    $scope.selectTab(2);
                }
            } else {
                $scope.selectTab(tab);
            }

            $location.hash(id);
            $anchorScroll();

        };

        $scope.clearSearch = function () {

            $scope.search = '';
            $scope.results = [];

        };

        $scope.enterToSearch = function(keyEvent) {
            if (keyEvent.which === 13) {
                $scope.results = [];
                $scope.searchFor($scope.search);
            }
        };

        function searchSkills (text) {

            for (var i = 0; i < $scope.skills.length; i++) {

                if ($scope.skills[i].language.toLowerCase().indexOf(text) !== -1) {

                    var skill = {
                        title: $scope.skills[i].language + ' - ' + $scope.skills[i].experience + ' experience click for more information.',
                        id: $scope.skills[i].id
                    };

                    $scope.results.push(skill);
                }

            }

            return $scope.results.length > 0;

        }

        function searchProjects (text) {

            for (var i = 0; i < $scope.projects.length; i++) {

                if ($scope.projects[i].name.toLowerCase().indexOf(text) !== -1) {

                    var project = {
                        title: $scope.projects[i].name,
                        id: $scope.projects[i].name
                    };

                    $scope.results.push(project);
                }

            }

            return $scope.results.length > 0;

        }

        function searchGalleries (text) {

            for (var i = 0; i < $scope.galleries.length; i++) {

                if ($scope.galleries[i].name.toLowerCase().indexOf(text) !== -1) {

                    var gallery = {
                        title: $scope.galleries[i].name,
                        id: $scope.galleries[i].name
                    };

                    $scope.results.push(gallery);
                }

            }

            return $scope.results.length > 0;

        }

        $scope.searchFor = function (text) {
            $scope.results = [];

            if (text === undefined) {
                text = '';
            }

            text = text.toLowerCase();

            if ($scope.searchType === 'skills') {
                if (!searchSkills(text)) {
                    $scope.results.push({
                        title: 'No Results found for ' + text,
                        id: ''
                    });
                }
            } else if ($scope.searchType === 'projects') {
                if (!searchProjects(text)) {
                    $scope.results.push({
                        title: 'No Results found for ' + text,
                        id: ''
                    });
                }
            } else if ($scope.searchType === 'galleries') {
                if (!searchGalleries(text)) {
                    $scope.results.push({
                        title: 'No Results found for ' + text,
                        id: ''
                    });
                }
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
                    s3.listObjects(params, function (err, data) {

                        if (err) {
                            console.log(err, err.stack);
                        } else {
                            $scope.getGalleries(data);
                        }

                    });
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