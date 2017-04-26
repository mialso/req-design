Vue.component('requirement', {
  template: `
    <li class="c-tree__item">
      <span>
        {{item.text}}
      </span>
    </li>`,
  props: {
    item: Object,
  },
});
