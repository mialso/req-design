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
        class="c-nav__item c-nav__item--info"
        v-bind:class="[currentView === 'requirementList' ? 'c-nav__item--active' : '']"
        v-on:click="changeView('requirementList')"
      >
        Requirements
      </div>
      <div
        class="c-nav__item c-nav__item--info"
        v-bind:class="[currentView === 'modelView' ? 'c-nav__item--active' : '']"
        v-on:click="changeView('modelView')"
      >
        Data model
      </div>
    </nav>`,
  computed: {
    currentView() {
      return this.$store.state.view.main;
    },
  },
  methods: {
    changeView(name) {
      this.$store.commit('setMainView', name);
    },
  },
});
