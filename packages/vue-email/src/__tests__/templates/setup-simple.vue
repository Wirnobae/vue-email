<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  setup(props) {
    const message = computed(() => `Welcome to my app ${props.name}`)

    return { message }
  }
})
</script>

<template>
  <h1>Hi {{ name }}</h1>
  <p>{{ message }}</p>
</template>

<style>
h1 {
  font-size: 2rem;
}
</style>
