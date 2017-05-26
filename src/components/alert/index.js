module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    template: `<div class="w-cover" ng-show="alert.status">
                <div class="backdrop"></div>
                <div class="ng-alert" ng-class="alert.type">
                  <div class="content">
                    <div class="title">
                      <span>{{alertType}}：</span>
                      <a class="btn-close" ng-click="close()">&times;</a>
                    </div>
                    <div class="info">{{alert.info}}</div>
                  </div>
                </div>
              </div>`,
    scope: {
      alert: '='
    },
    controller: ['$scope', ($scope) => {
      $scope.close = () => {
        $scope.alert.status = false
      }
      $scope.$watch('alert.type', (nv) => {
        $scope.alertType = (nv === 'error') ? '错误' : (nv === 'warning') ? '警告' : (nv === 'success') ? '提示' : ''
      })
    }]
  }
}