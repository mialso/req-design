Vue.component('requirement', {
  template: `
    <div>
      <div>{{reqName}}</div>
      <div v-for="subReq in items">
        <span>{{subReq}}</span>
      </div>
    </div>`,
  props: {
    items: Array,
    reqName: String,
  },
});
