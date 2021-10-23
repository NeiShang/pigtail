// pages/PVP/PVP.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        time:"",
        cardPool:[],
        cardShowed:[],
        playerACard:{
            "Spade":[],
            "Heart":[],
            "Diomond":[],
            "Club":[],
        },
        playerBCard:{
            "Spade":[],
            "Heart":[],
            "Diomond":[],
            "Club":[],
        },
        uuid:"",
        cardSelected:false,
        yourTurn:false,
        type:0,
        suit:"",
        card:"",
        playerId:"0",
        start:false,
        end:false,
        firstReceived:false,
        cardPoolImage:"/images/poker/back.jpg",
        showAreaImage:"/images/poker/back.jpg",
        playerASpade:"/images/poker/back.jpg",
        playerAHeart:"/images/poker/back.jpg",
        playerAClub:"/images/poker/back.jpg",
        playerADiomond:"/images/poker/back.jpg",
        playerBSpade:"/images/poker/back.jpg",
        playerBHeart:"/images/poker/back.jpg",
        playerBClub:"/images/poker/back.jpg",
        playerBDiomond:"/images/poker/back.jpg",
    },

    //点击牌堆的牌之后
    clickCard:function(){
        this.setData({
            cardSelected:true,
            type:0,
        })
    },

    //点击玩家的手牌之后
    clickPlayerCard:function(para){
        var suit=para.currentTarget.dataset.index
        var card;
        if(!this.data.playerBCard[suit][0]) return;
        else {
            card=this.data.playerBCard[suit][0]
        }
        console.log(card)
        this.setData({
            cardSelected:true,
            type:1,
            suit:suit,
            card:card,
        })
    },
    //用户点击取消后
    clickCancel:function(){
        this.setData({
            cardSelected:false,
            suit:"",
            card:"",
        })
    },

    //用户点击确定后
    clickConfirm:function(){
        var token=wx.getStorageSync("token");
        var uuid=wx.getStorageSync("uuid");
        var that=this;
        if(this.data.type==0){
            wx.request({
                url:"http://172.17.173.97:9000/api/game/"+uuid,
                method:"PUT",
                data:{
                    type:0,
                },
                header: {
                    "Content-Type" : 'application/x-www-form-urlencoded ',
                    "Authorization": token
                },
                success(res){
                    if(res.data.code==200){
                        console.log(res.data.data.last_code)
                        var type=res.data.data.last_code[2];
                        var card=res.data.data.last_code.slice(4,7);
                        that.update("0",type,card);
                        that.setData({
                            cardSelected:false,
                            card:"",
                            suit:"",
                            firstReceived:false,
                            type:0,
                            yourTurn:false,
                        })
                        console.log(that.data.cardPool)
                        console.log(that.data.cardShowed)
                        console.log(that.data.playerACard)
                        console.log(that.data.playerBCard)
                        that.getPreviousStep();
                    }
                }
            })
        }
        else{
            wx.request({
                url:"http://172.17.173.97:9000/api/game/"+uuid,
                method:"PUT",
                data:{
                    type:1,
                    card:this.data.card,
                },
                success(res){
                    if(res.data.code==200){
                        console.log(res.data.data.last_code)
                        var type=res.data.data.last_code[2];
                        var card=res.data.data.last_code.slice(4,7);
                        that.update("0",type,card);
                        //此处代码应该放置到success中
                        that.setData({
                            cardSelected:false,
                            card:"",
                            suit:"",
                            firstReceived:false,
                            type:0,
                            yourTurn:false,
                        })
                        console.log(that.data.cardPool)
                        console.log(that.data.cardShowed)
                        console.log(that.data.playerACard)
                        console.log(that.data.playerBCard)
                        that.getPreviousStep();
                    }
                }
            })
        }
        


        
    },

    //获取上一步操作
    getPreviousStep:function(){
        var token=wx.getStorageSync("token");
        var that=this;
        var uuid=wx.getStorageSync("uuid");
        var end=false;
        var timer1 = setInterval(function () { 
            wx.request({
                url:"http://172.17.173.97:9000/api/game/"+uuid+"/last",
                method:"GET",
                header: {
                    "Content-Type" : 'application/x-www-form-urlencoded ',
                    "Authorization": token
                },
                timeout:1000,
                success(res){
                    if(res.data.code==200){
                        if(res.data.data.your_turn==true){
                            if(that.data.firstReceived==false){
                                if(res.data.data.last_code){
                                    console.log(res.data.data.last_code)
                                    var type=res.data.data.last_code[2];
                                    var card=res.data.data.last_code.slice(4,7);
                                    that.update("1",type,card);
                                }
                                end=true;
                                that.setData({
                                    yourTurn:true,
                                    firstReceived:true,
                                })
                            }
                            
                        }
                    }
                },
                fail(){
                    wx.showToast({
                        title: '网络错误!',
                        icon: 'none',
                        duration: 1000
                    })
                }
            })
            if(end)
            { 
                clearInterval(timer1) 
            } 
        }, 2000) 
        this.setData({
            time:timer1
        })
    },

    //判断花色是否相同
    judgeSuit:function(suit1, suit2){
        if(suit1[0]==suit2[0]) return true;
        else return false;
    },
    getSuit:function(firstLetter){
        var suit;
        switch(firstLetter){
                case "S":
                    suit="Spade";
                    break;
                case "H":
                    suit="Heart";
                    break;
                case "C":
                    suit="Club";
                    break;
                case "D":
                    suit="Diomond";
                    break;
        }
        return suit;
    },
    //更新牌堆，每次出牌摸牌都要进行此操作
    update:function(playerId,type, card){
        console.log(playerId)
        console.log(type)
        console.log(card)
        if(playerId==this.data.playerId){
            if(type=="0"){
                this.data.cardPool.splice(this.data.cardPool.indexOf(card),1);
                this.setData({
                    cardPool:this.data.cardPool,
                })
                if(this.data.cardShowed.length==0||!this.judgeSuit(card,this.data.cardShowed[0])){//若展示区为空或者牌堆顶牌不一致，则牌加入展示区
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                }
                else{
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                    this.getCard("B");
                }
            }
            if(type=="1"){
                suit=this.getSuit(card[0]);
                this.data.playerBCard[suit].splice(this.data.playerBCard[suit].indexOf(card),1);
                this.setData({
                    playerBCard:this.data.playerBCard,
                })
                if(this.data.cardShowed.length==0||!this.judgeSuit(card,this.data.cardShowed[0])){//若展示区为空或者牌堆顶牌不一致，则牌加入展示区
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                }
                else{
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                    this.getCard("B");
                }
            }
        }
        else{
            if(type=="0"){
                this.data.cardPool.splice(this.data.cardPool.indexOf(card),1);
                this.setData({
                    cardPool:this.data.cardPool,
                })
                if(this.data.cardShowed.length==0||!this.judgeSuit(card,this.data.cardShowed[0])){//若展示区为空或者牌堆顶牌不一致，则牌加入展示区
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                }
                else{
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                    this.getCard("A");
                }
            }
            if(type=="1"){
                suit=this.getSuit(card[0]);
                this.data.playerACard[suit].splice(this.data.playerBCard[suit].indexOf(card),1);
                this.setData({
                    playerACard:this.data.playerACard,
                })
                if(this.data.cardShowed.length==0||!this.judgeSuit(card,this.data.cardShowed[0])){//若展示区为空或者牌堆顶牌不一致，则牌加入展示区
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                }
                else{
                    this.data.cardShowed.unshift(card);
                    this.setData({
                        cardShowed: this.data.cardShowed
                    })
                    this.getCard("A");
                }
            }
        }
        var showAreaImage="/images/poker/back.jpg";
        var playerASpade="/images/poker/back.jpg";
        var playerAHeart="/images/poker/back.jpg";
        var playerAClub="/images/poker/back.jpg";
        var playerADiomond="/images/poker/back.jpg";
        var playerBSpade="/images/poker/back.jpg";
        var playerBHeart="/images/poker/back.jpg";
        var playerBClub="/images/poker/back.jpg";
        var playerBDiomond="/images/poker/back.jpg";
        if (this.data.cardShowed[0]) showAreaImage="/images/poker/"+this.data.cardShowed[0]+".jpg";
        if(this.data.playerACard["Spade"][0]) playerASpade="/images/poker/"+ this.data.playerACard["Spade"][0]+".jpg";
        if(this.data.playerACard["Heart"][0]) playerAHeart="/images/poker/"+ this.data.playerACard["Heart"][0]+".jpg";
        if(this.data.playerACard["Club"][0]) playerAClub="/images/poker/"+ this.data.playerACard["Club"][0]+".jpg";
        if(this.data.playerACard["Diomond"][0]) playerADiomond="/images/poker/"+ this.data.playerACard["Diomond"][0]+".jpg";
        if(this.data.playerBCard["Spade"][0]) playerBSpade="/images/poker/"+ this.data.playerBCard["Spade"][0]+".jpg";
        if(this.data.playerBCard["Heart"][0]) playerBHeart="/images/poker/"+ this.data.playerBCard["Heart"][0]+".jpg";
        if(this.data.playerBCard["Club"][0]) playerBClub="/images/poker/"+ this.data.playerBCard["Club"][0]+".jpg";
        if(this.data.playerBCard["Diomond"][0]) playerBDiomond="/images/poker/"+ this.data.playerBCard["Diomond"][0]+".jpg";
        this.setData({
            showAreaImage: showAreaImage,
            playerASpade: playerASpade,
            playerAHeart: playerAHeart,
            playerAClub: playerAClub,
            playerADiomond: playerADiomond,
            playerBSpade: playerBSpade,
            playerBHeart: playerBHeart,
            playerBClub: playerBClub,
            playerBDiomond: playerBDiomond,
        })
    },

    //收牌
    getCard:function(player){
        var count=this.data.cardShowed.length;
        var suit;
        console.log(count)
        var topCard;
        switch(player){
            case "A":
                while(count){
                    count-=1
                    topCard=this.data.cardShowed.pop();
                    suit=this.getSuit(topCard[0]);
                    this.data.playerACard[suit].unshift(topCard);
                }
                this.setData({
                    playerACard:this.data.playerACard,
                    cardShowed:this.data.cardShowed,
                })
                break;
            case "B":
                while(count){
                    count-=1
                    topCard=this.data.cardShowed.pop();
                    suit=this.getSuit(topCard[0]);
                    this.data.playerBCard[suit].unshift(topCard);
                }
                this.setData({
                    playerBCard:this.data.playerBCard,
                    cardShowed:this.data.cardShowed,
                })
                break;
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var token=wx.getStorageSync("token");
        var that=this;
        var uuid=wx.getStorageSync("uuid");
        this.setData({
            uuid:uuid
        })
        console.log(uuid);
        var end=false;
        this.setData({
            cardPool:[
                "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","CJ","CQ","CK",
                "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","DJ","DQ","DK",
                "H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","HJ","HQ","HK",
                "S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","SJ","SQ","SK"
            ],
        })
        //进入房间后，每隔一秒进行一次请求，直至游戏开始
        var timer1 = setInterval(function () { 
            wx.request({
                url:"http://172.17.173.97:9000/api/game/"+uuid+"/last",
                method:"GET",
                header: {
                    "Content-Type" : 'application/x-www-form-urlencoded ',
                    "Authorization": token
                },
                timeout:1000,
                success(res){
                    if(res.data.code==403){
                        wx.showToast({
                            title: '人还没齐，快去召唤你的小伙伴吧！',
                            icon: 'none',
                            duration: 1500
                        })
                    }
                    else if(res.data.code==200){
                        if(res.data.data.your_turn==true){
                            if(that.data.firstReceived==false){
                                wx.showToast({
                                    title: '游戏开始！',
                                    icon: 'none',
                                    duration: 1000
                                })
                                if(res.data.data.last_code){
                                    console.log(res.data.data.last_code)
                                    var type=res.data.data.last_code[2];
                                    var card=res.data.data.last_code.slice(4,7);
                                    that.update("1",type,card);
                                }
                                end=true;
                                that.setData({
                                    yourTurn:true,
                                    firstReceived:true,
                                })
                            }
                        }
                    }
                },
                fail(){
                    wx.showToast({
                        title: '网络错误，请重试',
                        icon: 'none',
                        duration: 1000
                    })
                }
            })
            if(end)
            { 
                clearInterval(timer1) 
            } 
        }, 2000) //循环时间 这里是1秒
        
        this.setData({
            time:timer1
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
        clearInterval(this.data.time)
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