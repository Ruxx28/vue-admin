<template>
  <div class="w-100">
    <a-page-header class="px-0" :title="title" sub-title="Danh sách các thành viên">
      <div class="container-fluid p-0">
        <div class="row">
          <div class="col-sm-auto"><a-statistic class="mr-3" title="Tất cả chi" :value="assets.a1"/></div>
          <div class="col-sm-auto"><a-statistic class="mr-3" title="Tất cả nhận" :value="assets.a2"/></div>
          <div class="col-auto"></div>
        </div>
      </div>
    </a-page-header>
    <Fillter css='d-inline-block' v-on:eventFillter="fillterRow"/>
    <a-button class="float-end mt-1" type="primary" @click="addRow">
      <a-icon type="plus" />
      <span>Thành viên</span>
    </a-button>
    <div class="clearfix">
       <Table nameData="users"
        :columns="columns" 
        :dataSource="users"
        :childElement="['link']"
        bordered
        v-on:eventEdit="editRow"
        v-on:eventDelete="(e)=>{ users.splice(e.index, 1); }"/>
    </div>
    <a-modal :title="isAdd?'Thêm mới':'Chỉnh sửa'"
      :visible="isModal"
      ok-text="Đồng ý" cancel-text="Hủy"
      @ok="handleSubmit" @cancel="()=>{isModal=false}">
      <template>
        <a-form :form="form" @submit="handleSubmit">
          <div class="row">
            <div class="col-6 custom-label">
              <a-form-item label="Họ và tên">
                <a-input v-decorator="['name']" placeholder="Họ tên đầy đủ"/>
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Số điện thoại">
                <a-input v-decorator="['phone']" placeholder="Số điện thoại"/>
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Vai trò">
               <a-input v-decorator="['tag']" disabled/>
              </a-form-item>
            </div>
            <div class="col-12 custom-label">
              <a-form-item label="Ghi chú">
                <a-textarea
                  v-decorator="['note']" placeholder="..."
                    :auto-size="{ minRows: 3, maxRows: 5 }" allowClear
                  />
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
  title: 'Ngày tạo',
  dataIndex: 'dateCreate',
  key: "dateCreate",
  ellipsis: true,
  },{
  title: 'Họ và tên',
  dataIndex: 'name',
  key: "name",
  ellipsis: true,
  scopedSlots: { customRender: "nameCustom" },
  },{
  title: 'Số điện thoại',
  dataIndex: 'phone',
  key: "phone",
  ellipsis: true,
  },{
  title: 'Nhãn',
  dataIndex: 'tag',
  key: "tag",
  ellipsis: true,
  },{
  title: 'Chi phí',
  dataIndex: 'spending',
  key: "spending",
  ellipsis: true,
  width: 90
  },{
  title: 'Ghi chú',
  dataIndex: 'note',
  key: "note",
  ellipsis: true,
  },{
  title: 'Hành động',
  dataIndex: '_id',
  key: "_id",
  ellipsis: true,
  width: 90,
  scopedSlots: { customRender: "_id" },
  },];
const columnsSM = [
  columns[1],
  columns[4],
  columns[6]]
import moment from "moment";
import Fillter from 'components/table/fillter'
import Table from "components/table";
export default {
  async asyncData({ $axios }) {
    const u = await $axios.$get(`/api/users`);
    const a = await $axios.$get(`/api/assets`);
    let view = {a1: 0, a2: 0}
    u.forEach((e) => (
      e.dateCreate = moment(e.dateCreate).format("DD/MM/YYYY"),
      e.spending = String(e.spending).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    ));
    a.forEach((e) => {
      if(e.type == 'Chi'){
        view.a1 += e.price
      } else{
        view.a2 += e.price
      }
    })
    return { assets: view, users : u};
  },
  components: { Fillter, Table}, 
  data() {
    return {
      title: "Chi phí phát sinh",
      columns: this.$device.isMobile ? columnsSM : columns,
      formatDate: "DD/MM/YYYY",
      form: this.$form.createForm(this),
      isAdd: false,
      isModal: false,
      indexTemp: "",
    };
  },
  methods: {
    fillterRow(){
      this.$axios.post("/api/users",{'name':{$regex:`${e}`,$options:'$i'}}).then((res)=>{
        this.users = res.data
      })
    },
    addRow(){
      this.isModal = true;
      this.isAdd = true;
      this.$nextTick(() => {
        this.form.setFieldsValue({
          "name": "","phone": "","tag": "","note":""
        });
      });
    },
    editRow(e){
      /* if(e.tag === "Chủ cửa hàng"){
        this.$message.info("Bạn không thể thay đổi nội dụng này")
        return
      } */
      this.isAdd = false
      this.isModal = true;
      this.$nextTick(() => {
        this.indexTemp = this.users.findIndex((item) => item._id == e._id);
        let temp = this.users[this.indexTemp];
        this.form.setFieldsValue({
          name: temp.name,
          phone: temp.phone,
          tag: temp.tag,
          note: temp.note
        });
      });
    },
    handleSubmit(e){
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.isAdd) {
            this.$axios.$put("/api/users", values).then((res) => {
              res.dateCreate = moment(res.dateCreate).format("DD/MM/YYYY")
              this.users.push(res);
              this.isModal = false; this.isAdd = false;
            }).catch((e) => {
              console.log(e);
            });
          } else {
            this.$axios
              .$patch(`/api/users/${this.users[this.indexTemp]._id}`, values).then((res) => {
                this.users[this.indexTemp].name = res.name
                this.users[this.indexTemp].phone = res.phone
                this.users[this.indexTemp].tag = res.tag
                this.users[this.indexTemp].note = res.note
                this.isModal = false; this.isAdd = false;
              }).catch((e) => {
                console.log(e);
              });
          }
        }
      });
    },
  }
};
</script>