var users = null;
var currentUsername = null;
$(document).ready(function () {
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

    users = JSON.parse(document.getElementById("users").value)
    currentUsername = document.getElementById('currentUsername').value
    createUsersTable(users)
    setSwitch();
    // var init = new Switchery(document.querySelector('.js-switch-disable'),
    //     {
    //         size: 'small'
    //     }
    // )
    // init.disable();


    sTable = $('#usersTable').DataTable({
        "dom": "<'col-md-12't><'col-md-4'<'pull-left'l>><'col-md-8 right-pagging'p>",
        "lengthMenu": [
            [10, 50, 100, -1],
            [10, 50, 100, "All"]
        ],
        "iDisplayLength": 10,
    });

    $('#searchSecurity').keyup(function () {
        sTable.search($(this).val()).draw();
    })

    $('#deleteUserModal').on('show.bs.modal', function (e) {
        var curUsername = $(e.relatedTarget).data('id');
        usernameForDelete = curUsername;
    });

    $("#DeleteUserBtn").click(function () {
        dropUser(usernameForDelete);
    });

    $('#addUserForm').validate({
        showErrors: function (errorMap, errorList) {
            errorList.forEach(elem => {
                elem.element.style.border = '2px solid red';
                elem.element.style.backgroundColor = 'rgb(255, 125, 115)';
            });

        },
        rules: {
            username: {
                required: true,
            },
            password: {
                required: true,
            },
            role: {
                required: true,
            },
        },
        submitHandler: function (form) {

            var newUser = {
                username: $("input[name=username]").val(),
                password: $("input[name=password]").val(),
                role: $("select[name=role]").val(),
                active: $("input[name=active]").prop('checked'),
            }
            addnewUser(newUser);
        }


    });

    $.ajax({
        type: "POST",
        url: '/security/getallrole',
        success: (res => {
            roles = res;
            res.forEach(role => {
                $('#selectRole').append($("<option style='padding: 3px;'>")
                    .attr("value", role.id)
                    .text(role.role))
            });

        }),
        dataType: 'json',
        error: (err) => {
            console.log(err)
            document.location.href = '/logout';
        }
    });

});

function toggleActive(username) {
    var user = null;

    for (u in users) {
        if (users[u].username == username) {
            user = users[u];            
            if (user.active) {
                user.active = false;
            } else {
                user.active = true;
            }

            $.ajax({
                type: "POST",
                url: 'security/update_user_active',
                data: user,
                success: function () {
                    console.log('updated successfully');
                },
                error: function (err) {
                    console.log(err);
                    document.location.href = '/logout';
                }
            });

        }
    }

}

function userDetail(username) {
    window.location = "user_detail?un=" + username

}

dropUser = function (username) {
    var element = $("#usersTable tbody tr:contains('" + username + "')");
    element.addClass("forDelete");

    var sTable = $('#usersTable').DataTable();
    $.ajax({
        type: "POST",
        url: '/security/drop_user',
        data: {
            username: username
        },
        success: function (res) {
            sTable.row('.forDelete').remove().draw();
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
        },
        error: function (err) {
            console.log(err);
            document.location.href = '/logout';
        }
    });
}

goToEditUser = function (username) {
    var user = null;
    
    for (u in users) {
        if (users[u].username == username) {
            user = users[u];
            document.getElementById('userToEdit').value = JSON.stringify(user);
            $('#goToEditUser').submit();
        }
    }
}

setDataTable = () => {
    var sTable = $('#usersTable').DataTable({
        "dom": "<'col-md-12't><'col-md-4'<'pull-left'l>><'col-md-8 right-pagging'p>",
        "lengthMenu": [
            [10, 50, 100, -1],
            [10, 50, 100, "All"]
        ],
        "iDisplayLength": 10,
    });
}

var createUsersTable = function (allUser) {
    var tbody = $('#usersTable tbody');
    allUser.forEach(user => {
        var tr = document.createElement('tr');

        //Picture
        // var td = document.createElement('td');
        var i = document.createElement('i');
        // i.setAttribute('class', 'fa fa-user-circle usericon');
        // td.appendChild(i);
        // tr.appendChild(td);

        //Username
        var td = document.createElement('td');
        td.appendChild(document.createTextNode(user['username']));
        td.setAttribute('onclick', 'goToEditUser("'+user['username']+'")');
        td.setAttribute('style', 'cursor: pointer');
        tr.appendChild(td);

        // Role
        td = document.createElement('td');
        td.setAttribute('onclick', 'goToEditUser("'+user['username']+'")');
        td.setAttribute('style', 'cursor: pointer');
        td.appendChild(document.createTextNode(user.role != undefined ? user.role.role : 'no role'))
        tr.appendChild(td);

        //Active
        td = document.createElement('td');
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('onchange', 'toggleActive("' + user.username + '");');
        if (user.username == currentUsername)
            input.setAttribute('class', 'js-switch-disable');
        else
            input.setAttribute('class', 'js-switch');
        if (user.active)
            input.setAttribute('checked', true);
        td.appendChild(input)
        tr.appendChild(td);

        //Failed Login Attempts
        td = document.createElement('td');
        td.appendChild(document.createTextNode(' - '))
        tr.appendChild(td);
        //delete icon
        td = document.createElement('td');
        td.setAttribute('class', 'midtitle2');
        i.setAttribute('class', 'fa fa-trash ml-2');
        // i.setAttribute('onclick', 'dropUser("' + user.username + '")');
        i.setAttribute('href', '#deleteUserModal')
        i.setAttribute('data-toggle', 'modal')
        i.setAttribute('data-target', '#deleteUserModal')
        i.setAttribute('data-id', user.username)

        td.appendChild(i);
        tr.appendChild(td);
        tbody.append(tr);
    });

}

addnewUser = function (newUser) {
    $.ajax({
        type: "POST",
        url: '/security/add_user',
        data: newUser,
        success: (res => {
            if (res.error) {
                toastr.error(res.error);
            } else {
                toastr.info(res.message);
                $.ajax({
                    type: "POST",
                    url: '/security/getalluser',
                    success: (res => {
                        users = res;
                        if (res.error != undefined)
                            console.log(res.error);
                        else {
                            var sTable = $('#usersTable').DataTable();
                            sTable.destroy();
                            $('#usersTable tbody').children().remove()
                            createUsersTable(users);
                            setSwitch();
                            setDataTable();
                            $('#addUserModal').modal('toggle');
                        }

                    }),
                    dataType: 'json',
                    error: function (err) {
                        console.log(err)
                        document.location.href = '/logout';
                    }
                });
            }
        }),
        dataType: 'json',
        error: function (err) {
            console.log(err)
            document.location.href = '/logout';
        }
    });
}

setSwitch = () => {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

    elems.forEach(function (html) {
        var switchery = new Switchery(html, {
            size: 'small'
        });
    });

    var disb = document.querySelector('.js-switch-disable');
    var init = new Switchery(disb, { size: 'small' })
    init.disable();
}