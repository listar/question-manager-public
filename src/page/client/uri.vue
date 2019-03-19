<template>
    <div class="content-layer" v-if="paperInfo">
        <div class="paper-box">
            <div class="content-box">
                <div class="head">
                    <h1>{{paperInfo.title}}</h1>
                    <div class="paper-small" v-html="paperInfo.description"></div>
                </div>
                <div class="question-list">
                    <div :class="{item: item.qcId != 7, notAnswer: notAnswerData.indexOf(item.id) > -1 || notAnswerData.join(',').indexOf(item.id+ '_') > -1 ? 1 : 0 }" v-for="item in questionList">
                        <!--段落说明-->
                        <section v-if="[7].indexOf(item.qcId) > -1" class="section-tips" v-html="item.contentJson[0]"></section>

                        <div v-else>
                            <div class="title">
                                <span class="isBida" v-if="item.isBida">*</span>
                                <span class="title-txt" v-html="item.title"></span>
                                <span class="qc" v-if="[2].indexOf(item.qcId) > -1">【{{item.qcName}}】</span>
                            </div>
                            <div class="question-tips" v-html="item.tips"></div>

                            <div class="answer-list">
                                <a-radio-group v-if="[1].indexOf(item.qcId) > -1" @change="onChangeRadio(item.id)" v-model="userAnswerData['subject_'+item.id]"  >
                                    <div v-for="(answers,index) in item.contentJson" :key="index" class="answer-item">
                                        <a-radio :value=index>{{answers.name}}</a-radio>
                                    </div>
                                </a-radio-group>


                                <a-checkbox-group @change="onChangeCheckbox(item.id)" v-if="[2].indexOf(item.qcId) > -1" v-model="userAnswerData['subject_'+item.id]">
                                    <div v-for="(answers,index) in item.contentJson" :key="index" class="answer-item">
                                        <a-checkbox :value=index>{{answers.name}}</a-checkbox>
                                    </div>
                                </a-checkbox-group>

                                <a-textarea v-if="[3].indexOf(item.qcId) > -1" v-model="userAnswerData['subject_'+item.id]" placeholder="请填写" autosize />

                                <div v-if="[4,6].indexOf(item.qcId) > -1">
                                    <table  cellpadding="10px">
                                        <tr v-for="(answers,index) in item.contentJson">
                                            <td class="trLeft">{{answers.name}}</td>
                                            <td>
                                                <a-textarea v-if="[4].indexOf(item.qcId) > -1"  placeholder="请填写" autosize @change="onChangeArrTextarea($event, item.id, index)" style="width: 360px" />
                                                <a-rate v-if="[6].indexOf(item.qcId) > -1" allowHalf @change="onChangeRate($event, item.id, index)" />
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="content-footer" v-if="paperInfo.isPublish">
                    <a-button type="primary" @click="submitPaper">提交</a-button>
                </div>
                <div class="content-footer" v-else>
                    <a-button disabled>暂未发布！还不能使用</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {infoPaperApi, addTableCountApi} from "@/api/question";
  import {submitPaperApi} from "@/api/user";
  import {mapState, mapMutations} from 'vuex'
  import { ADDUSERANSWERDATA} from '@/store/mutation-types'
  import {setStore} from '@/utils/common'


  export default {
    name: "uri", //客户端查看 试卷
    data(){
      return {
        uri:this.$route.params.uri || '',
        paperInfo: {},
        questionList: [],
        userAnswerData: {},

        inTime: new Date().getTime(), // 开始答卷时间
        notAnswerData: [], //没有填写答案的题目数组

      }
    },
    mounted(){
      infoPaperApi({
        uri: this.uri
      }).then( (res) => {
        if(res.data.errcode >0){
          console.log(res);
          return;
        }
        if(typeof res.data.data.paperAttr == "undefined"){
          this.$router.push({path: '/404'});
          return;
        }
        this.paperInfo = res.data.data.paperAttr;
        res.data.data.questionList.map((item, i) => {
          res.data.data.questionList[i].contentJson = JSON.parse(res.data.data.questionList[i].content);
        });
        this.questionList = res.data.data.questionList;
      });

      //view + 1
      addTableCountApi({
        table: 'qqa',
        field: 'view',
        uri: this.uri
      });
    },
    methods:{

      clearNotAnswerData(qId){
        let _index =  this.notAnswerData.indexOf(qId);
        console.log(_index);
        if(_index > -1){
          this.notAnswerData.splice(_index, 1);
        }
      },
      onChangeRadio(qId){
        // console.log('radio'+ e.target.value);
        this.clearNotAnswerData(qId);
      },
      onChangeCheckbox(qId){
        // console.log('checked = ', checkedValues);
        this.clearNotAnswerData(qId);
      },
      onChangeRate(starNum, qItem, aIndex){
        if(typeof this.userAnswerData['subject_'+ qItem] == "undefined"){
          this.userAnswerData['subject_'+ qItem] = [];
        }
        this.userAnswerData['subject_'+ qItem][aIndex] = starNum;
        this.clearNotAnswerData(qItem +'_'+ aIndex);
        console.log(qItem +'_'+ aIndex);
      },
      onChangeArrTextarea(e, qItem, aIndex){
        if(typeof this.userAnswerData['subject_'+ qItem] == "undefined"){
          this.userAnswerData['subject_'+ qItem] = [];
        }
        this.userAnswerData['subject_'+ qItem][aIndex] = e.target.value;
        this.clearNotAnswerData(qItem +'_'+ aIndex);
      },

      submitPaper(){
        // console.log(this.userAnswerData);
        if(!this.paperInfo){
          this.$message.error('未发布！不能提交');
          return;
        }
        this.notAnswerData = [];
        //必答题目答案
        this.questionList.map((item, index) => {
          if(!item.isBida){
            return;
          }
            // 多项填空  评分 4 ，6
            if([4,6].indexOf(item.qcId) > -1){
                item.contentJson.map((cItem, cIndex) => {
                    if(cItem.isBida){
                      if(typeof this.userAnswerData['subject_'+ item.id] == "undefined"){
                        this.notAnswerData.push(item.id+'_'+ cIndex);
                        return;
                      } else if(typeof this.userAnswerData['subject_'+ item.id][cIndex] == "undefined"){
                        this.notAnswerData.push(item.id+'_'+ cIndex);
                      }else if(!this.userAnswerData['subject_'+ item.id][cIndex]){
                        this.notAnswerData.push(item.id+'_'+ cIndex);
                      }

                    }
                });
                return;
            }

            // console.log(item.id, this.userAnswerData[item.id], typeof this.userAnswerData[item.id]);
            if(typeof this.userAnswerData['subject_'+item.id] == "undefined"){
              this.notAnswerData.push(item.id);
            } else if(typeof this.userAnswerData['subject_'+item.id] == "object" && !this.userAnswerData['subject_'+item.id].length){
              this.notAnswerData.push(item.id);
            }



        });

        if(this.notAnswerData.length > 0){
          this.$message.error('还有必答题您未作答！');
          console.log(this.notAnswerData);
          return;
        }

        // submit
        let _nowTime = new Date().getTime();
        let _insertData = {
          uri: this.uri,
          userId: 1,
          userName: '匿名用户',
          answerJson: JSON.stringify(this.userAnswerData),
          useTime: parseInt((_nowTime - this.inTime) / 1000),
          time: parseInt(_nowTime / 1000),
        };
        console.log(_insertData);

        submitPaperApi(_insertData).then((res) => {
          if(res.data.errcode){
            this.$message.error('提交试卷失败！');
            return;
          }
          setStore('USERANSWER'+ this.uri, _insertData);
          this.ADDUSERANSWERDATA(_insertData);
          this.$message.success('成功提交！');
          this.$router.push({path: '/my/pc/'+ this.uri});
        });

      },
      ...mapMutations([
        ADDUSERANSWERDATA
      ])
    },
  }
