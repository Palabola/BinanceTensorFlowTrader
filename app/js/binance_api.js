// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const binance = require('node-binance-api')().options({
   APIKEY: '<key>',
   APISECRET: '<secret>',
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: true // If you want to use sandbox mode where orders are simulated
  });

  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter = new FileSync('db.json')
  const db = low(adapter)

  ai_trader = {};
  ai_trader.btc = [];
  ai_trader.datasetlimit = 2000;
  ai_trader.update = 0;

if(db.has('btc_1m').value() && ai_trader.btc.length==0)
    {
        ai_trader.btc =  db.get('btc_1m').value();

                if(!data_integrity(ai_trader.btc))
                {
                    ai_trader.btc = []; 
                    setTimeout(handle_gardening_candle,500,({limit: 500}));
                }
                else
                {
                    setTimeout(handle_gardening_candle,500,({limit: 100}));     
                }

                TensorClass.exchange_data_set(ai_trader.btc);        
    }

function data_integrity(data)
{
            for(let i=0; i < data.length-1; i++)
            { 
                    if(data[i+1][0] - data[i][0] != 60000)
                    {
                        console.log('Data corrupted at:',i,data[i+1][0],data[i][0]);
                        return false; // Data corrupted!   
                    }   
            }

        return true;       
}


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

                                db.set('btc_1m', ai_trader.btc).write();    

                                        if(!data_integrity(ai_trader.btc))
                                        {
                                            ai_trader.btc = []; 
                                            setTimeout(handle_gardening_candle,500,({limit: 500}));
                                        }

                                data_set(ai_trader.btc.length);
                                
                                TensorClass.exchange_data_set(ai_trader.btc);

                                return;
                            }

                          // Create history!   

                          if(config.limit == 500 && ai_trader.btc[0][0] != ticks[0][0])
                          {
                                  
                              if(ai_trader.btc.length >= ai_trader.datasetlimit) // LIMIT OF HISROTY!
                              {
                                return;
                              }  

                              ai_trader.btc = ticks.concat(ai_trader.btc); 

                              setTimeout(handle_gardening_candle,500,({limit: 500, endTime: ticks[0][6]-60000}));    

                              return;
                          }
                    
                
                    setTimeout(handle_gardening_candle,500,({limit: 500, endTime: ticks[0][6]-60000}));    

                    return;          
                        
                
                }, config);
               
}


binance.websockets.candlesticks(['BTCUSDT'], "1m", (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;

                if(isFinal)
                {
                    if(ai_trader.btc.length >= ai_trader.datasetlimit) 
                    {
                        handle_gardening_candle({limit: 100});

                        if(TensorClass.predict_get().length > 0)
                        {
                          TensorClass.real_price_set(close);
                        }

                        ai_trader.update = 1;
                    }                    
                }
                else
                {

                   if(ai_trader.update == 1)
                   { 
                    TensorClass.update_and_train();  

                    console.log(TensorClass.real_price_get());
                    console.log(TensorClass.predict_get());

                    ai_trader.update = 0;
                   }

                   next_predict(TensorClass.last_predict);

                }


  });


