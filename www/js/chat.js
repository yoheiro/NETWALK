//一件分のリスト要素を表すHTML要素を作成
function createListItem(data) {
//gazou
  //金原さんのすごいガードに通す
  var chat = escape_html(data.chat);

  //名前の処理
  var name = data.userName;

  //数字を常に二桁にする
  function getdoubleDigestNumber(number) {
    return ("0" + number).slice(-2);
  }
  //時間の処理
  var now = new Date(data.createDate);
  now.toUTCString();

  var month = getdoubleDigestNumber(now.getMonth() + 1);
  var day = getdoubleDigestNumber(now.getDate());
  var hour = getdoubleDigestNumber(now.getHours());
  var minute = getdoubleDigestNumber(now.getMinutes());
  var time = month + "月" + day + "日 " + hour + "時" + minute + "分";

  //位置情報の処理
  var loc = data.address;
  var location = loc.slice(0,20);

 

  //ハッシュタグの処理
  var hashtag = data.hashtag;

  //いいねの処理
  var heart = data.heartNumber;
 
  //オブジェクトIDの処理
  var objectId = data.objectId;

  //画像
  //var photo = data.photo;
  var thumb = data.thumb;

  var item = "<ons-list-item modifier='longdivider' id='chatitem'>" + "<header><span class='item-label'>" + time + "</span><span class='item-name'>" + name + "</span></header>" + "<div class='item-desc' class='list-item__title'>" + chat + "</div>";

//画像処理
if(thumb){
    item += "<div class='item-img list-item__subtitle' style='text-align:center;margin-bottom:10%;'onclick='Idget()'> <img src='"+ thumb + "'width='95%' max-height='50px' alt='写真を拡大' id='"+objectId+"' /></a></div>"
    /*+"<img src='data:image/png;base64,"+ photo + "'width='200' height='auto' /></div>"*/;
  }

  //ハッシュタグの処理 
  if(hashtag){
    for(var i=0;i < hashtag.length;i++){
      item += "<div class='item-tag' onclick =' timelineNavi.bringPageTop(`search.html`); clickSearch()'>" + hashtag[i] + "</div>";
    }
  }

  //いいねの色処理
  var style;
  var list = JSON.parse(localStorage.getItem("key"));
  for (var i = 0; i<list.length; i++) {
    if (objectId == list[i])  {
      style = "color:red";
      break;
    }
  }

   item += "<footer><ons-icon icon='ion-ios-heart' class='item-heart' id ='" + objectId + "' style='" + style + "'> " + heart + "</ons-icon>"
//ユーザー識別
 var User = ncmb.User.getCurrentUser();
 var userName = User.get("userName");

 
  if(userName==name){
 item +="<ons-icon icon='ion-ios-trash' class='item-trash' id ='" + objectId + "' size='1x' onclick='Remove();'></ons-icon>"
  }
  item+="<span class='item-geo'>" + location + "</span></footer></ons-list-item>";

//投稿削除
var pub =data.pub;
  if(pub==false){

  item = "<!--"+item+"-->";
  }

// item += "<footer><ons-icon icon='ion-ios-heart' class='item-heart' id ='" + objectId + "' style='" + style + "'> " + heart + "</ons-icon><span class='item-geo'>" + location + "</span></footer></ons-list-item>";


  return item;
}

//削除
function Remove() {
    if( confirm("本当に消しますか？") ) {
      var change1 = event.target.id;
if(change1 != '') {
     chatData.equalTo('objectId', event.target.id).fetch().then(function(results) {
       results.set('pub', false).update();
              });}
      getChat();//ここがうまく作動しない時もある
        }
    else {
        //console.log(event.target.id);
    }
}

//金原さんのすごいガード
function escape_html(string) {
  if (typeof string !== 'string') {
    return string;
  }
  return string.replace(/[&'`"<>]/g, function (match) {
    return {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;',
    } [match];
  });
}

