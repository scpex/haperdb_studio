let firstFilterCol = '';
let grobalSchemas = '';
let operations = ['=', '<', '<=', '>', '>=', 'LIKE', 'in']
let condition = ['AND', 'OR']
let saveSQL = '';
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
    $("#collapseResult").hide()
    var schemas = document.getElementById('schemas').value;
    grobalSchemas = JSON.parse(schemas);
    var keys = Object.keys(grobalSchemas);

    firstFilterCol = $('#firstFilterColumn').children();

    getSchemas(keys);
    removeFilter();

    $('#AddFilterColumn').click(e => {

        var firstFilter = $('#firstFilterColumn');
        if (firstFilter.children().length == 0) {
            createFirstFilterColumn();
        } else
            createOtherFilterColumn();
    })

    selectToggle();


    $('#searchSqlBtn').click(function (e) {
        $('#collapseResultChart').hide()
        $(document.body).css({
            'cursor': 'wait'
        });
        // option X Y Axis Charts 
        $('#hTitle')
            .find('option')
            .remove().end()
            .append('<option value="">none</option>')
            .val('')

        $('#vTitle')
            .find('option')
            .remove().end()
            .append('<option value="">none</option>')
            .val('')

        $.ajax({
            type: "POST",
            url: '/explore/filter_search',
            data: {
                sql: buildSqlQuery()
            },
            success: function (obj) {
                console.log(obj)


                if (obj.result.error != undefined) {
                    toastr.error(obj.result.error);
                    $("#collapseResult").hide()
                } else if (typeof obj.result == 'string') {
                    toastr.error(obj.result);
                    $("#collapseResult").hide()
                } else {
                    $("#collapseResult").show()
                    toastr.success(obj.sql);
                    saveSQL = obj.sql;
                    var columnssss = [];
                    if (obj.result.length > 0) {
                        Object.keys(obj.result[0]).forEach(element => {
                            columnssss.push({
                                title: element
                            })
                            
                            $('#hTitle')
                                .append($("<option></option>")
                                    .attr("value", element)
                                    .text(element));
                            $('#vTitle')
                                .append($("<option></option>")
                                    .attr("value", element)
                                    .text(element));
                        });


                        var data = [];
                        obj.result.forEach(element => {
                            data.push(Object.values(element));
                        });
                        if ($.fn.DataTable.isDataTable('#resultTable')) {
                            sTable.destroy();
                            $('#resultTable').empty();
                        }
                        sTable = $('#resultTable').DataTable({
                            data: data,
                            columns: columnssss,
                            "dom": "<'col-md-12 datatable-over't><'col-md-4'<'pull-left'l>><'col-md-8 right-pagging'p>",
                            "lengthMenu": [
                                [10, 50, 100, -1],
                                [10, 50, 100, "All"]
                            ],
                            "iDisplayLength": 10,
                            buttons: [{
                                extend: 'csvHtml5',
                                text: '<i class="fa fa-refresh"></i>',
                                titleAttr: 'CSV'
                            }]
                        });
                        saveRecent(obj.sql);
                    } else {
                        if ($.fn.DataTable.isDataTable('#resultTable')) {
                            sTable.destroy();
                            $('#resultTable').empty();
                        }
                        // alert('data is empty');
                        toastr.info('data is empty');
                    }
                }
                $(document.body).css({
                    'cursor': 'default'
                });

            },
            error: function (err) {
                $(document.body).css({
                    'cursor': 'default'
                });
                console.log(err);
                document.location.href = '/logout';
            }
        });
    })

    // //export
    // $('.fa-sign-out').click(() => {
    //     sTable.button(0).trigger();
    // })

    //reset
    $('#resetSqlBtn').click(() => {
        $('#otherFilterColumn').children().remove();
        $("#selectSchema").val('');
        // $('#selectTable').children().remove();
        $("#selectTable").val('');
        getTables();
        $("input").val('');
        $('#selectAttribute').children().remove();
        $('#selectAttribute').append('<option value="">select attribute</option>');
    })

    $("#favoriteForm").submit(function (event) {

        saveFavorite().then(() => {
            $('#saveModalCenter').modal('toggle');
        });
        event.preventDefault();
    });

    $("#filterGenerateChart, .fa-refresh-filter").click(function () {
        $("#collapseResult").hide()
        var sqlQuery = buildSqlQuery();
        console.log(sqlQuery)
        var options = {
            // 'width': 800,
            'height': 300,
            // chartArea: { width: '80%' },
            title: $('#chartTitle').val(),
            titleTextStyle: {
                color: '#333',
                bold: true,
            },
            // subtitle: $('#chartSubtitle').val(),
            hAxis: {
                title: $('#hTitle').val(),
                textStyle: { color: '#333' },
                titleTextStyle: { color: '#333' },
                gridlines: { color: '#1E4D6B' }
            },
            vAxis: {
                title: $('#vTitle').val(),
                textStyle: { color: '#333' },
                titleTextStyle: { color: '#333' },
                gridlines: { color: '#1E4D6B' }
            },
            bars: 'horizontal' // Required for Material Bar Charts.
            ,
            backgroundColor: '#C6C8CA',
            series: {
                0: { color: '#403B8A' },
                1: { color: '#009455' }
            },
            legend: {
                textStyle: {
                    color: '#333'
                }
            }
            , showTooltip: true,
            showInfoWindow: true
        };
        globalOptions = options;
        var gType = $("#type-chart").val()
        gGraphType = gType;

        generateChart(gType, sqlQuery, options);
    })


});

