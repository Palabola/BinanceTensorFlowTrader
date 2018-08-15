

function data_set (value)
{
    $('.dataset').html("Available dataset: "+value);
}

function modell_difficulty (value)
{
    $('.modell_diff').html("Modell difficulty: "+ Math.round(value * 100) / 100);
}

function last_predict (predict)
{
    $('.result').prepend('<h1>'+ Math.round(predict * 100) / 100+'</h1>');
}

function new_action (pred,real)
{
    $('.actions').prepend('<h1>Buy/Sell Pred:'+Math.round(pred * 100) / 100+' Real:'+Math.round(real * 100) / 100+'</h1>');
}



function next_predict (predict)
{
    if(predict == 0)
        return;

    $('.next-predict').html(Math.round(predict * 100) / 100);
}

function last_realprice (realprice)
{
    $('.realprice').prepend('<h1>'+ Math.round(realprice * 100) / 100+'</h1>');
}

function live_fields (time,price)
{
    time = new Date(time);

    $('.time').html(time.getHours()+":"+time.getMinutes());
    $('.current-price').html(Math.round(price * 100) / 100);
}


function clean_orders ()
{

    binance.cancelOrders("BTCUSDT", (error, response, symbol) => {
        console.log(symbol+" cancel response:", response);
      });

}




function start ()
{
    TensorClass.start();
}

$(document).ready(function(){


});