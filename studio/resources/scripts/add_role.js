$(document).ready(function () {


    $('.trees > li label').click(function () {
        $(this).parent().find('ul').toggle();
    });

    var schemas = document.getElementById('schemaAll').value

    schemas = JSON.parse(schemas);    

    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

    elems.forEach(function (html) {
        var switchery = new Switchery(html, {
            size: 'small'
        });
    });
    
    $('.trees > li label').parent().find('ul').toggle();

    var changeAllSchemas = document.querySelector('#all-schema');
    var specials = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    specials.shift();
    specials.shift();
    changeAllSchemas.onchange = function () {        
        if (changeAllSchemas.checked) {
            //true            
            specials.forEach(special => {
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
            specials.forEach(special => {
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

    $('.js-switch.schema').change(function (e) {
        var schemaName = $(this).attr('id');
        var changeAllTable = document.querySelector('#' + schemaName);
        var tableChilds = document.querySelectorAll('.' + schemaName);

        if (changeAllTable.checked) {
            //true            
            tableChilds.forEach(eachNode => {
                if (!eachNode.checked) {
                    eachNode.checked = true;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, true);
                        eachNode.dispatchEvent(event);
                    } else {
                        eachNode.fireEvent('onchange');
                    }
                }
            });
        } else {
            tableChilds.forEach(eachNode => {
                if (eachNode.checked) {
                    eachNode.checked = false;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, true);
                        eachNode.dispatchEvent(event);
                    } else {
                        eachNode.fireEvent('onchange');
                    }
                }
            });
        }

    })


    $('.js-switch.table').change(function (e) {
        var schemaName = $(this).attr('id');
        var changeAllTable = document.querySelector('#' + schemaName);
        var tableChilds = document.querySelectorAll('.' + schemaName);

        if (changeAllTable.checked) {
            //true            
            tableChilds.forEach(eachNode => {
                if (!eachNode.checked) {
                    eachNode.checked = true;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, true);
                        eachNode.dispatchEvent(event);
                    } else {
                        eachNode.fireEvent('onchange');
                    }
                }
            });
        } else {
            tableChilds.forEach(eachNode => {
                if (eachNode.checked) {
                    eachNode.checked = false;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, true);
                        eachNode.dispatchEvent(event);
                    } else {
                        eachNode.fireEvent('onchange');
                    }
                }
            });
        }
    })


    $('.js-switch.attribute').change(function (e) {
        var schemaName = $(this).attr('id');
        var changeAllTable = document.querySelector('#' + schemaName);
        var tableChilds = document.querySelectorAll('.' + schemaName);

        if (changeAllTable.checked) {
            //true            
            tableChilds.forEach(eachNode => {
                if (!eachNode.checked) {
                    eachNode.checked = true;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, true);
                        eachNode.dispatchEvent(event);
                    } else {
                        eachNode.fireEvent('onchange');
                    }
                }
            });
        } else {
            tableChilds.forEach(eachNode => {
                if (eachNode.checked) {
                    eachNode.checked = false;
                    if (typeof Event === 'function' || !document.fireEvent) {
                        var event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, true);
                        eachNode.dispatchEvent(event);
                    } else {
                        eachNode.fireEvent('onchange');
                    }
                }
            });
        }
    })


});

var addingRole = function () {
    var operation = "add_role"
    var objAddRole = {};
    objAddRole.operation = operation;
    objAddRole.role = document.getElementById('newRoleName').value;
    objAddRole.permission = {}
    objAddRole.permission.super_user = document.querySelector('#superadmin').checked
    var flatenSchema = document.getElementById('flatenSchema').value;
    flatenSchema = JSON.parse(flatenSchema);
    var schemas = Object.keys(flatenSchema);

    if (schemas.length > 0) {
        schemas.forEach(schema => {
            if (flatenSchema[schema] != undefined) {
                var tables = Object.keys(flatenSchema[schema]);
                if (tables.length > 0) {
                    objAddRole.permission[schema] = {}
                    objAddRole.permission[schema].tables = {}
                    tables.forEach(table => {
                        var idAttribute = schema + '_' + table + '_';
                        objAddRole.permission[schema].tables[table] = {};
                        objAddRole.permission[schema].tables[table].read = document.querySelector('#' + idAttribute + 'R').checked;
                        objAddRole.permission[schema].tables[table].insert = document.querySelector('#' + idAttribute + 'I').checked;
                        objAddRole.permission[schema].tables[table].update = document.querySelector('#' + idAttribute + 'U').checked;
                        objAddRole.permission[schema].tables[table].delete = document.querySelector('#' + idAttribute + 'D').checked;
                        var attributes = flatenSchema[schema][table];
                        objAddRole.permission[schema].tables[table].attribute_restrictions = [];
                        if (attributes.length > 0) {
                           

                            attributes.forEach(att => {
                                var attObj = {}
                                var idRestrictions = idAttribute + att + "_";
                                attObj.attribute_name = att;
                                attObj.read = document.querySelector('#' + idRestrictions + 'R').checked;
                                attObj.insert = document.querySelector('#' + idRestrictions + 'I').checked;
                                attObj.update = document.querySelector('#' + idRestrictions + 'U').checked;
                                attObj.delete = document.querySelector('#' + idRestrictions + 'D').checked;                                
                                objAddRole.permission[schema].tables[table].attribute_restrictions.push(attObj);
                            });
                        }
                    });
                }
            }
        });
    }
        

    $.ajax({
        type: "POST",
        url: '/security/add_role',
        data: {"operationAddRole": JSON.stringify(objAddRole)},
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
            toastr.info('add ' + res.role + ' role successfully');
        },
        error: function (err) {            
            document.location.href = '/logout';
        }
    });
}