// pages/PVP/PVP.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardPool:{},//采用键值对
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
        cardSelected:false,
        yourTurn:true,
        type:0,
        suit:"",
        card:"",
        playerId:"0",
        start:false,
        end:false,
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
        if(!this.data.playerBCard[suit][0]) return;
        else card=this.data.playerBCard[suit][0]
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
        var card=this.data.card;
        var that=this;
        if(this.data.type==0){
            wx.getrequest({
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
                        var playerId=res.data.data.last_code[0];
                        var type=res.data.data.last_code[2];
                        var card=res.data.data.slice(4,6);
                        that.update(playerId,type,card);
                    }
                }
            })
        }
        else{
            wx.getrequest({
                url:"http://172.17.173.97:9000/api/game/"+uuid,
                method:"PUT",
                data:{
                    type:1,
                    card:card,
                },
                success(res){
                    if(res.data.code==200){
                        var playerId=res.data.data.last_code[0];
                        var type=res.data.data.last_code[2];
                        var card=res.data.data.slice(4,6);
                        that.update(playerId,type,card);
                    }
                }
            })
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
        //数据设定未完成
        this.setData({
            cardSelected:false,
            card:"",
            suit:"",
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



        console.log(this.data.cardPool)
        console.log(this.data.cardShowed)
        console.log(this.data.playerACard)
        console.log(this.data.playerBCard)
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
        if(playerId==this.data.playerId){
            if(type==0){
                delete this.data.cardPool[card];
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
            if(type==1){
                suit=this.getSuit(card[0]);
                this.data.playerBCard[suit].splice(this.data.playerBCard[suit.indexOf(card),1]);
                //list.splice(list.indexOf(item), 1)
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
            if(type==0){
                delete this.data.cardPool[card];
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
            if(type==1){
                suit=this.getSuit(card[0]);
                this.data.playerBCard[suit].splice(this.data.playerBCard[suit.indexOf(card),1]);
                //list.splice(list.indexOf(item), 1)
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
                    this.getCard("A");
                }
            }
        }
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
        var end=false;
        //进入房间后，每隔一秒进行一次请求，直至游戏开始
        var timer1 = setInterval(function () { 
            wx.getrequest({
                url:"http://172.17.173.97:9000/api/game/"+uuid+"/last",
                method:"GET",
                header: {
                    "Content-Type" : 'application/x-www-form-urlencoded ',
                    "Authorization": token
                },
                success(res){
                    if(res.data.code==403){
                        wx.showToast({
                            title: '人还没齐，快去召唤你的小伙伴吧！',
                            icon: 'none',
                            duration: 1000
                        })
                    }
                    else{
                        var yourTurn=res.data.data.your_turn;
                        that.setData({
                            yourTurn:yourTurn,
                        })
                        end=true
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
        }, 1000) //循环时间 这里是1秒
        //游戏开始后，每隔一秒进行一次请求
        wx.showToast({
            title: '游戏开始',
            icon: 'none',
            duration: 1000
        })
        
        while(1){
            end=false;
            var timer2 = setInterval(function () { 
                wx.getrequest({
                    url:"http://172.17.173.97:9000/api/game/"+uuid+"/last",
                    method:"GET",
                    header: {
                        "Content-Type" : 'application/x-www-form-urlencoded ',
                        "Authorization": token
                    },
                    success(res){
                        if(res.data.code==200){
                            if(res.data.data.your_turn){
                                if(res.data.data.last_code){
                                    var playerId=res.data.data.last_code[0];
                                    var type=res.data.data.last_code[2];
                                    var card=res.data.data.slice(4,6);
                                    that.update(playerId,type,card);
                                }
                                end=true;
                                that.setData({
                                    yourTurn:true,
                                })
                            }
                        }
                        else{
                            //对局结束
                            that.setData({
                                end:true,
                            })
                            end=true
                        }
                    },
                })
                
                if(end)
                { 
                    clearInterval(timer2) 
                } 
            }, 1000) //循环时间 这里是1秒
            if(this.data.end) break;//对局结束
        }
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