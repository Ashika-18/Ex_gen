//メッセージの削除
function confirmDelete(messageId) {
    if (confirm('このメッセージを削除しますか？')) {
        // 確認ダイアログでOKをクリックした場合の処理
        window.location.href = '/boards/delete/' + messageId;
    } else {
      // キャンセルされた場合の処理
      alert('削除がキャンセルされました。');
      return false;
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
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('form[action="/users/add"]').addEventListener('submit', handleSubmit);
});

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
    if (errorData.error) {
      alert(errorData.error);
    } else {
      alert("エラーが発生しました。");
    }
  } else {
    window.location.href = '/boards';
  }
}

//コメント欄の表示と非表示
document.querySelectorAll('.comment-toggle').forEach(function(element) {
  element.addEventListener('click', function() {
      var commentRow = this.parentElement.parentElement.nextElementSibling;
      if (commentRow.style.display === 'none' || commentRow.style.display === '') {
          commentRow.style.display = 'table-row';
      } else {
          commentRow.style.display = 'none';
      }
  });
});

console.log('javascriptは読み込みOK');