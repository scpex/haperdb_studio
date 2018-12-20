$(document).ready(function () {

    var sTable = $('#logsTable').DataTable({
        "dom": "<'col-md-12't><'col-md-4'<'pull-left'l>><'col-md-8 right-pagging'p>",
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

    $('#searchlogs').keyup(function () {
        sTable.search($(this).val()).draw();
    });

    //export
    $('.fa.fa-download').click(() => {
        sTable.button(0).trigger();
    })

});