(function() {
    'use strict';

    angular
        .module('dyn.domains')
        .factory('dynDomainsService', dynDomainsService);

    dynDomainsService.$inject = ['$http', 'dynDomainsConfig', '$log', '$q'];

    /* @ngInject */
    function dynDomainsService($http, dynDomainsConfig, $log, $q) {
        var cache = {};
        var defaults = {
			baseUrl: '/'
        };
        angular.extend(defaults, dynDomainsConfig);


        return {
            getDomain: getDomain
        };

        /**
         * Retorna uma promise com o resultado da consulta considerando o
         * @param domain
         *
         * @param  {string}  domain dominio que deverá ser consultado
         * @return {promise}        promise de consulta
         *
         */
        function getDomain(domain, deep) {
            if (cache[domain] && !deep) {
                return $q(function(resolve) {
                    resolve(cache[domain]);
                });
            }

            return $http.get(makeUrl(domain))
                .then(function(response) {
                    cache[domain] = response.data.map(convertKey);
                    return cache[domain];
                })
                .catch(function(message) {
                    $log.error(message);
                });
        }

        /**
         *
         * Cria a url de consulta de acordo com a configuração injetada (dynDomainsConfig.baseUrl)
         * e o @param domain enviado
         *
         * @private
         * @param  {string} domain dominio que deverá ser consultado
         * @return {string}        url gerada
         *
         */
        function makeUrl(domain) {
            var url = defaults.baseUrl;
            if (!url) {
                return '/' + domain; //consulta no dominio de origem
            }

            if (url.slice(-1) !== '/') {
                url += '/' + domain;
            } else {
                url += domain;
            }
            return url;
        }

        /**
         * Método auxiliar para conversão de elementos da tabela de dominio,
         * considerando que o element enviado possui a prop key, que será
         * alterada
         *
         * @param  {[Object]} element inicial
         * @return {[Object]} element com a prop key convertida, se possível
         */
        function convertKey(element) {
            var numberKey = element.key ? parseInt(element.key) : '';
            if (typeof numberKey === 'number' && !isNaN(numberKey)) {
                element.key = numberKey;
            }
            return element;
        }
    }
})();
