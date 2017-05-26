module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div class="ng-loading" ng-show="isLoading">正在加载数据</div>',
    scope: {
      isLoading: '='
    }
  }
}