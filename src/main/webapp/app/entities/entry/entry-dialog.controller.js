(function() {
    'use strict';

    angular
        .module('aipgApp')
        .controller('EntryDialogController', EntryDialogController);

    EntryDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'DataUtils', 'entity', 'Entry', 'EntryCategory', 'User', 'Tag'];

    function EntryDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, DataUtils, entity, Entry, EntryCategory, User, Tag) {
        var vm = this;

        vm.entry = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        vm.entrycategories = EntryCategory.query({filter: 'entry-is-null'});
        $q.all([vm.entry.$promise, vm.entrycategories.$promise]).then(function() {
            if (!vm.entry.entryCategory || !vm.entry.entryCategory.id) {
                return $q.reject();
            }
            return EntryCategory.get({id : vm.entry.entryCategory.id}).$promise;
        }).then(function(entryCategory) {
            vm.entrycategories.push(entryCategory);
        });
        vm.users = User.query();
        vm.tags = Tag.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.entry.id !== null) {
                Entry.update(vm.entry, onSaveSuccess, onSaveError);
            } else {
                Entry.save(vm.entry, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('aipgApp:entryUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.date = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();