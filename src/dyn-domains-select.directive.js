(function() {
    'use strict';

    angular
        .module('dyn.domains')
        .directive('dynDomainsSelect', dynDomainsSelect);

    dynDomainsSelect.$inject = [];

    /* @ngInject */
    function dynDomainsSelect() {
        return {
            restrict: 'E',
            template: '<select ng-options="item[dynDomainSelCrtl.key] as item[dynDomainSelCrtl.value] for item in dynDomainSelCrtl.itensDomain"><option ng-if="dynDomainSelCrtl.showEmptyOption" ng-disabled="dynDomainSelCrtl.disableEmptyOption" value="">Selecione...</option></select>',
            controller: DynDomainsSelectController,
            controllerAs: 'dynDomainSelCrtl',
            scope: {
                showEmptyOption: '@',
                disableEmptyOption: '@',
                domain: '@',
                key: '@',
                value: '@',
                ngModel: '='
            },
            bindToController: true,
            replace: true,
            require: ['ngModel', 'domain']
        };
    }

    DynDomainsSelectController.$inject = ['dynDomainsService'];

    /**
     * Controller para a diretiva, especialmente para capturar o dominio solicitado
     * e carregar os itens
     *
     * @param {[Service]} dynDomainsService service para consulta de dominios
     */
    function DynDomainsSelectController(dynDomainsService) {

        var _this = this;

        _this.showEmptyOption = _this.showEmptyOption == 'true' || true;
        _this.disableEmptyOption = _this.disableEmptyOption == 'true' || false;
        _this.key = _this.key || 'key';
        _this.value = _this.value || 'value';

        dynDomainsService.getDomain(_this.domain)
            .then(function(data) {
                _this.itensDomain = data;
            });
    }
})();
