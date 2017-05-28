Vue.component('topMenu', {
  template: `
    <nav class="c-nav c-nav--inline">
      <a class="c-nav__item c-text--loud" href="#">req app</a>
    </nav>`,
});
Vue.component('leftMenu', {
  template: `
    <nav class="c-nav c-nav--light o-panel">
      <leftMenuItem
        v-for="item in views"
        :key="item.id"
        :viewName="item.text"
        :viewId="item.id">
      </leftMenuItem>
    </nav>`,
  computed: {
    views() {
      return this.$store.getters.mainViews;
    },
  },
});
Vue.component('leftMenuItem', {
  template: `
    <div
      class="c-nav__item c-nav__item--info"
      v-bind:class="[currentView === viewId ? 'c-nav__item--active' : '']"
      v-on:click="changeView"
    >
      {{viewName}}
    </div>`,
  props: {
    viewName: {
      type: String,
      default: '',
      required: true,
    },
    viewId: {
      type: String,
      default: '',
      required: true,
    },
  },
  computed: {
    currentView() {
      return this.$store.state.view.main;
    },
  },
  methods: {
    changeView() {
      this.$store.commit('setMainView', this.viewId);
    },
  },
});
