<template>
  <div class="container-fluid">
    <div class="row auth">
      <div class="col-sm-5">
        <div class="auth-head">
          <h2 v-if="!$device.isMobile">Application <br/> Login Page</h2>
          <h2 v-else>Application Login Page</h2>
          <p>Login from here to access.</p>
        </div>
      </div>
      <div class="col-sm-7">
        <a-form :class="!$device.isMobile ? 'w-75' : 'w-100' " :form="form" @submit="handleSubmit">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
                 <a-form-item class="form-group">
                  <a-input class="form-control" v-decorator="['username']" placeholder="Username">
                    <a-icon slot="prefix"  type="user"/>
                  </a-input>
                </a-form-item >
              </div>
              <div class="col-12">
                <a-form-item class="form-group">
                  <a-input class="form-control" v-decorator="['password']" type="password" placeholder="Password">
                    <a-icon slot="prefix" type="lock"/>
                  </a-input>
                </a-form-item>
              </div>
              <div class="col-12">
                <a-form-item class="form-group">
                  <a-button html-type="submit" class="btn-auth-outline">Log in</a-button>
                </a-form-item>
              </div>
            </div>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
    };
  },
  methods: {
    setCookie(name,data,day){
      const d = new Date();
      d.setTime(d.getTime() + (day*24*60*60*1000));
      document.cookie = `${name}=${data}; ${"expires="+ d.toUTCString()}`;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        this.$axios.$post(`/api/setting/auth`, values).then(res => {
          this.setCookie('token', res, 365)
          this.$router.push('/')
        }).catch(e => {
          console.log(e);
        })
      });
    },
  },
};
</script>