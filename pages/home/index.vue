<template>
  <div class="w-100">
    <a-page-header :title="title" sub-title="Bảng thống kê tình trạng cửa hàng" class="mb-2">
      <template slot="extra">
        <div>{{formatDate}}</div>
      </template>
    </a-page-header>
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-xxl-3 col-sm-6 col-lg-3 mb-2">
            <div class="card card-raised border-0 border-start border-warning border-4 shadow-sm">
                <div class="card-body px-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="me-2">
                            <div class="display-5">{{kFormatter(asset.all+setting.startCost)}}</div>
                            <div class="card-text">Tài sản</div>
                        </div>
                        <div class="icon-circle bg-warning text-white">
                          <a-icon type="money-collect" />
                        </div>
                    </div>
                    <div class="card-text">
                        <div class="d-inline-flex align-items-center">
                            <a-icon type="rise" class="text-success"/>
                            <div class="caption text-success fw-500 me-2">{{percent.asset}}%</div>
                            <div class="caption">từ tháng trước</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6 col-lg-3 mb-2">
            <div class="card card-raised border-0 border-start border-success border-4 shadow-sm">
                <div class="card-body px-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="me-2">
                            <div class="display-5">{{kFormatter(asset.interest)}}</div>
                            <div class="card-text">Lợi nhuận</div>
                        </div>
                        <div class="icon-circle bg-success text-white">
                          <a-icon type="thunderbolt" />
                        </div>
                    </div>
                    <div class="card-text">
                        <div class="d-inline-flex align-items-center">
                            <a-icon type="rise" class="text-success"/>
                            <div class="caption text-success fw-500 me-2">{{percent.interest}}%</div>
                            <div class="caption">từ tháng trước</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6 col-lg-3 mb-2">
            <div class="card card-raised border-0 border-start border-secondary border-4 shadow-sm">
                <div class="card-body px-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="me-2">
                            <div class="display-5">{{kFormatter(viewData.customer)}}</div>
                            <div class="card-text">Khách hàng</div>
                        </div>
                        <div class="icon-circle bg-secondary text-white">
                          <a-icon type="team" />
                        </div>
                    </div>
                    <div class="card-text">
                        <div class="d-inline-flex align-items-center">
                            <a-icon type="rise" class="text-success"/>
                            <div class="caption text-success fw-500 me-2">{{percent.customer}}%</div>
                            <div class="caption">từ tháng trước</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6 col-lg-3 mb-2">
            <div class="card card-raised border-0 border-start border-info border-4 shadow-sm">
                <div class="card-body px-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="me-2">
                            <div class="display-5">{{kFormatter(viewData.oder)}}</div>
                            <div class="card-text">Đơn hàng</div>
                        </div>
                        <div class="icon-circle bg-info text-white">
                          <a-icon type="shopping" />
                        </div>
                    </div>
                    <div class="card-text">
                        <div class="d-inline-flex align-items-center">
                            <a-icon type="rise" class="text-success"/>
                            <div class="caption text-success fw-500 me-2">{{percent.oder}}%</div>
                            <div class="caption">từ tháng trước</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div class="row">
        <div class="mb-2 col-lg-6 col-xs-12">
          <div id="echart" class="card border-0 shadow-sm p-2" style="height:250px"></div>
        </div>
        <div class="mb-2 col-lg-3 col-sm-6 col-xs-12">
          <div class="card border-0 shadow-sm p-2 h-100">
            <div class="card-body">
              <h6>Tổng doanh thu</h6>
              <span class="display-6">{{kFormatter(asset.all)}}</span>
            </div>
            <div class="card-body">
              <h6>Tiền mặt</h6>
              <span class="display-6">{{kFormatter(asset.all+setting.startCost-viewData.cash)}}</span>
            </div>
          </div>
        </div>
        <div class="mb-2 col-lg-3 col-sm-6 col-xs-12">
          <div class="card border-0 shadow-sm p-2 h-100">
            <div class="card-header bg-transparent">
              <h6 class="card-title mb-0">Sản phẩm bán chạy</h6>
            </div>
            <div class="card-body p-0">
              <table class="table m-0">
                <tbody>
                  <tr v-for="i in topProducts" :key="i.stt">
                    <th scope="row" 
                     :class="i.stt == 1 ? 'ranking-1': i.stt == 2 ? 'ranking-2': i.stt == 3 ? 'ranking-3': 'ranking'">
                    {{i.stt}}</th>
                    <td colspan="2" 
                    class="text-truncate" 
                    style="max-width: 120px;">
                      <!-- <a-tooltip placement="leftTop">
                        <template slot="title">
                          <span>{{ i.name }}</span>
                        </template>
                        <div class="border-0">{{ i.name }}</div>
                      </a-tooltip> -->
                      {{ i.name }}
                    </td>
                    <td class="text-truncate" style="max-width: 30px;">{{i.quantity}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
export default {
  async asyncData({ $axios }) {
    if(process.browser){
      let itemSetting = localStorage.getItem('setting');
      if(!itemSetting){
        const s = await $axios.$get('/api/setting')
        localStorage.setItem('setting', JSON.stringify(s[0]));
      }
      const o = await $axios.$get('/api/oder?status=Hoàn thành');
      const c = await $axios.$get('/api/customer');
      const a = await $axios.$get(`/api/asset`);
      let cash = 0
      a.forEach((e) => { 
        if(e.type == 'Chi') { cash += e.price } 
      })
      return { 
        oder: o, 
        customer: c, 
        setting: itemSetting, 
        viewData: { oder: o.length, customer: c.length, cash: cash}
      }
    }
  },
  data() {
    return {
      title: "Thống kê",
      topProduct: [],
      formatDate: '',
      d: new Date(),
      month: new Date().getMonth(),
      chartData: {},
      asset: { interest: 0, all: 0 },
      percent: { oder: 0, customer: 0, asset: 0, interest: 0 }
    };
  },
  mounted: async function() {
    if(this.oder.length !== 0){
      this.chartData = await this.loadChatjs()
      this.buildChart(this.chartData)
      this.getDateNow()
      this.getPercentage()
      this.getTopProduct()
    }
  },
  methods: {
    getTopProduct(){
      let items = []
      this.oder.forEach(e=>{
        e.product.forEach(i=>{
          const c = items.find(a=>a.id == i._id)
          if(c){
            const index = items.findIndex(b=>b.id == i._id)
            items[index].quantity += i.quantity
          }else{
            items.push({
              id: i._id,
              name: i.name,
              quantity: i.quantity
            })
          }
        })
      })
      const sort_by = (field, reverse, primer) => {
        const key = primer ?
          function(x) {
            return primer(x[field])
          } :
          function(x) {
            return x[field]
          };
        reverse = !reverse ? 1 : -1;
        return function(a, b) {
          return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
      }
      items.sort(sort_by('quantity', true, parseInt))
      for(let d = 0; d<5; d++){
        if(items[d]){
          items[d].stt = id + 1
          items[d].quantity = this.kFormatter(items[d].quantity)
          this.topProduct.push(items[d])
        }
      }
    },
    getPercentage(){
      let all = 0; let now = 0
      let allAsset = 0; let nowAsset = 0
      let allInterest = 0; let nowInterest = 0
      this.oder.forEach(e=>{
        const data = new Date(e.dateCreate).getMonth()
        if(data+1 != this.month+1){ 
          all += 1
          if(e.type == 'Shoppe'){
            const total = e.totalPrice * e.feesShoppe / 100
            allInterest += e.totalPrice - total - e.cost;
            allAsset += e.totalPrice - total
          }else{
            allInterest += e.totalPrice - e.cost;
            allAsset += e.totalPrice
          }
        }
        if(data+1 == this.month){ 
          now += 1
          if(e.type == 'Shoppe'){
            const total = e.totalPrice * e.feesShoppe / 100
            nowInterest += e.totalPrice - total - e.cost;
            nowAsset += e.totalPrice - total
          }else{
            nowInterest += e.totalPrice - e.cost;
            nowAsset += e.totalPrice
          }
        }
        if(e.type == 'Shoppe'){
          const total = e.totalPrice * e.feesShoppe / 100
          this.asset.interest += e.totalPrice - total - e.cost;
          this.asset.all += e.totalPrice - total
        }else{
          this.asset.interest += e.totalPrice - e.cost;
          this.asset.all += e.totalPrice
        }
      })
      if(all != 0){
        this.percent.oder =  now/all*100
        this.percent.asset =  (nowAsset/(allAsset+this.setting.startCost)*100).toFixed(1)
        this.percent.interest =  (nowInterest/allInterest*100).toFixed(1)
      }
      all = 0; now = 0
      this.customer.forEach(e=>{
        const data = new Date(e.dateCreate).getMonth()
        if(data+1 != this.month+1){ 
          all += 1
        }
        if(data+1 == this.month){ 
          now += 1
        }
      })
      if(all != 0){
        this.percent.customer =  now/all*100
      }
    },
    kFormatter(num) {
      return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    },
    fixNumber(number,fix){
      return parseFloat((Math.round(number /fix) / 100).toFixed(1));
    },
    buildChart(data){
      let chartDom = document.getElementById('echart')
      let myChart = echarts.init(chartDom)
      let option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }},
        /* toolbox: {
          feature: {
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
          }
        }, */
        legend: { data: ['Doanh thu', 'Lợi nhuận', 'Vốn'], left: 0},
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true},
        xAxis: [ { type: 'category', data: data.month }],
        yAxis: [ { 
          type: 'value',
          name: '1 đơn vị = 1000', 
          }],
        series: [{
          name: 'Doanh thu',
          type: 'bar',
          color: '#73c0de',
          data: data.d0,
          emphasis: {  focus: 'series' },
        },{
          name: 'Lợi nhuận',
          type: 'bar',
          color: '#fac858',
          barWidth: 5,
          data: data.d1,
          emphasis: {  focus: 'series' },
          stack: 'a',
        },{
          name: 'Vốn',
          type: 'bar',
          color: '#91cc75',
          data: data.d2,
          emphasis: {  focus: 'series' },
          stack: 'a',
        }]
      };
      option && myChart.setOption(option);
    },
    loadChatjs: async function(){
      let addData = {d0: [], d1: [], d2: [], month: []}
      let monthArray = ['Th1','Th2','Th3','Th4','Th5','Th6','Th7','Th8','Th9','Th10','Th11','Th12']
      let currMonth = new Date().getMonth()+1;
      let firstMonth = currMonth - 6;
      if(firstMonth < 0){
        monthArray.slice(12 - Math.abs(firstMonth), 12).forEach(e=>{ addData.month.push(e) })
        monthArray.slice(0, currMonth).forEach(e=>{ addData.month.push(e) })
      }else{
        addData.month = monthArray.slice(firstMonth, currMonth)
      }
      for(let e of addData.month){
        let month = parseInt(e.substr(2))
        const files = await this.getItem(month)
        if(files.length != 0){
        let price = 0, cost = 0
        for(let e of files){
          if(e.status == 'Hoàn thành'){
            if(e.type == 'Shoppe'){
              const total = e.totalPrice * e.feesShoppe / 100
              price += e.totalPrice - total
              cost += e.totalPrice - total - e.cost
            }else{
              price += e.totalPrice
              cost += e.totalPrice - e.cost 
            }
          }
        }
        price = this.fixNumber(price,10)
        cost = this.fixNumber(cost,10)
        addData.d2.push(price - cost),
        addData.d1.push(cost),
        addData.d0.push(price)
        }else{
          addData.d2.push(0), addData.d1.push(0), addData.d0.push(0)
        }
      }
      return addData
    },
    getItem: async function(month){
      const { data } = await this.$axios.post("/api/oder",{ "$expr": { "$eq": [{ "$month": "$dateCreate" }, month] } })
      return data
    },
    getDateNow(){
      let weekdays = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy']
      let months = ['tháng một','tháng hai','tháng ba','tháng tư','tháng năm','tháng sáu','tháng bảy','tháng tám','tháng chín','tháng mười','tháng mười một','tháng mười hai']
      this.formatDate = weekdays[this.d.getDay()]+', '+this.d.getDate()+' '+months[this.d.getMonth()]+' '+this.d.getFullYear();
    }
  },
};
</script>