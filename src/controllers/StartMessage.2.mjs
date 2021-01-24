export default Controller =>
  class extends Controller {
    connect () {
      if (0 <= document.cookie.indexOf('dontShowIntro=true')) return
      document.getElementById('modal-control').setAttribute('checked', '')
    }
    close () {
      console.log('close')
      if (document.getElementById('dont-show-anymore').checked)
        document.cookie = 'dontShowIntro=true'
      return true
    }
  } 
