module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    template: `<div class="ng-select">
                <input type="text" class="form-control" ng-model="inputText" ng-click="toggle($event)" ng-change="search && input()"/>
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
    link: (scope, ele) => {
      scope.mapping = scope.mapping ? scope.mapping.split(',') : ['id', 'title']
      // 数组字段
      scope.valueField = scope.mapping[0]
      // 文字字段
      scope.textField = scope.mapping[1]
      // 展开状态
      scope.isOpened = false
      scope.toggle = (e) => {
        if (scope.isOpened) {
          e.target.blur()
        }
        scope.isOpened = !scope.isOpened
        // 绑定、解除关闭事件
        if (scope.isOpened === true) {
          angular.element(document).bind('click', hide)
        } else {
          angular.element(document).unbind('click', hide)
        }
      }

      // 点击其他地方隐藏
      function hide(event) {
        const e = event || window.event
        let element = e.target || e.srcElement
        while (element) {
          if (element === ele[0]) {
            return
          } else {
            element = element.parentNode
          }
        }
        // 隐藏后更新视图，删除事件绑定
        scope.$apply(() => {
          scope.isOpened = false
        })
        angular.element(document).unbind('click', hide)
      }

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
          // 向父级广播
          scope.$emit('sizeChange', scope.value)
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