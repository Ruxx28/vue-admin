<template>
  <div class="container-fluid view-layout">
    <div class="row">
      <nav :class="state ? 'sidebar col p-0' : 'sidebar sidebar-small col p-0'">
        <menu-left/>
      </nav>
      <main class="col" :style="!state ? 'margin-left: 50px;': ''">
        <div class="btn-close-nav">
          <b-icon icon="list" font-scale="2" @click="closeNav"/>
        </div>
        <Nuxt/>
      </main>
    </div>
  </div>
</template>
<script>
import menuLeft from "components/layout/MenuLeft.vue";
export default {
  data() {
    return {
      state: !this.$device.isMobile ? true : false
    };
  },
  computed: {
    /* current() {
      if (this.$device.isMobile) {
        console.log("Layout mobile");
      } else if (this.$device.isTablet) {
        console.log("Layout tablet");
      } else {
        console.log("Layout desktop");
      }
      return ''
    }, */
  },
  components: {
    menuLeft,
  },
  methods: {
    closeNav(){
      if(this.state){
        this.state = false
      } else{
        this.state = true
      }
    }
  }
};
</script>