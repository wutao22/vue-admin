<template>
  <div>
    <el-card class="box-card">
      <div class="title">个人资料</div>
      <div class="avatar-box">
        <!-- <img @click=""
          src="http://qiniu.mghz.top/uploads/20230130/Fr923nug2MUv9CP4-OT74NhISKdi.webp"
          alt=""
        /> -->
        <el-upload
          action="#"
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="formLabelAlign"
        class="form"
      >
        <el-form-item label="用户名">
          <el-input v-model="formLabelAlign.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="formLabelAlign.mail"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formLabelAlign.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formLabelAlign.pwd"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" size="small" @click="submit()"
          >提交</el-button
        >
        <el-button type="info" size="small" @click="reset()">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      imageUrl: "",
      labelPosition: "right",
      formLabelAlign: {
        username: "",
        mail: "",
        nickname: "",
        pwd: "",
      },
      id: "",
      file: null,
    };
  },
  mounted() {
    this.getUserInfo();
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.imageUrl = userInfo.avatar;
    this.id = userInfo.id;
    this.formLabelAlign.username = userInfo.name;
    this.formLabelAlign.mail = userInfo.email;
    this.formLabelAlign.nickname = userInfo.nickName;
    // this.formLabelAlign.pwd = userInfo.password
  },
  methods: {
    updateAvatar() {},
    handleAvatarSuccess(file) {
      this.imageUrl = URL.createObjectURL(file);
    },
    // 上传头像
    beforeAvatarUpload(file) {
      let imgdata = new FormData();
      imgdata.append("file", file);
      imgdata.append("id", this.id);
      axios({
        method: "POST",
        url: "/api/user/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: imgdata,
      }).then((data) => {
        this.getUserInfo();
      });
      this.handleAvatarSuccess(file);
    },
    // 提交修改
    submit() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let pwd = userInfo.password;
      if (this.formLabelAlign.pwd) {
        var password = this.formLabelAlign.pwd;
      }
      this.post("/user/updateInfo", {
        id: this.id,
        email: this.formLabelAlign.mail,
        nickName: this.formLabelAlign.nickname,
        password: password,
      }).then((res) => {
        if (res.data.code === 200) {
          this.$router.go(0);
          this.showSuccess();
          this.getUserInfo();
        } else {
          this.$message({
            message: res.data.message || '失败',
            type: "error",
          });
        }
      });
      this.$router.push("/dashboard");
    },
    getUserInfo() {
      this.get("/user/getSysUserInfo").then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        this.imageUrl = userInfo.avatar;
        this.id = userInfo.id;
        this.formLabelAlign.username = userInfo.name;
        this.formLabelAlign.mail = userInfo.email;
        this.formLabelAlign.nickname = userInfo.nickName;
      });
    },
    reset() {
      this.formLabelAlign.mail = "";
      this.formLabelAlign.nickname = "";
      this.formLabelAlign.pwd = "";
    },
  },
};
</script>

<style lang="scss">
.box-card {
  width: 580px;
  margin: 10px;
  padding: 4px !important;
}
.el-card__body {
  padding: 8px !important;
}
.title {
  font-size: 14px;
}
.avatar-box {
  width: 100%;
  padding: 20px;
  text-align: center;
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
}
.form .el-input {
  width: 350px;
}
</style>