//クリックによる検索
function clickSearch(){
     $(document).on('click', '.item-tag', function (){
      var text = $(this).text();
      search(text);
 });
}

//ハッシュタグをデータストアから検索
function search(word){
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
    function(results, status) {
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
    chatData.equalTo("hashtag", word)
            .order("createDate", true)
            //緯度における現在地から1km以内のデータ
            .greaterThanOrEqualTo("chatLatitude", latitude-0.009-resusLatitude)
            .lessThanOrEqualTo("chatLatitude", latitude + 0.009 + resusLatitude)
            //経度における現在地から1km以内のデータ
            .greaterThanOrEqualTo("chatLongitude", longitude-0.011 - resusLongitude)
            .lessThanOrEqualTo("chatLongitude", longitude + 0.011 + resusLongitude)
            .limit(100)
            .fetchAll()
            .then(function(items){

              $(".search_box").val(word);


              //リストを初期化する
              var list = document.getElementById("search");
              var htmlStr = ""; 

              //取得に成功した場合
              //一件ずつリストに追加する
              items.forEach(function(item){
                htmlStr += createListItem(item);
              });
              list.innerHTML = htmlStr;
            },
            function(err){
              alert(err.message);   
            })
            .catch(function(err){
              console.log(err);
            }); 
  } 
 
  //位置情報が取得できなかったとき
  function onError(error) {
    alert(error.message);
  }
}
