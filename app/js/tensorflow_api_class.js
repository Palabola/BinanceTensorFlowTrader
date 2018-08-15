

class TENSOR_API{

	constructor() {
		this.model = tf.sequential();
        this.exchange_data = {};
        this.status = 0; // 0 stopped, 1 started, 2 pre-train finish
        this.pretain = {};
        this.deeptrain = {};
        this.predict_tensor = {};
        this.optimizer = tf.train.adam();
        this.loss = tf.losses.meanSquaredError;
        this.difficulty = 0;
        this.pre_train_loop = 12;
        this.live_train_loop = 5;
        this.last_predict = 0;
        this.predict = [];
        this.real_price = [];
    }

predict_get() 
{
    return this.predict;
}   

async predict_set(predict) 
{
    this.predict.push(predict);
    return;
} 

real_price_set(value) 
{
    this.real_price.push(value)
}   

real_price_get()
{
    return this.real_price;
}   

async exchange_data_set(exchange_data) 
{
    this.exchange_data = exchange_data;
    return this.exchange_data;
}

exchange_data_get() 
{
    return this.exchange_data;
}    
        
candle_convert(size = 0)
            {
                let result = {};

                let candlechart = this.exchange_data;

                result.input = [];

                result.output = [];

                if(size !=0)
                {
                    size = size+3; // Correction for conversion lost
                    candlechart = candlechart.slice(candlechart.length-size,candlechart.length); // Slice candlechart array to correct size!
                }

                        for(let i = 2; i < candlechart.length-1; i++)
                        {
                                let single_array = [];
                                single_array[0] = []; 

                                        for(let k=0; k<3; k++) // Create 3x7 historical array!
                                        {     
                                            let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = candlechart[i-k];

                                            single_array[0].push(open,high,low,close,volume,trades,buyBaseVolume); 
                                        }

                                result.input[i-2] = single_array[0];
                        }

                        for(let i = 3; i < candlechart.length; i++) // Create 
                        {
                            result.output[i-3] = candlechart[i][4]; // Close Price
                        }

                return result;       
            }

    create_model()
    {
        this.model.add(tf.layers.dense({
            units: 21,
            inputShape: [21],
            activation: 'elu',
            }));


      this.model.add(tf.layers.dense ({
                    units: 17,
                    activation: 'elu',
        }));      
            

        this.model.add(tf.layers.dense ({
            units: 8,
            activation: 'elu',
        }));     


        this.model.add( tf.layers.dense({
            units: 1,
            activation: 'elu',
        }));

        this.model.compile(
            {
                optimizer: this.optimizer,  
                loss: this.loss,
            }
        );

		return;
    }
    

	create_pretain_tensor(){

        let result = this.candle_convert(); 

        this.pretain.input = tf.tensor(
            result.input
        );

        this.pretain.output = tf.tensor(
            result.output
        );

		return;
    }

    create_deeptrain_tensor(){

        let result = this.candle_convert(100); 

        this.deeptrain.input = tf.tensor(
            result.input
        );

        this.deeptrain.output = tf.tensor(
            result.output
        );

        this.predict_tensor = tf.tensor2d(
            [result.input[result.input.length-1]]
        );     

		return;
    }

	pre_train(){
       
        this.train(this.pretain.input,this.pretain.output,this.pre_train_loop).then(() => {
            this.status = 1;
            return;
        });
 
    }
    
    start(){
        if(this.status == 1) // Already started!
        {
          return;  
        }    

        this.create_model();
        this.create_pretain_tensor();
        this.pre_train();
    }


  async update_and_train()
    {
        if(this.status !== 1)
        {
            console.log('Modell is not ready!');
            return;
        }

        await this.sleep(5000); 

        this.create_deeptrain_tensor();

        await this.train(this.deeptrain.input,this.deeptrain.output,this.live_train_loop);

                let outputs = this.model.predict(this.predict_tensor);

                let predict_value = outputs.dataSync()[0];

                this.last_predict = predict_value;

                this.predict_set(predict_value);
   
                await this.sleep(500); // Be sure everything is updated

                return;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

	async train(input_ts,output_ts,loop){
        for (let i = 0; i < loop; i++) {

            const config = {
                shuffle: true,
                epochs: 50,
                batchSize: 128
            }
    
            const response = await this.model.fit(input_ts, output_ts, loop)
            console.log(response.history.loss[0]);
            this.difficulty = response.history.loss[0];
            }
    }
    

	}
	
module.exports = TENSOR_API