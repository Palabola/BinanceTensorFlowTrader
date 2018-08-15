// TensorFlow + Binance BTC predicter!

BinanceClass.websocket_start();

BinanceClass.update_loop();

window.last_update = 0;


async function draw_loop()
{
    // Keep datas up to date!
    TensorClass.exchange_data_set(BinanceClass.data);


    if(window.last_update != BinanceClass.last_update)
    {
        data_set(BinanceClass.data.length);

        BinanceClass.get_balance();

        window.last_update = BinanceClass.last_update;


        if(TensorClass.predict_get().length > 0)
        {
            TensorClass.real_price_set(close);
        }

        TensorClass.update_and_train().then(() =>
        {
            next_predict(TensorClass.last_predict);
            modell_difficulty(TensorClass.difficulty);
        }); 




    }

                live_fields(BinanceClass.last_update,BinanceClass.tick_data.close);

           
                let depth_bid = depth_grouper(BinanceClass.depth.bids);
                let depth_ask = depth_grouper(BinanceClass.depth.asks);

                console.log(depth_volume_predict('bid',depth_bid,BinanceClass.data[BinanceClass.data.length-1][7]));
                console.log(depth_volume_predict('ask',depth_ask,BinanceClass.data[BinanceClass.data.length-1][7]));

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
        predict.small = values[0];
        predict.big = values[0];
        let volume_big = volume*3;  

      for(i = 0; i < values.length; i++)
      {
        volume = volume-depth[values[i]];
        volume_big = volume_big-depth[values[i]];

        if(volume < 0 && i > 1 && predict.small == values[0]) // Volume filled the Orderbook
        {
           predict.small = values[i-1]; // Return Last fit price!  
        }

        if(volume_big < 0 && i > 1 && predict.big == values[0]) // Volume filled the Orderbook
        {
           predict.big = values[i-1]; // Return Last fit price!  
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