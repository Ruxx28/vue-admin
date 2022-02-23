<template>
  <div class="w-100">
    <a-page-header class="px-0"  
    @back="() => $router.go(-1)" 
    :title="title" sub-title="Thông tin chi tiết khách hàng">
      <template slot="tags" v-if="numberOder.run">
        <a-tag color="blue" v-if="!$device.isMobile">
          Cần xử lý
        </a-tag>
      </template>
      <a-row type="flex">
        <a-statistic title="Tổng tiền hàng" :value="numberOder.allTotal" />
        <a-statistic title="Hoàn thành" :value="numberOder.success" :style="{ margin: '0 32px', }"/>
        <a-statistic title="Thất bại" :value="numberOder.danger" />
      </a-row>
    </a-page-header>
    <div class="row">
      <div class="col-sm-3">
        <a-card class="w-100 border-0 shadow-sm my-2">
          <h6>Thông tin khách hàng</h6>
          <p>{{ customers.name}}</p>
          <p>{{ customers.phone}}</p>
          <p>{{ customers.address}}</p>
          <p>{{ customers.note}}</p>
          <a-button size="small">Cập nhật thông tin</a-button>
        </a-card>
      </div>
      <div class="col-sm-9">
        <Fillter css='d-inline-block' v-on:eventFillter="fillterRow"/>
        <a-button class="float-end mt-1" type="primary" @click="addRow">
          <a-icon type="plus" />
          <span>Đơn hàng</span>
        </a-button>
        <Table nameData="oders"
        :columns="columns" 
        :dataSource="oders" 
        bordered
        :childElement="['tags', 'viewRow']"
        v-on:eventView="viewRow"
        v-on:eventEdit="editRow"
        v-on:eventDelete="deleteRow"
        v-on:eventTag="openTagChange"
        />
      </div>
    </div>
    <ModalCustom :visible="isModal"
      disabled
      :dataItem="products"
      v-on:eventOk="handleSubmit"
      v-on:eventCancel="()=>{ isModal = false }"
      :title="isAdd ? 'Thêm mới' : 'Chỉnh sửa'"
      :formModal="formModal" :editData="editData"
      />
    <a-modal :visible="dataStatus.show" :title="dataStatus.title"
      ok-text="Đồng ý" cancel-text="Hủy"
      @ok="tagChange" @cancel="()=>{dataStatus.show = false}">
      <template>
        <a-form-model :form="dataStatus" @submit="tagChange">
          <div class="col-12 custom-label">
            <a-form-model-item label="Trạng thái" help="Đơn hàng hoàn thành sẽ ko được cập nhật nữa">
              <a-select v-model="dataStatus.value" :disabled="dataStatus.status == 'Hoàn thành'">
                <a-select-option v-for="i in [{name:'Hoàn thành'},{name:'Thất bại'}]" :key="i.name">
                  {{i.name}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
        </a-form-model>
      </template>
    </a-modal>
    <ModalSuccess :visible="dataView.show"
      v-on:eventCancel="()=>{ dataView.show = false }"
      :title="dataView.title"
      :content="dataView.content"
      />
  </div>
</template>
<script>
const columns = [{
  title: "Trạng thái",
  dataIndex: "status",
  key: "status",
  scopedSlots: { customRender: "tagsCustom" },
  ellipsis: true,
  },{
  title: "Ngày tạo",
  dataIndex: "dateCreate",
  key: "dateCreate",
  ellipsis: true,
  },{
  title: "Tổng tiền hàng",
  dataIndex: "totalPrice",
  key: "totalPrice",
  ellipsis: true,
  },{
  title: "Loại",
  dataIndex: "type",
  key: "type",
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
  },];
const columnsSM = [{
  title: "Trạng thái",
  dataIndex: "status",
  key: "status",
  scopedSlots: { customRender: "tagsCustom" },
  ellipsis: true,
  width: 50,},
  columns[1],
  columns[2],
  columns[4]
]
import moment from "moment";
import Fillter from 'components/table/fillter'
import Table from "components/table";
import ModalCustom from "components/modal/modalCustom";
import ModalSuccess from "components/modal/success";
export default {
  async asyncData({ $axios, params  }) {
    let c = await $axios.$get(`/api/customers/${params._id}`);
    let o =  await $axios.$get(`/api/oders?customer._id=${params._id}`)
    const p = await $axios.$get("/api/products");
    let i = {run: false, success: 0, danger: 0, allTotal: 0}
    o.forEach((e) => {
      if(e.status === 'Đang xử lý'){ i.run = true }
      if(e.status === 'Hoàn thành') {  
        i.allTotal += e.totalPrice; 
        i.success = i.success+1
      } else if(e.status === 'Thất bại'){ i.danger = i.danger+1 }
      e.dateCreate = moment(e.dateCreate).format("DD/MM/YYYY HH:mm")
      e.ship = String(e.ship).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      e.totalPrice = String(e.totalPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    })
    i.allTotal = String(i.allTotal).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return { customers: c, oders: o, numberOder: i, products: p};
  },
  components: { Fillter, Table,  ModalCustom, ModalSuccess }, 
  data() {
    return {
      title: 'Khách hàng',
      columns: this.$device.isMobile ? columnsSM : columns,
      formatDate: "DD/MM/YYYY HH:mm",
      form: this.$form.createForm(this),
      indexTemp: '',
      isAdd: false,
      isModal: false,
      formModal: {},
      editData: {},
      dataView: {},
      dataStatus: {}
    };
  },
  methods: {
    reloadAllStatus(){
      let i = {run: this.numberOder.run, success: 0, danger: 0}
      this.oders.forEach((e) => {
        if(e.status === 'Đang xử lý'){ i.run = true }
        else{i.run = false}
        if(e.status === 'Hoàn thành') {
          i.success = i.success+1
        } else if(e.status === 'Thất bại'){
          i.danger = i.danger+1
        }
      });
      this.numberOder = i
    },
    fillterRow(e){
      /* this.$axios.post("/api/oders",{'customer.name':{$regex:`${e}`,$options:'$i'}}).then((res)=>{
        res.data.forEach((e)=>{
          e.dateCreate = moment(e.dateCreate).format("this.formatDate),
          e.ship = String(e.ship).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          e.totalPrice = String(e.totalPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        })
        this.oders = res.data
      }) */
    },
    openTagChange(e){
      if(e.status == 'Hoàn thành') {
        this.$message.info('Bạn không thể thay đổi hóa đơn đã hoàn thành !') }
      else {
        if(e.status == 'Đang xử lý'){
         this.dataStatus = {
          show: true,
          title: e.dateCreate + ' - ' + e.customer.name,
          status: e.status,
          value: 'Hoàn thành',
          _id: e._id }}
        else{
          this.dataStatus = {
          show: true,
          title: e.dateCreate + ' - ' + e.customer.name,
          status: e.status,
          value: e.status,
          _id: e._id }}
      }
    },
    tagChange(){
      const newStatus = this.dataStatus.value
      if(newStatus == '' || newStatus == undefined){
        this.$message.info('Vui lòng chọn trạng thái !'); return }
      const _id = this.dataStatus._id
      const index = this.oders.findIndex((item) => item._id == _id);
      if(newStatus=='Hoàn thành'){
        this.oders[index].status = 'Hoàn thành'
        this.$axios.$patch(`/api/oders/${_id}`, {status: 'Hoàn thành'})
        let o = this.oders.find(i => i._id == _id)
        let temp = []
        o.product.forEach(e=>{
          let p = this.products.find(i => i._id == e._id)
          if(p.type == "product"){
            temp.push({id:e._id, quantity: p.quantity - e.quantity})
          } else{
            let i = true;
            do {
              this.products.forEach(a=>{
                if(a.sku == p.sku){
                  if(a.type == 'product'){
                    const c = temp.find(b=>b.id == a._id)
                    if(c){
                      const index = temp.findIndex(f=>f.id == a._id)
                      temp[index].quantity -= p.quantity*e.quantity
                    } else{
                      temp.push({id:a._id,quantity: a.quantity - (p.quantity*e.quantity)})
                    }
                    i = false
                  }
                }
              })
            }
            while (i);
          }
        })
        temp.forEach(x=>{
          const index = this.products.findIndex(g => g._id == x.id)
          this.products[index].quantity = x.quantity
          this.$axios.$patch(`/api/products/${x.id}`, {quantity: x.quantity})
        })
      } else if (newStatus=='Thất bại'){
        this.oders[index].status = 'Thất bại'
        this.$axios.$patch(`/api/oders/${_id}`, {status: 'Thất bại'})
        this.$message.error('Bạn vừa hủy một đơn hàng');
      }
      this.dataStatus.show = false
    },
    viewRow(e){
      let items = [];let fees = 0;let pay = 0
      e.product.forEach(i => {
        const price = String(i.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        const total = String(i.price*i.quantity).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        items.push({v1: i.name,v2: price+' x '+i.quantity+' = '+total})
      })
      if(e.type=='Shoppe'){
        fees = e.feesShoppe+'%'
        let ntotal = parseInt(e.totalPrice.replace(/\$\s?|(,*)/g, ''))
        pay = String(ntotal - (ntotal * e.feesShoppe / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else { 
        fees = e.ship
        pay = String(
          parseInt(e.ship.replace(/\$\s?|(,*)/g, ''))+
          parseInt(e.totalPrice.replace(/\$\s?|(,*)/g, ''))).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      this.dataView = {
        show: true,
        title: [{name:'Đơn hàng',value:e._id},{name:'Loại:',value:e.type+' - '+e.dateCreate}],
        content: [
          {type:'title',name:'',value:e.customer.name},
          {type:'ico',name:'phone',value:e.customer.phone},
          {type:'ico',name:'environment',value:e.customer.address},
          {type:'list',name:'Sản phẩm',value:items},
          {type:'text-right',name:'rightAll',value:[
            {v1:'Tổng tiền hàng',v2:e.totalPrice},
            {v1:e.type=='Website'?'Phí vận chuyển:':'Phí giao dịch:',v2:fees},
            {v1:'Thành tiền:',v2:pay}]},
         ]
      }
    },
    editRow(e) {
      this.isAdd = false
      this.isModal = true;
      this.indexTemp = this.oders.findIndex((item) => item._id == e._id);
      let temp = this.oders[this.indexTemp];
      const total = String(temp.totalPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      temp.product.forEach(e => {
        let priceItem = String(e.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        let totalItem = String(e.quantity*e.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        e.format = priceItem+" x "+String(e.quantity)+" = "+totalItem
      })
      this.formModal = {
        'phone':temp.customer.phone,
        'fullname': temp.customer.name,
        'type': temp.type,
        'ship': parseInt(temp.ship.replace(/\$\s?|(,*)/g, '')),
        'note': temp.note }
      this.editData = {
        'user': temp.customer,'items': temp.product,'total': total,'cost': temp.cost}
    },
    addRow() {
      this.isModal = true;
      this.isAdd = true;
      this.formModal = {'phone': this.customers.phone,'fullname': this.customers.name,'type': 'Website','ship': '30000','note': ''}
      this.editData = {'user': this.customers,'items': [], 'total': 0, 'cost': 0}
    },
    deleteRow(e){
      if(e.status == 'Hoàn thành'){
        let temp = []
        e.product.forEach(e=>{
          let p = this.products.find(i => i._id == e._id)
          if(p.type == "product"){
            temp.push({id:e._id,quantity: p.quantity + e.quantity})
          } else{
            let i = true;
            do {
              this.products.forEach(a=>{
                if(a.sku == p.sku){
                  if(a.type == 'product'){
                    const c = temp.find(b=>b.id == a._id)
                    if(c){
                      const index = temp.findIndex(f=>f.id == a._id)
                      temp[index].quantity += p.quantity*e.quantity
                    } else{
                      temp.push({id:a._id,quantity: a.quantity + (p.quantity*e.quantity)})
                    }
                    i = false
                  }
                }
              })
            }
            while (i);
          }
        })
        temp.forEach(x=>{
          const index = this.products.findIndex(g => g._id == x.id)
          this.products[index].quantity = x.quantity
          this.$axios.$patch(`/api/products/${x.id}`, {quantity: x.quantity})
        })
      }
      this.oders.splice(e.index, 1);
    },
    handleSubmit(e) {
      if (this.isAdd) {
        this.$axios.$put("/api/oders", e).then((res) => {
          res.dateCreate = moment(e.dateCreate).format(this.formatDate)
          res.ship = String(res.ship).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          res.totalPrice = String(res.totalPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          this.oders.unshift(res);
          this.isModal = false; this.isAdd = false;
          this.$message.success( `Đã tạo đơn hàng ${res.customer.name}`, 5,);
        }).catch((e) => { console.log(e); });
      } else {
        this.$axios.$patch(`/api/oders/${this.oders[this.indexTemp]._id}`, e).then((res) => {
          this.oders[this.indexTemp].customer = res.customer
          this.oders[this.indexTemp].note = res.note
          this.oders[this.indexTemp].product = res.product
          this.oders[this.indexTemp].ship = String(res.ship).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          this.oders[this.indexTemp].totalPrice = String(res.totalPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          this.oders[this.indexTemp].type = res.type
          this.isModal = false; this.isAdd = false, this.indexTemp = ''
        }).catch((e) => { console.log(e);});
      }
    },
  },
};
</script>