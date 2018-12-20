$(document).ready(function () {
    var user = JSON.parse(document.getElementById("detail_user").value);
    if (user.role.permission != undefined) {        
        var permission = typeof(user.role.permission) == 'object' ? user.role.permission: JSON.parse(user.role.permission);
        if (permission.super_user) {
            var sa = document.getElementById("superAdmin");
            var text_div = document.createElement("div");
            text_div.setAttribute("class", "col-lg-6");
            text_div.innerHTML = "Super Admin";
            sa.appendChild(text_div);

            var icon_div = document.createElement("div");
            icon_div.setAttribute("class", "col-md-2");

            var span = document.createElement("span");
            span.setAttribute("class", "pe-7s-check");
            span.setAttribute("style", "margin-top:3%");

            span.setAttribute("style", "font-size:25px;color:rgb(27, 191, 137);");
            icon_div.appendChild(span);
            sa.appendChild(icon_div);

        } else {
            var perms = document.getElementById("perms");
            perms.setAttribute("style", "display:block;");
            var tabNav = document.getElementById("tab_nav");
            var tabContent = document.getElementById("tab_content");
            var activeTabSet = false;
            for (schema in permission) {
                if (schema != 'super_admin') {
                    var tab = document.createElement("li");
                    var a = document.createElement("a");
                    a.setAttribute("data-toggle", "tab");
                    a.setAttribute("href", "#" + schema);
                    a.innerHTML = schema;

                    var tab_body = document.createElement("div");
                    tab_body.setAttribute("id", schema);


                    if (!activeTabSet) {
                        a.setAttribute("aria-expanded", "true");
                        tab.setAttribute("class", "active");
                        activeTabSet = true;
                        tab_body.setAttribute("class", "tab-pane active ");

                    } else {
                        a.setAttribute("aria-expanded", "false");
                        tab_body.setAttribute("class", "tab-pane ");


                    }

                    tabContent.appendChild(tab_body);



                    tab.appendChild(a);
                    tabNav.appendChild(tab);





                }
            }


        }

    }


});