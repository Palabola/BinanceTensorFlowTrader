

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

function start ()
{
    TensorClass.start();
}

$(document).ready(function(){


});