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

// user追加フォームの送信時に呼び出される関数
document.querySelector('form').addEventListener('submit', handleSubmit);
async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const pass = formData.get('pass');
  
    try {
      const response = await fetch('/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, pass })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      // 成功した場合の処理
      window.location.href = '/users';
      
    } catch (error) {
      alert(error.message); // エラーメッセージをalertウィンドウに表示
    }
}

console.log('javascriptは読み込みOK');