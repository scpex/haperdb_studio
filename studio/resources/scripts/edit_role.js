document.body.style.cursor = 'wait';

let currentRoleId = null;
let currentRoleName = null;
$(document).ready(function () {
    $('[id]').each(function () {
        var ids = $('[id="' + this.id + '"]');
        if (ids.length > 1 && ids[0] == this)
            console.warn('Multiple IDs #' + this.id);
    });
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
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

    elems.forEach(function (html) {
        var switchery = new Switchery(html, {
            size: 'small'
        });
    });

    $('.trees > li label').parent().find('ul').toggle();

    $('.trees > li label').click(function () {
        $(this).parent().find('ul').toggle();
    });

    $('.allschema').change((e) => {
        var specials = Array.prototype.slice.call(document.querySelectorAll('.' + e.currentTarget.id));
        var changeAllSchemas = document.querySelector('#' + e.currentTarget.id);
        toggleAllSwitch(changeAllSchemas, specials);
    })

    $('.alltables').change(function (e) {
        var changeAllTables = document.querySelector('#' + e.currentTarget.id);
        var specials = Array.prototype.slice.call(document.querySelectorAll('.' + e.currentTarget.id));

        toggleAllSwitch(changeAllTables, specials);
    })

    $('.childTables').change(function (e) {
        var changeChildTables = document.querySelector('#' + e.currentTarget.id);
        var specials = Array.prototype.slice.call(document.querySelectorAll('.' + e.currentTarget.id));

        toggleAllSwitch(changeChildTables, specials);
    })

    $('.attributeAll').change(function (e) {
        var changeAttributeAll = document.querySelector('#' + e.currentTarget.id);
        var specials = Array.prototype.slice.call(document.querySelectorAll('.' + e.currentTarget.id));
        toggleAllSwitch(changeAttributeAll, specials);
    })

    $('#changingName').click(() => {

    })

    $('#EditRoleModal').on('show.bs.modal', function (e) {
        var id = $(e.relatedTarget).data('id');
        var name = $(e.relatedTarget).data('name');
        currentRoleId = id;
        currentRoleName = name;

        document.getElementById('textRoleName').innerHTML = 'Edit on "' + name + '" role';
    });

    $('#deleteRole').on('show.bs.modal', function (e) {
        var id = $(e.relatedTarget).data('id');
        var name = $(e.relatedTarget).data('name');
        currentRoleId = id;
        currentRoleName = name;

        document.getElementById('exampleModalLongTitle').innerHTML = 'Are you sure for delete "' + name + '" role ?';
    });

    $('#DeleteRoleBtn').click(() => {
        deleteRole(currentRoleId, currentRoleName);
    })

    $('#SaveEditRoleBtn').click(() => {
        editingRole(currentRoleId, currentRoleName);
    })

    var schemas = $('#usedSchemas').val()
    var roles = $('#usedRoles').val()

    roles = JSON.parse(roles);
    var roleNames = roles.map(s => s.role);
    setEditble(roleNames);
    $('#searchRole').keyup(function () {
        var valueSearch = $('#searchRole').val();
        if (valueSearch == '') {
            roleNames.forEach(element => {
                $('#' + element).show();
            });
        } else {
            roleNames.forEach(element => {
                $('#' + element).hide();
            });
            let results = [];
            valueSearch = valueSearch.toLowerCase();
            results = roleNames.filter(x => x.toLowerCase().includes(valueSearch));
            results.forEach(element => {
                $('#' + element).show();
            });
        }
    });

    jQuery(document).ready(function () {        
        document.body.style.cursor = 'default';
    });
});

