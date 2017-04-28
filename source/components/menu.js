Vue.component('topMenu', {
  template: `
    <nav class="c-nav c-nav--inline">
      <a class="c-nav__item c-text--loud" href="#">req app</a>
    </nav>`,
});
Vue.component('leftMenu', {
  template: `
    <nav class="c-nav c-nav--light o-panel">
      <div
        v-on:click="changeView('requirementList')"
        class="c-nav__item">
        Requirements
      </div>
      <div
        class="c-nav__item"
        v-on:click="changeView('modelView')">
        Data model
      </div>
    </nav>`,
  methods: {
    changeView(name) {
      this.$store.commit('setCurrentView', name);
    },
  },
});
