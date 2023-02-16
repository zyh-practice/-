// pages/search/search.js
import request from '../../../utils/request'
let time
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '', //搜索框内容
        hotList: [], //热搜榜数据
        searchContent: '', //表单内容
        searchList: [], //搜索的内容
        historyList: [], //历史搜索
        index:2,//触底返回数据倍数
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getInitData()
        this.getSearchHistory()
    },
    // 获得初始化数据
    async getInitData() {
        let placeholderContent = await request('/search/default')
        let hotListData = await request('/search/hot/detail')
        this.setData({
            placeholderContent: placeholderContent.data.showKeyword,
            hotList: hotListData.data
        })

    },

    // 获取本地历史记录
    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory')
        if (historyList) {
            this.setData({
                historyList
            })
        }
    },

    // 表单内容改变
    handInputChange(e) {
        console.log('change')
        this.setData({
            searchContent: e.detail.value.trim()
        })
        console.log('sss');
        this.setStoryList()


    },

    // 清空历史缓存
    deleteSearchHistory() {
        wx.showModal({
            cancelColor: 'cancelColor',
            content: "确定删除历史记录吗",
            success: (e) => {
                if (e.confirm) {
                    this.setData({
                        historyList: []
                    })
                    // 删除本地缓存
                    wx.removeStorageSync('searchHistory')
                }
            }
        })
    },

    // 清空表单内容回调
    clearSearchContent() {
        this.setData({
            searchContent: ''
        })
    },

    // 跳转到详情页面
    toDetail(e) {
        let {
            id
        } = e.currentTarget.dataset
        let {
            historyList,
            searchContent
        } = this.data
        // 添加搜索记录
        if (historyList.indexOf(searchContent) !== -1) {
            historyList.splice(historyList.indexOf(searchContent), 1)
        }
        historyList.unshift(searchContent)
        this.setData({
            historyList
        })
        wx.setStorageSync('searchHistory', historyList)
        wx.navigateTo({
            url: '/songPackage/pages/songDetail/songDetail?musicId=' + id,
        })
    },

    // 点击热搜榜跳转
    toSearch(e) {
        console.log('热搜');
        let hotList = this.data.hotList
        this.setData({
            searchContent: hotList[e.currentTarget.dataset.index].searchWord
        })
        this.setStoryList()

    },
    // 点击历史搜索跳转
    toHistorySearch(e) {
        let history = this.data.historyList
        this.setData({
            searchContent: history[e.currentTarget.dataset.index]
        })
        this.setStoryList()

    },
    // 搜索列表展示
    setStoryList() {
        console.log('setstory');
        let {
            searchContent
        } = this.data
        // 获取模糊数据
        if (time) clearTimeout(time)
        time = setTimeout(async () => {
            let searchList
            if (this.data.searchContent) {
                searchList = await request('/search', {
                    keywords: searchContent,
                    limit: 20
                })
            } else {
                this.setData({
                    searchList: []
                })
                return
            }
            this.setData({
                searchList: searchList.result.songs
            })


        }, 500)
    },

    //触底调用
    async handleLower(){
        wx.showLoading({
          title: '加载中',
        })
        let {
            searchContent,index
        } = this.data
     let result=await request('/search',{
        keywords: searchContent,
        limit: 20+10*index
     })
     console.log(result);
     if(result.code==200){
     this.setData({
         index:++index,
        searchList: result.result.songs
     })
    }else{
        wx.showToast({
          title: '没有更多了',
          icon:'none'
        })
    }
    wx.hideLoading()
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