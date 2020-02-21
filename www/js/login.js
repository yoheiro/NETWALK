//会員登録の処理
function register(){
  var user = new ncmb.User();
  var username = $("#reg_username").val();
  var password = $("#reg_password").val();
  var mailaddress = $("#reg_mailaddress").val();
    
    user.set("userName", username)
        .set("password", password)
        .set("mailAddress", mailaddress)
        .signUpByAccount()
        .then(function(user){
            $("#reg_username").val("");
            $("#reg_password").val("");
            $("#reg_mailaddress").val("");

            ons.notification.alert({
                title: "仮登録完了",
                message: "仮登録が完了しました。" + "<br>" +"登録されたメールアドレスにURLを送信しますので、そこから本登録を行ってください。",
                callback: function() {
                  //スムーズにログインしやすいようにページを切り替える
                  mainNavigator.bringPageTop('tab.html');
                  dialog.show();
                }
            });
        })
        .catch(function(err){
            //エラー処理
            //メアドかチェック
            if (!(new RegExp("^[A-Za-z0-9][A-Za-z0-9_.-]+@[a-zA-Z0-9-]+([.][a-zA-Z0-9-]+[A-Za-z0-9])+$").test(mailaddress))){
              ons.notification.alert({
                title: "登録失敗",
                message: "メールアドレスで登録してください。"
              });    
            } else {
            ons.notification.alert({
                        title: "登録失敗",
                        message: 'ユーザーネームまたはメールアドレスが既に使用されています。'
                    });
            }
        });
}

//ログインボタンをクリックした際の処理
function login(){
    //入力フォームからメールアドレスとパスワードを取得する
    var username = $("#username").val();
    var password = $("#password").val();
    //メールアドレスとパスワードでログインする
    ncmb.User.login(username, password)
    .then(function(user) {
        /* 処理成功 */
        //フィールドを空にする
        $("#username").val("");
        $("#password").val("");
        ons.notification.toast('ログインに成功しました。', {timeout: 2000});
        //ユーザーネームとメールアドレスを取得して表示する
        var User = ncmb.User.getCurrentUser();
        $("#current_user").text(user.get("userName"));
        $("#current_mailaddress").text(user.get("mailAddress"));
        //ログインしたら自動的にTLを表示
        getChat();
        ons.notification.toast(toastText, {timeout: 2000});
        ons.notification.toast(toastText2, {timeout: 2000});
    })
    .catch(function(error) {
        /* 処理失敗 */
        ons.notification.alert({
            title: "ログイン失敗",
            message: 'ログインに失敗しました。',
            callback: function() {
                dialog.show();
            }
        });
    });
}

//パスワードを忘れた方はこちらをクリックした際の処理
function reset(){
  var mailaddress = $("#reset_mailaddress").val();

  //メアドかチェック
  if (!(new RegExp("^[A-Za-z0-9][A-Za-z0-9_.-]+@[a-zA-Z0-9-]+([.][a-zA-Z0-9-]+[A-Za-z0-9])+$").test(mailaddress))){
    ons.notification.alert({
                  title: "登録失敗",
                  message: "メールアドレスで登録してください。"
              });    
  };


 //メールアドレスに会員登録用メールを送信する
            var user = new ncmb.User();
                user.set("mailAddress", mailaddress);
                user.requestPasswordReset()
                     .then(function(data){
                        //処理成功 
                        //フィールドを空にする
                        $("#reset_mailaddress").val("");
                        ons.notification.alert({
                            title: "メール送信完了",
                            message: "リセットメールを送信しました。",
                            callback: function() {
                              //スムーズにログインしやすいようにページを切り替える
                              mainNavigator.bringPageTop('tab.html');
                              dialog.show();
            }
                        });
                        
                     })
                     .catch(function(error){
                        //処理失敗
                        ons.notification.alert({
                            title: "メール送信失敗",
                            message: 'メール送信に失敗しました。'
                        });
                         
                     });
}
