Vue.component('model_level', {
  template: `
    <div>
      <model_type v-for="item in items" name="item.name"></model_type>
    </div>`,
  props: {
    items: {
      type: Array,
      default: [],
    },
  },
});
