module.exports = () => {
  return {
    restrict: 'AE',
    replace: true,
    template: require('./index.html'),
    scope: {
      dateString: '@date'
    },
    link: (scope, ele) => {
      const now = scope.dateString ? parseISO8601(scope.dateString) : new Date()

      // 操作的年月日
      scope.year = now.getFullYear()
      scope.month = now.getMonth()
      scope.date = now.getDate()

      // 输入框中的日期
      scope.inputDate = {
        year: now.getFullYear(),
        month: now.getMonth(),
        date: now.getDate(),
      }

      // IE8时间转换器
      function parseISO8601(dateStringInRange) {
        let isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,
          date = new Date(NaN),
          month,
          parts = isoExp.exec(dateStringInRange)

        if (parts) {
          month = +parts[2]
          date.setFullYear(parts[1], month - 1, parts[3])
          if (month != date.getMonth() + 1) {
            date.setTime(NaN)
          }
        }
        return date
      }

      // 设置输入框日期
      function setInuptDateValue() {
        scope.inputDateString = `${scope.inputDate.year}-${(scope.inputDate.month + 1)}-${scope.inputDate.date}`
      }

      // 获取当前月的天数
      function getTotalDaysByMonth(year, month) {
        return (new Date(year, month + 1, 0)).getDate()
      }

      // 获取每个月第一天是星期几
      function getDayByMonth(year, month) {
        return (new Date(year, month, 1)).getDay()
      }

      // 计算列表
      function getDateItem(year, month) {
        let totalday = getTotalDaysByMonth(year, month)
        let firstDateDay = getDayByMonth(year, month)
        let lastMonthTotalDay = getTotalDaysByMonth(year, month - 1)

        let tempArr = []
        // 当前月份第一天是否是星期天
        if (firstDateDay > 0) {
          let start = lastMonthTotalDay - firstDateDay + 1
          for (; start <= lastMonthTotalDay; start++) {
            tempArr.push({
              year: year,
              month: month - 1,
              date: start
            })
          }
        }

        // 月份号码遍历
        for (let i = 1; i <= totalday; i++) {
          tempArr.push({
            year: year,
            month: month,
            date: i
          })
        }

        // 月份最后一天星期是否有空余
        let j = tempArr.length % 7
        if (j !== 0) {
          for (let k = 1, len = 7 - j; k <= len; k++) {
            tempArr.push({
              year: year,
              month: month + 1,
              date: k
            })
          }
        }

        let weekIndex = 0,
          weeks = []

        angular.forEach(tempArr, (v, k) => {
          weekIndex = parseInt(k / 7)
          if (!weeks[weekIndex]) {
            weeks[weekIndex] = []
          }
          weeks[weekIndex].push(v)
        })
        scope.weeks = weeks
      }

      // 点击其他地方隐藏
      angular.element(document).bind('click', (event) => {
        const e = event || window.event
        let element = e.target || e.srcElement
        while (element) {
          if (element === ele[0]) {
            return
          } else {
            element = element.parentNode
          }
        }
        scope.$apply(() => {
          scope.isOpened = false
        })
      })

      // 切换年份
      function changeYear(num) {
        scope.year += num
        getDateItem(scope.year, scope.month)
      }

      // 切换月份
      function changeMonth(num) {
        if (!((scope.month === 0 && num < 0) || (scope.month === 11 && num > 0))) {
          scope.month += num
        } else if (scope.month === 0 && num <= 0) {
          scope.year -= 1
          scope.month = 11
        } else {
          scope.year += 1
          scope.month = 0
        }
        getDateItem(scope.year, scope.month)
      }

      // 选择
      scope.selectDate = (day) => {
        if (day.month !== scope.month) {
          scope.changeMonth(day.month - scope.month)
        }
        scope.inputDate.year = day.year
        scope.inputDate.month = day.month
        scope.inputDate.date = day.date
        setInuptDateValue()
        scope.isOpened = false
      }

      // 显示
      scope.toggle = (e) => {
        scope.isOpened = !scope.isOpened
        if (!scope.isOpened) {
          e.target.blur()
        } else {
          scope.year = scope.inputDate.year
          scope.month = scope.inputDate.month
          scope.date = scope.inputDate.date
          getDateItem(scope.year, scope.month)
        }
      }

      // 
      scope.clickHandle = (e) => {
        const className = e.target.className
        const parentClassName = e.target.parentNode.className
        if (className === 'btn-pre-month' || parentClassName === 'btn-pre-month') {
          changeMonth(-1)
        } else if (className === 'btn-next-month' || parentClassName === 'btn-next-month') {
          changeMonth(1)
        } else if (className === 'btn-pre-year' || parentClassName === 'btn-pre-year') {
          changeYear(-1)
        } else if (className === 'btn-next-year' || parentClassName === 'btn-next-year') {
          changeYear(1)
        }
      }

      setInuptDateValue()
      getDateItem(scope.year, scope.month)
    }
  }
}