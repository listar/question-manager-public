<template>
    <div class="edit">


        <a-affix :offsetTop="2">
            <div class="edit-content-head">
                <div class="item" @click="menuItemTap(qcitem)" v-for="qcitem in categoryList"><a-icon :type="qcitem.icon"  />{{qcitem.name}}</div>
            </div>
        </a-affix>
        <div class="edit-content-body-head" @click="paperTitleDescModalFun">
            <div class="title">{{title}}</div>
            <div class="description" v-html="description"></div>
        </div>

        <div class="edit-paper-title-desc">
            <a-modal
                    v-model="paperTitleDescModal"
                    onOk="handleOk"
                    footer=""
            >
                <a-row>
                    <a-col :span="3">标题</a-col>
                    <a-col :span="21"><a-input placeholder="标题" v-model="title"/></a-col>
                </a-row>
                <br>
                <a-row>
                    <a-col :span="3">说明:</a-col>
                    <a-col :span="21">
                        <ckeditor :editor="editor" v-model="description" :config="editorConfig"></ckeditor>
                    </a-col>
                </a-row>

            </a-modal>
        </div>




        <div class="edit-content-body">
            <div class="content-list">


                <div class="item" v-for="(question, qindex) in questionList" :key="qindex" @click="changeEditItem(qindex)" @mouseover="mouseoverItem(qindex)" @mouseout="mouseoutItem(qindex)">

                    <!--other-->
                    <div v-if="[7].indexOf(question.qcId) > -1" >
                        <!--段落说明-->
                        <div class="paragraph-layer">
                            <div class="question-title-layer">
                                <div v-if="question.answerJson[0].length >= 1" class="paragraph-desc" v-html="question.answerJson[0]"></div>
                                <div v-else class="paragraph-desc">{{question.title}}</div>
                            </div>
                            <div class="edit-layer-content" v-if="question.isEdit">
                                <ckeditor :editor="editor" v-model="question.answerJson[0]" :config="editorConfig"></ckeditor>
                            </div>
                        </div>
                    </div>


                    <!--paper-->
                    <div v-else>
                    <div class="question-title-layer">
                        <div class="bida" v-if="question.isBida">*</div>
                        <div class="title" v-html="question.title"></div>

                        <div class="score" v-if="question.score && [1,2,3].indexOf(question.qcId) > -1">（分值：{{question.score}} 分）</div>
                    </div>

                    <div class="answer-tips" v-if="question.tips.length > 2" v-html="question.tips"></div>
                    <div class="answer-data">

                        <!--多项选择-->
                        <div v-if="[1,2].indexOf(question.qcId) > -1" :class="{'answer-item':true, isanswer:item.isAnswer }" v-for="(item,index) in question.answerJson">
                            <label>
                            <input type="checkbox" disabled :name="qindex+ '_answer'" :checked="Boolean(item.isAnswer)" :value="item.isAnswer"  v-if="question.qcId == 2"/>
                            <input type="radio" disabled :name="qindex+ '_answer'" :checked="Boolean(item.isAnswer)" :value="item.isAnswer" v-if="question.qcId == 1"/>
                            {{item.name + (item.isAnswer? '（正确答案）': '')}}</label>
                        </div>

                        <!--矩阵填空-->
                        <!--矩阵评分-->
                        <div v-if="[4,6].indexOf(question.qcId) > -1">
                            <table cellpadding="5">
                                <tr v-for="(item,index) in question.answerJson">
                                    <td align="right">
                                        {{item.name}}
                                    </td>
                                    <td>
                                        <a-textarea v-if="question.qcId == 4" autosize class="textarea" disabled />
                                        <a-rate v-if="question.qcId == 6" :defaultValue="item.vaule" allowHalf disabled />
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <!--单项填空-->
                        <a-textarea autosize v-if="[3].indexOf(question.qcId) > -1" class="textarea" disabled />

                        <!--段落说明-->
                        <div v-if="[7].indexOf(question.qcId) > -1">
                            <div v-if="!item">请在此输入说明文字</div>
                            <div v-else>
                                {{item}}
                            </div>
                        </div>
                    </div>
                    <div class="answer-jiexi" v-if="question.answerAnalysis.length > 2" v-html="question.answerAnalysis"></div>

                    <div class="edit-layer-content" v-if="question.isEdit">
                        <ckeditor :editor="editor" v-model="question.title" :config="editorConfig"></ckeditor>

                        <div class="category">
                            <div class="select-category">
                            题目类型
                            <a-select :defaultValue="question.qcName" style="width: 120px" @change="handleChange" disabled>
                                <a-select-option :value="type.name" v-for="type in categoryList">{{type.name}}</a-select-option>
                            </a-select>
                            </div>

                            <div class="other-attr">
                                <a-checkbox @change="bidaChange($event, qindex)" :defaultChecked="Boolean(question.isBida)">必答</a-checkbox>
                                <a-button @click="answerTips(qindex)" size="small">填写提示</a-button>

                                <div class="answer-tips-model">
                                    <a-modal
                                            v-model="paperTipsModal"
                                            onOk="handleOk"
                                            footer=""
                                    >
                                        <ckeditor :editor="editor" v-model="question.tips" :config="editorConfig"></ckeditor>
                                    </a-modal>
                                </div>
                            </div>
                        </div>
                        <div class="score" v-if="[1,2,3].indexOf(question.qcId) > -1">
                            <span>题目分数 <a-input v-model="question.score" class="score" /></span>
                            <span>
                                <a-button @click="answerjiexi(qindex)" size="small">设置答案解析</a-button>
                            </span>

                            <div class="answer-jiexi-model">
                                <a-modal
                                        v-model="paperJiexiModal"
                                        onOk="handleOk"
                                        footer=""
                                >
                                    <ckeditor :editor="editor" v-model="question.answerAnalysis" :config="editorConfig"></ckeditor>
                                </a-modal>
                            </div>
                        </div>


                        <div class="answer-list" v-if="[1,2].indexOf(question.qcId) > -1">
                            <table cellpadding="5px">
                                <thead>
                                    <tr>
                                        <th>选项文字</th>
                                        <th>正确答案</th>
                                        <th>上移下移</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item,index) in question.answerJson">
                                        <td width="410px">
                                            <a-input v-model="item.name" style="width: 335px"/>
                                            <a-icon type="plus-circle" class="btn" @click="editAnswerNum('add', qindex, index)"/>
                                            <a-icon type="minus-circle" class="btn" @click="editAnswerNum('delete', qindex, index)"/>
                                        </td>
                                        <td>
                                            <input type="checkbox" @change="setAnswerInput(question.qcId, qindex, index)" :name="qindex+ '_answer_edit'" v-model="item.isAnswer" :value="item.isAnswer" />
                                        </td>
                                        <td>
                                            <a-icon type="up-circle" class="btn" @click="moveAnswer('up', qindex, index)" />
                                            <a-icon type="down-circle" class="btn" @click="moveAnswer('down' ,qindex, index)" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div v-if="[4, 6].indexOf(question.qcId) > -1" class="answer-list">
                            <table cellpadding="5px">
                                <thead>
                                <tr>
                                    <th>行标题</th>
                                    <th>必答</th>
                                    <th>上移下移</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="(item,index) in question.answerJson">
                                    <td width="410px">
                                        <a-input v-model="item.name" style="width: 335px"/>
                                        <a-icon type="plus-circle" class="btn" @click="editAnswerNum('add', qindex, index)"/>
                                        <a-icon type="minus-circle" class="btn" @click="editAnswerNum('delete', qindex, index)"/>
                                    </td>
                                    <td>
                                        <input type="checkbox" @change="setAnswerInput(question.qcId, qindex, index)" :name="qindex+ '_answer_edit'" v-model="item.isBida" :value="item.isBida" />
                                    </td>
                                    <td>
                                        <a-icon type="up-circle" class="btn" @click="moveAnswer('up', qindex, index)" />
                                        <a-icon type="down-circle" class="btn" @click="moveAnswer('down' ,qindex, index)" />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>



                    <!--item-tools-->
                    <div class="item-tools-layer">
                        <div class="tools-list" v-if="mouseState[qindex] != undefined && !question.isEdit">
                            <a-button class="tbtn" icon="edit" size="small">编辑</a-button>
                            <a-button class="tbtn" icon="delete" size="small" @click="delItem($event, qindex)">删除</a-button>
                            <a-button class="tbtn" icon="up" size="small" @click="moveItemUp($event, qindex)">上移</a-button>
                            <a-button class="tbtn" icon="down" size="small" @click="moveItemDown($event, qindex)">下移</a-button>
                        </div>
                    </div>

                </div>
            </div>
            <div class="bottom-util">
                <a-button icon="plus" @click="batchAddQuestion">批量添加题目</a-button>
            </div>

            <div class="success-btn-layer">
                <a-button type="primary" class="success-btn" @click="successSubmit">完成编辑</a-button>
            </div>
        </div>
    </div>
