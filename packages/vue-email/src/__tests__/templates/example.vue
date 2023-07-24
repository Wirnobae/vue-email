<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    show: Boolean,
    name: String,
  },
  methods: {
    do() {
      console.log('Doing...')
    }
  }
})
</script>

<template>
  <h1>Hi {{ name }}</h1>
</template>

<style>
h1 {
  font-size: 2rem;
}
</style>
