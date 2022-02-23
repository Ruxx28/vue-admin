<template>
  <div :class="css+' fillter'">
    <form >
      <a-form-item>
        <a-input v-model="dataFillter" v-on:keyup="onChange" placeholder="Tìm kiếm"/>
      </a-form-item>
    </form>
  </div>
</template>
<script>
import moment from "moment";
import debounce from 'lodash/debounce';
export default {
  name: "FillterTable",
  props: [ 'css' ],
  data() {
    return {
      dataFillter: ''
    };
  },
  created() {
    this.onChange = debounce(this.onChange, 1000)
  },
  methods: {
    onChange(e) {
      this.$emit('eventFillter', e.target.value)
    },
    moment,
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf("day");
    },
    listenPicker(date, dateString) {
      console.log(dateString);
      console.log(dateString[0] === "");
      if (dateString[0] !== "") {
        this.searchDate = dateString;
      } else {
        this.searchDate = null;
      }
    },
    actionSearch(e) {
      console.log(this.searchDate);
      this.$axios.$get(`/api/oders?customer.phone=${e}`).then((res) => {
        res.data.forEach((e) => {
          e.dateCreate = moment(e.dateCreate).format("DD/MM/YYYY");
          e.ship = String(e.ship).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          e.totalPrice = String(e.totalPrice).replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          );
        });
        this.oders = res.data;
      });
    },
  },
};
</script>