//mBaaSからチャットを取得する
function getChat(done) {
  console.log(localStorage);
  //端末の位置情報を取得
  navigator.geolocation.getCurrentPosition(onSuccess, onError);

  //位置情報の近くの投稿だけをタイムラインに取得
  function onSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    //緯度・経度をLatLngクラスに変換します。
    var latLngInput = new google.maps.LatLng(latitude, longitude);

    //Google Maps APIのジオコーダを使います。
    var geocoder = new google.maps.Geocoder();

    //ジオコーダのgeocodeを実行します。
    //第１引数のリクエストパラメータにlatLngプロパティを設定します。
    //第２引数はコールバック関数です。取得結果を処理します。
    geocoder.geocode({
        latLng: latLngInput
      },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          //取得が成功した場合

        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
          alert("住所が見つかりませんでした。");
        } else if (status == google.maps.GeocoderStatus.ERROR) {
          alert("サーバ接続に失敗しました。");
        } else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
          alert("リクエストが無効でした。");
        } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          alert("リクエストの制限回数を超えました。しばらくたってからお試しください。");
        } else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
          alert("サービスが使えない状態でした。しばらくたってからお試しください。");
        } else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
          alert("原因不明のエラーが発生しました。再度試してみてください。");
        } else {
          alert("想定外のエラー：status=" + status);
        }
      });

    //新しい順に並べて100件まで取得する
    chatData.order("createDate", true)
      //緯度における現在地から1km以内のデータ
      .greaterThanOrEqualTo("chatLatitude", latitude - 0.0009 -resusLatitude)
      .lessThanOrEqualTo("chatLatitude", latitude + 0.0009 + resusLatitude)
      //経度における現在地から1km以内のデータ
      .greaterThanOrEqualTo("chatLongitude", longitude - 0.0011 - resusLongitude)
      .lessThanOrEqualTo("chatLongitude", longitude + 0.0011 + resusLongitude)
      .limit(100)//
      .fetchAll()
      .then(function (items) {

          //リストを初期化する
          var list = document.getElementById("timeline");
          var htmlStr = "";

          //取得に成功した場合
          //一件ずつリストに追加する
          items.forEach(function (item) {
            htmlStr += createListItem(item);
          });
          list.innerHTML = htmlStr;

          //モーダル画面を隠す
          if (flag == 1) {
            done();
            flag = 0;
          }
        },
        function (err) {
          alert(err.message);
          //モーダル画面を隠す
          if (flag == 1) {
            done();
            flag = 0;
          }
        })
      .catch(function (err) {
        console.log(err);
        //モーダル画面を隠す
        if (flag == 1) {
          done();
          flag = 0;
        }
      });
  }
  //位置情報が取得できなかったとき
  function onError(error) {
    alert(error.message);
    //モーダル画面を隠す
    if (flag == 1) {
      done();
      flag = 0;
    }
  }
}
function shoot(){
    navigator.camera.getPicture(cameraSuccess, cameraError, { quality: 50, 
    sourceType : Camera.PictureSourceType.PHOTOLIBRARY,

    destinationType: Camera.DestinationType.DATA_URL });
}
// 写真撮影が成功した時
function cameraSuccess(image2){
   var imgArea = document.getElementById("imageID");
    imgArea.src = "data:image/jpeg;base64," + image2;
    //samune
    //canvas
var scale = 0.05; // saizuhennkou
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var image = new Image();
var reader = new FileReader();
image.crossOrigin = "Anonymous";
image.onload = function(event){
    var dstWidth = this.width * scale;
    var dstHeight = this.height * scale
    canvas.width = dstWidth;
    canvas.height = dstHeight;
    ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, dstWidth, dstHeight);
    $("#dst").attr('src', canvas.toDataURL());
    //サムネ格納
    image3 = canvas.toDataURL();
    
    
}
image.src = imgArea.src;//motogazou

    img = image2;
}
// 失敗した時
function cameraError(message){
    ons.notification.alert("Failed!!: " + message);
}


