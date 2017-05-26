module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: `<div class="w-cover" ng-show="confirm">
                <div class="backdrop"></div>
                <div class="ng-confirm">
                  <div class="content">
                    <div class="title">
                      <span class="glyphicon glyphicon-info-sign"></span>
                      <span>警告</span>
                      <a class="btn-close" ng-click="close()">&times;</a>
                    </div>
                    <div class="info">确定要删除么？</div>
                    <div class="btns">
                      <button type="button" class="btn btn-sm btn-default" ng-click="close()">关闭</button>
                      <button type="button" class="btn btn-sm btn-danger" ng-click="ok()">确定</button>
                    </div>
                  </div>
                </div>
              </div>`,
    scope: {
      confirm: '='
    },
    controller: ['$scope', ($scope) => {
      $scope.close = () => {
        $scope.confirm = false
      }
      $scope.ok = () => {
        $scope.$emit('confirmOk')
      }
    }]
  }
}