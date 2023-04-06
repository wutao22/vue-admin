<template>
  <div>
    <!-- 首页顶部数据 -->
    <div class="top">
      <div class="top-item">
        <div class="icon">
          <img src="@/assets/imgs/member.png" alt="" style="width: 40px;height: 40px;">
          <!-- <i class="el-icon-s-custom" style="color: #fff; font-size: 32px"></i> -->
        </div>
        <div style="display: flex; flex-direction: column; font-size: 14px">
          <div class="num">{{ data.zuserCount ? data.zuserCount : 0 }}</div>
          <div>总会员数</div>
        </div>
      </div>
      <div class="top-item">
        <div class="icon">
          <img src="@/assets/imgs/file.png" alt="" style="width: 40px;height: 40px;">
        </div>
        <div style="display: flex; flex-direction: column; font-size: 14px">
          <div class="num">
            {{ data.zattachmentCount ? data.zattachmentCount : 0 }}
          </div>
          <div>总附件数</div>
        </div>
      </div>
      <div class="top-item">
        <div class="icon">
          <img src="@/assets/imgs/admin.png" alt="" style="width: 40px;height: 40px;">
        </div>
        <div style="display: flex; flex-direction: column; font-size: 14px">
          <div class="num">{{ data.zadminCount ? data.zadminCount : 0 }}</div>
          <div>总管理员数</div>
        </div>
      </div>
    </div>
    <!-- 中部数据 -->
    <div class="mid margin-tb-lg">
      <!-- 折线图 -->
      <div id="charts"></div>
      <!-- 中部右侧数据 -->
      <div class="mid-right grid grid-2 grid-gap">
        <div class="data-item">
          <div class="flex align-center justify-center">
            <img src="@/assets/imgs/4.png" alt="" style="width: 80px; height: 60px" />
            <!-- <i class="el-icon-news" style="color: #28bb9c; font-size: 28px"></i> -->
          </div>
          <div class="flex flex-direction margin-left-sm justify-around">
            <div class="padding-tb num_l">
              {{ dayData.todayRegister ? dayData.todayRegister : 0 }}
            </div>
            <div class="text-14">今日注册</div>
          </div>
        </div>
        <div class="data-item">
          <div class="flex align-center justify-center">
            <img src="@/assets/imgs/2.png" alt="" style="width: 80px; height: 60px" />
          </div>
          <div class="flex flex-direction margin-left-sm justify-around">
            <div class="padding-tb num_l">
              {{ dayData.todayRecord ? dayData.todayRecord : 0 }}
            </div>
            <div class="text-14">今日登录</div>
          </div>
        </div>
        <div class="data-item">
          <div class="flex align-center justify-center">
            <img src="@/assets/imgs/3.png" alt="" style="width: 80px; height: 60px" />
          </div>
          <div class="flex flex-direction margin-left-sm justify-around">
            <div class="padding-tb num_l">
              {{ dayData.threeDayRegister ? dayData.threeDayRegister : 0 }}
            </div>
            <div class="text-14">三日新增</div>
          </div>
        </div>
        <div class="data-item">
          <div class="flex align-center justify-center">
            <img src="@/assets/imgs/1.png" alt="" style="width: 80px; height: 60px" />
          </div>
          <div class="flex flex-direction margin-left-sm justify-around">
            <div class="padding-tb num_l">
              {{ dayData.sevenDayRegister ? dayData.sevenDayRegister : 0 }}
            </div>
            <div class="text-14">七日新增</div>
          </div>
        </div>
        <div class="data-item">
          <div class="flex align-center justify-center">
            <img src="@/assets/imgs/5.png" alt="" style="width: 80px; height: 60px" />
          </div>
          <div class="flex flex-direction margin-left-sm justify-around">
            <div class="padding-tb num_l">
              {{ dayData.sevenDayBrisk ? dayData.sevenDayBrisk : 0 }}
            </div>
            <div class="text-14">七日活跃</div>
          </div>
        </div>
        <div class="data-item">
          <div class="flex align-center justify-center margin-left">
            <img src="@/assets/imgs/6.png" alt="" style="width: 80px; height: 60px" />
          </div>
          <div class="flex flex-direction justify-around">
            <div class="padding-tb num_l">
              {{ dayData.monthBrisk ? dayData.monthBrisk : 0 }}
            </div>
            <div class="text-14">月活跃</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer flex w7">
      <div class="fi-box">
        <div class="ft-file padding flex justify-between">
          <div>附件统计</div>
          <div class="padding-lr-sm text-13 flex justify-center align-center radius-4 text-white"
            style="background: #444c69;opacity: 0.7;">
            实时
          </div>
        </div>
        <div class="flex justify-around margin-top">
          <div class="flex flex-direction">
            <div class="padding text-24 text-bold">
              {{ data.zattachmentCount ? data.zattachmentCount : 0 }}
            </div>
            <div>
              <i class="el-icon-folder-checked" style="font-size: 18px"></i>
              <span class="padding-lr-sm">附件数量</span>
            </div>
          </div>
          <div class="flex flex-direction justify-center align-center">
            <div class="padding text-24 text-bold">
              {{ data.zattachmentSize ? data.zattachmentSize : 0 }}
            </div>
            <div class="flex justify-center align-center">
              <i class="el-icon-paperclip" style="font-size: 18px"></i>
              <span class="padding-lr-sm">附件大小</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fi-box bg-green margin-left-xl">
        <div class="ft-file padding flex justify-between">
          <div>图片统计</div>
          <div class="padding-lr-sm text-13 flex justify-center align-center radius-4 text-white"
            style="background: #444c69;opacity: 0.7;">
            实时
          </div>
        </div>
        <div class="flex justify-around margin-top">
          <div class="flex flex-direction">
            <div class="padding text-24 text-bold">
              {{ data.imageCount ? data.imageCount : 0 }}
            </div>
            <div>
              <i class="el-icon-picture-outline" style="font-size: 18px"></i>
              <span class="padding-lr-sm">图片数量</span>
            </div>
          </div>
          <div class="flex flex-direction justify-center align-center">
            <div class="padding text-24 text-bold">
              {{ data.imageSize ? data.imageSize : 0 }}
            </div>
            <div class="flex justify-center align-center">
              <i class="el-icon-paperclip" style="font-size: 18px"></i>
              <span class="padding-lr-sm">图片大小</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import * as echarts from "echarts";

