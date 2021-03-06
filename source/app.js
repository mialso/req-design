// eslint-disable-next-line no-extra-semi, func-names
;(function (glob, Vue) {
  'use strict';

  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    template: `
      <div>
        <topMenu></topMenu>
        <div class="o-grid o-panel o-panel--nav-top">
          <div class="o-grid__cell--width-15 o-panel-container">
            <leftMenu></leftMenu>
          </div>
          <div class="o-grid__cell o-panel-container">
            <div class="o-panel u-window-box--medium">
              <dynamicView view="main"></dynamicView>
            </div>
          </div>
        </div>
        <errorNotifier></errorNotifier>
        <inlineMenu v-if="inlineMenuText"></inlineMenu>
      </div>`,
    store: glob.reqAppStore,
    computed: {
      inlineMenuText() {
        return this.$store.getters.inlineMenu.text;
      },
    },
  });
  delete glob.reqAppStore;
}(self, Vue));
