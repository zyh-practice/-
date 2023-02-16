// pages/recommendSong/recommendSong.js
import pubSub from 'pubsub-js'
import request from '../../../utils/request'
import getDate from '../../../utils/getDate'
Page({

    myDate: new Date(),
    /**
     * 页面的初始数据
     */
    data: {
        date: {
            hour: '00',
            minute: '00',
            second: '00'
        },
        handleInter: 0,
        recommendList: [], //歌曲列表
        index: '' //跳转歌曲下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
          })
        this.getRecommendList()

        // 订阅消息
        pubSub.subscribe('switchType', (msg, type) => {
            let {
                recommendList,
                index
            } = this.data
            if (type == 'pre') {
                index == 0 ? wx.showToast({
                    title: '这已经是第一首了',
                    icon: 'none'
                }) : index -= 1
            }
            if (type == 'next') {
                (index == recommendList.length - 1) && (index = -1)
                index += 1
            }
            this.setData({
                index
            })

            let musicId = recommendList[index].id
            // 将音乐id回传
            pubSub.publish('musicId', musicId)
        })

    },

    //得到推荐歌曲
    async getRecommendList() {
        let recommendList = await request('/recommend/songs')
        this.setData({
            recommendList: recommendList.recommend,
        })
        wx.hideLoading({
          success: (res) => {},
        })
    },

    // 跳转到详情页面
    toSongDetail(e) {
        let {
            index,
            song
        } = e.currentTarget.dataset
        this.setData({
            index
        })
        wx.navigateTo({
            url: '/songPackage/pages/songDetail/songDetail?musicId=' + song.id,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

        
        let handleInter = setInterval(() => {

            this.setData({
                date: getDate(new Date)
            })

        }, 1000)

        this.setData({
            handleInter
        })

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

        clearInterval(this.data.handleInter)
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