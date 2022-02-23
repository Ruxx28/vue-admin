<template>
  <div class="w-100">
    <a-page-header class="px-0" :title="title" sub-title="Danh sách tất cả sản phẩm"/>
    <Fillter css='d-inline-block' v-on:eventFillter="fillterRow"/>
    <a-button class="float-end mt-1" type="primary" @click="addRow">
      <a-icon type="plus" />
      <span>Sản phẩm</span>
    </a-button>
    <div class="clearfix">
      <Table nameData="products"
        :columns="columns" 
        :dataSource="products" 
        bordered
        v-on:eventEdit="editRow"
        v-on:eventDelete="deleteRow" />
    </div>    
    <a-modal 
      :width=" $device.isMobile ? 520 : $device.isTablet ? 520 : 800"
      :title="isAdd ? 'Thêm mới sản phẩm':'Chỉnh sửa sản phẩm'"
      :visible="isModal"
      ok-text="Đồng ý" cancel-text="Hủy"
      @ok="handleSubmit" @cancel="()=>{isModal=false}">
      <template>
        <a-form :form="form"  @submit="handleSubmit">
          <div class="row">
            <div class="col-md-6">
              <div class="container-fluid p-0">
                <div class="row">
                  <div class="col-6 custom-label">
                    <a-form-item label="SKU">
                      <a-input v-decorator="['sku']" disabled />
                    </a-form-item>
                  </div>
                  <div class="col-6 custom-label">
                    <a-form-item label="Tên sản phẩm" required>
                      <a-input v-decorator="['name',{
                        rules: [ {  required: true, message: 'Đừng để trống nha',}] }]" 
                        placeholder="Tên sản phẩm" />
                    </a-form-item>
                  </div>
                  <div class="col-6 custom-label">
                    <a-form-item label="Giá">
                      <a-input-number class="w-100" :min="1000"
                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                        v-decorator="['cost']" placeholder="Giá nhập"/>
                    </a-form-item>
                  </div>
                  <div class="col-6 custom-label">
                    <a-form-item label="Giá bán">
                      <a-input-number class="w-100" :min="1000"
                        :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                        :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                        v-decorator="['price']" placeholder="Giá bán" />
                    </a-form-item>
                  </div>
                  <div class="col-6 custom-label">
                    <a-form-item label="Số lượng">
                      <a-input-number class="w-100" :min="0"
                        v-decorator="['quantity']" placeholder="Số lượng"/>
                    </a-form-item>
                  </div>
                  <div class="col-6 custom-label">
                    <a-form-item label="Nhà cung cấp">
                      <a-select
                        mode="multiple"
                        style="width: 100%"
                        placeholder="Chọn các nhà sản xuất"
                        v-decorator="['suppliers']">
                        <a-select-option v-for="i in producers" :key="i._id">
                          {{ i.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                  <div class="col-12 custom-label">
                    <a-form-item label="Mô tả">
                      <a-textarea v-decorator="['description']" placeholder="..." 
                        :auto-size="{ minRows: 1, maxRows: 3 }" allowClear />
                    </a-form-item>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div>
                <a-form-item
                  v-for="(k, index) in item"
                  :key="k"
                  :label="index === 0 ? 'Nhóm số lượng' : ''"
                  :help="index === 0 ? 'Nhập số lượng và giá bán sản phẩm' : ''"
                  :required="true">
                  <span :id="`ids[${k}]`" v-decorator="[ `ids[${k}]`]"/>
                  <a-input-number :min="2"  
                    v-decorator="[ 
                    `names[${k}]`,
                    { rules: [{ required: true, message: 'Vui lòng nhập số lượng', }] }
                    ]"
                    placeholder="Số lượng"
                    style="width: 55%; margin-right: 8px" />
                  <a-input-number :min="1000"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                    v-decorator="[ 
                    `prices[${k}]`,
                    { rules: [{ required: true,message: '...',}] }
                    ]"
                    placeholder="Giá bán"
                    style="width: 31% !important; margin-right: 8px" />
                  <a-icon
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    @click="() => remove(k)"
                  />
                </a-form-item>
                <a-form-item v-bind="formItemLayoutWithOutLabel">
                  <a-button type="dashed" style="width: 60%" @click="add">
                    <a-icon type="plus" /> Thêm nhóm
                  </a-button>
                </a-form-item>
              </div>
            </div>
          </div>
        </a-form>
      </template>
    </a-modal>
  </div>
