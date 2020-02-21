/**ログイン機能**/
// [NCMB] APIキー設定
var appKey =
"cd5a1f755cad119d40f02ce86648a072dd89e372dcf51066e966de0a5f90fc3f";
var clientKey =
"2c2432780128caeb82fa96b08bb78d5aa7d5208966671c79e08e11aad0149d69";

// [NCMB] SDKの初期化
var ncmb = new NCMB(appKey, clientKey);

//mBaaSにデータストアを作成する
var chatData = ncmb.DataStore("chatData");

//doneのエラーを消す
var flag = 0;

// ログイン中の会員
var User;

//現在位置の郵便番号
var postalCode;

//現在位置の総人口
var totalPopulation;

//現在位置の面積
var area;

//現在位置の人口密度
var populationDensity = 0;

//人口密度と連動して決めた範囲
var resusLatitude = 0;
var resusLongitude = 0;

//ローカルストレージのリスト
var heartList = [];

//画像
var img;
var image3;//thumb

//トーストの文章
var toastText = "情報が取得できませんでした";
var toastText2 = "情報が取得できませんでした";

var objectId2;