;(function (glob, module) {
  const app = {}
  let _reqData = null

  Object.defineProperty(app, 'reqList', {
    enumerable: false,
    configurable: false,
    get: function () {
      return _reqData
    },
    set: function (newData) {
      if (!Array.isArray(newData)) {
        throw new Error(`app.reqList.set(): newData is not array, but ${typeof newData}`)
      }
      _reqData = newData
      console.log(`new reqList: ${newData}`)
    }
  })

  window.onload = function() {
    console.log('app laj loaded')
    let request = new Request('/requirements/list', {method: 'GET'})
    fetch(request)
    .then((response) => {
      return response.json()
    })
    .then((jsonData) => {
      app.reqList = jsonData.reqList
    })
  }
})(window, 'app');