function saveFavorite() {
    return new Promise(resolve => {
        $.ajax({
            type: "POST",
            url: '/explore/setfavorite',
            data: {
                sql: saveSQL,
                note: document.getElementById('favoriteNote').value,
                name: document.getElementById('favoriteName').value
            },
            success: function (result) {
                toastr.success(JSON.stringify(result));
                resolve(true);
            },
            error: function (err) {
                console.log(err);
                document.location.href = '/logout';
            }
        })
    })

}

var removeFilter = () => {
    $('.removeicon .fa').click(function (e) {
        $(this).parent().parent().parent().remove();
    })
}

var selectToggle = () => {
    $("#selectSchema").change(function () {
        $('#otherFilterColumn').children().remove()
        var type = document.getElementById('selectSchema').value;

        getTables(type);
    });

    $("#selectTable").change(function () {
        $('#otherFilterColumn').children().remove()
        var schema = document.getElementById('selectSchema').value;
        var table = document.getElementById('selectTable').value;
        getAttribute(schema, table);
    });
}

createFirstFilterColumn = () => {
    $('#firstFilterColumn').append(firstFilterCol);
    removeFilter();

}

createOtherFilterColumn = () => {

    var curNum = $('#otherFilterColumn .row').length;
    curNum += 1;
    while (-1) {
        if (document.getElementById('conditionsAttribute' + curNum) != null)
            curNum++;
        else
            break;
    }
    var rowDiv = document.createElement('div');
    rowDiv.setAttribute('class', 'row filterrow')

    var colDiv = document.createElement('div')
    colDiv.setAttribute('class', 'col-md-12')


    var btnGroupDiv = document.createElement('div')
    btnGroupDiv.setAttribute('class', 'btn-group minfiltertitle')
    btnGroupDiv.setAttribute('style', 'float:left')

    var conditions = document.createElement('select')
    conditions.setAttribute('id', 'conditionsAttribute' + curNum)
    conditions.setAttribute('name', 'conditionsAttribute' + curNum)
    conditions.setAttribute('class', 'form-controls')

    condition.forEach(element => {
        var conditionOption = document.createElement('option')
        conditionOption.setAttribute('value', element)
        conditionOption.appendChild(document.createTextNode(element))
        conditions.appendChild(conditionOption);
    });

    btnGroupDiv.appendChild(conditions)

    colDiv.appendChild(btnGroupDiv)

    var btnGroupDivColumn = document.createElement('div')
    btnGroupDivColumn.setAttribute('class', 'btn-group minfiltertitle')
    btnGroupDivColumn.setAttribute('style', 'float:left; margin-left:10px;')

    var columnSelect = document.createElement('select')
    columnSelect.setAttribute('id', 'selectAttribute' + curNum)
    columnSelect.setAttribute('name', 'selectedAttribute' + curNum)
    columnSelect.setAttribute('class', 'form-controls')

    var attributes = [];
    var schema = document.getElementById('selectSchema').value;
    var table = document.getElementById('selectTable').value;
    if (grobalSchemas[schema][table]['attributes'] != undefined)
        attributes = grobalSchemas[schema][table]['attributes'].map(a => a.attribute);

    var options = document.createElement('option')
    options.setAttribute('value', '')
    options.appendChild(document.createTextNode('Select Column'))

    attributes.forEach(element => {
        options = document.createElement('option')
        options.setAttribute('value', element)
        options.appendChild(document.createTextNode(element))
        columnSelect.appendChild(options);
    });

    btnGroupDivColumn.appendChild(columnSelect);

    colDiv.appendChild(btnGroupDivColumn)

    var btnGroupDivOperation = document.createElement('div')
    btnGroupDivOperation.setAttribute('class', 'btn-group minfiltertitle')
    btnGroupDivOperation.setAttribute('style', 'float:left; margin-left:10px;')

    var operationSelect = document.createElement('select')
    operationSelect.setAttribute('id', 'selectOperation' + curNum)
    operationSelect.setAttribute('name', 'selectedOperation' + curNum)
    operationSelect.setAttribute('class', 'form-controls')

    operations.forEach(element => {
        var options = document.createElement('option')
        options.setAttribute('value', element)
        options.appendChild(document.createTextNode(element))
        operationSelect.appendChild(options);
    });

    btnGroupDivOperation.appendChild(operationSelect);

    colDiv.appendChild(btnGroupDivOperation)

    var valueDiv = document.createElement('div')

    var valueInput = document.createElement('input')
    valueInput.setAttribute('name', 'value' + curNum)
    valueInput.setAttribute('class', 'form-controls minwidthtextbox')
    valueInput.setAttribute('style', 'float:left; margin-left:10px; max-width:200px; margin-right:5px;')
    valueInput.setAttribute('placeholder', 'Enter Value')
    valueDiv.appendChild(valueInput);
    colDiv.appendChild(valueDiv)

    var removeDiv = document.createElement('div')
    removeDiv.setAttribute('class', 'removeicon')

    var removeIcon = document.createElement('i')
    removeIcon.setAttribute('class', 'fa fa-times text-red')

    removeDiv.appendChild(removeIcon);

    colDiv.appendChild(removeDiv)

    rowDiv.appendChild(colDiv);
    $('#otherFilterColumn').append(rowDiv);
    selectToggle();
    removeFilter();
}

