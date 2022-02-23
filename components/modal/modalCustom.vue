<template>
  <a-modal
    :title="title"
    :visible="visible"
    width="800px"
    ok-text="Đồng ý"
    cancel-text="Hủy"
    @ok="clickOk"
    @cancel="clickCancel">
    <template>
      <a-form :form="form" @submit="clickOk">
        <div class="row">
          <div class="col-lg-6">
            <div class="row">
              <div class="col-6 custom-label">
                <a-form-item label="Số điện thoại">
                  <a-auto-complete
                    placeholder="Nhập số điện thoại" 
                    :disabled="title == 'Chỉnh sửa' || disabled" 
                    v-model="formModal.phone"
                    :data-source="dataSource"
                    @select="onSelect"
                    @change="onChange"
                  />
                </a-form-item>
              </div>
              <div class="col-6 custom-label">
                <a-form-item label="Khách hàng" help="Thông tin lấy từ ô nhập số điện thoại">
                  <a-input v-model="formModal.fullname" disabled>
                  </a-input>
                </a-form-item>
              </div>
              <div class="col-6 custom-label">
                <a-form-item label="Loại">
                  <a-select :disabled="title == 'Chỉnh sửa'"
                  @change="typeChange" v-model="formModal.type"
                  showSearch optionFilterProp="children" placeholder="Loại đơn hàng"  >
                    <a-select-option v-for="i in [{name:'Shoppe'},{name:'Website'}]"  :key="i.name">
                      {{ i.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="col-6 custom-label">
                <a-form-item label="Vận chuyển">
                  <a-input-number :step='10000' :disabled="ship"
                  :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="value => value.replace(/\$\s?|(,*)/g, '')"
                  v-model="formModal.ship"
                  placeholder="Phí vận chuyển" />
                </a-form-item>
              </div>
              <div class="col-12 custom-label">
                <a-form-item label="Ghi chú">
                  <a-textarea
                  v-model="formModal.note" placeholder="Những điều cần lưu ý .."
                  :auto-size="{ minRows: 1, maxRows: 3 }" allowClear
                  />
                </a-form-item>
              </div>
            </div>
          </div>
          <div class="col-lg-6 border-left">
            <div class="row">
              <div class="col-8 custom-label">
                <a-form-item label="Sản phẩm" help="Khối lượng tổng đơn hàng: ">
                  <a-select 
                  v-decorator="['item']" 
                  showSearch 
                  placeholder="Chọn sản phẩm" 
                  optionFilterProp="children">
                    <a-select-option v-for="i in dataItem" :key="i._id">
                      <a-tooltip placement="rightTop">
                        <template slot="title">
                          <span>{{ i.name }}</span>
                        </template>
                        <div class="border-0">{{ i.name }}</div>
                      </a-tooltip>
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>
              <div class="col-2 custom-label p-0">
                <a-form-item :label=" $device.isMobile ? 'Số lượng' : 'sl'">
                  <a-input-number  v-decorator="['itemNumber',{initialValue:1}]" :min="1"/>
                </a-form-item>
              </div>
              <div class="col-2 pr-0" style="margin-top: 27px">
                <a-tag color="#87d068" @click="addItem">
                  <a-icon type="plus" style="font-size: 15px; padding-bottom: 5px"/>
                </a-tag>
              </div>
              <div class="col-12">
                  <a-list :data-source="dataNew.items" size="small">
                    <a-list-item  slot="renderItem" slot-scope="item">
                      <a-list-item-meta class="text-right" :description="item.format">
                        <a slot="title" :href="item.href" class="text-truncate" >{{ item.name }}</a>
                      </a-list-item-meta>
                      <a slot="actions" @click="removeItem(item._id)">
                        <a-icon type="delete" :style="{ color: '#e32' }"/></a>
                    </a-list-item>
                  </a-list>
              </div>
              <div class="col-5"></div>
              <div class="col-7 border-top p-0">
                <h5 class="m-0 mt-2 ">
                  Tổng tiền hàng: <span class="text-danger">{{ dataNew.total }}</span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </a-form>
    </template>
  </a-modal>
</template>
<script>
import debounce from 'lodash/debounce';
export default {
  name: "ModalCustom",
  props: [ 'title', 'visible', 'formModal', 'dataItem', 'editData', 'disabled'],
  data() {
    return {
      ship: false,
      form: this.$form.createForm(this),
      dataSource: [],
      temp: '',
      feesShoppe: 0
    };
  },
  computed: {
    dataNew: function () {
      return this.editData
    }
  },
  created() {
    this.onChange = debounce(this.onChange, 1000)
  },
  methods: {
    onChange(e) {
      this.$axios.post("/api/customers",{'phone':{$regex:`${e}`}}).then((res)=>{
        let newData = []
        res.data.forEach((e)=>{
          newData.push(e.phone)
        })
        this.dataSource = newData
      })
    },
    onSelect(e){
      this.$axios.get(`/api/customers?phone=${e}`).then((res)=>{
        this.dataNew.user = res.data[0]
        this.formModal.fullname = res.data[0].name
      })
    },
    addItem(){
      const d = this.form.getFieldsValue(["item","itemNumber"])
      if(d.itemNumber<0){ this.$message.warning('Số lượng không hợp lệ'); return}
      const f = this.dataItem.find(x=>x._id === d.item)
      if(!f) { this.$message.warning('Vui lòng chọn sản phẩm'); return}
      const check = this.dataNew.items.some(item => item._id === f._id)
      let item = {_id: f._id,name: f.name,cost: f.cost,price: f.price,quantity: 0,format: ''}
      const price = String(f.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      if(f && !check){
        const total = String(d.itemNumber*f.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        item.quantity = d.itemNumber
        item.format = price+" x "+item.quantity+" = "+total
        this.dataNew.items.push(item)
        this.sumItem()
      } else if(f && check){
        const index = this.dataNew.items.findIndex(x => x._id === f._id)
        const newQuantity = parseInt(d.itemNumber)+parseInt(this.dataNew.items[index].quantity)
        const total = String(newQuantity*f.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        item.quantity = newQuantity
        item.format = price+" x "+item.quantity+" = "+total
        this.dataNew.items[index] = item;
        const temp = this.dataNew.items
        this.dataNew.items = []
        temp.forEach(e => { this.dataNew.items.push(e) })
        this.sumItem()
      }
      this.form.setFieldsValue({"item":'',"itemNumber":'1'})
    },
    removeItem(e){
      this.dataNew.items.splice(this.dataNew.items.findIndex(i => i._id === e), 1);
      this.sumItem()
    },
    sumItem(){
      let sumPrice = this.dataNew.items.reduce( (accumulator, currentValue) => {
        return accumulator + currentValue.quantity*currentValue.price;
      },0)
      let sumCost = this.dataNew.items.reduce( (accumulator, currentValue) => {
        return accumulator + currentValue.quantity*currentValue.cost;
      },0)
      this.dataNew.total = String(sumPrice).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      this.dataNew.cost = sumCost
    },
    typeChange(e){
      if(e=="Shoppe"){
        this.$axios.$get('/api/settings').then(res=>{
          this.feesShoppe = res[0].feesShoppe
        })
        this.formModal.ship = "0"
        this.ship = true
      } else {
        this.formModal.ship=  "30000"
        this.ship = false
      }
    },
    clickOk() {
      const formValue = this.formModal
      const dataNew = this.dataNew
      if(formValue.phone!=dataNew.user.phone){this.$message.warning("Vui lòng kiểm tra lại thông tin khách hàng");return}
      if(dataNew.items.length === 0){ this.$message.warning("Vui lòng thêm sản phẩm");return}
      else if(dataNew.user === ''){ this.$message.warning("Vui lòng thêm khách hàng");return}
      // check all stock product for all oders status = dang xu lý
      this.dataNew.items.forEach(e => delete e.format);
      let temp = {
        type: formValue.type,
        customer: dataNew.user,
        product: dataNew.items,
        totalPrice: parseInt(dataNew.total.replace(/\$\s?|(,*)/g, '')),
        cost: dataNew.cost,
        ship: parseInt(formValue.ship),
        note: formValue.note,}
      if(temp.type=="Shoppe"){
        temp.feesShoppe = this.feesShoppe
      }
      this.$emit('eventOk', temp)
    },
    clickCancel() {
      this.$emit('eventCancel')
    },
  },
}
</script>