</template>
<style>
.ant-form-item-label {
  text-align: left !important;
  line-height: 16px !important;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 0px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
<script>
const columns = [{
  title: "Tên sản phẩm",
  dataIndex: "name",
  key: "name",
  scopedSlots: { customRender: "name" },
  ellipsis: true,
  },{
  title: "Số lượng",
  dataIndex: "quantity",
  key: "quantity",
  ellipsis: true,
  width: 90
  },{
  title: "Giá bán",
  dataIndex: "price",
  key: "price",
  ellipsis: true,
  width: 110
  },{
  title: "Giá nhập",
  dataIndex: "cost",
  key: "cost",
  ellipsis: true,
  width: 110
  },{
  title: "Mô tả",
  dataIndex: "description",
  key: "description",
  ellipsis: true,
  width: 300
  },{
  title: "Hành động",
  dataIndex: "_id",
  key: "_id",
  scopedSlots: { customRender: "_id" },
  width: 90,
  ellipsis: true,
  },];
const columnsSM = [
  columns[0],
  columns[1],
  columns[5]
]
import Fillter from 'components/table/fillter'
import Table from "components/table";
export default {
  async asyncData({ $axios }) {
    const get1 = await $axios.$get("/api/products");
    const get2 = await $axios.$get("/api/producers");
    const array1 = []
    const array2 = []
    get1.forEach((e) => {
      if(e.type=="product"){
        e.cost = String(e.cost).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        e.price = String(e.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        array1.push(e)
      } else {
        array2.push(e)
      }
    });
    return { products: array1, productCombo: array2, producers: get2};
  },
  components: { Fillter, Table}, 
  data() {
    return {
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      title: "Sản phẩm",
      columns: this.$device.isMobile ? columnsSM : columns,
      form: this.$form.createForm(this),
      isAdd: false,
      isModal: false,
      indexTemp: '',
      item: [],
      id: 0,
      tempItem: []
    };
  },
  methods: {
    resetItem(){
      this.item = []
      this.id = 0
      this.tempItem = []
    },
    remove(k) {
      const keys = this.item
      if (keys.length === 0) {
        return;
      }
      this.item = keys.filter(key => key !== k)
    },
    add() {
      const keys = this.item
      const nextKeys = keys.concat(this.id++);
      this.item = nextKeys
    },
    fillterRow(e){
      this.$axios.post("/api/products",{'name':{$regex:`${e}`,$options:'$i'},'type':'product'}).then((res)=>{
        res.data.forEach((e)=>{
          e.cost = String(e.cost).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          e.price = String(e.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        })
        this.products = res.data
      })
    },
    editRow(e) {
      let names = []
      let prices = []
      let ids = []
      this.resetItem()
      this.isAdd = false; 
      this.isModal = true
      this.indexTemp = this.products.findIndex(item => item._id == e._id)
      let temp = this.products[this.indexTemp]
      const find = this.productCombo.find(e => e.sku == temp.sku)
      if(find){
        this.productCombo.forEach(e=>{
          if(e.sku == temp.sku){
            this.tempItem.push(e)
            this.add()
            ids.push(e._id)
            names.push(e.quantity)
            prices.push(e.price)
          }
        })
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          ids: ids,
          names: names,
          prices: prices,
          suppliers: temp.suppliers,
          sku: temp.sku,
          name: temp.name,
          quantity: temp.quantity,
          cost: parseInt(temp.cost.replace(/\$\s?|(,*)/g, '')),
          price: parseInt(temp.price.replace(/\$\s?|(,*)/g, '')),
          description: temp.description,
        })
      })
      
    },
    addRow() {
      this.resetItem()
      this.isModal = true, 
      this.isAdd = true; 
      let renderSKU = ''
      if(this.products.length === 0){ 
        renderSKU = 'P00001'
      }else {
        let lastElement = this.products.slice(0).shift()
        let n = parseInt(lastElement.sku.substr(1))+1
        let nlength = 4 - String(n).length
        let iArray = ['P0','P00','P000','P0000']
        renderSKU = iArray[nlength]+n 
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          "sku": renderSKU,
          "name": '',
          "quantity": '',
          "cost": '',
          "price": '',
          "description": '',
        })
      })
    },
    deleteRow(e){
      this.products.splice(e.index, 1)
      this.$axios.$delete(`/api/products?sku=${e.sku}`).then(res=>{
        let items = []
        this.productCombo.forEach(a=>{
          if(a.sku != e.sku){
            items.push(a)
          }
        })
        this.productCombo = items
      }).catch(e=>{
        console.log(e)
      })
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const keys = this.item
          const { ids, names, prices } = values;
          let groupItem = []
          keys.forEach(e=>{
            const item = {
              sku: values.sku,
              type: 'combo',
              name:`${names[e] + ' ' + (values.name).toLowerCase()}`,
              quantity: names[e],
              price: prices[e],
              cost: values.cost*names[e],
            }
            if(!this.isAdd){
              if(ids[e]){
                item._id = ids[e]
              }
            }
            groupItem.push(item)
          })
          if(this.isAdd) {
            let values_coppy = [values]
            if(keys.length !== 0){
              delete values.ids;
              delete values.names;
              delete values.prices;
              values_coppy = values_coppy.concat(groupItem)
            }
            this.$axios.$put('/api/products', values_coppy).then(res => {
              if(keys.length != 0){ 
                res[0].cost = String(res[0].cost).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                res[0].price = String(res[0].price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.products.unshift(res[0])
                res.slice(1).forEach(i=>{
                  this.productCombo.push(i)
                })
              } else {
                res[0].cost = String(res[0].cost).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                res[0].price = String(res[0].price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                this.products.unshift(res[0])
              }
              this.isModal = false, this.isAdd = false
              this.resetItem()
            }).catch(e => {
              console.log(e);
            })}
          else {
            if(keys.length !== 0){
              delete values.ids;
              delete values.names;
              delete values.prices;
            }
            this.$axios.$patch(`/api/products/${this.products[this.indexTemp]._id}`,values).then(res=>{
              this.products[this.indexTemp].suppliers = res.suppliers
              this.products[this.indexTemp].sku = res.sku
              this.products[this.indexTemp].name = res.name
              this.products[this.indexTemp].quantity = res.quantity
              this.products[this.indexTemp].cost = String(res.cost).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              this.products[this.indexTemp].price = String(res.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              this.products[this.indexTemp].description = res.description
              this.isModal = false, this.isAdd = false
              this.resetItem()
              if(keys.length !== 0 || this.tempItem !== 0){
                this.tempItem.forEach(e=>{
                  const checkRomove = groupItem.find(a => a._id == e._id)
                  if(!checkRomove){
                    const index = this.productCombo.findIndex(d => d._id == e._id)
                    this.$axios.$delete(`/api/products/${e._id}`).then(res => {
                      this.productCombo.splice(index, 1);
                    })
                  }
                })
                groupItem.forEach(e=>{
                  const checkArray = this.productCombo.find(b=>b._id == e._id)
                  if(checkArray){
                    const index = this.productCombo.findIndex(c => c._id == e._id)
                    this.$axios.$patch(`/api/products/${e._id}`,e).then(res=>{
                      this.productCombo[index] = res
                    })
                  } else {
                    this.$axios.$put('/api/products', e).then(res => {
                      this.productCombo.push(res)
                    })
                  }
                })
              }
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