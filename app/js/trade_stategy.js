
class TRADE_BRAIN{

	constructor() {
        this.balance = {};
        this.trades = {};
        this.depth = {};
        this.symbol = 'BTCUSDT';
    }

}






/* OLD BUY SYSTEM :) */

/*
let depth_bid = depth_grouper(BinanceClass.depth.bids);
let depth_ask = depth_grouper(BinanceClass.depth.asks);

console.log('Volume: ', BinanceClass.data[BinanceClass.data.length-1][5],BinanceClass.data[BinanceClass.data.length-1][9]);

console.log('Bids: ',depth_volume_predict('bid',depth_bid,BinanceClass.data[BinanceClass.data.length-1][7]));
console.log('Asks: ',depth_volume_predict('ask',depth_ask,BinanceClass.data[BinanceClass.data.length-1][7]));

// Buy / Sell test 01: 0.00000073 31.29290460 over 0.00000073 30.93924752 with 7% BTC price loss!
/*

if(BinanceClass.balances.BTC) 
{
   console.log(BinanceClass.balances.BTC.available,BinanceClass.balances.USDT.available);
}


if(Math.abs(TensorClass.last_predict - BinanceClass.tick_data.close) > 5 && TensorClass.last_predict > 0 && TensorClass.difficulty < 500)
{
    new_action(TensorClass.last_predict,BinanceClass.tick_data.close); 

    let stepSize = 0.00010000;

    if(TensorClass.last_predict - BinanceClass.tick_data.close > 15 && BinanceClass.balances.USDT.available > 20) // Buy!
    {
        let quantity = BinanceClass.balances.USDT.available/BinanceClass.tick_data.close; // IN BTC

        quantity = binance.roundStep(quantity, stepSize);

        binance.marketBuy("BTCUSDT", quantity);
    }

    if(TensorClass.last_predict - BinanceClass.tick_data.close < 10 && BinanceClass.balances.BTC.available > 0.002) // Sell!
    {
        let quantity = BinanceClass.balances.BTC.available;

        quantity = binance.roundStep(quantity, stepSize);

        binance.marketSell("BTCUSDT", quantity);

    }

}
*/

/* Pump & Dump trader */
/*
binance.cancelOrders(BinanceClass.symbol, (error, response, symbol) => {
            
    console.log('Cleaned orders: ',response);
    

    let pump_wait = BinanceClass.tick_data.close*0.02;
    let depth_bid = depth_grouper(BinanceClass.depth.bids);
    let depth_ask = depth_grouper(BinanceClass.depth.asks);

    depth_bid = depth_volume_predict('bid',depth_bid,BinanceClass.data[BinanceClass.data.length-1][7]);
    depth_ask = depth_volume_predict('ask',depth_ask,BinanceClass.data[BinanceClass.data.length-1][7]);

    let trend = BinanceClass.trend(240);

    let stepSize = 0.00010000;  

    
   // console.log('Volume: ', BinanceClass.data[BinanceClass.data.length-1][5],BinanceClass.data[BinanceClass.data.length-1][9]);
    
    console.log('Bids: ',depth_bid);
    console.log('Asks: ',depth_ask);

    // Up trend strategy! 
 
    if(depth_ask.big - BinanceClass.tick_data.close > pump_wait && TensorClass.last_predict > 0 && trend == 'up') // SELL and take profit!
    {
        console.log('SELL ORDER!');

        let quantity = BinanceClass.balances.BTC.available;

        quantity = binance.roundStep(quantity, stepSize);

        binance.sell(BinanceClass.symbol, quantity, depth_ask.big); 
    }

    if(depth_bid.small < BinanceClass.tick_data.close && TensorClass.last_predict > 0 && trend == 'up') // BUY and wait for profit
    {
        console.log('BUY ORDER!');

        let quantity = BinanceClass.balances.USDT.available/depth_bid.small; 

        quantity = binance.roundStep(quantity, stepSize);

        binance.buy(BinanceClass.symbol, quantity, depth_bid.small); 
    }

    console.log(depth_bid.small,BinanceClass.tick_data.close,TensorClass.last_predict);


    
  });
  */