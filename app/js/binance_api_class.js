// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const api_settings =  require('./api_keys').get_settings();

const binance = require('node-binance-api')().options({
   APIKEY: api_settings.APIKEY,
   APISECRET: api_settings.APISECRET,
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

  class BINANCE_API{

	constructor() {
        this.symbol = 'BTCUSDT';
        this.invertval = '1m';
        this.invertval_msec = 60000;
        this.data_lenght_min = 2000;
        this.last_update = 0;
        this.tick_price = 0;
        // LOAD FROM LOW DB
        if(db.has(this.symbol+this.invertval).value())
        {
         this.data = db.get(this.symbol+this.invertval).value();
        }
        else
        {
          this.data = [];
        }
    }

    async websocket_start()
    {
        binance.websockets.candlesticks([this.symbol], this.invertval, (candlesticks) => {
            let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
            let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;

             this.tick_price = close;
             
             if(isFinal)
             {
              this.update_loop();
             }
             else
             {
                if(this.data.length <= this.data_lenght_min)
                    {
                     this.update_loop();  
                    }
             }
          });

          
    }


    async update_loop()
    {

        await this.data_integrity();

        if(this.data.length <= this.data_lenght_min) // Preload phase
        {
          await this.get_preload_history(); 
          console.log('Create history: ',this.data.length);
        }
        else
        {
          this.get_live_history(()=>{
            db.set(this.symbol+this.invertval, this.data).write(); 
            this.last_update = this.data[this.data.length-1][0];
          });
        }
    }

    async data_integrity()
        {
            if(this.data.length==0)
                return true;

                    for(let i=0; i < this.data.length-1; i++)
                    { 
                            if(this.data[i+1][0] - this.data[i][0] != this.invertval_msec)
                            {
                                console.log('Data corrupted at:',i,this.data[i+1][0],this.data[i][0]);
                                this.data = []; // Empty data!
                                return false; // Data corrupted!   
                            }   
                    }


            return true;       
        }

    async get_preload_history()
    {
       if(this.data.length == 0) 
       {
        this.get_candlesticks({limit: 500},(ticks)=>{
            this.data = ticks;
        });
       }
       else
       {
        this.get_candlesticks({limit: 500, endTime: this.data[0][6]-60000},(ticks)=>{
            this.data = ticks.concat(this.data);
        });
       }
    }

    async get_live_history(callback)
    {
        this.get_candlesticks({limit: 50},(ticks)=>{
            for(let i=0; i < ticks.length; i++)
            {
                if(ticks[i][0] > this.data[this.data.length-1][0])
                {
                    
                this.data.push(ticks[i]);
                }
            }
            return callback();
        });
    }


    // [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
    async get_candlesticks(config,callback)
    {    

        binance.candlesticks(this.symbol, this.invertval, (error, ticks, symbol) => {
              return callback(ticks);
             }, config);
    }


}



module.exports = BINANCE_API



