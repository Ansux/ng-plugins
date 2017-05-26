module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: `<div class="ng-select">
                <input type="text" class="form-control" ng-model="inputText" ng-focus="isOpened=true" ng-change="search && input()"/>
                <span class="indicator glyphicon" ng-class="{false:'glyphicon-triangle-bottom', true:'glyphicon-triangle-top'}[isOpened]"></span>
                <div class="options" ng-show="isOpened">
                  <ul ng-click="select($event)">
                    <li ng-repeat="option in filterOptions" data-val="{{option[valueField]}}" ng-class="{selected: option.selected}">{{option[textField]}}</li>
                  </ul>
                </div>
              </div>`,
    scope: {
      options: '=',
      value: '=',
      mapping: '@',
      search: '@'
    },
    link: (scope, ele, attrs) => {
      scope.mapping = scope.mapping ? scope.mapping.split(',') : ['id', 'title']
      // 数组字段
      scope.valueField = scope.mapping[0]
      // 文字字段
      scope.textField = scope.mapping[1]
      // 展开状态
      scope.isOpened = false

      // 设置input文字（并不是真实的value值）
      function setInputText(val) {
        angular.forEach(scope.options, (v, k) => {
          if (v[scope.valueField] === val) {
            v.selected = true
            scope.inputText = v[scope.textField]
          } else {
            v.selected = false
          }
        })
      }

      // 列表过滤
      function filter(val) {
        let tempArr = []
        angular.forEach(scope.options, (v, k) => {
          if (v[scope.textField].indexOf(val) > -1) {
            tempArr.push(v)
          }
        })
        return tempArr
      }

      // 输入框输入（用于搜索筛选）
      scope.input = function () {
        scope.filterOptions = filter(scope.inputText)
      }

      // 选择处理（事件委托）
      scope.select = (e) => {
        if (e.target.tagName === 'LI') {
          scope.value = isNaN(scope.value) ? scope.value : (e.target.getAttribute('data-val') - 0)
          scope.isOpened = false
          // 如果开启搜索功能，每次选择完毕后自动复位
          if (scope.search) {
            scope.filterOptions = filter('')
          }
        }
      }

      // 监听value
      scope.$watch('value', (nv) => {
        setInputText(nv)
      })

      // 列表初始化
      scope.filterOptions = scope.search ? filter('') : scope.options
    }
  }
}