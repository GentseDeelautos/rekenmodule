export default Controller => {
  class StartMessageController extends Controller {
    connect () {
      if (0 <= document.cookie.indexOf('dontShowIntro=true')) return
      this.modalVisibilityCheckBoxTarget.setAttribute('checked', '')
    }
    close () {
      document.cookie = `dontShowIntro=${this.dontShowAnymoreCheckBoxTarget.checked}`
      return true
    }
  } 
  StartMessageController.targets = ['dontShowAnymoreCheckBox', 'modalVisibilityCheckBox']

  return StartMessageController
}
