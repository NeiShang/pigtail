// pages/local/local.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
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
        index:0,
        pickPlayerA:false,
        pickPlayerB:false,
        cardSelected:false,
        isHandCard:false,
        turn:0,
        suit:"",
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
 
    //判断花色是否相同
    judgeSuit:function(suit1, suit2){
        if(suit1[0]==suit2[0]) return true;
        else return false;
    },

    //获取当前回合的玩家
    getCurrentPlayer:function(){
        if(this.data.pickPlayerA) return "A";
        else return "B";
    },

    //点击牌堆的牌之后
    clickCard:function(){
        this.setData({
            cardSelected:true,
            isHandCard:false,
        })
    },

    //点击玩家的手牌之后
    clickPlayerCard:function(para){
        var suit=para.currentTarget.dataset.index
        if(this.data.pickPlayerA){
            if(!this.data.playerACard[suit][0]) return;
        }
        else{
            if(!this.data.playerBCard[suit][0]) return;
        }
        this.setData({
            cardSelected:true,
            isHandCard:true,
            suit:suit,
        })
    },

    //用户点击确定后
    clickConfirm:function(){
        if(this.data.isHandCard) this.outCard();
        else this.touchCard();
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
            pickPlayerA:!this.data.pickPlayerA,
            pickPlayerB:!this.data.pickPlayerB,
            cardSelected:false,
            isHandCard:false,
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
    
    //摸牌
    touchCard:function(){
        var player;
        player=this.getCurrentPlayer();
        var number=this.data.index;
        if(this.data.cardPool.length==0){
            //判断谁赢
            return;
        }
        var topCard=this.data.cardPool[number];
        this.data.cardPool.splice(number, 1);
        this.setData({
	        cardPool: this.data.cardPool
        });
        //console.log(this.data.cardPool.length);
        console.log(topCard);
        number=Math.floor(Math.random() * this.data.cardPool.length);
        this.setData({
            index:number,
        });
        if(this.data.cardShowed.length==0||!this.judgeSuit(topCard,this.data.cardShowed[0])){//若展示区为空或者牌堆顶牌不一致，则牌加入展示区
            this.data.cardShowed.unshift(topCard);
            this.setData({
                cardShowed: this.data.cardShowed
            })
        }
        else{
            this.data.cardShowed.unshift(topCard);
            this.setData({
                cardShowed: this.data.cardShowed
            })
            this.getCard(player)
        }
    },
    
    //出牌
    outCard:function(){
        var topCard;
        var suit=this.data.suit
        
        var player=this.getCurrentPlayer();
        
        switch(player){
            case "A":
                topCard=this.data.playerACard[suit][0];
                this.data.playerACard[suit].shift();
                this.setData({
                    playerACard:this.data.playerACard,
                })
                break;
            case "B":
                topCard=this.data.playerBCard[suit][0];
                this.data.playerBCard[suit].shift();
                this.setData({
                    playerBCard:this.data.playerBCard,
                })
                break;
        }
        if(this.data.cardShowed.length==0||!this.judgeSuit(topCard,this.data.cardShowed[0])){//若展示区为空或者牌堆顶牌不一致，则牌加入展示区
            this.data.cardShowed.unshift(topCard);
            this.setData({
                cardShowed: this.data.cardShowed  
            })
        }
        else{
            this.data.cardShowed.unshift(topCard);
            this.setData({
                cardShowed: this.data.cardShowed
            })
            this.getCard(player);
        }
    },

    //获得当前牌的花色
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
    
    //重新选择一张牌
    selectAnother:function(){
        var number=Math.floor(Math.random() * this.data.cardPool.length);
        this.setData({
            index:number,
        });
    },
    
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var number=Math.floor(Math.random() * 52);	// 返回 0 至 51 之间的数
        this.setData({
            cardPool:[
                "C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","CJ","CQ","CK",
                "D1","D2","D3","D4","D5","D6","D7","D8","D9","D10","DJ","DQ","DK",
                "H1","H2","H3","H4","H5","H6","H7","H8","H9","H10","HJ","HQ","HK",
                "S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","SJ","SQ","SK"
            ],
            index:number,
            pickPlayerA:false,
            pickPlayerB:true,
            cardSelected:false,
            isHandCard:false,
        });
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