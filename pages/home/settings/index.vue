<template>
  <div class="w-100">
    <a-page-header class="px-0" :title="title" sub-title="Thông tin chi tiết cửa hàng" />
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-md-6">
          <a-switch v-model="isEdit" size="small" class="mb-2"/>
          <div class="h6-title d-inline-block">Thông tin cửa hàng</div>
          <a-form-model :model="settings">
            <div class="container-fluid p-0">
              <div class="row">
                <div class="col-sm-6 custom-label">
                  <a-form-model-item label="Tên cửa hàng">
                    <a-input placeholder="Nhập tên cửa hàng của bạn" 
                    :v-model="settings == {} ? '' : settings.nameShop" :disabled="!isEdit"/>
                  </a-form-model-item>
                </div>
                <div class="col-sm-6 custom-label">
                  <a-form-model-item label="Số điện thoại">
                    <a-input placeholder="" 
                    :v-model="settings == {} ? '' : settings.phone" :disabled="!isEdit"/>
                  </a-form-model-item>
                </div>
                <div class="col-sm-6 custom-label">
                  <a-form-model-item label="Địa chỉ">
                    <a-input placeholder="" 
                    :v-model="settings == {} ? '' : settings.address" :disabled="!isEdit"/>
                  </a-form-model-item>
                </div>
                <div class="col-sm-6 custom-label">
                  <a-form-model-item label="Vốn ban đầu">
                    <a-input-number class="w-100"
                    :min="0" :disabled="!isEdit"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    :v-model="settings == {} ? '' : settings.startCost"/>
                  </a-form-model-item>
                </div>
                <div class="col-sm-6 custom-label">
                  <a-form-model-item label="Phí giao dịch shoppe">
                    <a-input-number class="w-100"
                      :min="0" :max="100" :disabled="!isEdit"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      :v-model="settings == {} ? '' : settings.feesShoppe"/>
                  </a-form-model-item>
                </div>
                <div class="col-12 custom-label">
                  <a-form-model-item>
                    <a-button type="wanring" @click="onSubmit" :disabled="!isEdit">Cập nhật</a-button>
                  </a-form-model-item>
                </div>
              </div>
            </div>
          </a-form-model>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get("/api/settings");
    return { settings: data.length == 0 ? {} : data[0], status: data.length == 0 };
  },
  data() {
    return {
      title: "Tùy chỉnh",
      isEdit: false
    };
  },
  methods: {
    onSubmit() {
      let value = {
        nameShop: this.settings.nameShop,
        phone: this.settings.phone,
        address: this.settings.address,
        startCost: this.settings.startCost,
        feesShoppe: this.settings.feesShoppe
      }
      if(this.status){
        this.$axios.$put(`/api/settings`, value).then(res=>{
          this.$message.success( `Đã cập nhật thông tin cửa hàng`, 5,);
        })
      } else{
        this.$axios.$patch(`/api/settings/${this.settings._id}`, value).then(res=>{
          this.$message.success( `Đã cập nhật thông tin cửa hàng`, 5,);
        })
      }
    },
  }
};
</script>