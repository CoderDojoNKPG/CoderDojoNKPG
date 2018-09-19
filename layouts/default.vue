<template>
  <div>
    <nav/>

    <nuxt/>

    <footer/>
  </div>
</template>

<script>
import Nav from '~/components/nav.vue'
import Footer from '~/components/footer.vue'

export default {
  components: {
    Nav,
		Footer
  }
}
</script>
