Vue.component('model_view', {
  template: `
    <div>
      <model_level v-for="item in items" items="item"></model_level>
    </div>`,
  props: {
    levels: {
      type: Array,
      default: [],
    },
  },
});
