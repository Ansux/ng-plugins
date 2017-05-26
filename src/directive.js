
angular.module('app.directive', [])
  .directive('ngSelect', require('./components/select'))
  .directive('ngDatepicker', require('./components/datepicker'))
  .directive('ngAlert', require('./components/alert'))
  .directive('ngConfirm', require('./components/confirm'))
  .directive('ngModal', require('./components/modal'))
  .directive('ngLoading', require('./components/loading'))
  .directive('ngPager', require('./components/pager'))