Vue.component('modelCanvasView', {
  template: `
    <div style="height: 100%;">
      <canvas style="width: 100%; height: 100%"></canvas>
    </div>`,
  data() {
    return {
      cW: 0,
      cH: 0,
    };
  },
  mounted() {
    this.cW = this.$el.clientWidth - 1;
    this.cH = this.$el.clientHeight - 1;
    this.$store.commit(
      'setModelCanvasElement',
      {
        canvas: this.$el.children[0],
        width: this.cW,
        height: this.cH,
      });
  },
  computed: {
  },
  methods: {
  },
});
