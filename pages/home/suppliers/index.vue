<template>
  <div class="w-100">
    <a-page-header class="px-0" :title="title" sub-title="Danh sách nhà cung cấp"/>
    <Fillter css='d-inline-block' v-on:eventFillter="fillterRow"/>
    <a-button class="float-end mt-1" type="primary" @click="addRow">
      <a-icon type="plus" />
      <span>Nhà cung cấp</span>
    </a-button>
    <div class="clearfix">
      <Table nameData="producers"
        :columns="columns" 
        :dataSource="producers" 
        bordered
        :childElement="['webPage']"
        v-on:eventEdit="editRow"
        v-on:eventDelete="(e)=>{ producers.splice(e.index, 1); }" />
    </div>    
    <a-modal :title="isAdd ? 'Thêm mới sản phẩm':'Chỉnh sửa sản phẩm'"
      :visible="isModal"
      ok-text="Đồng ý" cancel-text="Hủy"
      @ok="handleSubmit" @cancel="()=>{isModal=false}" >
      <template>
        <a-form :form="form"  @submit="handleSubmit">
          <div class="row">
            <div class="col-6 custom-label">
              <a-form-item label="Tên sản phẩm">
                <a-input v-decorator="['name']" placeholder="Tên sản phẩm" />
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Số điện thoại">
                <a-input  v-decorator="['phone']" placeholder="09..."/>
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Địa chỉ">
                <a-input v-decorator="['address']" placeholder="" />
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Website">
                <a-input v-decorator="['webPage']" placeholder="https//..."/>
              </a-form-item>
            </div>
            <div class="col-12 custom-label">
              <a-form-item label="Mô tả">
                <a-textarea v-decorator="['note']" placeholder="..." 
                  :auto-size="{ minRows: 3, maxRows: 5 }" allowClear />
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
  title: "Tên nhà cung cấp",
  dataIndex: "name",
  key: "name",
  ellipsis: true,
  },{
  title: "Số điện thoại",
  dataIndex: "phone",
  key: "phone",
  ellipsis: true,
  },{
  title: "Địa chỉ",
  dataIndex: "address",
  key: "address",
  ellipsis: true,
  },{
  title: "Website",
  dataIndex: "webPage",
  key: "webPage",
  scopedSlots: { customRender: "webPage" },
  ellipsis: true,
  },{
  title: "Mô tả",
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
  },];
const columnsSM = [{
  title: "Tên nhà cung cấp",
  dataIndex: "name",
  key: "name",
  ellipsis: true,
  width: 150},
  columns[3],
  columns[5]
]
import Fillter from 'components/table/fillter'
import Table from "components/table";
export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get("/api/producers");
    return { producers: data };
  },
  components: { Fillter, Table}, 
  data() {
    return {
      title: 'Nhà cung cấp',
      columns: this.$device.isMobile ? columnsSM : columns,
      form: this.$form.createForm(this),
      isAdd: false,
      isModal: false,
      indexTemp: '',
    };
  },
  methods: {
    fillterRow(e){
      this.$axios.post("/api/producers",{'name':{$regex:`${e}`,$options:'$i'}}).then((res)=>{
        res.data.forEach((e)=>{
          e.cost = String(e.cost).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          e.price = String(e.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        })
        this.producers = res.data
      })
    },
    editRow(e) {
      this.isAdd = false; 
      this.isModal = true
      this.indexTemp = this.producers.findIndex(item => item._id == e._id)
      let temp = this.producers[this.indexTemp]
      this.$nextTick(() => {
        this.form.setFieldsValue({
          name: temp.name,
          phone: temp.phone,
          address: temp.address,
          webPage: temp.webPage,
          note: temp.note,
        })
      })
    },
    addRow() {
      this.isModal = true, 
      this.isAdd = true; 
      this.$nextTick(() => {
        this.form.setFieldsValue({
          "name": '',
          "phone": '',
          "address": '',
          "webPage": '',
          "note": '',
        })
      })
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if(this.isAdd) {
            this.$axios.$put('/api/producers',values).then(res => {
              this.producers.push(res)
              this.isModal = false, this.isAdd = false
            }).catch(e => {
              console.log(e);
            })}
          else {
            this.$axios.$patch(`/api/products/${this.producers[this.indexTemp]._id}`,values).then(res=>{
              this.producers[this.indexTemp].name = res.name
              this.producers[this.indexTemp].phone = res.phone
              this.producers[this.indexTemp].address = res.address
              this.producers[this.indexTemp].webPage = res.webPage
              this.producers[this.indexTemp].note = res.note
              this.isModal = false, this.isAdd = false
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