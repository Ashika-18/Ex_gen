function confirmDelete(messageId) {
    if (confirm('このメッセージを削除しますか？')) {
        // 確認ダイアログでOKをクリックした場合の処理
        window.location.href = '/boards/delete/' + messageId;
    } else {
        // キャンセルされた場合の処理
        alert('削除がキャンセルされました。');
    }
    console.log('読み込めてるよ😜')
}
