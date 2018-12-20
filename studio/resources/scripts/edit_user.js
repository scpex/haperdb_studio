$(document).ready(function () {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

    elems.forEach(function (html) {
        var switchery = new Switchery(html, {
            // size: 'small'
        });
    });

    $('#deleteUserModal').on('show.bs.modal', function (e) {
        var curUsername = $(e.relatedTarget).data('id');
        usernameForDelete = curUsername;
    });

    $("#DeleteUserBtn").click(function () {
        dropUser(usernameForDelete);
    });
});

function toggleActive(username) {
    var user = document.getElementById('thisUser').value;

    user = JSON.parse(user);
    if (user.active) {
        user.active = false;
    } else {
        user.active = true;
    }

    $.ajax({
        type: "POST",
        url: '/security/update_user',
        data: user,
        success: function () {
            console.log('updated successfully');
            document.getElementById('thisUser').value = JSON.stringify(user);
        },
        error: function (err) {
            console.log(err);
            document.location.href = '/logout';
        }
    });

}

dropUser = function (username) {
    
    var sTable = $('#usersTable').DataTable();
    $.ajax({
        type: "POST",
        url: '/security/drop_user',
        data: {
            username: username
        },
        success: function (res) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            toastr.info(res.message);
            console.log('deleted successfully');
            window.location.replace("/security");
        },
        error: function (err) {
            console.log(err);
            document.location.href = '/logout';
        }
    });
}

resetPassword = () => {
    var user = document.getElementById('thisUser').value;
    user = JSON.parse(user);
    var newPassword = document.getElementById('newPassword').value;
    user.password = newPassword;
    console.log(user);
    $.ajax({
        type: "POST",
        url: '/security/update_user_password',
        data: user,
        success: function (res) {
            toastr.options = {
                "closeButton": false,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
            toastr.info(JSON.stringify(res));
            console.log('updated password successfully');
            document.getElementById('thisUser').value = JSON.stringify(user);
        },
        error: function (err) {
            console.log(err);
            document.location.href = '/logout';
        }
    });
}