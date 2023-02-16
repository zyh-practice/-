// pages/comments/comments.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index:[1,1,1],//数组
         isTrue:[false,false,true],
         hotComments:[],//热门评论
         comments:[],//评论
         songId:'',//歌曲id
         total:'',//评论总数
         arr:[],
         id:'',//歌曲id
         song:{},//歌曲详情
         forComment:false,//回复
         indexs:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            id:options.id
        })
       this.getComments(options.id);
       this.gethotComment(options.id)
       this.getMusic(options.id)
    },
    forcomment(e){
        let {forComment}=this.data
        let indexs=e.currentTarget.dataset.index
       this.setData({
           forComment:!forComment,
           indexs,
       })
       
    },
    async getMusic(id){
       let result=await request('/song/detail',{ids:id})
       console.log(result,'2');
       this.setData({
         song:result.songs[0]
       })
    },
    // 得到基本plun
    async getComments(id){
        let result=await request('/comment/music',{id,offset:280})
        let arr=result.comments
        result.comments.sort((a,b)=>{
            return b.beReplied.length-a.beReplied.length
        })
        this.setData({
            arr,
         comments:result.comments,
         songId:result.userId,
         total:result.total,
        })
        wx.setNavigationBarTitle({
            title: '共'+this.data.total+'条',
        })
        console.log(result);
    },
    //得到热门评论
    async gethotComment(id){
        let result=await request('/comment/hot',{id,type:0,offset:40})
        this.setData({
            hotComments:result.hotComments
        })
    },

    // 改变推荐、最新，最热状态
    changeClass(e){
      let arr=this.data.isTrue
      let number=e.currentTarget.dataset.index
      arr=arr.map((value,index)=>{
          return index==number?true:false
      })
      this.setData({
          isTrue:arr
      })
    },
    async tobar(e){
        console.log(e);
        if(e.currentTarget.dataset.name=='推荐'){
        let {index,arr}=this.data
        console.log(arr);
        let result=await request('/comment/music',{id:this.data.id,limit:20,offset:++index[0]*20,before:arr[(index[0]-1)*20-1].time})
        console.log(result.comments,'1');
        arr.push(...result.comments)
        this.setData({
            index,
            arr,
        })
    }else if(e.currentTarget.dataset.name=='最热'){
        let {index,hotComments}=this.data
        console.log(hotComments)
        let result=await request('/comment/hot',{id:this.data.id,type:0,offset:++index[2]*20,before:(index[2]-1)*20-1})
        hotComments.push(...result.hotComments)
        this.setData({
            index,
            hotComments,
        })
    }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})