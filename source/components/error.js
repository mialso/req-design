Vue.component('errorNotifier', {
  template: `
    <div class="c-alerts c-alerts--bottomright" v-show="errors.length > 0">
      <div
        class="c-alert c-alert--error"
        v-for="error in errors"
        >
        <button
          class="c-button c-button--close"
          v-on:click.stop="removeAlert(error.message)"
          >
          x
        </button>
        <span class="c-badge">{{error.count}}</span>
        {{error.message}}
      </div>
    </div>`,
  computed: {
    errors() { return this.$store.getters.errorsArray; },
  },
  methods: {
    removeAlert(message) {
      this.$store.commit('cleanError', message);
    },
  },
});
