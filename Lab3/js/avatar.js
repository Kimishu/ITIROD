

var loadFile = function(event) {
    var avatar = document.getElementById('avatar');
    avatar.style.background = URL.createObjectURL(event.target.files[0]);
    avatar.onload = function() {
      URL.revokeObjectURL(avatar.src) // free memory
    }
  };
