export default {
  methods: {
    successNotify(msg) {
      this.$q.notify({
        message: msg,
        position: "top",
        timeout: 3500,
        type: "positive",
        color: "positive",
        icon: "fas fa-check"
      });
    },
    errorNotify(msg) {
      this.$q.notify({
        message: msg,
        position: "top",
        group: true,
        timeout: 3500,
        type: "negative",
        color: "negative",
        icon: "fas fa-exclamation-triangle"
      });
    }
  }
};
