<template>
  <a-table class="bg-white shadow-sm"
    size="small"
    :bordered="bordered"
    :columns="columns"
    :data-source="dataSource"
    :rowKey="(e) => e._id">
    <div v-if="slotTable.tags" slot="tagsCustom" slot-scope="tag, e">
      <a-tag
        v-if="$device.isMobile"
        v-on:click="tags(e)"
        class="cursor-pointer"
        :color=" tag == 'Hoàn thành' ? 'green' : tag == 'Thất bại' ? 'red' : 'orange'">
        <a-icon v-if="tag == 'Hoàn thành'" type="check" />
        <a-icon v-else-if="tag == 'Thất bại'" type="minus" />
        <a-icon v-else type="exclamation" />
      </a-tag>
      <a-tag
        v-else
        v-on:click="tags(e)"
        class="cursor-pointer"
        :color=" tag == 'Hoàn thành' ? 'green' : tag == 'Thất bại' ? 'red' : 'orange'">
        {{ tag }}
      </a-tag>
    </div>
    <nuxt-link v-show="slotTable.link" slot="nameCustom" 
      slot-scope="name, e"  
      :to="`${nameData}/${e._id}`"
      >{{ name }}</nuxt-link>
    <a v-show="slotTable.webPage" slot="webPage" 
      slot-scope="webPage"  
      :href="`${webPage}`"
      >{{ webPage }}</a>
    <!-- <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
      {{ record.description }}
    </p> -->
    <div slot="_id" slot-scope="id, e" class="item-center">
      <span v-show="slotTable.viewRow" class="cursor-pointer font-weight-bold tx-primary" @click="viewRow(e)">
        <a-icon type="info-circle" :style="{ color: '#1890ff' }" />
      </span>
      <span class="cursor-pointer font-weight-bold tx-warning" @click="editRow(e)">
        <a-icon type="edit"/>
      </span>
      <span class="cursor-pointer font-weight-bold tx-danger" @click="deleteRow(e)">
        <a-icon type="delete" :style="{ color: '#e32' }" />
      </span>
    </div>
  </a-table>
</template>
<script>
export default {
  name: "Table",
  props: {nameData: String, columns: Array, dataSource: Array, bordered: Boolean, childElement: Array},
  data() {
    return {
      slotTable: this.childElement !== undefined ? {
        tags: this.childElement.includes("tags"),
        viewRow: this.childElement.includes("viewRow"),
        link: this.childElement.includes("link"),
        webPage: this.childElement.includes("webPage"),
      } : {}
    };
  },
  methods: {
    tags(e){
      this.$emit('eventTag',e)
    },
    viewRow(e) {
      this.$emit('eventView',e)
    },
    editRow(e) {
      this.$emit('eventEdit',e)
    },
    deleteRow(e) {
      const is = this
      if(is.nameData=="users"){
        if(is.dataSource[0]._id == e._id){
          is.$message.info("Bạn không thể xóa nội dụng này")
          return
        }
      }
      this.$confirm({
        title: 'Bạn có chắc chắn xóa mục này không?',
        okText: 'Đồng ý',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk() {
          is.$axios.$delete(`/api/${is.nameData}/${e._id}`).then((res) => {
            let newData = is.dataSource.findIndex((i) => i._id === e._id)
            e.index = newData
            is.$emit('eventDelete', e)
          }).catch((e) => {
            console.log(e);
          });
        },
      });
    },
  },
};
</script>