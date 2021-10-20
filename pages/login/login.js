// pages/login/login.js
Page({

    data: {
        student_id:"",
        password:"",
    },

    login:function(){
        console.log(this.data.student_id);
        console.log(this.data.password);
        console.log(typeof(this.data.student_id));
        // wx.redirectTo({
        //     url:"/pages/gamelobby/gamelobby"
        // })
        var student_id=this.data.student_id;
        var password=this.data.password;
        console.log(student_id)
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
                console.log(res.data)
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