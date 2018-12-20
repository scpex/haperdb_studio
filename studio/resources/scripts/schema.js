var schemaForSearch = [];
$(document).ready(function () {
    createAddTableType();
    createuploadFileType();
    var schemaName = document.getElementById('selectSchemaName').value;
    getTable(schemaName);
    $("#addType").change(function () {
        var type = document.getElementById('addType').value;
        if (type == 'table')
            createAddTableType();
        else
            createAddSchemaType();
    })

    // $('#addCSVBtn').click(() => {
    //     $('#addCSVBtn').attr('disabled', true)
    // })

    $('#addCSVForm').submit(function (ev) {
        this.submit();
        $('#addCSVBtn').attr('disabled', true)
    });

    $("#csvType").change(function () {
        var type = document.getElementById('csvType').value;

        if (type == 'file')
            createuploadFileType();
        else if (type == 'url')
            createUrlCSVType()
        else
            createDataCSVType();
    });

    $("#selectSchemaName").change(function () {
        var schemaName = document.getElementById('selectSchemaName').value;
        getTable(schemaName);
    });

    $('[id]').each(function () {
        var ids = $('[id="' + this.id + '"]');
        if (ids.length > 1 && ids[0] == this)
            console.warn('Multiple IDs #' + this.id);
    });

    var schemas = document.getElementById('schemas').value;
    schemas = JSON.parse(schemas);
    schemaForSearch = Object.keys(schemas);

    $('#searchSchema').keyup(function () {
        var valueSearch = $('#searchSchema').val();
        if (valueSearch == '') {
            $("[class*='forsearch_']").show()
        } else {            
            $("[class*='forsearch_']").hide()
            var schemaForSearch = Object.keys(schemas);
            schemaForSearch.forEach(schemaName => {                
                if (schemaName.match(valueSearch) != null)
                    $(".forsearch_" + schemaName + "").show()
                var tableForSearch = Object.keys(schemas[schemaName]);
                tableForSearch.forEach(tableName => {
                    if (tableName.match(valueSearch) != null) {
                        $(".forsearch_" + schemaName).show();
                        $(".forsearch_" + schemaName + "_" + tableName).show();
                    }
                    var attributeForSearch = schemas[schemaName][tableName].attributes.map(a => a.attribute)
                    attributeForSearch.forEach(eachAttribute => {
                        if (eachAttribute.match(valueSearch) != null) {
                            $(".forsearch_" + schemaName).show();
                            $(".forsearch_" + schemaName + "_" + tableName).show();
                            $(".forsearch_" + schemaName + "_" + tableName + "_" + eachAttribute).show();
                        }
                    })

                })
            });
        }
    });

    $('#goToViewDataModel').click(function () {
        window.location.href = "/explore/sql_search";
    })
});

getTable = (schemaName) => {
    var schemas = document.getElementById('schemas').value;
    schemas = JSON.parse(schemas);
    $("#selectTableName").children().remove();
    if (schemas[schemaName] != undefined) {
        var tableNames = Object.keys(schemas[schemaName]);
        tableNames.forEach(element => {
            $("#selectTableName").append(('<option value="' + element + '"> ' + element + '</option>'));
        });
    }
}

createAddTableType = () => {
    var schemas = document.getElementById('schemas').value;
    var appendChangeType = document.getElementById('changeAddType');

    appendChangeType.innerHTML = '';
    schemas = JSON.parse(schemas);
    var schemaNames = [];
    for (var prop in schemas) {
        schemaNames.push(prop);
    }

    var btnDiv = document.createElement('div')
    btnDiv.setAttribute('class', 'btn-group clear mt-2 mb-2')
    btnDiv.setAttribute('style', 'float:left')

    var span = document.createElement('span')
    span.setAttribute('class', 'minwidth150 mr-2')
    span.appendChild(document.createTextNode('Select Schema'))

    var select = document.createElement('select');
    select.setAttribute('class', 'minwidth250 form-controls')
    select.setAttribute('name', 'schemaName')
    select.setAttribute('id', 'schemaName')
    select.setAttribute('required', true)

    schemaNames.forEach(element => {
        var options = document.createElement('option');
        options.setAttribute('value', element)
        options.appendChild(document.createTextNode(element))
        select.appendChild(options);
    });

    btnDiv.appendChild(span);
    btnDiv.appendChild(select);
    appendChangeType.appendChild(btnDiv);

    btnDiv = document.createElement('div')
    btnDiv.setAttribute('class', 'btn-group clear mt-2 mb-2')
    btnDiv.setAttribute('style', 'float:left')

    var input = document.createElement('input');
    input.setAttribute('class', 'minwidth250 form-controls')
    input.setAttribute('name', 'tableName')
    input.setAttribute('id', 'tableName')
    input.setAttribute('required', true)

    span = document.createElement('span')
    span.setAttribute('class', 'minwidth150 mr-2')
    span.appendChild(document.createTextNode('Table Name'))

    btnDiv.appendChild(span)
    btnDiv.appendChild(input)

    appendChangeType.appendChild(btnDiv);

    btnDiv = document.createElement('div')
    btnDiv.setAttribute('class', 'btn-group clear mt-2 mb-2')
    btnDiv.setAttribute('style', 'float:left')

    var input = document.createElement('input');
    input.setAttribute('class', 'minwidth250 form-controls')
    input.setAttribute('name', 'hashAttribute')
    input.setAttribute('id', 'hashAttribute')
    input.setAttribute('required', true)

    span = document.createElement('span')
    span.setAttribute('class', 'minwidth150 mr-2')
    span.appendChild(document.createTextNode('Hash Attribute'))

    btnDiv.appendChild(span)
    btnDiv.appendChild(input)
    appendChangeType.appendChild(btnDiv);
    $("div #exampleModalLongTitle").text("Add Table");
}

