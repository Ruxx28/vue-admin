<template>
  <div class="w-100">
    <a-page-header class="px-0"  
    @back="() => $router.go(-1)" 
    :title="title" sub-title="Danh sách chi và nhận của thành viên"/>
    <div class="row">
      <div class="col-lg-3">
        <a-card class="w-100 border-0 shadow-sm my-2">
          <h6>Thông tin thành viên</h6>
          <p>{{user.name}}</p>
          <p>{{user.phone}}</p>
          <p>{{user.tag}}</p>
          <p>{{user.note}}</p>
          <div :style="{ display: 'flex', width: 'max-content', justifyContent: 'flex-end', }" >
            <a-statistic title="Tất cả" :value="viewSpending.allSpending" :style="{ marginRight: '32px',  }"  />
            <a-statistic title="Còn lại" :value="viewSpending.spending" />
          </div>
        </a-card>
      </div>
      <div class="col-lg-9">
        <Fillter css='d-inline-block' v-on:eventFillter="fillterRow"/>
        <div class="float-end mt-1">
          <a-button @click="addReceiversType" v-if="!$device.isMobile">Trả phí nhanh</a-button>
          <a-button type="primary" @click="addRow">
            <a-icon type="plus" />
            <span>Phí phát sinh</span>
          </a-button>
        </div>
        <div class="clearfix">
          <Table nameData="assets"
            :columns="columns" 
            :dataSource="assets"
            bordered
            v-on:eventEdit="editRow"
            v-on:eventDelete="deleteRow"/>
        </div>
      </div>
    </div>
    <a-modal :title="isAdd?'Thêm mới':'Chỉnh sửa'"
      :visible="isModal"
      ok-text="Đồng ý" cancel-text="Hủy"
      @ok="handleSubmit" @cancel="()=>{isModal=false}">
      <template>
        <a-form :form="form" @submit="handleSubmit">
          <div class="row">
            <div class="col-6 custom-label">
              <a-form-item label="Loại">
                <a-select v-decorator="['type']" :disabled="isAdd == false">
                    <a-select-option v-for="i in ['Chi','Nhận']"  :key="i">
                      {{ i }}
                    </a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Số tiền">
                <a-input-number step="10000" class="w-100" :min="1000" :disabled="isAdd == false"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  v-decorator="['price']" placeholder=""/>
              </a-form-item>
            </div>
            <div class="col-6 custom-label">
              <a-form-item label="Tiêu đề">
                <a-input v-decorator="['name', { rules: [{ required: true, message: 'Cần phải có tiêu đề đấy !' }] }]" placeholder="Tiêu đề để tiện tìm kiếm sau này"/>
              </a-form-item>
            </div>
            <div class="col-12 custom-label">
              <a-form-item label="Nội dung">
                <a-textarea v-decorator="['note']" placeholder="..."
                  :auto-size="{ minRows: 3, maxRows: 5 }" allowClear/>
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
  title: 'Ngày',
  dataIndex: 'dateCreate',
  key: "dateCreate",
  ellipsis: true,
  },{
  title: 'Loại',
  dataIndex: 'type',
  key: "type",
  ellipsis: true,
  },{
  title: 'Tiêu đề',
  dataIndex: 'name',
  key: "name",
  width: '150px'
  },{
  title: 'Tiền chi',
  dataIndex: 'price',
  key: "price",
  ellipsis: true,
  width: 100
  },{
  title: 'Nội dung',
  dataIndex: 'note',
  key: "note",
  ellipsis: true,
  },{
  title: 'Hành động',
  dataIndex: '_id',
  key: "_id",
  scopedSlots: { customRender: "_id" },
  ellipsis: true,
  width: 90
  },
];
const columnsSM = [{
  title: 'Ngày tạo',
  dataIndex: 'dateCreate',
  key: "dateCreate",
  width: 70},
  columns[3],
  columns[5]
]
import moment from "moment";
import Fillter from 'components/table/fillter'
import Table from "components/table";
export default {
  async asyncData({ $axios, params }) {
    const u = await $axios.$get(`/api/users/${params._id}`);
    const a = await $axios.$get(`/api/assets?user._id=${params._id}`);
    let view = {spending: 0, allSpending: 0}
    view.spending = String(u[0].spending).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    a.forEach((e) => {
      if(e.type=="Chi"){ view.allSpending += e.price }
      e.dateCreate = moment(e.dateCreate).format("DD/MM/YYYY")
      e.price = String(e.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    })
    view.allSpending = String(view.allSpending).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return { assets: a, user: u[0], viewSpending: view };
  },
  components: { Fillter, Table}, 
  data() {
    return {
      title: "Chi tiết phí phát sinh",
      columns: this.$device.isMobile ? columnsSM : columns,
      formatDate: "DD/MM/YYYY",
      form: this.$form.createForm(this),
      isAdd: false,
      isModal: false,
      indexTemp: "",
    };
  },
  methods: {
    reloadData(){
      this.$axios.$get(`/api/users/${this.user._id}`).then(res=>{
        this.user = res[0]
        this.viewSpending.spending = String(res[0].spending).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      })
      let newData = 0
      this.assets.forEach(e => {
        if(e.type=="Chi")
        { newData += parseInt(e.price.replace(/\$\s?|(,*)/g, ''))}})
      this.viewSpending.allSpending = String(newData).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    fillterRow(){
      this.$axios.post("/api/assets",{'name':{$regex:`${e}`,$options:'$i'}}).then((res)=>{
        res.data.forEach((e)=>{
          e.dateCreate = moment(e.dateCreate).format("DD/MM/YYYY")
          e.price = String(e.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        })
        this.assets = res.data
      })
    },
    addReceiversType(){
      const is = this
      let spending = is.viewSpending.spending
      const values = {
          "user": is.user,
          "type": "Nhận",
          "name": "Thêm nhanh",
          "price": `${parseInt(spending.replace(/\$\s?|(,*)/g, ''))}`,
          "note": ""
      }
      is.$confirm({
        title: 'Bạn có muốn trả nhanh tất cả chi phí ?',
        content: h => <div style="color:red;">Chi phí cần thanh toán: {spending}</div>,
        onOk() {
          is.$axios.$put("/api/assets", values).then((res) => {
            res.dateCreate = moment(res.dateCreate).format(is.formatDate)
            res.price = String(res.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            is.assets.push(res);
            let newData = {}
            if(res.type == "Nhận"){
              newData.spending = parseInt(is.user.spending)-parseInt(res.price.replace(/\$\s?|(,*)/g, ''))
              is.$axios.$patch(`/api/users/${is.user._id}`, newData)
              is.user.spending = newData.spending
            }
            is.reloadData()
          })
        },
        class: 'test',
      });
    },
    addRow(){
      this.isModal = true;
      this.isAdd = true;
      this.$nextTick(() => {
        this.form.setFieldsValue({
          "type": "Chi","name": "","price": "10000","note": ""
        });
      });
    },
    editRow(e){
      this.isAdd = false
      this.isModal = true;
      this.$nextTick(() => {
        this.indexTemp = this.assets.findIndex((item) => item._id == e._id);
        let temp = this.assets[this.indexTemp];
        this.form.setFieldsValue({
          type: temp.type,
          name: temp.name,
          price: parseInt(temp.price.replace(/\$\s?|(,*)/g, '')),
          note: temp.note,
        });
      });
    },
    deleteRow(e){
      let newData = {}
      if(e.type == "Chi"){
        newData.spending = parseInt(this.user.spending)-parseInt(e.price.replace(/\$\s?|(,*)/g, ''))
        this.$axios.$patch(`/api/users/${this.user._id}`, newData)
      } else if(e.type == "Nhận"){
        newData.spending = parseInt(this.user.spending)+parseInt(e.price.replace(/\$\s?|(,*)/g, ''))
        this.$axios.$patch(`/api/users/${this.user._id}`, newData)
      }
      this.assets.splice(e.index, 1);
      this.reloadData()
    },
    handleSubmit(e){
      e.preventDefault();
      this.form.validateFields((err, values) => {
        values.user = this.user
        if (!err) {
          if (this.isAdd) {
            this.$axios.$put("/api/assets", values).then((res) => {
              res.dateCreate = moment(res.dateCreate).format(this.formatDate)
              res.price = String(res.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              this.assets.unshift(res);
              let newData = {}
              if(res.type == "Chi"){
                newData.spending = parseInt(this.user.spending)+parseInt(res.price.replace(/\$\s?|(,*)/g, ''))
                this.$axios.$patch(`/api/users/${this.user._id}`, newData)
                this.user.spending = newData.spending
              } else if(res.type == "Nhận"){
                newData.spending = parseInt(this.user.spending)-parseInt(res.price.replace(/\$\s?|(,*)/g, ''))
                this.$axios.$patch(`/api/users/${this.user._id}`, newData)
                this.user.spending = newData.spending
              }
              this.isModal = false; this.isAdd = false;
              this.reloadData()
            }).catch((e) => {
              console.log(e);
            });
          } else {
            this.$axios.$patch(`/api/assets/${this.assets[this.indexTemp]._id}`, values)
              .then((res) => {
                this.assets[this.indexTemp].name = res.name
                this.assets[this.indexTemp].note = res.note
                this.assets[this.indexTemp].price = String(res.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.isModal = false; this.isAdd = false;
                this.reloadData()
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