module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: `<div class="ng-scroll" ng-style="style" ng-mouseenter="mouseenter()">
                <div class="scroll-content" ng-transclude></div>
                <div class="scroll-bar"><span></span></div>
              </div>`,
    scope: {
      style: '='
    },
    link: (scope, ele, attrs) => {
      scope.mouseenter = () => {

      }
      console.log(ele[0].querySelector('.scroll-content').offsetHeight)
    }
  }
}