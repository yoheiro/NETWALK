let getCurrentPosition = () => {
  //端末の位置情報を取得する
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  
  function onSuccess(position){
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    //緯度・経度をLatLngクラスに変換する。
    var latLngInput = new google.maps.LatLng(latitude, longitude);

    //Google Maps APIのジオコーダを使います。
    var geocoder = new google.maps.Geocoder();

    //ジオコーダのgeocodeを実行します。
    //第１引数のリクエストパラメータにlatLngプロパティを設定します。
    //第２引数はコールバック関数です。取得結果を処理します。
    geocoder.geocode({
      latLng: latLngInput
    },
    function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //位置情報が取得できたとき

        //現在地
        var currentPosition = {
          lat:latitude,
          lng:longitude
        }

        var map;
        var marker = [];
        var infoWindow = [];
        var mapPin;
        var markerData = [];

        chatData.order("createDate", true)
        //緯度における現在地から1km以内のデータ
        .greaterThanOrEqualTo("chatLatitude", latitude - 0.0009 - resusLatitude)
        .lessThanOrEqualTo("chatLatitude", latitude + 0.0009 + resusLatitude)
        //経度における現在地から1km以内のデータ
        .greaterThanOrEqualTo("chatLongitude", longitude - 0.0011 - resusLongitude)
        .lessThanOrEqualTo("chatLongitude", longitude + 0.0011 + resusLongitude)
        .limit(100)
        .fetchAll()
        .then(function(items){

          //マーカーにデータをぶちこむ
          markerData = items;

          //地図を作成する
          map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: currentPosition,
            zoom : 15
          });

          //マーカー毎の処理
          for(var i = 0; i < markerData.length;i++){
            markerLatLng = new google.maps.LatLng({lat: markerData[i]['chatLatitude'], lng: markerData[i]['chatLongitude']});
            
            marker[i] = new google.maps.Marker({
              position: markerLatLng,
              map:map
            });
            
            infoWindow[i] = new google.maps.InfoWindow({
              content: '<div class="map-canvas">' + markerData[i]['chat'] + '</div>'
            });

            //ピンの色をわける
            if(markerData[i]['heartNumber'] <= 1){
              mapPin = "img/pinlevel1.png";
            }else if(markerData[i]['heartNumber'] <= 2){
              mapPin ="img/pinlevel2.png";
            }else if(markerData[i]['heartNumber'] <= 3){
              mapPin ="img/pinlevel3.png";
            }else if(markerData[i]['heartNumber'] <= 4){
              mapPin ="img/pinlevel4.png";
            }else if(markerData[i]['heartNumber'] <= 5){
              mapPin ="img/pinlevel5.png";
            }else if(markerData[i]['heartNumber'] <= 6){
              mapPin ="img/pinlevel6.png";
            }else if(markerData[i]['heartNumber'] <= 7){
              mapPin ="img/pinlevel7.png";
            }else if(markerData[i]['heartNumber'] <= 8){
              mapPin ="img/pinlevel8.png";
            }else if(9 < markerData[i]['heartNumber']){
              mapPin ="img/pinlevel9.png";
            };

            marker[i].setOptions({
              icon: {
                url: mapPin
              }
            });

          markerEvent(i);
    }

    function markerEvent(i) {
      marker[i].addListener('click', function() { // マーカーをクリックしたとき
      infoWindow[i].open(map, marker[i]); // 吹き出しの表示
    });
};
              
            },
             function(err){
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
  function onError(error){
    alert(error.message);
  }
}

function wait(){
  tabbar.on('postchange', function(event) {
    console.log("マップ開始");
    getCurrentPosition();
  });
}

setTimeout(wait,1000);
