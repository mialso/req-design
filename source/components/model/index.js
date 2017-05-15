Vue.component('modelView', {
  template: `
    <div class="model-view c-tabs">
      <div class="c-tabs__headings">
        <div
          class="c-tab-heading"
          v-bind:class="[currentView === 'modelHtmlView' ? 'c-tab-heading--active' : '']"
          v-on:click="changeView('modelHtmlView')"
        >
          html view
        </div>
        <div
          class="c-tab-heading"
          v-bind:class="[currentView === 'modelCanvasView' ? 'c-tab-heading--active' : '']"
          v-on:click="changeView('modelCanvasView')"
        >
          canvas view
        </div>
      </div>
      <div class="c-tabs__tab c-tabs__tab--active">
        <dynamicView view="model"></dynamicView>
      </div>
    </div>`,
  beforeCreate() {
    this.$store.dispatch('getModelData');
  },
  data() {
    return {};
  },
  computed: {
    currentView() {
      return this.$store.getters.currentModelView;
    },
  },
  methods: {
    changeView(name) {
      this.$store.commit('setModelView', name);
    },
  },
});
