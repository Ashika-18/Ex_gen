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

// // user追加フォームの送信時に呼び出される関数
async function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('name');
  const pass = formData.get('pass');

  const response = await fetch('/users/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, pass })
  });

  if (!response.ok) {
    const errorData = await response.json();
    alert(errorData.error);
    window.location.href = '/boards';
  } else {
  // 成功した場合の処理
  window.location.href = '/users';
  }
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('form').addEventListener('submit', handleSubmit);
});

console.log('javascriptは読み込みOK');