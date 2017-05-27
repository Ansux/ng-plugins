module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: `<div class="w-cover" ng-show="modal.show">
                <div class="backdrop"></div>
                <div class="ng-modal">
                  <div class="content">
                    <div class="header">
                      <button type="button" class="close" ng-click="close()"><span aria-hidden="true">&times;</span></button>
                      <h4 class="modal-title">{{modal.title}}</h4>
                    </div>
                    <div class="body" ng-transclude></div>
                  </div>
                </div>
              </div>`,
    scope: {
      modal: '='
    },
    link: (scope, ele, attrs, ctrl, transclude) => {
      scope.close = () => {
        scope.modal = {}
        angular.element(document.body).removeClass('modal-open')
      }
      scope.$watch('modal', (nv) => {
        if (nv.show) {
          angular.element(document.body).addClass('modal-open')
        } else {
          angular.element(document.body).removeClass('modal-open')
        }
      })
    }
  }
}