
async function apiget(fresh = 0) 
{
    json = ai_trader.btc;

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

            function real_time_tensor(limit,callback)
            {

               apiget(1).then((result) => {

                console.log(result);

                         result = converter.candle_convert(result,limit); 

                         return callback(result.input,result.output);
                });
            }



                function production()
                {

                        real_time_tensor(100,(input,output) =>{

                                        let tickets = tf.tensor(
                                            input
                                        );

                                        let final_price = tf.tensor(
                                            output
                                        );


                                        train(tickets,final_price,20).then(() => {

                                            const tester = tf.tensor2d(
                                                [input[input.length-1]]
                                            );

                                            let outputs = model.predict(tester);

                                            predict_value = outputs.dataSync()[0];

                                            last_predict(predict_value);

                                            last_realprice(output[output.length-1]);

                                        });

                            });


                            setTimeout(production,55000);

                }

                async function train(input_ts,output_ts,loop)
                    {
                        
                        for (let i = 0; i < loop; i++) {

                            const config = {
                            shuffle: true,
                            epochs: 50,
                            batchSize: 128
                            }

                            const response = await model.fit(input_ts, output_ts, loop);
                            console.log('Train loss difficulty:',response.history.loss[0]);
                            //console.log(tf.memory());

                        }
                    }
                    
    setTimeout(production,1000);            

});


