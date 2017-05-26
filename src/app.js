require('./directive')

angular.module('app', ['app.directive'])
  .controller('ctrl', ['$scope', '$timeout', ($scope, $timeout) => {
    // 下拉选项
    $scope.value = 1
    $scope.options = [{
      _id: 1,
      name: 'ansux'
    }, {
      _id: 2,
      name: 'jack'
    }, {
      _id: 3,
      name: 'dom'
    }, {
      _id: 4,
      name: 'sunny'
    }]

    // 弹出提示框
    $scope.alert = {}
    $scope.showAlert = (type) => {
      $scope.alert = {
        status: true,
        type: type,
        info: '警告警告啊。'
      }
    }

    // 确认框
    $scope.confirm = false
    $scope.showConfirm = () => {
      $scope.confirm = true
    }
    $scope.$on('confirmOk', (event) => {
      $scope.confirm = false
      console.log('ok')
    })

    // 模态框
    $scope.modal = {}
    $scope.showModal = () => {
      $scope.modal = {
        size: 'lg',
        title: '新病例',
        show: true
      }
    }

    // Loading
    $scope.showLoading = () => {
      $scope.isLoading = true
      $timeout(() => {
        $scope.isLoading = false
      }, 2000)
    }

    // pager
    $scope.pager = {
      current: 1,
      size: 5,
      totalPage: 3,
      hasPageSizeSelect: true
    }
  }])

// Render App
angular.bootstrap(document, ['app'])