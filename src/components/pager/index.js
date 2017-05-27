module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    template: `<div class="ng-pager clearfix">
                <div class="page-size-select" ng-if="pager.hasPageSizeSelect">
                  <span>每页显示</span>
                  <div ng-select options="options" mapping="id,val" value="size"></div>
                  <span>条</span>
                </div>
                <ul class="pagination pull-right">
                  <li ng-class="{'disabled': pager.current===1}">
                    <a ng-click="changePage(pager.current-1)">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li ng-repeat="page in pageItems" ng-class="{'active': page.active}">
                    <a ng-click="changePage(page.index)">{{page.index}}</a>
                  </li>
                  <li ng-class="{'disabled': pager.current===pager.totalPage}">
                    <a ng-click="changePage(pager.current+1)" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </div>`,
    scope: {
      pager: '='
    },
    controller: ['$scope', ($scope) => {
      $scope.options = [{
        id: 5,
        val: 5
      }, {
        id: 10,
        val: 10
      }, {
        id: 20,
        val: 20
      }, {
        id: 30,
        val: 30
      }]

      $scope.size = 5

      let scope = $scope
      // 切换分页
      scope.changePage = function (index) {
        if (index < 1 || index > scope.pager.totalPage) {
          return
        }
        scope.pager.current = index
        angular.forEach(scope.pageItems, (v) => {
          v.active = (v.index === index)
        })
        scope.$emit('changePage')
      }

      // 监听分页size变化
      scope.$on('sizeChange', (e, val) => {
        scope.size = val
      })

      // 调整每页显示条数
      scope.changePageSize = () => {
        scope.pager.current = 1
        scope.$emit('changePage')
      }
    }],
    link: (scope) => {
      scope.renderPager = () => {
        let pager = scope.pager
        let pageItems = []
        let start = 1
        let end = 5
        // 页数超过5时
        if (pager.totalPage > 5) {
          if (pager.totalPage - pager.current < 3) {
            end = pager.totalPage
            start = end - 4
          } else if (pager.current >= 3) {
            start = pager.current - 2
            end = pager.current + 2
          }
        } else {
          end = pager.totalPage
        }
        for (let i = start; i <= end; i++) {
          pageItems.push({
            index: i,
            active: i === pager.current
          })
        }
        scope.pageItems = pageItems
      }
      // 监听总页数变化，并及时重新渲染页码
      scope.$watch('pager.totalPage', (nv) => {
        scope.renderPager(nv)
      })
    }
  }
}