<script>
import { defineComponent } from 'vue';
import ComponentSetup from './setup'

export default defineComponent({
  components: {
    ComponentSetup,
  },
  props: {
    show: Boolean,
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
