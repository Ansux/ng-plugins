module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: `<div class="ng-scroll">
                <div class="scroll-content" ng-transclude></div>
                <div class="scroll-bar"><span class="scroll-thumb"></span></div>
              </div>`,
    scope: {
      height: '@'
    },
    link: (scope, ele, attrs, ctrl, transclude) => {
      const rootDom = ele[0]
      const scrollHeight = scope.height ? parseInt(scope.height) : rootDom.parentNode.offsetHeight

      const contentDom = ele[0].querySelector('.scroll-content')
      const barDom = ele[0].querySelector('.scroll-bar')
      const thumbDom = ele[0].querySelector('.scroll-thumb')

      const contentHeight = contentDom.offsetHeight
      const barHeight = scrollHeight / contentHeight * scrollHeight
      const maxBarScrollHeight = scrollHeight - barHeight
      const maxContentScrollHeight = contentHeight - scrollHeight
      rootDom.style.height = `${scrollHeight}px`
      barDom.style.height = `${barHeight}px`

      angular.element(rootDom).bind('mouseenter', mouseenter)

      function mouseenter() {
        angular.element(thumbDom).bind('mousedown', thumbDown)
        angular.element(rootDom).bind('mouseleave', mouseleave)
        angular.element(rootDom).bind('mousewheel', mousewheel)
      }

      function mouseleave() {
        angular.element(thumbDom).unbind('mousedown', thumbDown)
        angular.element(rootDom).unbind('mouseleave', mouseleave)
        angular.element(rootDom).unbind('mousewheel', mousewheel)
      }

      let clickClientY = 0
      let barTop = 0
      let lastBarTop = 0
      let contentTop = 0

      function thumbDown(event) {
        const e = event || window.event
        angular.element(document).bind('mousemove', thumbMove)
        angular.element(document).bind('mouseup', thumbUp)
        clickClientY = e.clientY
      }

      function mousewheel(event) {
        const e = event || window.event
        const wheelDelta = (e.deltaY || -e.wheelDelta)
        if (!((contentTop === 0 && wheelDelta < 0) || (contentTop === -maxContentScrollHeight && wheelDelta > 0))) {
          contentTop -= wheelDelta
          contentTop = (contentTop > 0) ? 0 : (contentTop < -maxContentScrollHeight) ? -maxContentScrollHeight : contentTop
          lastBarTop = barTop = -contentTop / (scrollHeight / barHeight)
          updatePosition()
        }
        e.preventDefault ? e.preventDefault() : e.returnValue = false
      }

      function thumbMove(event) {
        const e = event || window.event
        barTop = lastBarTop + (e.clientY - clickClientY)
        if (barTop < 0) {
          barTop = 0
        } else if (barTop > maxBarScrollHeight) {
          barTop = maxBarScrollHeight
        } else {
          contentTop = -barTop * (scrollHeight / barHeight)
        }
        updatePosition()
        e.preventDefault ? e.preventDefault() : e.returnValue = false
      }

      function thumbUp() {
        angular.element(document).unbind('mousemove', thumbMove)
        angular.element(document).unbind('mouseup', thumbUp)
        lastBarTop = barTop
      }

      function updatePosition() {
        contentDom.style.top = `${contentTop}px`
        barDom.style.top = `${barTop}px`
      }
    }
  }
}