// pages/songList/songList.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      playList:{},//歌单信息
      songList:[],//歌曲信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
          title: '加载中',
        })
         this.getListData(options.id)
         console.log(2);
    },

    // 获得歌单详情
    async getListData(id){
      let result =await request('/playlist/detail',{id})
      this.setData({
        playList:result.playlist
    })
    let songList=result.playlist.tracks
    this.setData({
        songList
    })
    wx.hideLoading()

    },

    //跳转到详情页面
    toDetail(e){
        console.log(e.currentTarget.dataset.id);
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