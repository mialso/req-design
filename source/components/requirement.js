Vue.component('requirement', {
  template: `
    <li 
      v-on:click.stop="handleClick"
      class="c-tree__item" :class="[expanded ? expandedClass : expandableClass]"
      >
      <span class="c-link c-link--warning">{{reqName}}</span>
      <ul class="c-tree" v-show="expanded && items.length > 0"  v-for="subReq in items">
        <li class="c-tree__item">
          <span>{{subReq}}</span>
        </li>
      </ul>
    </li>`,
  props: {
    items: {
      type: Array,
      default: [],
    },
    reqName: String,
  },
  // eslint-disable-next-line object-shorthand, func-names
  data: function () {
    return {
      expanded: false,
      expandedClass: 'c-tree__item--expanded',
      expandableClass: 'c-tree__item--expandable',
    };
  },
  methods: {
    handleClick() {
      this.expanded = !this.expanded;
    },
    expand() {
      this.expanded = true;
    },
    close() {
      this.expanded = false;
    },
  },
});