createAddSchemaType = () => {
    var appendChangeType = document.getElementById('changeAddType');
    exampleModalLongTitle
    appendChangeType.innerHTML = '';
    var btnDiv = document.createElement('div')

    btnDiv.setAttribute('class', 'btn-group')
    btnDiv.setAttribute('style', 'float:left')

    var span = document.createElement('span')
    span.setAttribute('class', 'minwidth150 mr-2')
    span.appendChild(document.createTextNode('Schema Name'))

    var input = document.createElement('input');
    input.setAttribute('class', 'minwidth250 form-controls')
    input.setAttribute('name', 'schemaName')
    input.setAttribute('id', 'schemaName')
    input.setAttribute('required', true)

    btnDiv.appendChild(span);
    btnDiv.appendChild(input);
    appendChangeType.appendChild(btnDiv);
    $("div #exampleModalLongTitle").text("Add Schema");
}

createuploadFileType = () => {

    var appendChangeType = document.getElementById('changeCSVType');

    appendChangeType.innerHTML = '';

    var btnDiv = document.createElement('div')
    btnDiv.setAttribute('class', 'btn-group clear mt-2 mb-2')
    btnDiv.setAttribute('style', 'float:left')

    var span = document.createElement('span')
    span.setAttribute('class', 'minwidth150 mr-2')
    span.appendChild(document.createTextNode('Path CSV File'))


    var upload = document.createElement('input');
    upload.setAttribute('type', 'text');
    upload.setAttribute('name', 'csvPath')
    upload.setAttribute('id', 'uploadFileCsv')
    upload.setAttribute('class', 'minwidth250 form-controls')
    btnDiv.appendChild(span)
    btnDiv.appendChild(upload)
    appendChangeType.appendChild(btnDiv);
}

createUrlCSVType = () => {
    var appendChangeType = document.getElementById('changeCSVType');

    appendChangeType.innerHTML = '';

    var btnDiv = document.createElement('div')
    btnDiv.setAttribute('class', 'btn-group clear mt-2 mb-2')
    btnDiv.setAttribute('style', 'float:left')

    var span = document.createElement('span')
    span.setAttribute('class', 'minwidth150 mr-2')
    span.appendChild(document.createTextNode('CSV Url'))


    var upload = document.createElement('input');
    upload.setAttribute('type', 'text');
    upload.setAttribute('name', 'csvUrl')
    upload.setAttribute('class', 'minwidth250 form-controls')
    btnDiv.appendChild(span)
    btnDiv.appendChild(upload)
    appendChangeType.appendChild(btnDiv);
}

createDataCSVType = () => {
    var appendChangeType = document.getElementById('changeCSVType');

    appendChangeType.innerHTML = '';

    var btnDiv = document.createElement('div')
    btnDiv.setAttribute('class', 'btn-group clear mt-2 mb-2')
    btnDiv.setAttribute('style', 'float:left')

    var span = document.createElement('span')
    span.setAttribute('class', 'minwidth150 mr-2')
    span.appendChild(document.createTextNode('CSV Data'))


    var upload = document.createElement('textarea');
    upload.setAttribute('name', 'csvData')
    upload.setAttribute('class', 'minwidth250 form-controls')
    btnDiv.appendChild(span)
    btnDiv.appendChild(upload)
    appendChangeType.appendChild(btnDiv);
}