</script>

<style lang="scss" scoped>

    .content-layer{
        width: 920px;
        background: url('../../assets/paper_bg1.jpg') no-repeat top center;
        padding-top: 105px;
        margin: 0 auto;
        .paper-box{
            background: #ffffff;
            margin: 0;
            padding: 0;
            color: #6a6a6a;
            font-size: 12px;
            .content-box{
                width: 780px;
                line-height: 20px;
                margin: 0 auto;
                .head{
                    padding-bottom: 20px;
                    h1{
                        font-size: 24px !important;
                        font-weight: bold;
                        color: #19a8ee;
                        padding: 25px 0 10px;
                        line-height: 24px;
                        text-align: center;
                    }
                    .paper-small{
                        font-size: 16px;
                    }
                }
                .question-list{
                    .section-tips{
                        font-size: 15px;
                        color: #666666;
                    }

                    .item{
                        margin-bottom:30px;
                        border:2px solid #FFF;
                        &.notAnswer{
                            border:2px solid rgb(255, 153, 0);
                        }
                        .answer-list{
                            clear: both;
                            padding-top: 5px;
                            padding-left: 24px;
                            padding-bottom: 5px;
                            border-bottom: 1px solid #EFEFEF;
                            font-size: 15px;
                            color: #333333;
                        }
                        .trLeft{
                            padding-right: 20px;
                            text-align: right;
                        }
                    }
                    .title{
                        font-size: 15px;
                        color: #444444;
                        font-weight: bold;
                        line-height: 20px;
                        span{
                            float: left;
                        }
                        .title-txt{
                            float: left;
                        }
                        .isBida{
                            color: red;
                            font-weight: bold;
                            padding: 0 2px;
                            line-height: 25px;
                        }
                        .qc{
                            color: #0066FF;
                            font-weight: normal;
                            font-size: 14px;
                        }
                    }
                    .question-tips{
                        clear: both;
                        padding-top: 8px;
                        width: 100%;
                        color: #666666;
                        font-size: 14px;
                        padding-left: 24px;
                        line-height: 18px;
                    }
                    .answer-item{
                        line-height: 30px;
                    }
                }

                .content-footer{
                    text-align: center;
                    padding: 30px 0;

                }
            }

        }
    }
</style>
<style>
    body{
        background-image:url('../../assets/paper_bg1_2.jpg') !important;
        background-repeat: repeat-x !important;
        background-color: #ddf4ff !important;
        display: block;
    }
</style>