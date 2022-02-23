<template>
  <a-modal :visible="visible" @cancel="clickCancel" :footer="null">
    <template>
      <div class="row">
        <div class="col-12 pb-3">
          <div class="container-fluid p-0">
            <div class="row">
              <div class="col-1">
                <a-icon type="check-circle" class="mr-2 s-px24" theme="twoTone" two-tone-color="#52c41a" />
              </div>
              <div class="col-11">
                <div class="container-fluid p-0">
                  <div class="row">
                    <div v-for="i in title" 
                    :key="i.value" class="col-12"> {{ i.name }} {{ i.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="i in content" :key="i.name" class="col-12">
          <span v-if="i.type == 'title'" class="h6-title">{{ i.name }} {{ i.value }}
          </span>
          <span v-else-if="i.type == 'note'" class="note-custom py-2" >{{ i.name }} {{ i.value }}
          </span>
          <p v-else-if="i.type == 'ico'" class="m-0"><a-icon :type="i.name" /> {{ i.value }}
          </p>
          <div v-else-if="i.type == 'list'" class="row py-2">
            <div class="col-12 h6">{{ i.name }}</div>
            <div class="col-12">
              <div class="row" v-for="a in i.value" :key="a.v1">
                <div class="col-lg-6">{{ a.v1 }}</div>
                <div class="col-lg-6">
                  <div :class=" !$device.isMobile ? 'float-end' : ''">{{ a.v2 }}</div>
                </div>
              </div>
            </div>
          </div>
          <div 
          v-else-if="i.type == 'text-right'" 
          class="row py-2">
            <div class="col-lg-6"/>
            <div class="col-lg-6">
              <p v-for="a in i.value" :key="a.v1" class="m-0">
                {{ a.v1 }} <span class="float-end">{{ a.v2 }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </a-modal>
</template>
<script>
export default {
  name: "ModalSuccess",
  props: ["visible", "title", "content"],
  data: () => {
    return {};
  },
  methods: {
    clickCancel() {
      this.$emit("eventCancel");
    },
  },
};
</script>