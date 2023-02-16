// pages/login/login.js
import request from '../../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '', // 手机号
        password: '', // 用户密码
        tip:'',//验证码
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
   
       // 登录的回调
  async slogin(){
    // 1. 收集表单项数据
    let {phone, password} = this.data;
    // 2. 前端验证
    /*
    * 手机号验证：
    *   1. 内容为空
    *   2. 手机号格式不正确
    *   3. 手机号格式正确，验证通过
    * */
    
    if(!phone){
      // 提示用户
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    // 定义正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
  
    // 后端验证
    let result = await request('/login/cellphone', {phone, password, isLogin: true})
    // 自己加的
    
    console.log(wx.getStorageSync('s'));
    if(result.code === 200){ // 登录成功
      wx.showToast({
        title: '登录成功'
      })
      // 将用户的信息存储至本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      
      
      // 跳转至个人中心personal页面
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }else {
      wx.showToast({
        title: `${result.message}`,
        icon: 'none'
      })
    }
    console.log(result);
  },

  async login(){
    let result =await request(
        '/captcha/verify',
        {
           phone:this.data.phone,
           captcha:this.data.tip 
        }
    )
    console.log(result);
  },


  //验证码登录
  async getTip(){
    let result=await request(
        '/captcha/sent',
        {
          phone:this.data.phone
        }
    )
    if(result.code==200){
       wx.showToast({
           icon:'none',
         title: '发送成功',
       })
    }else{
        wx.showToast({
            icon:'none',
          title: result.message,
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