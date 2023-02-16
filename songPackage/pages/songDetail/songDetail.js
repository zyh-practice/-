// pages/songDetail/songDetail.js
import pubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../../utils/request'
let appInstance = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //判断是否播放
        song: {}, //歌曲详情
        musicUrl: '', //播放地址
        currentTime: '00:00', //当前播放时间
        durationTime: '00:00', //总时间
        currentWidth: 0, //当前长度
        currentTimes: 0, //当前播放时间S
        move: '', //移动类名
        allLyric:[],//歌词列表
        ishidden:true,//是否隐藏歌词
        love:false,//喜欢歌曲

    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        // 得到id和详细信息并自动播放
        await this.getMusicData(options.musicId)
        console.log(options.musicId,11);
        // 得到歌词信息
        this.getmusicLyric(options.musicId)
        //   判断音乐是否在播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === options.musicId) {
            this.setData({
                isPlay: true
            })
        }
        //   监视系统控制音乐播放,获得音乐管理者
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        this.backgroundAudioManager.onPlay(() => {
            // 修改音乐播放状态
            this.setData({
                isPlay: true,
            })
            appInstance.globalData.isMusicPlay = true
            appInstance.globalData.musicId = options.musicId
        })
        this.backgroundAudioManager.onPause(() => {
            // 修改音乐播放状态
            this.setData({
                isPlay: false
            })
            appInstance.globalData.isMusicPlay = false
        })
        this.backgroundAudioManager.onStop(() => {
            // 修改音乐播放状态
            this.setData({
                isPlay: false
            })
            appInstance.globalData.isMusicPlay = false
        })
        this.backgroundAudioManager.onTimeUpdate(() => {
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 390;
          
            this.setData({
                currentTime,
                currentWidth,
                currentTimes: this.backgroundAudioManager.currentTime,

            })
        })
        this.backgroundAudioManager.onEnded(() => {
            pubSub.publish('switchType', 'next')
            this.setData({
                currentWidth: 0,
                currentTime: 0
            })
        })
        this.backgroundAudioManager.src = this.data.musicUrl
        this.backgroundAudioManager.title = this.data.song.name //title必设，不然不会播放

        // 设定消息订阅监控
        pubSub.subscribe('musicId', async (msg, musicId) => {
            await this.getMusicData(musicId)
            this.musicControl(true, true)
        })
    },

    //隐藏歌词
    tohidden(){
        this.setData({
            ishidden:!this.data.ishidden
        })
    },

    async getmusicLyric(id){
       let result=  await request('/lyric',{id})
       let lyricList=result.lrc.lyric.split('\n')
       let allLyric=[]
       for(let i=0;i<lyricList.length;i++){
          let lyricArr=lyricList[i].split(']')
          let timeArr=lyricArr[0].substr(1).split(':')
          let time=timeArr[0]*60+Math.ceil(timeArr[1])
          let lyric=lyricArr[1]
          allLyric.push({
              time,
              lyric,
              id:i
          })
       }
       this.setData({
          allLyric
       })

    },

    // 获取音乐详情
    async getMusicData(musicId) {
        let songData = await request('/song/detail', {
            ids: musicId
        })
        let durationTime = moment(songData.songs[0].dt).format('mm:ss')
        this.setData({
            song: songData.songs[0],
            durationTime,
            currentTimes: 0
        })
        // 获得播放地址
        let musicClickData = await request('/song/url', {
            id: this.data.song.id
        })
        this.setData({
            musicUrl: musicClickData.data[0].url
        })

        wx.setNavigationBarTitle({
            title: this.data.song.name,
        })
    },

    // 点击播放、暂停的回调
    handleMusicPlay() {
        let isPlay = !this.data.isPlay
        // this.setData({
        //     isPlay
        // })
        this.musicControl(isPlay)
    },

    // 控制音乐播放的函数
    musicControl(isPlay, isPlays) {
        if (isPlay) {
            //   音乐播放
            if (isPlays) {
                this.backgroundAudioManager.startTime = 0
            } else {
                this.backgroundAudioManager.startTime = this.data.currentTimes
            }
            this.backgroundAudioManager.src = this.data.musicUrl
            this.backgroundAudioManager.title = this.data.song.name //title必设，不然不会播放
        } else {
            //   音乐暂停
            this.backgroundAudioManager.pause()
        }
    },

    // 点击切换歌曲的回调
    handleSwitch(e) {
        let type = e.currentTarget.id
        this.backgroundAudioManager.pause()
        
        // 触发回调
        pubSub.publish('switchType', type)
    },

    // 拖动进度条回调
    touchEnd(e) {
        let distance = e.changedTouches[0].clientX - e.currentTarget.offsetLeft;
        let time = distance * 2 / 390 * this.backgroundAudioManager.duration
        this.backgroundAudioManager.seek(time)
        this.setData({
            move: 0
        })

    },
    touchMove(e) {
        let currentLength = (e.changedTouches[0].clientX - e.currentTarget.offsetLeft) * 2;
        if (this.data.move == 0) {
            this.setData({
                move: 1
            })
        }
        this.setData({
            currentWidth: currentLength
        })
        
    },
    tocomment(){
       wx.navigateTo({
         url: '/pages/comments/comments?id='+this.data.song.id,
       })
    },

    //爱心改变
    changeLove(){
        let {love}=this.data
    this.setData({
        love:!love
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