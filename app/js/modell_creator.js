
async function apiget() 
{
    json = ai_trader.btc;

    return json;
}



function real_time_tensor(limit,callback)
{
        apiget().then((result) => {

                    result = converter.candle_convert(result,limit); 

                    return callback(result.input,result.output);
            });
}


function start_ts ()
{

apiget().then((result) => {       
        
                            if(result.length < 100)
                                    return;                    

                                function production()
                                {

                                    real_time_tensor(100,(input,output) =>{

                                        let tickets = tf.tensor(
                                            input
                                        );

                                        let final_price = tf.tensor(
                                            output
                                        );

                                        train(tickets,final_price,4).then(() => {

                                            const tester = tf.tensor2d(
                                                [input[input.length-1]]
                                            );

                                            let outputs = model.predict(tester);

                                            predict_value = outputs.dataSync()[0];

        
                                            last_predict(predict_value);

                                            last_realprice(output[output.length-1]);

                                        });

                                    });


                                    console.log('Continous sync');

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

                                        const response = await model.fit(input_ts, output_ts, loop)
                                        console.log(response.history.loss[0]);
                                        modell_difficulty(response.history.loss[0]);
                                        // console.log(tf.memory());

                                        }
                                }


            result = converter.candle_convert(result); 

            

            let tickets = tf.tensor(
                result.input
            );

            let final_price = tf.tensor(
                result.output
            );

// Activation elu jรณ!!!
    
                const model = tf.sequential();

                model.add(tf.layers.dense({
                    units: 21,
                    inputShape: [21],
                    activation: 'elu',
                    }));


                model.add(tf.layers.dense ({
                            units: 17,
                            activation: 'elu',
                }));      
                   

                model.add(tf.layers.dense ({
                    units: 8,
                    activation: 'elu',
                }));     


                model.add( tf.layers.dense({
                    units: 1,
                    activation: 'elu',
                }));


            // Fontos
      
            const optimizer = tf.train.adam();

                // Prepare the model for training: Specify the loss and the optimizer.
                model.compile(
                    {
                        optimizer: optimizer,  
                        loss: tf.losses.meanSquaredError,
                    }
                );


                train(tickets,final_price,20).then(() => {
                        production();
                });


});

}


module.exports.start_ts = start_ts;  