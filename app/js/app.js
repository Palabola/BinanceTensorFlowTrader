// TensorFlow + Binance BTC predicter!

BinanceClass.websocket_start();

BinanceClass.update_loop();

window.last_update = 0;

async function draw_loop()
{

    if(window.last_update != BinanceClass.last_update)
    {
        console.log('Application Loop');

        data_set(BinanceClass.data.length);

        window.last_update = BinanceClass.last_update;

        await TensorClass.exchange_data_set(BinanceClass.data);

        if(TensorClass.predict_get().length > 0)
        {
            TensorClass.real_price_set(close);
        }

        TensorClass.update_and_train().then(() =>
        {
            next_predict(TensorClass.last_predict);
            modell_difficulty(TensorClass.difficulty);
            console.log(TensorClass.predict_get());
        });

    }

    TensorClass.exchange_data_set(BinanceClass.data);
}


setInterval(draw_loop, 1000);