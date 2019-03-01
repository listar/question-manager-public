<style lang="scss" scoped>
    .table-head-layer{
        display: table;
        width: 100%;
        padding: 10px 0;
        .left-input{
            float: left;
            .item{
                float: left;
                padding-left: 10px;
                input{
                     width: 140px;
                }
            }
        }
        .right-btn{
            float: right;
        }
    }
</style>
<template>
    <div>

        <div class="table-head-layer">
            <div class="left-input">
                <div class="item">
                    <span>试卷uri：</span>
                    <a-input placeholder="试卷uri" />
                </div>
                <div class="item">
                    <span>标题：</span>
                    <a-input placeholder="试卷标题--可模糊" />
                </div>
            </div>
            <div class="right-btn">
                <a-button type="primary" icon="search">搜索</a-button>
            </div>
        </div>

        <a-table :columns="columns" :dataSource="listPaper"
                 :pagination="pagination"
                 :loading="pageLoading"
                 @change="handleTableChange">
            <a slot="uri" slot-scope="text, record" :href=" '/mobile/'+ record.uri " target="_blank">查看</a>
            <span slot="useTime" slot-scope="text, record">
                {{text | useTimeFormat}}
            </span>
            <span slot="action" slot-scope="text, record, index">
                <a href="javascript:;" @click="editPaper(text.uri)">删除</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="editPaper(text.uri)">查看详情</a>
            </span>
        </a-table>
    </div>
</template>
<script>

  import {listPaperApi, paperTotalApi, deletePaperApi, publishPaperApi} from '@/api/question';

  import {userAnswerListApi, userAnswerTotalApi} from  '@/api/dashboard';

  import {useTimeFormat} from '@/utils/common';

  export default {
    data() {
      return {
        columns: [{
          title: '试卷uri',
          dataIndex: 'uri',
          scopedSlots: { customRender: 'uri' },
        }, {
          title: '提交用户名称',
          dataIndex: 'userName',
        }, {
          title: '使用时间',
          dataIndex: 'useTime',
          scopedSlots: { customRender: 'useTime' },
        },
          {
            title: '得分',
            dataIndex: 'userScore',
          },
          {
            title: '操作',
            key: 'action',
            scopedSlots: { customRender: 'action' },
          }],
        listPaper: [],

        pageLoading: false,
        pagination: {
          defaultPageSize: 10,
          current: 1,
          total: 0
        }
      }
    },
    mounted(){
      userAnswerListApi({
        pageIndex: this.pagination.current,
        pageNum: this.pagination.defaultPageSize
      }).then((res) =>{
        if(res.data.errcode){
          this.$message.error(res.data.errmsg);
          return;
        }
        console.log(res.data.data);
        this.listPaper = res.data.data;
      });

      userAnswerTotalApi().then( (res) => {
        if(res.data.errcode){
          this.$message.error(res.data.errmsg);
          return;
        }
        console.log(res.data.data);
        this.pagination.total = res.data.data.total;
      });
    },
    methods:{
      editPaper(paperId){
        this.$message.success('后续补充！');
        // this.$router.push({path: '/question/edit/'+ paperId});
      },

      handleTableChange (pagination, filters, sorter) {
        this.pageLoading = true;
        console.log(pagination);
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;

        userAnswerListApi({
          pageIndex: this.pagination.current,
          pageNum: this.pagination.defaultPageSize
        }).then((res) =>{
          this.pageLoading = false;
          if(res.data.errcode){
            this.$message.error(res.data.errmsg);
            return;
          }
          this.listPaper = res.data.data;

        });
      }
    },
    filters: {
      useTimeFormat
    },
    computed: {
    },
  }
</script>