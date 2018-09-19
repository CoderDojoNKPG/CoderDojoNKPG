<template>
  <div>
    <layout-nav/>

    <nuxt/>

    <layout-footer/>
  </div>
</template>

<script>
import LayoutNav from '~/components/nav.vue'
import LayoutFooter from '~/components/footer.vue'

export default {
  components: {
    LayoutNav,
		LayoutFooter
  }
}
</script>
