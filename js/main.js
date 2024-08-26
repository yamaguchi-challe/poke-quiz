const base_url = "https://pokeapi.co/api/v2/pokemon/";
const species_url = "https://pokeapi.co/api/v2/pokemon-species/";

let ans_name = "";
let img_url = "";

$("#start").on("click",function(){
    $("#view").html('<img src="img/ball.png" id="load" style="width: 10%; margin-top: 150px">');
    showQuiz();
    $(this).removeAttr("style").hide();
});

function showQuiz(){
    let num_ary = []
    for(let i=0; i<3; i++){
        num_ary[i] = Math.ceil(Math.random()*1025);
    }
    let ans = Math.floor(Math.random()*3);
    $.when(getImg(num_ary[ans]), getName(num_ary[0]), getName(num_ary[1]), getName(num_ary[2]))
    .done(function(url, name1, name2, name3){
        if(ans == 0){
            ans_name = name1;
        }else if(ans == 1){
            ans_name = name2;
        }else if(ans == 2){
            ans_name = name3;
        }
        // 問題を表示
        img_url = url;
        $("#view").html('<img src="' + img_url + '" id="quiz_img" style="filter: brightness(0%)">')
        $("#buttons").append('<button class="ansbtn">' + name1 + '</button>');
        $("#buttons").append('<button class="ansbtn">' + name2 + '</button>');
        $("#buttons").append('<button class="ansbtn">' + name3 + '</button>');
    });
}

// 問題画像の取得 id=図鑑ナンバー
function getImg(id){
    let defer = new $.Deferred;
    $.ajax({
        url:base_url+id,
        type:"get",
        cache:false,
        dataType:"json"
    }).done(function(data){
        defer.resolve(data.sprites.other["official-artwork"].front_default);
    });
    return defer.promise();
}

// 日本語名の取得 id=図鑑ナンバー
function getName(id){
    let defer = new $.Deferred;
    $.ajax({
        url:species_url+id,
        type:"get",
        cache:false,
        dataType:"json"
    }).done(function(data){
        janame = "";
        for(let i=0; i<data.names.length; i++){
            if(data.names[i].language.name == "ja"){
                janame = data.names[i].name;
                break;
            } else if(data.names[i].language.name == "ja-Hrkt"){
                janame = data.names[i].name
                break;
            } else{
                janame = data.name
            }
        };
        defer.resolve(janame);
    });
    return defer.promise();
}

$(document).on("click", ".ansbtn", function(){
    console.log($(this).html());
    let ans_text = "";
    if(ans_name == $(this).html()){
        ans_text = '<h1 style="color: red">正解</h1>';
    }else{
        ans_text = '<h1>不正解</h1>';
    }
    ans_text += `
    <img src=" ${img_url}">
    <p>${ans_name}</p>
    `;
    $("#ans_view").html(ans_text);
    $("#easyModal").show();
});

//ユーザ名登録モーダルの非表示
$("#next_button").on("click",function(){
    $("#easyModal").removeAttr("style").hide();
    // 表示のクリア
    $("#view").html('<img src="img/ball.png" id="load" style="width: 10%; margin-top: 150px">');
    $("#buttons").html('');
    // 次の問題の表示
    showQuiz();
});

rotationAnimationLoop(0);
   
function rotationAnimationLoop(deg){
  rotationAnimation(deg);
  setTimeout(() => {
    rotationAnimationLoop(deg+5);
  }, 15);
}

function rotationAnimation(deg){
  $("#load").css("-webkit-transform","rotate(" + deg + "deg)");
}