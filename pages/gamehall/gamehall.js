// pages/gamehall/gamehall.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomList:[
            {
                "uuid":"",
                "host_id":"",
                "client_id":"",
                "create_at":""
            },
            {
                "uuid":"",
                "host_id":"",
                "client_id":"",
                "create_at":""
            },
            {
                "uuid":"",
                "host_id":"",
                "client_id":"",
                "create_at":""
            },
            {
                "uuid":"",
                "host_id":"",
                "client_id":"",
                "create_at":""
            },
            {
                "uuid":"",
                "host_id":"",
                "client_id":"",
                "create_at":""
            },
            {
                "uuid":"",
                "host_id":"",
                "client_id":"",
                "create_at":""
            },
        ],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(this.data.roomList[0].uuid)
        var token=wx.getStorageSync("token");
        var that=this;
        //console.log(token)
        wx.request({
            url:"http://172.17.173.97:9000/api/game/index",
            method:"GET",
            data:{
                page_size:'6',
                page_num:'1'
            },
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded ',
                "Authorization": token
            },
            success(res){
                // console.log(res);
                that.setData({
                    roomList:res.data.data.games,
                })
                //console.log(that.data.roomList)
            }
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

    }
})