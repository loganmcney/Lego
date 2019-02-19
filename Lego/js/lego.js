$(document).ready(init);

const API_KEY = "d8ceb587d4f60b07b6bfa8887f07b099";


function init() {

    //$("#submit").click(submit);
    $("#add-set").click(addToDB);
    //$("#clearSetParts").click(clearSetParts);
    //$("#clearParts").click(clearParts);
    $("#set-num").val("75102-1");


    $('.nav-tabs a').click(function () {
        $(this).tab('show');
    });

    $("#clear-parts").click(clearParts);
    $("#clear-set-parts").click(clearSetParts);
    $("#clear-sets").click(clearSets);

}



function submit() {
    var setNum = $("#setNum").val();

    var url = "https://rebrickable.com/api/v3/lego/sets/" + setNum + "/parts/?page_size=1000&key=" + API_KEY;

    var elements;

    $.getJSON(url,
            function (data) {

                elements = data.results;
                elements.forEach(element => {
                    qty += element.quantity;
                });

                $("#partsTable td").remove();
                addRow(elements);

            }
    );

}
var elements = [];
var nextExists;

function addToDB() {
    var setNum = $("#set-num").val();
    var set;
    var setUrl = "https://rebrickable.com/api/v3/lego/sets/" + setNum + "/?key=" + API_KEY;
    setPartsUrl = "https://rebrickable.com/api/v3/lego/sets/" + setNum + "/parts/?key=" + API_KEY;

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
                if (response.success) {
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

                // is there more than one page? get all the pages before adding parts
                if (data.next) {
                    setPartsUrl = "https" + data.next.substring(4);
                    addSetParts(elements);
                } else {

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

                    // add the parts to set_parts and parts tables
                    $(elements).each(function () {
                        // add the set parts
                        //console.log("setNum: " + setNum + " partNum: " + this.part.part_num);
                        $.post("php/addSetParts.php", {
                            setNum: setNum,
                            partNum: this.part.part_num,
                            colorID: this.color.id,
                            qty: this.quantity
                        }, function (response) {
                            console.log(response);
                        });
                        // add the parts
                        //    $.post("php/addParts.php", {
                        //        partNum: this.part.part_num,
                        //        name: this.part.name,
                        //        colorID: this.color.id,
                        //        partUrl: this.part.part_url,
                        //        partImgUrl: this.part.part_img_url
                        //    }, function (response) {
                        //        //console.log(response);
                        //    });

                    });
                }

            }
        );

        return elements;

    }

}

function clearSetParts() {
    $("label[for='clear-set-parts']").text("working...");
    $.post("php/clearSetParts.php",
            function (data) {
                $("#clear-set-parts").siblings("label").text("deleted " + data + " rows");
            });
}

function clearParts() {
    $("label[for='clear-parts']").text("working...");
    $.post("php/clearParts.php",
            function (data) {
                $("#clear-parts").siblings("label").text("deleted " + data + " rows");
            });
}

function clearSets() {
    $("label[for='clear-sets']").text("working...");
    $.post("php/clearSets.php",
            function (data) {
                $("#clear-sets").siblings("label").text("deleted " + data + " rows");
            });
}

// need to implement a table for this function to be useful
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