console.log("RESAS開始");

let getpopulationDensity = () => {
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
        
        //現在地の郵便番号を取得します。
        postalCode = results[0].formatted_address.replace(/\D{2,}/g,"");
        //郵便局CSVに適合する形に変換する
        postalCode = '"' + postalCode + '"';
        getCSV();
   
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

//人口密度を求める
let getCSV = () => {
    // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成  
  var req = new XMLHttpRequest();
  // アクセスするファイルを指定
  req.open("get", "csv/zenkoku.csv", true); 
  // HTTPリクエストの発行
  req.send(null);
  // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
  req.onload = function(){
    console.log("レスポンス返ってきた");
    convertCSVtoArray(req.responseText);// 渡されるのは読み込んだCSVデータ
  }
}

let convertCSVtoArray = (str) => {// 読み込んだCSVデータが文字列として渡される
  var CSV_result = [];// 最終的な二次元配列を入れるための配列
  var tmp = str.split("\n");// 改行を区切り文字として行を要素とした配列を生成
  for(var i=0;i<tmp.length;++i){// 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    CSV_result[i] = tmp[i].split(',');
  }
  //郵便番号一致関数に配列をぶち込む
  postSearch(CSV_result);
}

let postSearch = (dataset) =>{
    for(var data of dataset){
    //郵便番号とCSVを合致させる
    if(data[4] == postalCode){
      var prefecture = data[1];
      var city = data[2];
      //四桁の時、先頭に0を付ける
      if(String(city).length == 4){
        city = "0"+city;
      }
      break;
    }
  }
  RESASAPI(prefecture,city);
}

let RESASAPI = (prefecture,city) =>{
  //総人口取得
  $.ajax({
    url: "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode="+ city +"&prefCode="+ prefecture,
    type: "GET",
    headers: {
      'X-API-KEY': "6jZR3t1hXjFKY98YwvkztFqwVAHk1wUPmaZo2nQG",
    },
    async: "false",
    //2010年の総人口を取得する
    success: function(result_data) {
      console.log(result_data);
      for(var i=0;i<result_data["result"]["data"]["0"]["data"].length;i++){
        if(result_data["result"]["data"]["0"]["data"][i]["year"] == 2010){
          totalPopulation = result_data["result"]["data"]["0"]["data"][i]["value"];
          console.log(totalPopulation);
          break;
        }
      }
  //メッシュの枚数を数える
  $.ajax({
    url: "https://opendata.resas-portal.go.jp/api/v1/population/mesh/chart?year=2010&prefecture_cd="+ prefecture +"&city_cd="+ city +"&matter=0&displayMethod=0",
    type: "GET",
    headers: {
      'X-API-KEY': "6jZR3t1hXjFKY98YwvkztFqwVAHk1wUPmaZo2nQG",
    },
    async: "false",
    success: function(result_data) {
      var mesh = 0;
      console.log(result_data);
      for(var i=0;i<result_data["result"]["data"].length;i++){
        mesh = mesh + result_data["result"]["data"][i]["value1"];
      }
      //メッシュは一枚あたり0.25km平方なので、面積はメッシュ枚数×0.25
      area = mesh * 0.25;
      console.log(area);
      populationDensity = Math.round(totalPopulation / area);
      console.log(populationDensity);
      getRange();
      console.log(resusLatitude);

    }
  });
   }
  });
}

let getRange = () =>{
  if(populationDensity <= 2325){
    resusLatitude = 0.009 * 9;
    resusLongitude = 0.011 * 9;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は9.1km平方です。"

  }else if(populationDensity <= 4400){
    resusLatitude = 0.009 * 8;
    resusLongitude = 0.011 * 8;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は8.1km平方です。"

  }else if(populationDensity <= 6475){
    resusLatitude = 0.009 * 7;
    resusLongitude = 0.011 * 7;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は7.1km平方です。"

  }else if(populationDensity <= 8550){
    resusLatitude = 0.009 * 6;
    resusLongitude = 0.011 * 6;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は6.1km平方です。"

  }else if(populationDensity <= 10625){
    resusLatitude = 0.009 * 5;
    resusLongitude = 0.011 * 5;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は5.1km平方です。"

  }else if(populationDensity <= 12700){
    resusLatitude = 0.009 * 4;
    resusLongitude = 0.011 * 4;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は4.1km平方です。"

  }else if(populationDensity <= 14775){
    resusLatitude = 0.009 * 3;
    resusLongitude = 0.011 * 3;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は3.1km平方です。"

  }else if(populationDensity <= 16850){
    resusLatitude = 0.009 * 2;
    resusLongitude = 0.011 * 2;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は2.1km平方です。"

  }else if(populationDensity <= 18925){
    resusLatitude = 0.009;
    resusLongitude = 0.011;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は1.1km平方です。"

  }else if(18925 < populationDensity){
    resusLatitude = 0;
    resusLongitude = 0;
    toastText = "あなたのマチの人口密度はおよそ1km平方あたり" + populationDensity + "人です。";
    toastText2 = "あなたの投稿取得範囲は100m平方です。"

  }
}

getpopulationDensity();