// eslint-disable-next-line no-extra-semi, func-names
;(function (glob, Vue) {
  'use strict';

  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    template: `
      <div class="u-window-box--medium">
        <requirementList></requirementList>
        <errorNotifier></errorNotifier>
      </div>`,
    store: glob.reqAppStore,
  });
  delete glob.reqAppStore;
}(self, Vue));
