<template>


    <div>
        <a-breadcrumb>
            <a-breadcrumb-item>问卷系统</a-breadcrumb-item>
            <a-breadcrumb-item>列表</a-breadcrumb-item>
        </a-breadcrumb>

        <div>
            <router-link :to="{path: '/question/edit'}">
                <a-button icon="plus">创建问卷</a-button>
            </router-link>
        </div>

        <a-table :columns="columns" :dataSource="listPaper"
                 :pagination="pagination"
                 :loading="pageLoading"
                 @change="handleTableChange">
            <a slot="trtitle" slot-scope="text, record" :href=" '/mobile/'+ record.uri " target="_blank">{{text}}</a>
            <span slot="action" slot-scope="text, record, index">
                <span v-if="text.isPublish == 0">
              <a href="javascript:;" @click="editPaper(text.id)">编辑</a>

                <a-divider type="vertical" />
                <a-popconfirm title="发布后不能修改哟 确定发布吗？" @confirm="publishPaper(text.id, index)" okText="确定" cancelText="取消">
                    <a href="javascript:;">发布</a>
                </a-popconfirm>

                <a-divider type="vertical" />
                     </span>
                <a-popconfirm title="确定删除吗？" @confirm="delPaper(text.id, index)" okText="确定" cancelText="取消">
                    <a href="javascript:;">删除</a>
                </a-popconfirm>
            </span>
        </a-table>
    </div>
</template>
<script>

    import {listPaperApi, paperTotalApi, deletePaperApi, publishPaperApi} from '@/api/question';
    import {CookieUtil} from '@/utils/common'

    export default {
        data() {
            return {
                columns: [{
                    title: '试卷类型',
                    dataIndex: 'type',
                }, {
                    title: '题目',
                    dataIndex: 'title',
                    scopedSlots: { customRender: 'trtitle' },
                }, {
                    title: '题目数量',
                    dataIndex: 'contentNum',
                },
                    {
                        title: '浏览次数',
                        dataIndex: 'view',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        scopedSlots: { customRender: 'action' },
                    }],
                listPaper: [],
                pageNum: 10,
                pageIndex: 1,
                pageLoading: false,
                pagination: {
                    defaultPageSize: 6,
                    current: 1,
                    total: 0
                }
            }
        },
        mounted(){
            listPaperApi({
                pageIndex: this.pagination.current,
                pageNum: this.pagination.defaultPageSize,
            }).then((res) =>{
                if(res.data.errcode){
                    this.$message.error(res.data.errmsg);
                    return;
                }
                // console.log(res.data.data);
                this.listPaper = res.data.data;
            });

            paperTotalApi().then( (res) => {
                if(res.data.errcode){
                    this.$message.error(res.data.errmsg);
                    return;
                }
                // console.log(res.data.data);
                this.pagination.total = res.data.data.total;
            });
        },
        methods:{
            editPaper(paperId){
                this.$router.push({path: '/question/edit/'+ paperId});
            },
            //删除
            delPaper(paperId, qindex){
                this.pageLoading = true;
                deletePaperApi({
                    id: paperId,
                }).then((res) => {
                    this.pageLoading = false;
                    if(res.data.errcode){
                        this.$message.error(res.data.data);
                        return;
                    }
                    this.listPaper.splice(qindex, 1);
                    // this.listPaper[qindex].idDel=1;
                    this.$message.success('成功删除！');
                });
            },
            //发布
            publishPaper(paperId, qindex){
                publishPaperApi({
                    id: paperId
                }).then((res) => {
                    if(res.data.errcode){
                        this.$message.error(res.data.data);
                        return;
                    }
                    this.listPaper[qindex].isPublish = 1;
                    this.$message.success('成功发布！');
                });
            },

            handleTableChange (pagination, filters, sorter) {
                this.pageLoading = true;
                console.log(pagination);
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;

                listPaperApi({
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
        computed: {
        },
    }
</script>