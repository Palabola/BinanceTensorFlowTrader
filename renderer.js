// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


ai_trader = {};

ai_trader.btc = [];



const binance = require('node-binance-api')().options({
   APIKEY: '<key>',
   APISECRET: '<secret>',
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
  });


        function handle_gardening_candle(config)
        {

                binance.candlesticks("BTCUSDT", "1m", (error, ticks, symbol) => {
               // console.log("candlesticks()", ticks);
                let last_tick = ticks[ticks.length - 1];

                let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;

                        if(ai_trader.btc.length==0)
                        {
                            ai_trader.btc = ticks; 
                        }
                                  
                          // Continous update!
                            if(config.limit < 500)
                            {
                                    for(let i=0; i < ticks.length; i++)
                                    {
                                        if(ticks[i][0] > ai_trader.btc[ai_trader.btc.length-1][0])
                                        {
                                           ai_trader.btc.push(ticks[i]);
                                        }
                                    }

    
                                setTimeout(handle_gardening_candle,15000,({limit: 10}));    

                                return;
                            }

                          // Create history!   

                          if(config.limit == 500 && ai_trader.btc[0][0] != ticks[0][0])
                          {
                                  
                              ai_trader.btc = ticks.concat(ai_trader.btc); 

                              if(ai_trader.btc.length > 2000) // LIMIT OF HISROTY!
                              {
                                setTimeout(handle_gardening_candle,15000,({limit: 10}));
                                return;
                              }  

                              setTimeout(handle_gardening_candle,1000,({limit: 500, endTime: ticks[0][6]}));    

                              return;
                          }
                    
                
                    setTimeout(handle_gardening_candle,500,({limit: 500, endTime: ticks[0][6]}));    

                    return;          
                        
                
                }, config);


                
        }


handle_gardening_candle({limit: 500});
