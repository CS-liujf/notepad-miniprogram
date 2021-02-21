// pages/notebook/notebook.js
const app = getApp()
const db=wx.cloud.database();
const notes=db.collection('notes');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'',
    list:[],
    isEmpty:false,
    isMax:false,
    proh:false,
    openid:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  add:function(e){
    console.log(e);
    if(e.detail.value==0){
      this.setData({isEmpty:true});
      console.log('输入不能为空');
      console.log(this.data.isEmpty);
    }
    else if(e.detail.value.length>15)
      this.setData({isMax:true});
    else{
      this.setData({isMax:false});
      this.setData({isEmpty:false});
      this.setData({inputValue:e.detail.value});
      this.data.list.push(this.data.inputValue);
      this.setData({list:this.data.list, inputValue:'', proh:false});
      this.updateDataBase();
    }
  },

  updateDataBase:function(){
    notes.where({_openid:this.data.openid}).update({
      data:{
        message:this.data.list
      }
    }).then(res=>{console.log(res)});
  },

  del:function(e){
    console.log(e);
    this.data.list.splice(e.currentTarget.dataset['id'],1);
    this.setData({list:this.data.list});
    //更新数据库
    this.updateDataBase();
    if(this.data.list.length==0){
      this.setData({proh:true})
    }
    
  },

  clear:function(){
    console.log(this.data.userInfo);
    this.setData({list:[], proh:true});
    console.log('succeed');
    //更新数据库
    this.updateDataBase();
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    wx.cloud.callFunction({
      name:'getOpenId'
    })
    .then(res =>{
      console.log(res.result.openid);
      this.setData({openid:res.result.openid});
      notes.where({_openid:this.data.openid}).get()
      .then(res=>{
          if(res.data.length==0){
            console.log('不在数据库内');
            notes.add({
              data:{
                message:[]
              }
            })
            .then(res=>{console.log(res)})}
          else
            this.setData({list:res.data[0].message});
        }
      );
    });
    wx.stopPullDownRefresh();
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  log:function (){
    console.log('yes');
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})