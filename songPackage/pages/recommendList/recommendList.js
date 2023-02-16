// pages/recommendList/recommendList.js
import request from '../../../utils/request'
import pubSub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
       recommendData:{},//榜单数据
       songList:[],//榜单列表
       index:'',//现在播放index
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
          })
        let id=options.id
        this.getListData(id)

        // 订阅消息
        pubSub.subscribe('switchType', (msg, type) => {
            let {
                songList,
                index
            } = this.data
            if (type == 'pre') {
                index == 0 ? wx.showToast({
                    title: '这已经是第一首了',
                    icon: 'none'
                }) : index -= 1
            }
            if (type == 'next') {
                (index == songList.length - 1) && (index = -1)
                index += 1
            }
            this.setData({
                index
            })

            let musicId = songList[index].id
            // 将音乐id回传
            pubSub.publish('musicId', musicId)
        })
    },
// 得到页面信息
   async getListData(id){
        let result=await request('/top/list',{idx:id})
        let now=new Date(result.playlist.updateTime)
        let recommendData={
            name:result.playlist.name,
            url:result.playlist.coverImgUrl,
            updateTime:now.getFullYear()+'年'+(now.getMonth()+1)+'月'+now.getDate()+'日',
            playCount:result.playlist.playCount
        }
        let songList=result.playlist.tracks.splice(0,30)
       songList.map((item)=>{
         item.dt= Math.floor(item.dt/1000/60*100)/100
         return item
       })
        this.setData({
            recommendData,
            songList,
        })
        wx.hideLoading({
          success: (res) => {},
        })
    },

    // 跳转到详情页面
    toDetail(e) {
        let {
            index,
            id
        } = e.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/songPackage/pages/songDetail/songDetail?musicId=' + id,
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