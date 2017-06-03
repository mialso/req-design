Vue.component('requirement', {
  template: `
    <li class="c-tree__item">
      <requirementText :text="item.text"></requirementText>
    </li>`,
  props: {
    item: Object,
  },
});
