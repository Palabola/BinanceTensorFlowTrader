// TensorFlow + Binance BTC predicter!

BinanceClass.websocket_start();

BinanceClass.update_loop();

window.last_update = 0;

window.loging = [];


async function draw_loop()
{
    // Keep datas up to date!
    TensorClass.exchange_data_set(BinanceClass.data);


    if(window.last_update != BinanceClass.last_update)
    {
        data_set(BinanceClass.data.length);

        BinanceClass.get_balance();

        window.last_update = BinanceClass.last_update;


        if(TensorClass.predict.length > 0)
        {
            TensorClass.real_price_set(close);
        }

        TensorClass.update_and_train().then(() =>
        {
            next_predict(TensorClass.last_predict);
            modell_difficulty(TensorClass.difficulty);

            let depth_bid = depth_grouper(BinanceClass.depth.bids);
            let depth_ask = depth_grouper(BinanceClass.depth.asks);
            depth_bid = depth_volume_predict('bid',depth_bid,BinanceClass.data[BinanceClass.data.length-1][7]),
            depth_ask = depth_volume_predict('ask',depth_ask,BinanceClass.data[BinanceClass.data.length-1][7]),


            window.loging.push(
            [
            BinanceClass.last_update/1000,
            rounding_array(TensorClass.last_predict),
            rounding(TensorClass.difficulty,0),
            rounding(BinanceClass.data[BinanceClass.data.length-1][5]), // Total Volume
            rounding(BinanceClass.data[BinanceClass.data.length-1][9]), // Buy Volume
            depth_bid.small,
            depth_bid.big,
            depth_ask.small,
            depth_ask.big
            ]);


            log_print(window.loging);
            console.log(window.loging);

        }); 
    }

    live_fields(BinanceClass.last_update,BinanceClass.tick_data.close);

           
              
}


setInterval(draw_loop, 3000);



function depth_grouper(depth)
{

    let values = Object.keys(depth);

    let new_depth = {};

        for(let i = 0; i < values.length; i++)
            {
                let round = rounding(values[i],0);

               if(new_depth[round]) 
               {
                new_depth[round] = rounding(new_depth[round] + depth[values[i]]*values[i],0);
               }
               else
               {
                new_depth[round] = rounding(depth[values[i]]*values[i],0); 
               }
            }


      return new_depth;     
}

function depth_volume_predict(type,depth,volume) /* type = 'bid','ask' , depth, volume  */
{

   // console.log(type,depth,volume);
      let values = Object.keys(depth);  
            if(type == 'bid') // Need desc shot
                {
                    values.reverse();
                }  

        let predict = {};
        predict.small = Number(values[0]);
        predict.big = Number(values[0]);
        let volume_big = volume*3;  

      for(i = 0; i < values.length; i++)
      {
        volume = volume-depth[values[i]];
        volume_big = volume_big-depth[values[i]];

        if(volume < 0 && i > 1 && predict.small == values[0]) // Volume filled the Orderbook
        {
           predict.small = Number(values[i-1]); // Return Last fit price!  
        }

        if(volume_big < 0 && i > 1 && predict.big == values[0]) // Volume filled the Orderbook
        {
           predict.big = Number(values[i-1]); // Return Last fit price!  
           continue;
        }
      }

     return predict; 

}




function rounding(value,dec = 2)
{
    let coeff = Math.pow(10, dec);

   return Math.round(value * coeff) / coeff;
}

function rounding_array(array,dec = 2)
{
        let coeff = Math.pow(10, dec);
        let array_new = [];
    
        for (let i = 0; i < array.length; i++)
        {
            //console.log(Number(array[i]));
            array_new[i] = Math.round(Number(array[i]) * coeff) / coeff;    
        }
    
        return array_new;
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