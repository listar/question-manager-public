<template>
    <div class="content-layer" v-if="paperInfo">
        <div class="paper-box">
            <div class="content-box">

                <div class="user-paper-info">
                    <a-row :gutter="16">
                        <a-col :span="8">
                            <a-card title="得分" >
                                <p>{{userScore}} / {{scoreTotal}}</p>
                            </a-card>
                        </a-col>
                        <a-col :span="8">
                            <a-card title="准确率">
                                <p>{{parseFloat(userScore/scoreTotal).toFixed(2) * 100}} %</p>
                            </a-card>
                        </a-col>
                        <a-col :span="8">
                            <a-card title="排名">
                                <p>not data</p>
                            </a-card>
                        </a-col>
                    </a-row>
                </div>

                <div class="head">
                    <h1>{{paperInfo.title}}</h1>
                    <div class="paper-small" v-html="paperInfo.description"></div>
                </div>
                <div class="question-list">
                    <div :class="{item: item.qcId != 7, notAnswer: false }" v-for="(item,qIndex) in questionList" :key="qIndex">
                        <!--段落说明-->
                        <section v-if="[7].indexOf(item.qcId) > -1" class="section-tips" v-html="item.contentJson[0]"></section>


                        <div v-else>
                        <div class="title">
                            <span class="isBida" v-if="item.isBida">*</span>
                            <span class="title-txt" v-html="item.title"></span>
                            <span class="qc" v-if="[2].indexOf(item.qcId) > -1">【{{item.qcName}}】</span>
                        </div>
                        <div class="question-tips" v-html="item.tips"></div>

                        <div class="answer-list" v-if="[1,2].indexOf(item.qcId) > -1">
                            <div v-for="(answers,index) in item.contentJson" :key="index" class="answer-item">
                                <div>{{answers.name}}</div>
                            </div>
                        </div>

                        <div class="user-answer" v-if="[1,2, 3].indexOf(item.qcId) > -1">
                            <div class="index-txt">您的回答：</div>
                            <div v-if="[1,3].indexOf(item.qcId) > -1" class="my-answer">
                                {{item.quserAnswerData}}
                            </div>
                            <div v-if="[2].indexOf(item.qcId) > -1" class="my-answer">
                                <div class="check-item" v-for="(uanserItem, uIndex) in item.quserAnswerData">
                                    <a-divider v-if="uIndex" type="vertical" />
                                    <span>{{uanserItem}}</span>
                                </div>
                            </div>
                            <div class="my-score" v-if="item.isRight">
                                <a-divider type="vertical" />
                                <a-icon type="check" />(得分：{{item.score}})
                            </div>
                        </div>

                        <div v-if="[4,6].indexOf(item.qcId) > -1" class="item-info">
                            <table  cellpadding="10px">
                                <tr v-for="(answers,index) in item.contentJson">
                                    <td class="trLeft">{{answers.name}}</td>
                                    <td>
                                        <div v-if="[4].indexOf(item.qcId) > -1" >{{item.quserAnswerData[index]}}</div>
                                        <a-rate v-if="[6].indexOf(item.qcId) > -1" disabled allowHalf :value="item.quserAnswerData[index]" />
                                    </td>
                                </tr>
                            </table>
                        </div>
                        </div>

                    </div>
                </div>

                <div class="content-footer">

                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {infoPaperApi} from "@/api/question";
  import {submitPaperApi} from "@/api/user";
  import {mapState} from 'vuex';
  import {getStore} from '@/utils/common'


  export default {
    name: "myUriInfo",
    data(){
      return {
        uri:this.$route.params.uri || '',
        paperInfo: {},
        questionList: [],
        userAnswerData: {},

        inTime: new Date().getTime(), // 开始答卷时间
        notAnswerData: [], //没有填写答案的题目数组

        currentUserAnswerData: {},

        scoreTotal: 0, // 总分数
        userScore: 0, // 用户得分
      }
    },
    mounted(){
      this.currentUserAnswerData = JSON.parse(getStore("USERANSWER"+ this.uri));
      console.log(this.currentUserAnswerData);
      if(typeof this.currentUserAnswerData == "undefined" || typeof this.currentUserAnswerData['answerJson'] == undefined){
        this.$router.push({path: '/mobile/'+ this.uri});
        return;
      }


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
        let _questionList = res.data.data.questionList;

        // 整理数据
        if(typeof this.currentUserAnswerData['answerJson'] == "string"){
            let _answerJson = JSON.parse(this.currentUserAnswerData['answerJson']);
            this.currentUserAnswerData['answerJson'] = _answerJson;
        }

        _questionList.map((item, i) => {
          _questionList[i]['quserAnswerData'] = this.myAnswerData(item);
          _questionList[i]['isRight'] = this.isRight(item);
        });

        console.log(_questionList);

        this.questionList = _questionList;
      });



    },
    filters:{

        checkData: (questionItem) => {
          let answerData = [];
          switch (questionItem.qcId) {
            case 1:
              for(let alist in questionItem.contentJson){
                if(questionItem.contentJson[alist]['isAnswer']){
                  return alist;
                }
              }
              break;
            case 2:
              for(let alist in questionItem.contentJson){
                if(questionItem.contentJson[alist]['isAnswer']){
                   answerData.push(alist);
                }
              }
              return answerData;
              break;
          }
        }
    },
    methods:{
      onChangeRadio(qId){
        // console.log('radio'+ e.target.value);
        let _index =  this.notAnswerData.indexOf(qId);
        console.log(_index, qId, this.notAnswerData);
        if(_index > -1){
          this.notAnswerData.splice(_index, 1);
        }
      },
      onChangeCheckbox(qId){
        // console.log('checked = ', checkedValues);
        let _index =  this.notAnswerData.indexOf(qId);
        if(_index > -1){
          this.notAnswerData.splice(_index, 1);
        }
      },
      myAnswerData(questionItem){
        let currentpaper = this.currentUserAnswerData;
        // console.log(currentpaper);
        // currentpaper.answerJson = JSON.parse(currentpaper.answerJson);
        let currentQuestionAnswerIndexData = currentpaper.answerJson['subject_'+ questionItem.id];
        switch (questionItem.qcId) {
          case 1:
            if(typeof questionItem.contentJson[currentQuestionAnswerIndexData] == "undefined"){
              return '您没有回答！';
            }
            return questionItem.contentJson[currentQuestionAnswerIndexData]['name'];
            break;
          case 2:
            if(currentQuestionAnswerIndexData  == undefined){
              return [];
            }
            let _answerList = [];
            console.log(currentQuestionAnswerIndexData);
            for(let alist in questionItem.contentJson){
              let _alistIndex = parseInt(alist);
              if(currentQuestionAnswerIndexData.indexOf(_alistIndex) > -1){
                _answerList.push(questionItem.contentJson[alist]['name']);
              }
              // if(questionItem.contentJson[alist]['isAnswer']){
              //   answerData.push(alist);
              // }
            }
            return _answerList
            break;
          case 3:
          case 4:
          case 6:
            return currentQuestionAnswerIndexData;
            break;
        }
      },
      isRight(questionItem){
        let currentQuestionAnswerIndexData = this.currentUserAnswerData.answerJson['subject_'+ questionItem.id];

        this.scoreTotal += parseInt(questionItem.score);
        console.log(currentQuestionAnswerIndexData);
        switch (questionItem.qcId) {
          case 1:
            if( typeof questionItem.contentJson[currentQuestionAnswerIndexData] != "object"){
              return false;
            }
            let _isAnswer = questionItem.contentJson[currentQuestionAnswerIndexData]['isAnswer'];
            if(_isAnswer){
              this.userScore += parseInt(questionItem.score);
            }
            return _isAnswer;
            break;
          case 2:
            if(currentQuestionAnswerIndexData  == undefined){
              return false;
            }
            let _userAnswerStr = currentQuestionAnswerIndexData.sort().join("_");
            let _sysAnswer = [];
            questionItem.contentJson.map( (cItem, cIndex) => {
              if(cItem.isAnswer){
                _sysAnswer.push(cIndex);
              }
            });

            if(_userAnswerStr == _sysAnswer.sort().join("_")){
              this.userScore += parseInt(questionItem.score);
              return true;
            }
            return false;
            break;
        }

      }

    },
    computed:{
      ...mapState([
        'userSendAnswerData'
      ])
    }
  }
</script>

<style lang="scss" scoped>

    .content-layer{
        width: 920px;
        background: url('../../../assets/paper_bg1.jpg') no-repeat top center;
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

                .user-paper-info{
                    padding: 30px 0;
                }

                .head{
                    padding-bottom: 20px;
                    h1{
                        font-size: 24px !important;
                        font-weight: bold;
                        color: #19a8ee;
                        padding: 15px 0;
                        line-height: 24px;
                        text-align: center;
                    }
                    .paper-small{
                        font-size: 20px;
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
                            font-size: 15px;
                        }
                        .user-answer{
                            border-top:1px solid red;
                            font-size: 14px;
                            padding-left: 24px;
                            line-height: 30px;
                            .index-txt{
                                float: left;
                            }
                            .my-answer{
                                float: left;
                                .check-item{
                                    float: left;
                                }
                            }
                            .my-score{
                                color: #0066FF;
                            }
                        }
                        .item-info{
                            border-bottom: 1px solid #EFEFEF;
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
        background-image:url('../../../assets/paper_bg1_2.jpg') !important;
        background-repeat: repeat-x !important;
        background-color: #ddf4ff !important;
        display: block;
    }
</style>