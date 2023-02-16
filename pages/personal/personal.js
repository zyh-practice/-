// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0; // 手指起始的坐标
let moveY = 0; // 手指移动的坐标
let moveDistance = 0; // 手指移动的距离

Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform:'',
        coveTransition:'',
        userInfo:{},//用户信息
        recentPlayList:[],//播放记录
        collectVideo:[],//收藏视频
        delete:false,//删除按钮
        mvid:'',//mvid
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       let userInfo=wx.getStorageSync('userInfo')
       if(userInfo){
           this.setData({
               userInfo:JSON.parse(userInfo)
           })
       }

    //    获得浏览记录
      this.getUserRecentPlayList()
      this.getCollectVideo()
       
    },

    //获得用户浏览记录
    async getUserRecentPlayList(){
        let recentPlayListData=await request('/user/record',{uid:6332513301,type:0})
        let index=0
        let recentPlayList=recentPlayListData.allData.splice(0,10).map(item=>{
            item.id=index++
            return item
        })
        let userInfo=await request('/user/detail',{uid:6332513301})
        this.setData({
            recentPlayList,
            userInfo:userInfo
        })
    },
    //获得收藏视频
    async getCollectVideo(){
          let result=await request('/mv/sublist')
          console.log(result.data);
          this.setData({
              collectVideo:result.data
          })
    },
    toVideo(e){
        console.log(e.currentTarget.dataset.id);
    },
    //删除按钮出现
    deleteVideo(e){
       
        wx.vibrateShort({
          type: 'light',
        })
        this.setData({
            delete:true,
            mvid:e.currentTarget.dataset.id
        })
    },

    //删除视频
    async deleteVideos(){
        let id=this.data.mvid
         let result =await request('/video/sub',{id,t:0})
          wx.showToast({
              icon:'none',
            title: result.message,
          })
          this.setData({
              delete:false
          })
    },

    // 点击全屏取消按钮
    qvxiao(){
        this.setData({
            delete:false
        })
    },
   
    handleTouchStart(event){
        this.setData({
          coveTransition: ''
        })
        // 获取手指起始坐标
        startY = event.touches[0].clientY;
      },
      handleTouchMove(event){
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;
        
        if(moveDistance <= 0){
          return;
        }
        if(moveDistance >= 80){
          moveDistance = 80;
        }
        // 动态更新coverTransform的状态值
        this.setData({
          coverTransform: `translateY(${moveDistance}rpx)`
        })
      },
      handleTouchEnd(){
        // 动态更新coverTransform的状态值
        this.setData({
          coverTransform: `translateY(0rpx)`,
          coveTransition: 'transform 1s linear'
        })
      },

    //   调转至login
      toLogin(){
        wx.navigateTo({
          url: '/loginPackage/pages/login/login',
        })
    },
    //跳转音乐播放界面
    toDetail(e){
        wx.navigateTo({
            url: '/songPackage/pages/songDetail/songDetail?musicId='+e.currentTarget.dataset.id,
          })
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