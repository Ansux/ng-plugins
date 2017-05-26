module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    template: `<nav class="ng-pager" aria-label="Page navigation clearfix">
                <div class="page-size-select" ng-if="pager.hasPageSizeSelect">
                  <span>每页显示</span>
                  <select class="form-control input-sm" ng-model="pager.size" ng-change="changePageSize()">
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                  <span>条</span>
                </div>
                <ul class="pagination pull-right">
                  <li ng-class="{'disabled': pager.current===1}">
                    <a ng-click="changePage(pager.current-1)" aria-label="Previous">
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
              </nav>`,
    scope: {
      pager: '='
    },
    controller: ['$scope', ($scope) => {
      let scope = $scope
      // 切换分页
      scope.changePage = function (index) {
        // 不在正常页码，则return
        if (index < 1 || index > scope.pager.totalPage) {
          return
        }
        scope.pager.current = index
        angular.forEach(scope.pageItems, (v) => {
          v.active = (v.index === index)
        })
        scope.$emit('changePage')
      }
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