

module.exports = {


candle_convert: function (candlechart,size = 0)
{
    let result = {};

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
},


};