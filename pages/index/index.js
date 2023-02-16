// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
       bannerList:[],//轮播图
       recommendList:[],//推荐内容
       topList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
    //    轮播图
       let bannerData=await request('/banner',{type:1})
       this.setData({
            bannerList:bannerData.banners
       })
    //推荐内容
       let recommendList=await request('/personalized',{limit:10})
       this.setData({
           recommendList:recommendList.result,
       })
      
    //    热歌榜
    let index=0
    let topList=[]
    while(index<5){
        let toplistData=await request('/top/list',{idx:index++})
        let toplistItem={name:toplistData.playlist.name,tracks:toplistData.playlist.tracks.slice(0,3),id:toplistData.playlist.id}
        topList.push(toplistItem)
        this.setData({
            topList,
        })
    }
    
   
    },
    // 跳转至推荐歌曲
    toRecommendSong(){
        wx.navigateTo({
          url: '/songPackage/pages/recommendSong/recommendSong',
        })
    },

    // 跳转到搜索页面
    toSearch(){
        wx.navigateTo({
          url: '/songPackage/pages/search/search',
        })
    },

    // 跳转到详情页面
    toDetail(e){
        let id=e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/songPackage/pages/songDetail/songDetail?musicId=' + id,
        })
    },

    // 跳转到热歌榜单
    toRecommendList(e){
        let id=e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/songPackage/pages/recommendList/recommendList?id='+id
        })
    },

    // 跳转到歌单详情
    toListDetail(e){
        let id=e.currentTarget.dataset.id
        console.log(id);
        wx.navigateTo({
          url: '/pages/songList/songList?id='+id,
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