//チャット送信処理
function sendChat() {

  //mBaaSにデータストアを作成する
  var chatData = ncmb.DataStore("chatData");

  //インスタンスの作成
  var chatData = new chatData();

  //端末の位置情報を取得
  navigator.geolocation.getCurrentPosition(onSuccess, onError);

  //位置情報が取得できたとき
  function onSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude

    //緯度・経度をLatLngクラスに変換します。
    var latLngInput = new google.maps.LatLng(latitude, longitude);

    //Google Maps APIのジオコーダを使います。
    var geocoder = new google.maps.Geocoder();

    //ジオコーダのgeocodeを実行します。
    //第１引数のリクエストパラメータにlatLngプロパティを設定します。
    //第２引数はコールバック関数です。取得結果を処理します。
    geocoder.geocode({
        latLng: latLngInput
      },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          //取得が成功した場合

          //住所を取得します。
          var point = results[3].formatted_address.replace(/\D+〒\d{3}-\d{4}/g, ''); //国名と郵便番号を消してます。

          //インスタンスにデータをセットする
          var User = ncmb.User.getCurrentUser();
          var userName = User.get("userName");
          var chat = $("#chatText").val().replace(/\s{0,}#\S+/g, '');
          //chat = chat.replace(/\r?\n/g,'<br>');
          var hashtag = $("#chatText").val().match(/#\S+/g);
          var chatLatitude = latitude;
          var chatLongitude = longitude;
          var address = point;
          var heartNumber = 0;
          chatData.set("userName", userName)
            .set("chat", chat)
            .set("hashtag", hashtag)
            .set("chatLatitude", chatLatitude)
            .set("chatLongitude", chatLongitude)
            .set("address", address)
            .set("heartNumber", heartNumber)
           // .set("photo",img)
            .set("thumb",image3)
            .save()
            .then(function (results) {
           var namae= results.objectId;
              console.log(name);
              //gazoufilestore

      console.log("どうよ");
      var fileName = namae +".png";
      var fileData = toBlob(img);
    console.log(fileData);
      ncmb.File.upload(fileName, fileData)
        .then(function(res){
          // アップロード後処理
          console.log("アップロード");
        })
        .catch(function(err){
          // エラー処理
                    console.log("アップロード無理"+err);

        });
    



                //保存に成功
ons.notification.alert({
                title: "投稿完了",
                message: "投稿が完了しました。",});

                //チャット欄を更新する
                getChat();

                //フィールドを空にする
                $("#chatText").val("");
              },
              function (err) {
                alert(err.message);
              });

        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
          alert("住所が見つかりませんでした。");
        } else if (status == google.maps.GeocoderStatus.ERROR) {
          alert("サーバ接続に失敗しました。");
        } else if (status == google.maps.GeocoderStatus.INVALID_REQUEST) {
          alert("リクエストが無効でした。");
        } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          alert("リクエストの制限回数を超えました。しばらくたってからお試しください。");
        } else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
          alert("サービスが使えない状態でした。しばらくたってからお試しください。");
        } else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
          alert("原因不明のエラーが発生しました。再度試してみてください。");
        } else {
          alert("想定外のエラー：status=" + status);
        }
      });
  }
  //位置情報が取得できなかったとき
  function onError(error) {
    alert(error.message);
  }
}

if(!localStorage.getItem("key")){
 localStorage.setItem("key",JSON.stringify(heartList) ); //ローカルストレージにデータを挿入
 }

//いいね機能
$(document).on('click', '.item-heart', function () {
  //mBaaSにデータストアを作成する
  var chatData = ncmb.DataStore("chatData");
  var objectId = $(this).attr('id');
  var heartNumber = Number($(this).text());
  
  chatData.equalTo("objectId", objectId)
    .fetch()
    .then(function (results) {
      var heartFlag = 0; 
      var removeCount = 0;
      heartList = JSON.parse(localStorage.getItem("key"));
      for (var i = 0; i < heartList.length; i++) {
        if (objectId == heartList[i]){
          heartFlag = 1; 
          removeCount = i;
          break;
          
      }
      }
      
      if (heartFlag == 1) { //既にいいねされてるとき
        heartList.splice(removeCount, 1); //ローカルストレージからデータを削除
        // document.getElementById("objectID").disabled =true;
        heartNumber -= 1;
        heartFlag = 0;
       // document.getElementById("objectID").disabled =false;
        
      } else { //まだいいねされてないとき
        heartList.push(objectId); //ローカルストレージにデータを挿入
       //document.getElementById("objectID").disabled =true;
        heartNumber += 1;
       
       // document.getElementById("objectID").disabled =false;
      }
      localStorage.setItem("key",JSON.stringify(heartList));
      results.set("heartNumber", heartNumber);

      return results.update();
    })
    .then(function () {
      getChat();
    });
});
//base64→bainari 
    function toBlob(base64) {
        var bin = atob(base64.replace(/^.*,/, ''));
        var buffer = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) {
            buffer[i] = bin.charCodeAt(i);
        }
        // Blobを作成
        try{
            var blob = new Blob([buffer.buffer], {
                type: 'image/png'
            });
        }catch (e){
            return false;
        }
        return blob;
    }

        //hongazou
   document.addEventListener('show', function(event) {
    var page = event.target;

    if (page.id == "youhei") {

      var img6 = document.getElementById("halloween");
      img6.src = "https://mbaas.api.nifcloud.com/2013-09-01/applications/XRi0icWKKszbPA0J/publicFiles/"+ objectId2 +".png";
      console.log("show page1");
    }
  }, false); 
  function Idget(){
  //  document.getElementById("takagi");
 //objectId2=takagi.innerHTML;
    objectId2=event.target.id;
    timelineNavi.pushPage(`origin_photo.html`);

  }