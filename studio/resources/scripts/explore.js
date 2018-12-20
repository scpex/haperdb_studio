var gDeleteLivelinkId = null;
var globalLiveLink = null;

$(document).ready(function () {
    google.charts.load('current', { packages: ['corechart', 'line', 'bar', 'map', 'scatter', 'gauge', 'treemap', 'geochart'], 'mapsApiKey': 'AIzaSyAP0UYqFCuSOOIMOQ6Ltmrx1B79XUw4Tmw' });
    var recents = localStorage.getItem('recentSql');
    $('[data-toggle="tooltip"]').tooltip();

    GetFavorite().then(res => {
        globalLiveLink = res;
        createFovoriteDataTable(res);
        createLiveLinkDataTable(res);
        createChartElement(res);
    });

    recents = JSON.parse(recents);
    recents = recents.reverse()
    var recentData = []
    var recentColumns = [{ title: 'url' }, { title: 'sql' }]
    if (recents.length > 0) {
        recents.forEach(element => {
            recentData.push([element.url, element.sql])
        });


    }
    rTable = $('#recentTable').DataTable({
        data: recentData,
        columns: recentColumns,
        "dom": "<'col-md-12 datatable-over't><'col-md-12 right-pagging'p>",
        "columnDefs": [

            {
                "targets": 1,
                className: "favorite-td",
                "render": function (data, type, row, meta) {
                    var host = window.location.host;
                    var url = row[0].replace(host, "");
                    return "<span style='width: 100%' onClick='window.location.href=`" + url + "`'>" + data + "</span>"
                }
            },
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
        ],
        "drawCallback": function (settings) {
            $("#recentTable thead").remove();
            $('#recentTable_paginate').hide()
        },
        "iDisplayLength": 5,
        "language": {
            "emptyTable": "No recents"
        }
    });

    $('#livelinkTable tbody').on('click', 'tr', function () {
        var data = rTable.row(this).data();
        var host = window.location.host;
        var url = data[0].replace(host, "");
        window.location.href = url;
    });

    $('#deleteLivelinkModal').on('show.bs.modal', function (e) {
        var curLivelink = $(e.relatedTarget).data('id');
        gDeleteLivelinkId = curLivelink;
    });

    $('#DeleteLivelinkBtn').click(function () {
        $.ajax({
            type: "GET",
            url: '/livelink/delete/' + gDeleteLivelinkId,
            success: function (obj) {
                GetFavorite().then(res => {
                    globalLiveLink = res;
                    destroyDataTable('#favorTable');
                    destroyDataTable('#livelinkTable');
                    createFovoriteDataTable(res);
                    createLiveLinkDataTable(res);
                });
            }
        })
    });
});

var GetFavorite = function () {
    return new Promise((resolve) => {
        $.ajax({
            type: "GET",
            url: '/livelink/livelinklist',
            success: function (obj) {
                resolve(obj)
            },
            error: function (err) {
                console.log(err);
            }
        })
    })
}

var createFovoriteDataTable = function (obj) {
    var datas = [];
    var columnss = [{ title: 'id' }, { title: 'livelinkName' }]
    columnss.push({
        "data": "manage",
        "render": function (data, type, row, meta) {
            return "<i class='fa fa-pencil midtitle add-pointer-pencil mr-2' style='color: white' onClick='goToSqlSearchForEdit(`" + row[0] + "`)'></i>  <i class='fa fa-times midtitle add-pointer-times' style='color: white' onClick='changeStarFavor(`" + row[0] + "`, true)'> </i>"
        }
    })
    if (obj.length > 0) {
        obj = obj.filter(s => s.isFavorited === true)
        obj.forEach(element => {
            datas.push([element.id, element.livelinkName])
        });
    }

    fTable = $('#favorTable').DataTable({
        data: datas,
        columns: columnss,
        "dom": "<'col-md-12 datatable-over't><'col-md-12 right-pagging'p>",
        "columnDefs": [
            {
                "targets": 1, className: "favorite-td",
                "render": function (data, type, row, meta) {

                    return "<span style='width: 100%' onClick='goToLiveLink(`" + row[0] + "`)'>" + data + "</span>"
                }
            },
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },

        ],
        "drawCallback": function (settings) {
            $("#favorTable thead").remove();
            var api = this.api();
            if (api.rows().data().length <= 5) {
                $('#favorTable_paginate').hide()
            }
        },
        "iDisplayLength": 5,
        "language": {
            "emptyTable": "No favorite live link"
        }
    });




}

var goToSqlSearch = function (liveLinkId) {
    var currentRecent = globalLiveLink.filter(f => f.id == liveLinkId)[0];
    window.location.href = '/explore/sql_search/' + btoa(currentRecent.sql);

}

