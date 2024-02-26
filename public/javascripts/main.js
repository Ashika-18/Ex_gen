//メッセージの削除
function confirmDelete(messageId) {
    if (confirm('このメッセージを削除しますか？')) {
        // 確認ダイアログでOKをクリックした場合の処理
        window.location.href = '/boards/delete/' + messageId;
    } else {
        // キャンセルされた場合の処理
        alert('削除がキャンセルされました。');
    };
};

//アカウントの削除
function userDelete(accountId) {
    if (confirm('このアカウントを削除しますか？')) {
        // 確認ダイアログでOKをクリックした場合の処理
        window.location.href = '/users/delete/' + accountId;
    } else {
        // キャンセルされた場合の処理
        alert('削除がキャンセルされました。');
    };
};

//errorからのindexに戻る処理
function goBack(returnTo) {
    
    if (returnTo) {
        window.location.href = returnTo;
    } else {
        console.log('errorが発生しました。');
        window.location.href = ('/boards');
    }
}