var toggleAllSwitch = function (changeState, allElements) {
    if (changeState.checked) {
        //true
        allElements.forEach(special => {
            if (!special.checked) {
                special.checked = true;
                if (typeof Event === 'function' || !document.fireEvent) {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('change', true, true);
                    special.dispatchEvent(event);
                } else {
                    special.fireEvent('onchange');
                }
            }
        });
    } else {
        allElements.forEach(special => {
            if (special.checked) {
                special.checked = false;
                if (typeof Event === 'function' || !document.fireEvent) {
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent('change', true, true);
                    special.dispatchEvent(event);
                } else {
                    special.fireEvent('onchange');
                }
            }
        });
    }
}

var editingRole = function (roleId, roleName) {
    var operation = "alter_role"
    var objEditRole = {};
    objEditRole.operation = operation;
    objEditRole.id = roleId;
    objEditRole.role = $("#showName_" + roleName).text();
    objEditRole.permission = {}    
    objEditRole.permission.super_user = document.querySelector('#' + roleName + '_superadmin').checked
    var flatenSchema = document.getElementById('flatenSchema').value;
    flatenSchema = JSON.parse(flatenSchema);
    var schemas = Object.keys(flatenSchema);

    if (schemas.length > 0) {
        schemas.forEach(schema => {
            if (flatenSchema[schema] != undefined) {
                var tables = Object.keys(flatenSchema[schema]);
                if (tables.length > 0) {
                    objEditRole.permission[schema] = {}
                    objEditRole.permission[schema].tables = {}
                    tables.forEach(table => {
                        var idAttribute = roleName + '_all_' + schema + '_' + table + '_';
                        objEditRole.permission[schema].tables[table] = {};
                        objEditRole.permission[schema].tables[table].read = document.querySelector('#' + idAttribute + 'R').checked;
                        objEditRole.permission[schema].tables[table].insert = document.querySelector('#' + idAttribute + 'I').checked;
                        objEditRole.permission[schema].tables[table].update = document.querySelector('#' + idAttribute + 'U').checked;
                        objEditRole.permission[schema].tables[table].delete = document.querySelector('#' + idAttribute + 'D').checked;
                        var attributes = flatenSchema[schema][table];
                        objEditRole.permission[schema].tables[table].attribute_restrictions = [];
                        if (attributes.length > 0) {


                            attributes.forEach(att => {
                                var attObj = {}
                                var idRestrictions = idAttribute + att + "_";
                                attObj.attribute_name = att;
                                attObj.read = document.querySelector('#' + idRestrictions + 'R').checked;
                                attObj.insert = document.querySelector('#' + idRestrictions + 'I').checked;
                                attObj.update = document.querySelector('#' + idRestrictions + 'U').checked;
                                attObj.delete = document.querySelector('#' + idRestrictions + 'D').checked;
                                objEditRole.permission[schema].tables[table].attribute_restrictions.push(attObj);
                            });
                        }
                    });
                }
            }
        });
    }
    

    $.ajax({
        type: "POST",
        url: '/security/alter_role',
        data: {
            "operationEditRole": JSON.stringify(objEditRole)
        },
        success: function (res) {            
            toastr.info(JSON.stringify(res));
            $('#' + roleName).attr('id', objEditRole.role);
        },
        error: function (err) {
            console.log(err);
            document.location.href = '/logout';
        }
    });
}

var setEditble = (roleNameArray) => {
    roleNameArray.forEach(roleName => {
        var option = {
            trigger: $("#clickToChange_" + roleName),
            action: "click"
        };
        $("#showName_" + roleName).editable(option, function (e) { });
    });
}

var deleteRole = (roleId, roleName) => {
    $.ajax({
        type: "POST",
        url: '/security/drop_role',
        data: {
            "roleId": roleId
        },
        success: function (res) {
            console.log(res);


            // $('#deleteRole').modal('hide');
            $('#deleteRole').modal('toggle');
            $('.modal-backdrop').remove();
            if (res.error) {
                toastr.error(JSON.stringify(res));
            } else {
                toastr.info(JSON.stringify(res));
                $("#" + roleName).empty();
            }

        },
        error: function (err) {
            console.log(err);
            document.location.href = '/logout';
        }
    })
}