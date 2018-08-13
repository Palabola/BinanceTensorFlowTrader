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

                live_fields(BinanceClass.last_update,BinanceClass.tick_price);

                if(Math.abs(TensorClass.last_predict - BinanceClass.tick_price) > 20 && TensorClass.last_predict > 0 && TensorClass.difficulty < 500)
                {
                    new_action(TensorClass.last_predict,BinanceClass.tick_price); 
                }

}



setInterval(draw_loop, 1000);