</template>

<script>

    // import MarkdownEditor from '../../../components/MarkdownEditor'
    import {editQuestionApi, infoPaperApi,questionCategoryListApi} from "../../../api/question";
    import {CookieUtil} from '@/utils/common'

    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    // import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
    //
    // import EssentialsPlugin from '@ckeditor/ckeditor5-essentials/src/essentials';
    // import BoldPlugin from '@ckeditor/ckeditor5-basic-styles/src/bold';
    // import ItalicPlugin from '@ckeditor/ckeditor5-basic-styles/src/italic';
    // import LinkPlugin from '@ckeditor/ckeditor5-link/src/link';
    // import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';


    export default {
        name: "questionEdit",
        data(){
            return {

                editor: ClassicEditor,
                editorConfig: {

                    toolbar: {
                        items: [
                            'bold',
                            'italic',
                            // 'underline',
                            // 'stirkethrough',
                            'link',
                            // 'highlight',
                            '|',
                            'undo',
                            'redo',
                        ]
                    }
                },
                paperTitleDescModal: false,
              paperTipsModal: false,
              paperJiexiModal: false,

              mouseState:[],  //focus  焦点状态

              // questionCategoryListData: [],


                paperId: this.$route.params.paperId || 0,
                title: '考试',
                description: '说明',
                startTime: 0,
                endTime:0,
                type: 2,
                editContent: '',
                categoryList: [],  // 题目类型
                questionList: []
            }
        },
        activated(){

        },
        mounted(){

            //init
            this.paperId && infoPaperApi({
                id: this.paperId
            }).then( (res) => {
                if(res.data.errcode > 0){
                    this.$message.error(res.data.data);
                    return;
                }
                let _result = res.data.data;
                // this.questionList = _result.questionList;
                _result.questionList.map((item, index) => {
                    _result.questionList[index]['answerJson'] = JSON.parse(item.content);
                    _result.questionList[index]['isEdit'] = 0;
                });
                this.questionList = _result.questionList;
                // console.log(this.questionList);
                this.title = _result.paperAttr.title;
                this.description = _result.paperAttr.description;
                this.startTime = _result.paperAttr.startTime;
                this.endTime = _result.paperAttr.endTime;
                this.type = _result.paperAttr.type;

                console.log(this.title, this.description, _result.paperAttr);
            });

            //categorylist
          questionCategoryListApi({
            status: 1
          }).then( (res) => {
            if(res.data.errcode > 0){
              this.$message.error(res.data.data);
              return;
            }
            this.categoryList = res.data.data;
          });
        },
        components: {
        },
        methods: {

          //体型创建
          menuItemTap(qcitem){
            switch (qcitem.id){
              case 1:
                this.questionList.map( (item, i) => {
                  item.isEdit = 0;
                });
                this.questionList.push({
                  qcId:1,
                  qcName: '单选',
                  title: '标题',
                  score: 5,
                  isEdit: 1,
                  isBida:1,
                  status:1,
                  tips: '',
                  answerAnalysis: '',
                  answerJson: [
                    {
                      name: 'A、选项',
                      isAnswer: 0,
                    },
                    {
                      name: 'B、选项',
                      isAnswer: 0,
                    }
                  ]
                });
                break;
              case 2:
                this.questionList.map( (item, i) => {
                  item.isEdit = 0;
                });
                this.questionList.push({
                  qcId:2,
                  qcName: '多选',
                  title: '标题',
                  score: 5,
                  isEdit: 1,
                  isBida:1,
                  status:1,
                  tips: '',
                  answerAnalysis: '',
                  answerJson: [
                    {
                      name: 'A、选项',
                      isAnswer: 0,
                    },
                    {
                      name: 'B、选项',
                      isAnswer: 0,
                    }
                  ]
                });
                break;
              case 3:
                // 单选填空
                this.questionList.map( (item, i) => {
                  item.isEdit = 0;
                });
                this.questionList.push({
                  qcId:3,
                  qcName: '单项填空',
                  title: '标题',
                  score: 5,
                  isEdit: 1,
                  isBida:1,
                  status:1,
                  tips: '',
                  answerAnalysis: '',
                  answerJson: []
                });
                break;
              case 4:
                // 矩阵填空
                this.questionList.map( (item, i) => {
                  item.isEdit = 0;
                });
                this.questionList.push({
                  qcId:4,
                  qcName: '矩阵填空',
                  title: '标题',
                  score: 5,
                  isEdit: 1,
                  isBida:1,
                  status:1,
                  tips: '',
                  answerAnalysis: '',
                  answerJson: [
                    {
                      name: '标题',
                      value: '',
                      isBida:1,
                    },
                    {
                      name: '标题',
                      value: '',
                      isBida:1,
                    }
                  ]
                });
                break;
              case 5:
                // 多项填空
                break;
              case 6:
                // 矩阵评分
                this.questionList.map( (item, i) => {
                  item.isEdit = 0;
                });
                this.questionList.push({
                  qcId:6,
                  qcName: '矩阵评分',
                  title: '标题',
                  score: 5,
                  isEdit: 1,
                  isBida:1,
                  status:1,
                  tips: '',
                  answerAnalysis: '',
                  answerJson: [
                    {
                      name: '物流速度',
                      value: 0,
                      isBida:1,
                    },
                    {
                      name: '服务态度',
                      value: 0,
                      isBida:1,
                    }
                  ]
                });
                break;
              case 7:
                // 段落说明
                this.questionList.map( (item, i) => {
                  item.isEdit = 0;
                });
                this.questionList.push({
                  qcId: 7,
                  qcName: '段落说明',
                  title: '请在此输入说明文字',
                  score: 0,
                  isEdit: 1,
                  isBida: 0,
                  status:1,
                  tips: '',
                  answerAnalysis: '',
                  answerJson: ['']
                });

                console.log(this.questionList);
                break;
              case 8:
                break;
            }
          },


            //修改答案
            setAnswerInput(questioncategory, qindex, index){
                //单选
                if(questioncategory == 1 ){
                    for(let item in this.questionList[qindex]['answerJson']){
                        if(item != index){
                            this.questionList[qindex]['answerJson'][item].isAnswer = 0;
                        }
                    }
                }
            },

            //必答修改
            bidaChange (e, qindex) {
                this.checked = e.target.checked;
                this.questionList[qindex]['isBida'] = e.target.checked ? 1 : 0;
                console.log('bidaChange'+ this.questionList[qindex]['isBida']);
            },

            onChange (e) {
                console.log(`checked = ${e.target.checked}`)
            },
            //填写提示
            answerTips(){
              this.paperTipsModal = true;
            },
          //设置答案解析
          answerjiexi(){
            this.paperJiexiModal = true;
          },
          // 批量添加题目
          batchAddQuestion(){
            this.$message.success('功能版本二补充');
          },

          // 编辑item
            changeEditItem(qindex){
                console.log('edit'+ qindex);
                for(let item in this.questionList){
                    if(item == qindex){
                        // this.$nextTick(function () {
                        //     this.$el.questionList[item]['isEdit'] = 1;
                        // });
                        this.questionList[item]['isEdit'] = 1;
                    }else{
                        this.questionList[item]['isEdit'] = 0;
                    }
                }
                // console.log('edit'+ qindex +'_'+this.questionList[qindex]['isEdit']);
            },


          mouseoverItem(qindex){
            this.mouseState[qindex] = 1;
          },
          mouseoutItem(qindex){
            this.mouseState = [];
          },

          // 删除指定item
          delItem(e, qindex){
            e.preventDefault();
            e.stopPropagation();
            this.questionList.splice(qindex, 1);
          },
          // 往上移动item
          moveItemUp(e, qindex){
            e.preventDefault();
            e.stopPropagation();
            if(!qindex){
              return;
            }
            let _moveItem = this.questionList[qindex];
            this.questionList.splice(qindex-1, 0, _moveItem);
            this.questionList.splice(qindex+1, 1);
          },
          // 往下移动item
          moveItemDown(e, qindex){
            e.preventDefault();
            e.stopPropagation();
            if(qindex + 1 == this.questionList.length){
              return;
            }
            let _moveItem = this.questionList[qindex];
            this.questionList.splice(qindex+2, 0, _moveItem);
            this.questionList.splice(qindex, 1);
          },


            //选择类型
            handleChange(value) {
                console.log(`selected ${value}`);
            },

            //上移动 下移动
            moveAnswer(moveType = 'up', qindex, index){
                // console.log(moveType, qindex, index);
                let _moveItem = this.questionList[qindex]['answerJson'][index];
                switch (moveType){
                    case 'up':
                        if(!index){
                            break;
                        }
                        this.questionList[qindex]['answerJson'].splice(index-1, 0, _moveItem);
                        this.questionList[qindex]['answerJson'].splice(index+1, 1);
                        break;
                    case 'down':
                        if(this.questionList[qindex]['answerJson'].length == index +1){
                            break;
                        }
                        this.questionList[qindex]['answerJson'].splice(index+2, 0, _moveItem);
                        this.questionList[qindex]['answerJson'].splice(index, 1);
                        break;
                }
            },

            //添加答案选项
            editAnswerNum(action, qindex, index){
                if(action == 'add'){
                    //todo  答案的id 唯一
                    this.questionList[qindex]['answerJson'].splice(index+1, 0, {
                        name: '',
                        isAnswer: 0,
                    });
                    return;
                }
                if(action == 'delete'){
                    this.questionList[qindex]['answerJson'].splice(index, 1);
                }
            },

            //提交
            successSubmit(){
              let notAnswerData = [];
              //是否有设置答案
              this.questionList.map((item, index) => {
                if([1,2].indexOf(item.qcId) > -1){
                  let _notAnswer = true;
                  for(let _answer in item.answerJson){
                    if(item.answerJson[_answer].isAnswer){
                      _notAnswer = false;
                      break;
                    }
                  }
                  //没设置答案
                  if(_notAnswer){
                    notAnswerData.push(index);
                  }
                }
              });
              if(notAnswerData.length > 0){
                this.$message.error('还有题目未设置答案！');
                console.log(notAnswerData);
                return;
              }

              if(!this.questionList.length){
                this.$message.error('您还未添加题目！');
                return;
              }

                let _insertData = {
                    id: this.paperId,
                    title: this.title,
                    description: this.description,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    type: this.type,
                    questionList: JSON.stringify(this.questionList),
                  token: CookieUtil.get('TOKEN')
                };
                // console.log(_insertData);

                editQuestionApi(_insertData).then(res => {
                    if(res.data.errcode > 0){
                        this.$message.error(res.data.data);
                        // console.log(res.data);
                        return;
                    }
                    this.$message.success(_insertData.id ? '修改成功！': '添加成功！');
                    this.$router.push({path: '/question/list'});
                });
            },

            //
            paperTitleDescModalFun(){
                this.paperTitleDescModal = true;
            }


        },
        watch:{

        }
    }
