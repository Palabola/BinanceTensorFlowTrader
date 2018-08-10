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


if(db.has('btc_1m').value() && ai_trader.btc.length==0)
    {
        ai_trader.btc =  db.get('btc_1m').value();

        console.log(ai_trader.btc);

        if(!data_integrity(ai_trader.btc))
        {
            ai_trader.btc = []; 
            setTimeout(handle_gardening_candle,500,({limit: 500}));
        }
        else
        {
            setTimeout(handle_gardening_candle,500,({limit: 100}));     
        }

        console.log('Low DB connected and loaded!');
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

                                setTimeout(handle_gardening_candle,15000,({limit: 10}));    

                                return;
                            }

                          // Create history!   

                          if(config.limit == 500 && ai_trader.btc[0][0] != ticks[0][0])
                          {
                                  
                              console.log(ai_trader.btc);

                              if(ai_trader.btc.length > 2000) // LIMIT OF HISROTY!
                              {
                                setTimeout(handle_gardening_candle,15000,({limit: 10}));
                                return;
                              }  

                              ai_trader.btc = ticks.concat(ai_trader.btc); 

                              setTimeout(handle_gardening_candle,1000,({limit: 500, endTime: ticks[0][6]-60000}));    

                              return;
                          }
                    
                
                    setTimeout(handle_gardening_candle,500,({limit: 500, endTime: ticks[0][6]-60000}));    

                    return;          
                        
                
                }, config);


                
}



