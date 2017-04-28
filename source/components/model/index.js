Vue.component('modelView', {
  template: `
    <div class="model-view">
      <model_level v-for="item in modelItems" :items="item"></model_level>
    </div>`,
  computed: {
    modelItems() {
      return [];
    },
  },
});
