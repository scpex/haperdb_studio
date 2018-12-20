let startDate = null;
let endDate = null;

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

    $('#reportrange').daterangepicker({
            timePicker: false,
            // timePicker: true,
            autoApply: true,            
            locale: {
                format: 'YYYY-MM-DD',
                // format: 'YYYY-MM-DD hh:mm:ss'
            }
        },
        function (start, end, label) {
            startDate = start.format('YYYY-MM-DD');
            endDate = end.format('YYYY-MM-DD');
            // alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
            $('#showRangeDate').html(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));            
            // startDate = start.format('YYYY-MM-DD hh:mm:ss');
            // endDate = end.format('YYYY-MM-DD hh:mm:ss');
            // console.log(start);
            // // alert("A new date range was chosen: " + start.format('YYYY-MM-DD hh:mm:ss') + ' to ' + end.format('YYYY-MM-DD hh:mm:ss'));
            // $('#showRangeDate').html(start.format('YYYY-MM-DD hh:mm:ss') + ' - ' + end.format('YYYY-MM-DD hh:mm:ss'));            
        }        
    );


    $('#searchLogs, .fa.fa-refresh').click(function () {

        $(document.body).css({
            'cursor': 'wait'
        });

        var _opearation = {
            operation: "read_log",
            start: 0,
            order: document.getElementById('LogsOrder').value,
            limit: document.getElementById('limitLogs').value
        }

        if (startDate != null)
            _opearation.from = startDate
        if (endDate != null)
            _opearation.until = endDate

        if (_opearation["limit"] == "")
            delete _opearation["limit"];
        
        $.ajax({
            type: "POST",
            url: '/logs/search',
            data: {
                operation: JSON.stringify(_opearation)
            },
            success: function (obj) {                
                $("#collapseResult").show()
                toastr.success('get logs successfully');
                saveSQL = obj.sql;
                var useColumns = [];
                if (obj.result.length > 0) {
                    Object.keys(obj.result[0]).forEach(element => {
                        useColumns.push({
                            title: element,
                            "defaultContent": "null"
                        })
                    });

                    var data = [];
                    obj.result.forEach(element => {
                        data.push(Object.values(element));
                    });

                    if ($.fn.DataTable.isDataTable('#logsAdvance')) {
                        sTable.destroy();
                        $('#logsAdvance').empty();
                    }

                    sTable = $('#logsAdvance').DataTable({
                        data: data,
                        columns: useColumns,
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
                        }],
                        "initComplete": function (settings, json) {
                            var lTable = $('#logsAdvance').DataTable();
                            lTable.search($('#wildCardSearch').val()).draw();
                        }
                    });



                } else {
                    if ($.fn.DataTable.isDataTable('#logsAdvance')) {
                        sTable.destroy();
                        $('#logsAdvance').empty();
                    }                    
                    toastr.info('data is empty');
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

    $('#wildCardSearch').keyup(function () {
        if ($.fn.DataTable.isDataTable('#logsAdvance')) {
            sTable = $('#logsAdvance').DataTable();
            sTable.search($(this).val()).draw();
        }
    });

    $('#resetLogsSearch').click(() => {
        $('input[type=text]').each(function () {
            $(this).val('');
        })
    });
});