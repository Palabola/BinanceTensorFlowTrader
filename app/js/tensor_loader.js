
async function apiget(fresh = 0) 
{
    json = ai_trader.btc;

    if(fresh == 1)
    {
      json = json.slice(json.length-100,json.length);
    }

    return json;
}

async function modelget()
{

    const model = await tf.loadModel('http://localhost/generator/tensorflow/bitcoin-1(91).json');

    return model;
}

modelget().then((result) => 
{

        // LOAD MODEL!
            const model = result;

            const optimizer = tf.train.adam();

            // Prepare the model for training: Specify the loss and the optimizer.
            model.compile(
                {
                    optimizer: optimizer,  
                    loss: tf.losses.meanSquaredError,
                }
            );

        // LOAD MODEL!   

            function real_time_tensor(callback)
            {

                apiget(1).then((result) => {

                                let ticker_array = [];

                                let final_array = [];

                                        for(let i = 2; i < result.length-1; i++)
                                        {
                                                let single_array = [];
                                                single_array[0] = [];

                                                        for(let k=0; k<3; k++)
                                                        {     
                                                            let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = result[i-k];

                                                            single_array[0].push(open,high,low,close,volume,trades,buyBaseVolume);
                                                        }
                                                ticker_array[i-2] = single_array[0];
                                        }

                                        for(let i = 3; i < result.length; i++)
                                        {
                                            final_array[i-3] = result[i][4]; // Close Price
                                        }


                                return  callback(ticker_array,final_array);
                                    });
            }



                function production()
                {

                        real_time_tensor((input,output) =>{

                                        let tickets = tf.tensor(
                                            input
                                        );

                                        let final_price = tf.tensor(
                                            output
                                        );


                                        train(tickets,final_price,2).then(() => {

                                            const tester = tf.tensor2d(
                                                [input[input.length-1]]
                                            );

                                            let outputs = model.predict(tester);

                                            predict_value = outputs.dataSync()[0];

                                            console.log(predict_value);

                                            last_predict(predict_value);

                                        });

                            });


                            setTimeout(production,5000);

                }

                async function train(input_ts,output_ts,loop)
                    {
                        
                        for (let i = 0; i < loop; i++) {

                            const config = {
                            shuffle: true,
                            epochs: 50,
                            batchSize: 128
                            }

                            const response = await model.fit(input_ts, output_ts, loop)
                            console.log('Train loss difficulty:',response.history.loss[0]);
                            //console.log(tf.memory());

                        }
                    }
                    
    setTimeout(production,10000);            

});