var getSchemas = (schemas) => {
    schemas.forEach(element => {
        $('#selectSchema').append('<option value="' + element + '"> ' + element + '</option>');
    });
}

var getTables = (schema) => {

    var tableKeys = [];
    if (grobalSchemas[schema] != undefined)
        tableKeys = Object.keys(grobalSchemas[schema]);

    $('#selectTable').children().remove();
    $('#selectTable').append('<option value="">Select Table</option>');
    tableKeys.forEach(element => {
        $('#selectTable').append('<option value="' + element + '"> ' + element + '</option>');
    });
}

var getAttribute = (schema, table) => {
    var attributes = [];

    if (grobalSchemas[schema][table]['attributes'] != undefined)
        attributes = grobalSchemas[schema][table]['attributes'].map(a => a.attribute);
    $('#selectAttribute').children().remove();
    attributes.forEach(element => {
        $('#selectAttribute').append('<option value="' + element + '"> ' + element + '</option>');
    });

}

var saveRecent = (sql) => {
    var host = window.location.host;
    var encode = btoa(sql);
    var liveLink = host + '/explore/sql_search/' + encode
    var array = localStorage.getItem('recentSql')
    if (array == null)
        array = [];
    else {
        array = JSON.parse(array);
        if (array.length >= 7) {
            array.shift()
        }
    }

    var object = {
        sql: sql,
        url: liveLink
    }
    array.push(object);
    document.getElementById("liveLinkSQL").value = liveLink;
    localStorage.setItem('recentSql', JSON.stringify(array));
}

var buildSqlQuery = function () {
    var table = document.getElementById('selectTable').value
    var schema = document.getElementById('selectSchema').value
    // table = "\"" + table + "\"";
    // schema = "\"" + schema + "\"";
    var tableName = schema + '.' + table;
    let queryString = "SELECT * FROM " + tableName;
    var first = $('#firstFilterColumn .col-md-12').children().children();
    var whereString = '';
    if (first.length > 0) {
        var curValue = first[3].value.replace(/"/g, '\'');
        if (isNaN(parseFloat(curValue)) == true) {
            curValue = "'" + curValue + "'";            
        }
        else {
            curValue = parseFloat(curValue);

        }    
            
        whereString = " WHERE " + first[1].value + " " + first[2].value + " " + curValue;
    }

    var others = $('#otherFilterColumn .col-md-12').children().children();
    var moreQuery = '';
    if (others.length > 0) {
        moreQuery = ' ';
        for (var i = 0; i < others.length; i++) {
            var curValue = null;
            if (i % 5 != 4) {
                if (i % 5 == 1)
                    curValue = others[i].value
                else if (i % 5 == 3) {
                    curValue = others[i].value.replace(/"/g, '\'');
                    if (isNaN(curValue) == true)
                        curValue = "'" + curValue + "'";
                    else
                        curValue = parseInt(curValue);
                } else
                    curValue = others[i].value.replace(/"/g, '\'');

                moreQuery += curValue + ' ';
            }
        }

    }
    return queryString + whereString + moreQuery;
}