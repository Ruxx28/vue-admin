<template>
  <div >
    <div class="title-sidebar">
      <a-icon type="aliwangwang" />
      <span>Sunsay.io</span>
    </div>
    <a-menu :default-selected-keys="current" mode="inline">
      <a-menu-item key="Home">
        <nuxt-link to="/"
          ><a-icon type="dashboard" /><span>Thống kê</span></nuxt-link
        >
      </a-menu-item>
      <a-menu-item key="Products">
        <nuxt-link to="/products"
          ><a-icon type="appstore" /><span>Sản phẩm</span></nuxt-link
        >
      </a-menu-item>
      <a-menu-item key="Customers">
        <nuxt-link to="/customers"
          ><a-icon type="team" /><span>Khách hàng</span></nuxt-link
        >
      </a-menu-item>
      <a-menu-item key="Oders">
        <nuxt-link to="/oders"
          ><a-icon type="shopping" /><span>Đơn hàng</span></nuxt-link
        >
      </a-menu-item>
      <a-menu-item key="Supplier">
        <nuxt-link to="/suppliers"
          ><a-icon type="shop" /><span>Nhà cung cấp</span></nuxt-link
        >
      </a-menu-item>
      <a-menu-item key="Assets">
        <nuxt-link to="/assets"
          ><a-icon type="solution" /><span>Chi phí phát sinh</span></nuxt-link
        >
      </a-menu-item>
      <a-menu-item key="Settings">
        <nuxt-link to="/settings"
          ><a-icon type="setting" /><span>Tùy chỉnh</span></nuxt-link
        >
      </a-menu-item>
    </a-menu>
    <div class="footer-sidebar display-inline bg-light">
      <!-- <a-popover placement="topLeft">
        <template slot="content">
          <div>Đã xóa khách hàng 1</div>
          <div>Đã xóa khách hàng 1</div>
        </template>
        <a-button class="float-right mt-2" size="small" type="link">
          <b-icon icon="bell" font-scale="1.3" />
        </a-button>
      </a-popover> -->
      
      <a-popover placement="topRight">
        <template slot="content">
          <a href="/auth" class="h7-title" @click="removeAll">
            <a-icon type="logout" class="y-icon" /> logout
          </a>
        </template>
        <a-button class="p-0" type="link">
          <!-- <span v-if="!$device.isMobile" class="h7-title">
            <a-avatar src="/img/avatar.png" />
            {{ $store.state.user.username }}</span>
          <a-avatar v-else src="/img/avatar.png" /> -->
        </a-button>
      </a-popover>
    </div>
  </div>
</template>
<script>
export default {
  props: [''],
  computed: {
    current() {
      return [`${this.$route.name}`];
    },
  },
  methods: {
    removeAll() {
      this.$cookies.removeAll();
      this.$store.commit("remove");
    },
  },
};
</script>