var goToSqlSearchForEdit = function (liveLinkId) {
    window.location.href = '/explore/sql_search_edit/' + liveLinkId;
}

var goToLiveLink = function (liveLinkId) {
    var currentRecent = globalLiveLink.filter(f => f.id == liveLinkId)[0];
    window.open('/livelink/public/' + currentRecent.en_url, '_blank');
}

var createLiveLinkDataTable = function (obj) {
    if (obj.length > 0) {
        var recentData = [];
        obj.forEach(o => {
            recentData.push([o.id, o.isFavorited, o.livelinkName, o.date, o.notes])
        })

    }
    var recentColumns = [
        {
            title: 'id',

        },
        {
            title: ' '
        },
        {
            title: 'Name'
        },
        {
            title: 'Date Created',
        },
        {
            title: 'Notes',
            "defaultContent": "-"
        }
    ];
    recentColumns.push({
        "data": "manage",
        "render": function (data, type, row, meta) {
            return "<i class='fa fa-pencil midtitle add-pointer-pencil mr-2' style='color: white' onClick='goToSqlSearchForEdit(`" + row[0] + "`)'></i>  <i class='fa fa-trash  midtitle' data-toggle='modal' data-target='#deleteLivelinkModal' data-id='" + row[0] + "'> </i>"
        },
    })

    livelinkTable = $('#livelinkTable').DataTable({
        data: recentData,
        columns: recentColumns,
        "dom": "<'col-md-12 datatable-over't><'col-md-12 right-pagging'p>",
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [1],
                "render": function (data, type, row, meta) {
                    if (data)
                        return '<input class="star-favor" onClick="changeStarFavor(`' + row[0] + '`, ' + data + ')" type="checkbox" title="bookmark page" checked>'
                    else
                        return '<input class="star-favor" type="checkbox" title="bookmark page" onClick="changeStarFavor(`' + row[0] + '`, ' + data + ')">'
                }
            },
            {
                "targets": [2],
                className: "add-pointer",
                "render": function (data, type, row, meta) {
                    return "<span style='width: 100%' onClick='goToLiveLink(`" + row[0] + "`)'>" + data + "</span>"
                }

            },
            {
                "targets": [3],
                className: "add-pointer",
                "render": function (data, type, row, meta) {
                    return "<span style='width: 100%' onClick='goToLiveLink(`" + row[0] + "`)'>" + data + "</span>"
                }
            },
            {
                "targets": [4],
                className: "add-pointer",
                "render": function (data, type, row, meta) {
                    if (data == null)
                        return data
                    else if (type === 'display' && (data.length > 60))
                        return '<span title="' + data + '" onClick="goToLiveLink(`' + row[0] + '`)">' + data.substr(0, 58) + '...</span>'
                    else
                        return "<span style='width: 100%' onClick='goToLiveLink(`" + row[0] + "`)'>" + data + "</span>"
                }
            },


        ],
        "order": [[3, "desc"]],
        "iDisplayLength": 5,
        "language": {
            "emptyTable": "No live link saved"
        },
    });


}

var destroyDataTable = function (tableId) {
    var sTable = $(tableId).DataTable()
    sTable.destroy();
    $(tableId).empty();
}

var changeStarFavor = function (liveLinkId, isFavorited) {
    isFavorited = !isFavorited;
    $.ajax({
        type: "PUT",
        url: '/livelink/unfavorite/' + liveLinkId + '/' + isFavorited,
        success: function (obj) {
            GetFavorite().then(res => {
                globalLiveLink = res;
                destroyDataTable('#favorTable');
                destroyDataTable('#livelinkTable');
                createFovoriteDataTable(res);
                createLiveLinkDataTable(res);
            });
        },
        error: function (err) {
            console.log(err)
        }
    })
}

var createChartElement = function (chartObj) {
    if (chartObj.length > 0) {
        for (var i = 0; i < chartObj.length; i++) {
            if (i == 6) break;
            $('.row.d-flex').prepend('<div class="col-lg-4 mb-3"><div style="height: 300px; background-color: white;"><div class="chart_div"></div></div></div>')

        }
        generateCharts(chartObj);
    }


}

var generateCharts = async function (chartObj) {
    if (chartObj.length > 0) {
        var g = $('.chart_div').get();
        for (var i = 0; i < chartObj.length; i++) {
            if (i == 6) break;
            var obj = await executeSql(chartObj[i].sql);
            chartObj[i].options.backgroundColor = 'white';
            selectChart(chartObj[i].graphType, obj.result, chartObj[i].options, g[i]);
        }
    }
}
var executeSql = async function (sql) {
    return new Promise((resove) => {
        $.ajax({
            type: "POST",
            url: '/explore/filter_search',
            data: { sql: sql },
            success: function (obj) {
                resove(obj)
            }
        })
    })

}
