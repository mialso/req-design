Vue.component('dynamicView', {
  functional: true,
  render(createElement, context) {
    return createElement(context.parent.$store.state.view[context.data.attrs.view]);
  },
});
