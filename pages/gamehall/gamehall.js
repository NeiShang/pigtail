// pages/gamehall/gamehall.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomList:[],
        currentPage:1,
        uuid:"",
        isPrivate:false,
    },
    
    //加入房间
    joinRoom:function(para){
        var roomNumber=para.currentTarget.dataset.number;
        var uuid=this.data.roomList[roomNumber].uuid;
        var path = "http://172.17.173.97:9000/api/game/"+uuid;
        var token=wx.getStorageSync("token");
        wx.request({
            url:path,
            method:"POST",
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded ',
                "Authorization": token
            },
            success(res){
                console.log(res.data);
                if(res.data.code=="200"){
                    wx.setStorage({
                        key:"uuid",
                        data:uuid
                    })
                    wx.redirectTo({
                        url:"/pages/PVP/PVP"
                    })
                }
                else{
                    wx.showToast({
                        title: '加入失败，请重试',
                        icon: 'none',
                        duration: 1500
                    })
                }
            },
            fail(res){
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                    duration: 1500
                })
            }
        })
    },
    
    //通过uuid加入房间
    enterRoom:function(){
        var uuid=this.data.uuid;
        var token=wx.getStorageSync("token");
        var path = "http://172.17.173.97:9000/api/game/"+uuid;
        wx.request({
            url:path,
            method:"POST",
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded ',
                "Authorization": token
            },
            success(res){
                console.log(res.data);
                if(res.data.code=="200"){
                    wx.setStorage({
                        key:"uuid",
                        data:uuid
                    })
                    wx.redirectTo({
                        url:"/pages/PVP/PVP"
                    })
                }
                else{
                    wx.showToast({
                        title: '加入失败，请重试',
                        icon: 'none',
                        duration: 1500
                    })
                }
            },
            fail(res){
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                    duration: 1500
                })
            }
        })
    },

    //创建房间
    createRoom:function(){
        var token=wx.getStorageSync("token");
        wx.request({
            url:"http://172.17.173.97:9000/api/game",
            method:"POST",
            data:{
                private:this.data.isPrivate,
            },
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded ',
                "Authorization": token
            },
            success(res){
                if(res.data.code=="200"){
                    wx.setStorage({
                        key:"uuid",
                        data:res.data.data.uuid
                    })
                    wx.redirectTo({
                        url:"/pages/PVP/PVP"
                    })
                }
                else{
                    wx.showToast({
                        title: '创建房间失败，请重试',
                        icon: 'none',
                        duration: 1500
                    })
                }
            }
        })
    },

    bandChange(e){
        var isPrivate;
        if(e.detail.value=="public") isPrivate=false;
        else isPrivate=true;
        this.setData({
            isPrivate:isPrivate,
        })
    },

    //上一页
    clickPreviousPage:function(){
        var page=this.data.currentPage-1;
        var token=wx.getStorageSync("token");
        var that=this;
        page=page.toString();
        wx.request({
            url:"http://172.17.173.97:9000/api/game/index",
            method:"GET",
            data:{
                page_size:'4',
                page_num:page
            },
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded ',
                "Authorization": token
            },
            success(res){
                if(res.data.code=="200"){
                    page=parseInt(page)
                    that.setData({
                        roomList:res.data.data.games,
                        currentPage:page
                    })
                }
                else{
                    wx.showToast({
                        title: '加入线上游戏失败，请重试',
                        icon: 'none',
                        duration: 1500
                    })
                }
            }
        })
    },

    //下一页
    clickNextPage:function(){
        var page=this.data.currentPage+1;
        var token=wx.getStorageSync("token");
        var that=this;
        page=page.toString();
        wx.request({
            url:"http://172.17.173.97:9000/api/game/index",
            method:"GET",
            data:{
                page_size:'4',
                page_num:page
            },
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded ',
                "Authorization": token
            },
            success(res){
                if(res.data.code=="200"){
                    page=parseInt(page)
                    that.setData({
                        roomList:res.data.data.games,
                        currentPage:page
                    })
                }
                else{
                    wx.showToast({
                        title: '加入线上游戏失败，请重试',
                        icon: 'none',
                        duration: 1500
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(this.data.roomList[0].uuid)
        this.setData({
            currentPage:1,
        })
        var token=wx.getStorageSync("token");
        var that=this;
        //console.log(token)
        wx.request({
            url:"http://172.17.173.97:9000/api/game/index",
            method:"GET",
            data:{
                page_size:'4',
                page_num:'1'
            },
            header: {
                "Content-Type" : 'application/x-www-form-urlencoded ',
                "Authorization": token
            },
            success(res){
                // console.log(res);
                if(res.data.code=="200"){
                    that.setData({
                        roomList:res.data.data.games,
                    })
                }
                else{
                    wx.showToast({
                        title: '加入线上游戏失败，请重试',
                        icon: 'none',
                        duration: 1500
                    })
                }
                
                //console.log(that.data.roomList)
            },
            fail(res){
                console.log(token+"1")
                wx.showToast({
                    title: '网络错误，请重试',
                    icon: 'none',
                    duration: 1500
                })
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