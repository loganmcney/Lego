$(document).ready(init);

const API_KEY = "d8ceb587d4f60b07b6bfa8887f07b099";


function init() {

    //$("#submit").click(submit);
    $("#add-set").click(addToDB);
    //$("#clearSetParts").click(clearSetParts);
    //$("#clearParts").click(clearParts);
    $("#set-num").val("75194-1");


    $('.nav-tabs a').click(function () {
        $(this).tab('show');
    });


}



function submit() {
    var setNum = $("#setNum").val();

    var url = "https://rebrickable.com/api/v3/lego/sets/" + setNum + "/parts/?page_size=1000&key=" + API_KEY;

    var elements;

    $.getJSON(url,
            function (data) {

                var obj = data;
                var qty = 0;
                elements = data.results;
                elements.forEach(element => {
                    qty += element.quantity;
                });

                $("#partsTable td").remove();
                addRow(elements);

            }
    );

}



function addToDB() {
    var setNum = $("#set-num").val();
    //set = {};
    var set;
    var setUrl = "https://rebrickable.com/api/v3/lego/sets/" + setNum + "/?key=" + API_KEY;
    var setPartsUrl = "https://rebrickable.com/api/v3/lego/sets/" + setNum + "/parts/?key=" + API_KEY;

    // get the set info and call addSet script to add to DB    
    $.ajax({
        url: setUrl,
        dataType: "json",
        success: function (data) {
            set = data;
            // add set
            $.post("php/addSet.php", {
                setNum: set.set_num,
                name: set.name,
                numParts: set.num_parts,
                imgUrl: set.set_img_url,
                year: set.year,
                themeID: set.theme_id
            }, function (response) {
                $("#set-num").parents().siblings("p").replaceWith(response.message);
                console.log("succeeded: " + response.success);
                if (response.success) {
                    var elements = [];
                    addSetParts(elements);
                }
            });

        },
        error: function () { // AJAX JSON error callback
            $("#set-num").parents().siblings("p").text("Error: Could not find set " + setNum + "!").addClass("text-danger");
        }
    });




    function addSetParts(elements) {

        // get the parts
        $.getJSON(setPartsUrl,
                function (data) {

                    for (var i = 0; i < data.results.length; i++) {
                        elements.push(data.results[i]);
                    }

                    // is there more than one page?
                    if (data.next) {
                        setPartsUrl = data.next;
                        addSetParts(elements);
                    }

                    // do we count the extra parts?

//                    if ($("#useExtra").prop("checked")) {
//                        while (elements[elements.length - 1].is_spare) {
//                            var spareConsidered = false;
//                            for (var i = 0; i < elements.length - 1 || !spareConsidered; i++) {
//                                if (elements[i].part.part_num === elements[elements.length - 1].part.part_num) {
//                                    elements[i].quantity += elements[elements.length - 1].quantity;
//                                    elements.pop();
//                                    spareConsidered = true;
//                                }
//                            }
//                        }
//                    } else {
//                        while (elements[elements.length - 1].is_spare) {
//                            elements.pop();
//                        }
//                    }

                    // we'll count extra parts for now...
                    while (elements[elements.length - 1].is_spare) {
                        var spareConsidered = false;
                        for (var i = 0; i < elements.length - 1 || !spareConsidered; i++) {
                            if (elements[i].part.part_num === elements[elements.length - 1].part.part_num) {
                                elements[i].quantity += elements[elements.length - 1].quantity;
                                elements.pop();
                                spareConsidered = true;
                            }
                        }
                    }

                    console.log($(elements));

                    // add the set parts and the general parts
                    $(elements).each(function () {
                        // add the set parts
                        $.post("php/addSetParts.php", {
                            setNum: setNum,
                            elementID: this.element_id,
                            qty: this.quantity
                        }, function (response) {
                            //console.log(response);
                        });
                        // add the parts
//                        $.post("php/addParts.php", {
//                            partNum: this.part.part_num,
//                            name: this.part.name,
//                            colorID: this.color.id,
//                            partUrl: this.part.part_url,
//                            partImgUrl: this.part.part_img_url
//                        }, function (response) {
//                            //console.log(response);
//                        });

                    });

                }
        );

        return elements;

    }

    //console.log(elements);

    //console.log(set);

//    $.post("php/lego.php", {
//        something: "nice!",
//        year: postYear
//    },
//            function (data) {
//                console.log(data);
//            }
//    );

}


function clearSetParts() {
    $("label[for='clearSetParts']").text("working...");
    $.post("php/clearSetParts.php",
            function (data) {
                $("#clearSetParts").siblings("label").text("deleted " + data + " rows");
            });
}

function clearParts() {
    $("label[for='clearParts']").text("working...");
    $.post("php/clearParts.php",
            function (data) {
                $("#clearParts").siblings("label").text("deleted " + data + " rows");
            });
}


function addRow(elements) {
    elements.forEach(element => {
        var row = "<tr><td>" + element.element_id + "</td><td>" + element.part.part_num
                + "</td><td>" + element.color.name + "</td><td>" + element.quantity +
                "</td><td>" + element.part.name + "</td>" + "<td><img src='" +
                element.part.part_img_url + "' width='80px'></td></td>";
        $("#partsTable").append(row);
        if (element.is_spare) {
            $("#partsTable tr").last().addClass("bg-info");
        }
    });
}