export default {
  name: "Dashboard",
  data() {
    return {
      data: {}, //头部及底部附件图片数据
      dayData: {}, // 中部右侧数据
      startTime: "",
      endTime: "",
      xData: [],
      yData: [],
      formLabelAlign: {
        username: "",
        mail: "",
        nickname: "",
        pwd: "",
      },
      id: "",
    };
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.$nextTick(() => { });
    this.getData();
    this.getNumber();
  },
  methods: {
    // 图表数据
    getCharts() {
      var myCharts = echarts.init(document.getElementById("charts"));
      var option = {
        grid: {
          left: 40,
          width: 1030,
          height: 300,
          bottom: 40,
          show: true,
        },
        tooltip: {
          trigger: "axis",
          show: true,
          backgroundColor: "#dcdcdc",
          borderColor: "#dcdcdc",
          formatter: "{b} 新注册人数 {c}",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          splitLine: {
            show: true,
          },
          data: this.xData,
        },
        yAxis: {
          type: "value",
          show: true,
          splitLine: {
            show: true,
          },
        },
        series: [
          {
            data: this.yData,
            type: "line",
            lineStyle: {
              color: "#50b5d5",
            },
            itemStyle: {
              //下面是拐点样式配置属性
              color: "#ccc", //这里设置的拐点颜色
              borderColor: "#18D1B1", //  拐点边框颜色
              borderWidth: 3, //  拐点边框宽度
              shadowColor: "#F5F5F5", //  阴影颜色
              shadowBlur: 2, //  阴影渐变范围控制
            },
            symbol: "emptyCircle",
            symbolSize: 7,
            symbolColor: "#50b5d5",
            label: {
              color: "#50b5d5",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(40,118,255,0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(255,255,255,0.05)",
                },
              ]),
            },
            // smooth: true,
          },
        ],
      };
      myCharts.setOption(option);
    },
    getData() {
      this.get("/console/consoleInfo").then((res) => {
        if (res.data) {
          this.data = res.data;
          this.xData = res.data.xdata;
          this.yData = res.data.ydata;
          this.getCharts();
        } else {
          this.$Message.error(res.message);
        }
      });
    },
    getNumber() {
      this.getToday();
      this.get("/zUser/number", {
        startTime: this.startTime,
        endTime: this.endTime,
      }).then(
        (res) => {
          this.dayData = res.data;
        },
        (err) => {
          this.$message({
            message: "出错了",
            type: "error",
          });
        }
      );
    },
    getToday() {
      var now = new Date();
      var year = now.getFullYear();
      var mouth = now.getMonth() + 1;
      var day = now.getDate();
      if (mouth < 10) {
        mouth = "0" + mouth;
      }
      if (day < 10) {
        day = "0" + day;
      }
      this.startTime = year + "-" + mouth + "-" + day + " " + "00:00:00";
      this.endTime = year + "-" + mouth + "-" + day + " " + "23:59:59";
    },
    getUserInfo() {
      this.get("/user/getSysUserInfo").then((res) => {
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        this.id = userInfo.id;
        this.formLabelAlign.username = userInfo.name;
        this.formLabelAlign.mail = userInfo.email;
        this.formLabelAlign.nickname = userInfo.nickName;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.top {
  width: 64%;
  padding: 30px 60px;
  border-radius: 12px;
  justify-content: space-between;
  display: flex;
  background: linear-gradient(to right, #2f80ed, #56ccf2);

  .top-item {
    padding: 20px;
    display: flex;
    align-items: center;
    color: white;

    // border-radius: 10px;
    // box-shadow: 4px 4px 8px 0px #e7e7e7cc;
    .icon {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      // background: red;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .num {
      font-size: 24px;
      font-weight: 600;
      text-align: center;
      margin: 8px 0;
    }
  }
}

.mid {
  display: flex;

  #charts {
    width: 70%;
    height: 350px;
  }

  .mid-right {
    width: 30%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 10px;

    .data-item {
      height: 66px;
      padding: 45px 10px;
      text-align: left;
      display: flex;
      color: #333333;
      border-radius: 10px;
      border-bottom: 2px solid #f5f5f5;
      background: linear-gradient(to bottom, rgba(195, 222, 247, 0.5), rgba(255, 255, 255, 0.05));

      .icon-r {
        width: 50px;
        height: 50px;
        background: #ccc;
      }

      .num_l {
        font-weight: 600;
        font-size: 18px;
        text-align: center;
      }
    }
  }
}

.footer {
  height: 200px;

  .fi-box {
    width: 44%;
    height: 160px;
    border-radius: 10px;
    color: rgb(97, 97, 97);
    box-shadow: 3px 4px 9px 1px #dcdcdca1;
    background: -webkit-gradient(linear,
        left bottom,
        left top,
        color-stop(0, #e5e8ec),
        color-stop(1, #e2e4e7));
  }

  .bg-green {
    background: -webkit-gradient(linear,
        left bottom,
        left top,
        color-stop(0, #E0EAFC),
        color-stop(1, #CFDEF3)) !important;
  }
}
</style>
 