

function last_predict (predict)
{
    $('.result').prepend('<h1>'+ Math.round(predict * 100) / 100+'</h1>');
}

function last_realprice (realprice)
{
    $('.realprice').prepend('<h1>'+ Math.round(realprice * 100) / 100+'</h1>');
}



$(document).ready(function(){


});