</script>

<style lang="scss" scoped>
    #viewerSection{
        border:1px solid red;
        height: 400px;
        width: 100%;
        display: block;
    }
    .edit-content-body-head{
        .title{
            font-size: 15px;
            font-weight: bold;
            line-height: 60px;
            height: 60px;
            text-align: center;
        }
        .description{
            line-height: 30px;
            padding-bottom: 20px;
        }
    }
    .edit-content-head{
        background-color: #1890ff;
        display: table;
        width: 100%;
        padding: 5px;
        .item{
            float: left;
            color: #FFF;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            padding: 0 15px;
            border-radius: 5px;
            &:hover{
                background-color: #FFF;
                color: #f17819;
            }
        }
    }
    .content-list{
        .item{
            padding: 20px 0;
            border-bottom: 1px solid #ebedf0;
            min-height: 30px;
            .question-title-layer{
                display: table;
                width: 100%;
                .bida{
                    float: left;
                    color: red;
                    font-weight: bold;
                }
                .title{
                    font-size: 14px;
                    float: left;
                }
                .score{
                    color: #f17819;
                    padding-left: 5px;
                }
            }
            .answer-data{
                padding-left: 25px;
                .answer-item{
                    line-height: 30px;
                }
                .isanswer{
                    color: #f17819;
                }
                .textarea{
                    margin: 10px 0;
                }


                .qc4Item{
                    width: 100%;
                    clear: both;
                    display: table;
                }
                .name{
                    float: left;
                    padding-right: 20px;
                    line-height: 50px;
                }
                .value{
                    float: left;
                }
            }
            .answer-tips,
            .answer-jiexi{
                color: #666;
                padding-left: 25px;
            }

            .item-tools-layer{
                padding-top: 15px;
                height: 30px;
                .tools-list{
                    width: 100%;
                    text-align: right;
                    .tbtn{
                       margin-right: 10px;
                    }
                }
            }

        }
    }

    .edit-layer-content{
        background-color: #e8e8e8;
        padding: 20px 10px;
        .category{
            height: 30px;
            line-height: 30px;
            margin-top: 5px;
            .select-category{
                float: left;
            }
            .other-attr{
                padding-left: 20px;
                float: left;
            }
        }
        .score{
            height: 30px;
            line-height: 30px;
            margin-top: 5px;
            input{
                width: 40px;
            }
        }

        .answer-list table{
            width: 100%;
            margin-top: 10px;
            thead tr th{
                background: #fafafa;
                height: 40px;
            }
            tbody tr td{
                height: 30px;
            }
            .btn{
                padding: 0 5px;
            }
        }
    }

    .success-btn-layer{
        text-align: center;
    }

</style>