Vue.component('model_type', {
  template: '<div>{{name}}</div>',
  props: {
    name: {
      type: String,
      default: 'unknown',
    },
  },
});
