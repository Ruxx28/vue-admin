<template>
  <div class="w-100">
    <a-page-header class="px-0" :title="title" sub-title="Danh sách tất cả khách hàng"/>
    <Fillter css='d-inline-block' v-on:eventFillter="fillterRow"/>
    <a-button class="float-end mt-1" type="primary" @click="addRow">
      <a-icon type="plus" />
      <span>Khách hàng</span>
    </a-button>
    <div class="clearfix">
      <Table nameData="customers"
        :columns="columns" 
        :dataSource="customers"
        :childElement="['link']"
        bordered
        v-on:eventEdit="editRow"
        v-on:eventDelete="(e)=>{ customers.splice(e.index, 1); }" />
    </div>
    <a-modal :title="isAdd?'Thêm mới':'Chỉnh sửa'"
      :visible="isModal"
      ok-text="Đồng ý" cancel-text="Hủy"
      @ok="handleSubmit" @cancel="()=>{isModal=false}" >
      <template>
        <a-form :form="form"  @submit="handleSubmit">
          <div class="row">
            <div class="col-6 custom-label">
              <a-form-item label="Tên khách hàng">
                <a-input v-decorator="['name']" placeholder="Tên khách hàng" />
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Số điện thoại">
                <a-input v-decorator="['phone']" placeholder="Số điện thoại" />
              </a-form-item>
            </div>
            <div class="col-12 custom-label">
              <a-form-item label="Địa chỉ">
                <a-textarea v-decorator="['address']" placeholder="50 Bình chánh.."
                  :auto-size="{ minRows: 3, maxRows: 5 }" allowClear />
              </a-form-item>
            </div>
            <div class="col-12 custom-label">
              <a-form-item label="Ghi chú">
                <a-input v-decorator="['note']" placeholder="Ghi chú" />
              </a-form-item>
            </div>
          </div>
        </a-form>
      </template>
    </a-modal>
  </div>
</template>
<script>
const columns = [{
  title: "Tên khách hàng",
  dataIndex: "name",
  key: "name",
  scopedSlots: { customRender: "nameCustom" },
  ellipsis: true,
  
  },{
  title: "Số điện thoại",
  dataIndex: "phone",
  key: "phone",
  ellipsis: true,
  width: 110
  },{
  title: "Địa chỉ",
  dataIndex: "address",
  key: "address",
  ellipsis: true,
  },{
  title: "Ghi chú",
  dataIndex: "note",
  key: "note",
  ellipsis: true,
  },{
  title: "Hành động",
  dataIndex: "_id",
  key: "_id",
  scopedSlots: { customRender: "_id" },
  width: 90,
  ellipsis: true,
  }];
const columnsSM = [
  columns[0],
  columns[1],
  columns[4]
]
import Fillter from 'components/table/fillter'
import Table from "components/table";
export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get("/api/customers");
    return { customers: data };
  },
  components: { Fillter, Table}, 
  data() {
    return {
      title: 'Khách hàng',
      columns: this.$device.isMobile ? columnsSM : columns,
      form: this.$form.createForm(this),
      isAdd: false,
      isModal: false,
      indexTemp: '',
    };
  },
  methods: {
    fillterRow(e){
      this.$axios.post("/api/customers",{'name':{$regex:`${e}`,$options:'$i'}}).then((res)=>{
        this.customers = res.data
      })
    },
    editRow(e) {
      this.isAdd = false; 
      this.isModal = true
      this.indexTemp = this.customers.findIndex(item => item._id == e._id)
      let temp = this.customers[this.indexTemp]
      this.form.setFieldsValue({
        name: temp.name, 
        phone: temp.phone, 
        address: temp.address, 
        note: temp.note,
      })
    },
    addRow() {
      this.isModal = true
      this.isAdd = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          "name": "",
          "phone": '',
          "address": '',
          "note": ''
        })
      })
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if(this.isAdd) {
            this.$axios.$put('/api/customers',values).then(res => {
              this.customers.push(res)
              this.isModal = false; this.isAdd = false;
            }).catch(e => {
              console.log(e);
            })} 
          else {
            this.$axios.$patch(`/api/customers/${this.customers[this.indexTemp]._id}`,values)
            .then(res => {
              this.customers[this.indexTemp].name = res.name
              this.customers[this.indexTemp].phone = res.phone
              this.customers[this.indexTemp].address = res.address
              this.customers[this.indexTemp].note = res.note
              this.isModal = false; this.isAdd = false;
            }).catch(e => {
              console.log(e);
            })
          }
        }
      });
    },
  },
};
</script>