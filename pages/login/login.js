// pages/login/login.js
Page({

    data: {
        student_id:"",
        password:"",
    },

    login:function(){

        var student_id=this.data.student_id;
        var password=this.data.password;
        wx.request({
            url:"http://172.17.173.97:8080/api/user/login",
            method:"POST",
            data:{
                student_id: student_id,
                password: password,
            },
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded '
            },
            success(res){
                console.log(res.data.data.token)
                if(res.data.message=="Success"){
                    wx.setStorage({
                        key:"token",
                        data:res.data.data.token
                    })
                    console.log(res.data.data.detail.name)
                    wx.setStorage({
                        key:"name",
                        data:res.data.data.detail.name,
                    })
                    wx.redirectTo({
                        url:"/pages/gamelobby/gamelobby"
                    })
                }
                else{
                    wx.showToast({
                        title: '账号或密码错误，请重试',
                        icon: 'none',
                        duration: 1500
                    })
                }

            },
            fail(res){
                console.log(res);
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                    duration: 1500
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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