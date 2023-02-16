// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], // 导航标签数据
        navId: '', // 导航的标识
        videoList: [], // 视频列表数据
        videoId: '', // 视频id标识
        videoUpdateTime: [], // 记录video播放的时长
        isTriggered: false, // 标识下拉刷新是否被触发
        index:2, //触底标识符
        loveList:[],//喜欢列表
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
          })
        this.getLove()
     this.getVideoGroupListData()
     
    },
    //收藏视频
    async collectVideo(e){
        let videoList=this.data.videoList
        videoList[e.currentTarget.dataset.index].love=!videoList[e.currentTarget.dataset.index].love
        console.log(e.currentTarget.dataset.id);
       let result=await request('/video/sub',{id:e.currentTarget.dataset.id,t:videoList[e.currentTarget.dataset.index].love?1:0})
       wx.showToast({
           icon:'none',
         title: result.message,
       })
       this.setData({
        videoList
       })
    },
    //获取列表数据
    async getVideoGroupListData(){
        let videoGroupData=await request('/video/group/list')
        this.setData({
            videoGroupList:videoGroupData.data.slice(0,14),
            navId:videoGroupData.data[0].id
        })
        this.getVideoList(this.data.navId)
    },
    async getLove(){
        let result=await request('/mv/sublist')
        this.setData({
          loveList:result.data
        })
    },
    //获取视频数据
    async getVideoList(navId){
        
       let videoList=await request('/video/group',{id:navId}) 
       console.log(navId,12);
       let loveList=this.data.loveList
    //    关闭正在加载
    wx.hideLoading()
       let index=0
       videoList=videoList.datas.map(item=>
        {
            item.id=index++
            loveList.forEach(e => {
              
                item.love=(item.data.vid==e.vid)
            });
            return item
        })
       this.setData({
           videoList:videoList,
           isTriggered:false
       })
    },
    //点击导航回调
    changeNav(e){
        let id=e.currentTarget.id
        this.setData({
            navId:id*1,
            
        })
        // 正在加载提示
        wx.showLoading({
          title: '正在加载',
        })
        this.getVideoList(this.data.navId)
    },
    // 点击播放和继续播放回调
    handlePlay(event){
        
        /*
          问题： 多个视频同时播放的问题
        * 需求：
        *   1. 在点击播放的事件中需要找到上一个播放的视频
        *   2. 在播放新的视频之前关闭上一个正在播放的视频
        * 关键：
        *   1. 如何找到上一个视频的实例对象
        *   2. 如何确认点击播放的视频和正在播放的视频不是同一个视频
        * 单例模式：
        *   1. 需要创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象，
        *   2. 节省内存空间
        * */
        
        let vid = event.currentTarget.id;
        // 关闭上一个播放的视频
        // this.vid !== vid && this.videoContext && this.videoContext.stop();
        // if(this.vid !== vid){
        //   if(this.videoContext){
        //     this.videoContext.stop()
        //   }
        // }
        // this.vid = vid;
        
        // 更新data中videoId的状态数据
        this.setData({
          videoId: vid
        })
        // 创建控制video标签的实例对象
         this.videoContext = wx.createVideoContext(vid);
        // 判断当前的视频之前是否播放过，是否有播放记录, 如果有，跳转至指定的播放位置
        let {videoUpdateTime} = this.data;
        let videoItem = videoUpdateTime.find(item => item.vid === vid);
       
        if(videoItem){
          //this.videoContext.seek(videoItem.currentTime);
          
        }else{
        //  this.videoContext.play();
        // this.videoContext.stop();
        }
      },

      // 监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
    let {videoUpdateTime} = this.data;
    /*
    * 思路： 判断记录播放时长的videoUpdateTime数组中是否有当前视频的播放记录
    *   1. 如果有，在原有的播放记录中修改播放时间为当前的播放时间
    *   2. 如果没有，需要在数组中添加当前视频的播放对象
    *
    * */
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
    if(videoItem){ // 之前有
      videoItem.currentTime = event.detail.currentTime;
    }else { // 之前没有
      videoUpdateTime.push(videoTimeObj);
    }
    // 更新videoUpdateTime的状态
    this.setData({
      videoUpdateTime
    })
  },

//   自定义下拉刷新
  handleRefresher(){
    //   再次获得数据
      this.getVideoList(this.data.navId)
  },

//   上拉触底的回调
  async handleToLower(){
      let index=(this.data.index-1)*8
      let videoList=await request('/video/group',{id:this.data.navId,offset:this.data.index})
      videoList.datas=videoList.datas.map(item=>
        {
            item.id=index++
            return item
        })
        let video=this.data.videoList
        video.push(...videoList.datas)
       this.setData({
           index:++(this.data.index),
           videoList:video
       })
    
  },
//   播放结束
handleEnded(){
    console.log('播放结束');
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