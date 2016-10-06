/**
 * Created by Mauriel on 8/16/2016.
 */

var sourcePaths = [];
var pathLog = [];
var pathLogIndex = 0;

function getFolderTemplateInstance(folderName) {
    return "<li class='fb-folder droppable draggable' title='" + folderName + "&#13;Type: Filde Folder'>" +
        "<span class='fb-file-icon fa fa-folder glyphicon-folder'></span>" +
        "<span class='fb-file-name'>" + folderName + "</span>" +
        "<span class='fb-file-type'>File Folder</span>" +
        "<span class='fb-file-size'></span>" +
        "</li>"
}

function getFileTemplateInstance(fileName, fileType, fileSize, pk, url) {
    var fileTypeExt = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length);
    var extIcon = "fa-file-o";

    if (fileName.lastIndexOf(".")) {
        if (fileTypeExt.toUpperCase() == "PDF") {
            extIcon = "fa-file-pdf-o";
        }
        else if (fileTypeExt.toUpperCase() == "XLS" || fileTypeExt.toUpperCase() == "XLT" || fileTypeExt.toUpperCase() == "XML" || fileTypeExt.toUpperCase() == "CSV") {
            extIcon = "fa-file-excel-o";
        }
        else if (fileTypeExt.toUpperCase() == "ZIP" || fileTypeExt.toUpperCase() == "RAR" || fileTypeExt.toUpperCase() == "RAR5") {
            extIcon = "fa-file-zip-o";
        }
        else if (fileTypeExt.toUpperCase() == "DOC" || fileTypeExt.toUpperCase() == "DOCX") {
            extIcon = "fa-file-word-o";
        }
        else if (fileTypeExt.toUpperCase() == "MP3" || fileTypeExt.toUpperCase() == "WAV" || fileTypeExt.toUpperCase() == "WMA") {
            extIcon = "fa-file-audio-o";
        }
        else if (fileTypeExt.toUpperCase() == "MP4" || fileTypeExt.toUpperCase() == "MOV" || fileTypeExt.toUpperCase() == "WMV") {
            extIcon = "fa-file-movie-o";
        }
        else if (fileTypeExt.toUpperCase() == "PNG" || fileTypeExt.toUpperCase() == "JPG" || fileTypeExt.toUpperCase() == "JPEG" || fileTypeExt.toUpperCase() == "GIF" || fileTypeExt.toUpperCase() == "TIF" || fileTypeExt.toUpperCase() == "BMP") {
            extIcon = "fa-file-image-o";
        }
        else if (fileTypeExt.toUpperCase() == "TXT") {
            extIcon = "fa-file-text-o";
        }
        else if (fileTypeExt.toUpperCase() == "PPT" || fileTypeExt.toUpperCase() == "PPTX") {
            extIcon = "fa-file-powerpoint-o";
        }
        else if (fileTypeExt.toUpperCase() == "JS" || fileTypeExt.toUpperCase() == "PY" || fileTypeExt.toUpperCase() == "PHP" || fileTypeExt.toUpperCase() == "JAVA" || fileTypeExt.toUpperCase() == "CS") {
            extIcon = "fa-file-code-o";
        }
    }

    return "<li data-pk='" + pk + "' data-url='" + url + "' class='fb-file draggable' title='" + fileName + "&#13;Type: " + fileType + "&#13;Size: " + formatBytes(parseInt(fileSize)) +  "'>" +
        "<span class='fb-file-icon fa " + extIcon + "'></span>" +
        "<span class='fb-file-name'>" + fileName + "</span>" +
        "<span class='fb-file-type'>" + fileType + " File</span>" +
        "<span class='fb-file-size' data-file-size=" + fileSize + "'>" + formatBytes(parseInt(fileSize)) + "</span></li>"
}

function formatBytes(bytes) {
    if(bytes < 1024) return bytes + " Bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(1) + " KB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(1) + " MB";
    else return(bytes / 1073741824).toFixed(1) + " GB";
}

function updateSelectionMenuContext() {
    var selected = $("#fb-files-container li.ui-selected");

    var flagDisableOpen = false;
    var flagDisableDownload = false;
    var flagDisableRename = false;
    var flagDisablePaste = false;
    var flagDisableZip = false;
    var flagDisableUnzip = false;
    var flagDisableCut = false;
    var flagDisableDelete = false;

    if (selected.length > 1) {
        flagDisableRename = true;   // 'rename' menu item
        flagDisableOpen = true;
        flagDisablePaste = true;
        flagDisableZip = true;
    }
    else if (selected.length == 1) {    // Unused for now

    }
    else {
        flagDisableCut = true;
        flagDisableRename = true;
        flagDisableUnzip = true;
        flagDisableZip = true;
        flagDisableDelete = true;
        flagDisableDownload = true;
    }

    if (selected.hasClass("fb-file")) {
        flagDisableOpen = true;
        flagDisablePaste = true;
        flagDisableZip = true;
    }

    if (selected.hasClass("fb-folder")) {
        flagDisableDownload = true;
        flagDisableUnzip = true;
    }

    if (!sourcePaths.length) {
        flagDisablePaste = true;
    }

    for (var i = 0; i < selected.length; i++) {
        var fileName = $(selected[i]).children(".fb-file-name").text();
        var fileExt = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length);
        if (fileExt.toUpperCase() != "ZIP") {
            flagDisableUnzip = true;
        }
    }

    var menu = $("#right-click-menu");

    // Open
    menu.children("li[data-menu-name='open']").toggleClass("disabled", flagDisableOpen);

    // Download
    menu.children("li[data-menu-name='download']").toggleClass("disabled", flagDisableDownload);
    $("#fb-download").toggleClass("disabled", flagDisableDownload);

    // Rename
    menu.children("li[data-menu-name='rename']").toggleClass("disabled", flagDisableRename);
    $("#fb-rename").toggleClass("disabled", flagDisableRename);

    // Zip
    menu.children("li[data-menu-name='zip']").toggleClass("disabled", flagDisableZip);

    // Unzip
    menu.children("li[data-menu-name='unzip']").toggleClass("disabled", flagDisableUnzip);

    // Cut
    menu.children("li[data-menu-name='cut']").toggleClass("disabled", flagDisableCut);
    $("#fb-cut").toggleClass("disabled", flagDisableCut);

    // Paste
    menu.children("li[data-menu-name='paste']").toggleClass("disabled", flagDisablePaste);
    $("#fb-paste").toggleClass("disabled", flagDisablePaste);

    // Delete
    $("#fb-delete").toggleClass("disabled", flagDisableDelete);
    menu.children("li[data-menu-name='delete']").toggleClass("disabled", flagDisableDelete);
}

var isDragging = false;

function bindFileBrowserItemEvents() {
    var mode = $("#hs-file-browser").attr("data-mode");

    // Drop
    if (mode == "edit") {
        $(".droppable").droppable({
            drop: function (event, ui) {
                var resID = $("#hs-file-browser").attr("data-res-id");
                var destination = $(event.target);
                var sources = $("#fb-files-container li.ui-selected").children(".fb-file-name");
                var destName = destination.children(".fb-file-name").text();
                var destFileType = destination.children(".fb-file-type").text();

                if (destFileType != "File Folder") {
                    return;
                }

                var currentPath = $("#hs-file-browser").attr("data-current-path");
                var destPath = currentPath + "/" + destName;

                var calls = [];
                for (var i = 0; i < sources.length; i++) {
                    var sourcePath = currentPath + "/" + $(sources[i]).text();
                    calls.push(move_or_rename_irods_file_or_folder_ajax_submit(resID, sourcePath, destPath));
                }

                $.when.apply($, calls).done(function () {
                    refreshFileBrowser();
                    destination.removeClass("fb-drag-cutting");
                });
            },
            over: function (event, ui) {
                $("#fb-files-container li.ui-selected").addClass("fb-drag-cutting");
                $(event.target).addClass("fb-drag-cutting");
            },
            out: function (event, ui) {
                $("#fb-files-container li.ui-selected").removeClass("fb-drag-cutting");
                $(event.target).removeClass("fb-drag-cutting");
            },
            accept: 'li'
        });
    }

    // Handle "select" of clicked elements - Mouse Down
    $("#fb-files-container li").mousedown(function (e) {
        if (e.ctrlKey) {
            $(this).toggleClass("ui-selected");
        }
        else {
            if (!$(this).hasClass("ui-selected")) {
                $("#fb-files-container li").removeClass("ui-selected");
                $(this).addClass("ui-selected");
            }
        }
    });

    // Handle "select" of clicked elements - Mouse Up
    $("#fb-files-container li").mouseup(function (e) {
        if (!e.ctrlKey) {
            if (!isDragging && event.which == 1) {
                $("#fb-files-container li").removeClass("ui-selected");
            }
            $(this).addClass("ui-selected");
        }

        updateSelectionMenuContext();
    });

    if (mode == "edit") {
        $(".draggable").draggable({
                containment: "#fb-files-container",
                start: function (event, ui) {
                    $(ui.helper).addClass(".ui-selected");
                    isDragging = true;
                },
                stop: function (event, ui) {
                    $("#fb-files-container li.ui-selected").removeClass("fb-drag-cutting");
                    $('#fb-files-container li').animate({top: 0, left: 0}, 200);    // Custom revert to handle multiple selection
                    isDragging = false;
                },
                drag: function (event, ui) {
                    $('.ui-selected').css({
                        top: ui.position.top,
                        left: ui.position.left
                    });
                },
            }
        );
    }

    // Provides selection by drawing a rectangular area
    $("#fb-files-container")
        .selectable({
            filter: "li", cancel: ".ui-selected",
            stop: function (event, ui) {
                $(".selection-menu").hide();
                updateSelectionMenuContext();
            }
        });

    // Dismiss right click menu when mouse down outside of it
    $("#fb-files-container, #fb-files-container li, #fbContainmentWrapper").mousedown(function () {
        $(".selection-menu").hide();
    });

    $("#hs-file-browser li.fb-folder").dblclick(onOpenFolder);

    // Right click menu for file browser
    $("#fbContainmentWrapper").bind("contextmenu", function (event) {
        // Avoid the real one
        event.preventDefault();

        var menu;   // The menu to show
        updateSelectionMenuContext();

        if ($(event.target).closest("li").length) {     // If a file item was clicked
            if (!$(event.target).closest("li").hasClass("ui-selected")) {
                $(".ui-selected").removeClass("ui-selected");
                $(event.target).closest("li").addClass("ui-selected");
            }
            menu = $("#right-click-menu");
        }
        else {
            menu = $("#right-click-container-menu");    // empty space was clicked
        }

        $(".selection-menu").hide();    // Hide other menus

        var top = event.pageY;
        var left = event.pageX;

        menu.css({top: top, left: left});

        if (menu.css("display") == "none") {
            menu.show();
        }
        else {
            menu.hide();
        }
    });
}

function setBreadCrumbs(path) {
    var crumbs = $("#fb-bread-crumbs");
    crumbs.empty();

    if (path.lastIndexOf("/") == "-1") {
        $("#fb-move-up").attr("disabled", true)
    }
    else {
        $("#fb-move-up").attr("disabled", false)
    }

    var setFirstActive = false;
    while (path){
        var folder = path.substr(path.lastIndexOf("/") + 1, path.length);
        var currentPath = path;
        path = path.substr(0, path.lastIndexOf("/"));
        if (setFirstActive) {
            crumbs.prepend('<li data-path="' + currentPath + '"><i class="fa fa-folder-o" aria-hidden="true"></i><span> ' + folder + '</span></li>');
        }
        else {
            crumbs.prepend('<li class="active"><i class="fa fa-folder-open-o" aria-hidden="true"></i><span> ' + folder + '</span></li>');
            setFirstActive = true;
        }
    }

    // Bind click events
    $("#fb-bread-crumbs li:not(.active)").click(function() {
        var resID = $("#hs-file-browser").attr("data-res-id");
        var path = $(this).attr("data-path");

        pathLog.push(path);
        pathLogIndex = pathLog.length - 1;
        get_irods_folder_struct_ajax_submit(resID, path);
    });
}

// File sorting sort algorithms
function sort(method, order) {
    var sorted;
    if (method == "name") {
        // Sort by name
        if (order == "asc") {
            sorted = $('#fb-files-container li').sort(function (element1, element2) {
                return $(element2).children('span.fb-file-name').text().localeCompare($(element1).children('span.fb-file-name').text());
            });
        }
        else {
            sorted = $('#fb-files-container li').sort(function (element1, element2) {
                return $(element1).children('span.fb-file-name').text().localeCompare($(element2).children('span.fb-file-name').text());
            });
        }
    }
    else if (method == "size") {
        var size1, size2;

        sorted = $('#fb-files-container li').sort(function (element1, element2) {
            if (order == "asc") {
                size1 = parseInt($(element2).children('span.fb-file-size').attr("data-file-size"));
                size2 = parseInt($(element1).children('span.fb-file-size').attr("data-file-size"));
            }
            else {
                size1 = parseInt($(element1).children('span.fb-file-size').attr("data-file-size"));
                size2 = parseInt($(element2).children('span.fb-file-size').attr("data-file-size"));

            }

            if (isNaN(size1)) size1 = 0;
            if (isNaN(size2)) size2 = 0;

            if (size1 < size2) {
                return -1;
            }
            if (size1 > size2) {
                return 1;
            }
            // Both sizes are equal
            return 0;
        });
    }
    else if (method == "type") {
        if (order == "asc") {
            sorted = $('#fb-files-container li').sort(function (element1, element2) {
                return $(element2).children('span.fb-file-type').text().localeCompare($(element1).children('span.fb-file-type').text());
            });
        }
        else {
            sorted = $('#fb-files-container li').sort(function (element1, element2) {
                return $(element1).children('span.fb-file-type').text().localeCompare($(element2).children('span.fb-file-type').text());
            });
        }
    }

    // Move elements to the new order
    for (var i = 0; i < sorted.length; i++) {
        $(sorted[i]).prependTo("#fb-files-container");
    }
}

function onSort() {
    var method = $("#fb-sort li[data-method].active").attr("data-method");
    var order = $("#fb-sort li[data-order].active").attr("data-order");

    sort(method, order);
}

function onOpenFolder() {
    var resID = $("#hs-file-browser").attr("data-res-id");
    var currentPath = $("#hs-file-browser").attr("data-current-path");
    var folderName = $("#fb-files-container li.ui-selected").children(".fb-file-name").text();
    var targetPath = currentPath + "/" + folderName;

    // Remove further paths from the log
    var range = pathLog.length - pathLogIndex;
    pathLog.splice(pathLogIndex + 1, range);
    pathLog.push(targetPath);
    pathLogIndex = pathLog.length - 1;

    get_irods_folder_struct_ajax_submit(resID, targetPath);
}

function updateNavigationState() {
    $("#fb-move-back").toggleClass("disabled", pathLogIndex == 0);
    $("#fb-move-forward").toggleClass("disabled", pathLogIndex >= pathLog.length - 1);

    var upPath = $("#hs-file-browser").attr("data-current-path");
    upPath = upPath.substr(0, upPath.lastIndexOf("/"));

    $("#fb-move-up").toggleClass("disabled", upPath == "");
}

// Reload the current folder structure
function refreshFileBrowser() {
    var resID = $("#hs-file-browser").attr("data-res-id");
    var currentPath = $("#hs-file-browser").attr("data-current-path");
    var calls = [];
    calls.push(get_irods_folder_struct_ajax_submit(resID, currentPath));

    $.when.apply($, calls).done(function () {
        $("#fb-files-container li").removeClass("fb-cutting");
        $(".selection-menu").hide();
        sourcePaths = [];
    });
}

$(document).ready(function () {
    // Set initial folder structure
    var resID = $("#hs-file-browser").attr("data-res-id");
    if (resID) {
        get_irods_folder_struct_ajax_submit(resID, 'data/contents');
        pathLog.push('data/contents');
    }

    var previewNode = $("#flag-uploading").removeClass("hidden").clone();
    $("#flag-uploading").remove();

    // Show file drop visual feedback
    var mode = $("#hs-file-browser").attr("data-mode");
    if (mode == "edit") {
        Dropzone.options.fbContainmentWrapper = {
            paramName: "files", // The name that will be used to transfer the file
            clickable: ".fb-upload-caption",
            previewsContainer: "#previews", // Define the container to display the previews
            maxFilesize: 2048, // MB
            init: function () {
                this.on("dragenter", function (file) {
                    $(".fb-drag-flag").show();
                });

                this.on("dragleave", function (file) {
                    $(".fb-drag-flag").hide();
                });

                this.on("addedfile", function (file) {
                    $(".fb-drag-flag").hide();
                });

                this.on("processing", function (file) {
                    if (!$("#flag-uploading").length) {
                        $("#fbContainmentWrapper").prepend(previewNode);
                    }
                });
                this.on("queuecomplete", function () {
                    refreshFileBrowser();
                    $("#previews").empty();
                })
            }
        };
    }

    // Toggle between grid and list view
    $("#toggle-list-view").change(function () {
        if ($("#fb-files-container").hasClass("fb-view-list")) {
            // ------- Switch to grid view -------
            $("#fb-files-container").removeClass("fb-view-list");
            $("#fb-files-container").addClass("fb-view-grid");
        }
        else {
            // ------- switch to table view -------
            $("#fb-files-container").removeClass("fb-view-grid");
            $("#fb-files-container").addClass("fb-view-list");
        }
    });

    // Bind file browser gui events
    bindFileBrowserItemEvents();

    // Bind sort method
    $("#fb-sort li").click(function () {
        if ($(this).attr("data-method")) {
            $("#fb-sort li[data-method]").removeClass("active");
            $(this).addClass("active");
        }

        if ($(this).attr("data-order")) {
            $("#fb-sort li[data-order]").removeClass("active");
            $(this).addClass("active");
        }

        onSort();
    });

    // Filter files on search input text change
    function filter(){
        var items = $('#fb-files-container li').children('span.fb-file-name');
        var search = $("#txtDirSearch").val().toLowerCase();
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).text().toLowerCase().indexOf(search) >= 0) {
                $(items[i]).parent().removeClass("hidden");
            }
            else {
                $(items[i]).parent().addClass("hidden");
            }
        }
    }
    $("#txtDirSearch").on("input", filter);

    // Clear search input
    $("#btn-clear-search-input").click(function(){
        $("#txtDirSearch").val("");
        filter();
    });

    $('#create-folder-dialog').on('shown.bs.modal', function () {
        $('#txtFolderName').val("");
        $('#txtFolderName').closest(".modal-content").find(".btn-primary").toggleClass("disabled", true);
        $('#txtFolderName').focus();
    });

    $('#zip-folder-dialog').on('shown.bs.modal', function () {
        $('#txtFolderName').focus();
        // Select the file name by default
        var input = document.getElementById("txtZipName");
        var startPos = 0;
        var endPos = $("#txtZipName").val().length;

        if (typeof input.selectionStart != "undefined") {
            input.selectionStart = startPos;
            input.selectionEnd = endPos;
        } else if (document.selection && document.selection.createRange) {
            // IE branch
            input.select();
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveEnd("character", endPos);
            range.moveStart("character", startPos);
            range.select();
        }
    });

    $('#rename-dialog').on('shown.bs.modal', function () {
        $('#txtName').focus();

        // Select the file name by default
        var input = document.getElementById("txtName");
        var startPos = 0;
        var endPos = $("#txtName").val().lastIndexOf(".");

        if (endPos == -1) {
            endPos = $("#txtName").val().length;
        }

        if (typeof input.selectionStart != "undefined") {
            input.selectionStart = startPos;
            input.selectionEnd = endPos;
        } else if (document.selection && document.selection.createRange) {
            // IE branch
            input.select();
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveEnd("character", endPos);
            range.moveStart("character", startPos);
            range.select();
        }

        $('#txtName').closest(".modal-content").find(".btn-primary").toggleClass("disabled", false);
    });

    // Create folder at current directory
    $("#btn-create-folder").click(function () {
        var resID = $("#hs-file-browser").attr("data-res-id");
        var currentPath = $("#hs-file-browser").attr("data-current-path");
        var folderName = $("#txtFolderName").val();
        if (folderName) {
            var calls = [];
            calls.push(create_irods_folder_ajax_submit(resID, currentPath + "/" + folderName));

            $.when.apply($, calls).done(function () {
                refreshFileBrowser();
            });
        }
        return false;
    });

    // Move up one directory
    $("#fb-move-up").click(function () {
        var resID = $("#hs-file-browser").attr("data-res-id");
        var upPath = $("#hs-file-browser").attr("data-current-path");
        upPath = upPath.substr(0, upPath.lastIndexOf("/"));
        pathLog.push(upPath);
        pathLogIndex = pathLog.length - 1;
        get_irods_folder_struct_ajax_submit(resID, upPath);
    });

    // Move back
    $("#fb-move-back").click(function () {
        var resID = $("#hs-file-browser").attr("data-res-id");

        if (pathLogIndex > 0) {
            pathLogIndex--;
            if (pathLogIndex == 0) {
                $("#fb-move-back").addClass("disabled");
            }
            get_irods_folder_struct_ajax_submit(resID, pathLog[pathLogIndex]);
        }
    });

    // Move forward
    $("#fb-move-forward").click(function () {
        if (pathLogIndex < pathLog.length) {
            pathLogIndex++;
            if (pathLogIndex == pathLog.length - 1) {
                $("#fb-move-forward").addClass("disabled");
            }
            get_irods_folder_struct_ajax_submit(resID, pathLog[pathLogIndex]);
        }
    });

    $("#btn-open").click(onOpenFolder);

    $("#btn-cut, #fb-cut").click(onCut);

    function onCut() {
        var currentPath = $("#hs-file-browser").attr("data-current-path");
        $("#fb-files-container li").removeClass("fb-cutting");
        sourcePaths = [];

        var selection = $("#fb-files-container li.ui-selected:not(.hidden)");

        for (var i = 0; i < selection.length; i++) {
            var itemName = $(selection[i]).children(".fb-file-name").text();
            sourcePaths.push(currentPath + "/" + itemName);

            $(selection[i]).addClass("fb-cutting");
        }

        if (sourcePaths.length) {
            $(".selection-menu").children("li[data-menu-name='paste']").toggleClass("disabled", false);
            $("#fb-paste").toggleClass("disabled", false);
        }

        $("#fb-cut").toggleClass("disabled", true);
        $(".selection-menu").hide();
    }

    $(".selection-menu li[data-menu-name='paste'], #fb-paste").click(onPaste);

    function onPaste() {
        var folderName = $("#fb-files-container li.ui-selected").children(".fb-file-name").text();
        var resID = $("#hs-file-browser").attr("data-res-id");
        var targetPath = $("#hs-file-browser").attr("data-current-path");

        if (folderName && folderName.lastIndexOf(".") == -1) {  // Makes sure the destination is a folder
            targetPath = targetPath + "/" + folderName
        }

        var calls = [];
        for (var i = 0; i < sourcePaths.length; i++) {
            calls.push(move_or_rename_irods_file_or_folder_ajax_submit(resID, sourcePaths[i], targetPath));
        }

        // Wait for the asynchronous calls to finish to get new folder structure
        $.when.apply($, calls).done(function () {
            refreshFileBrowser();
            sourcePaths = [];
            $("#fb-files-container li").removeClass("fb-cutting");
            $(".selection-menu").hide();
            updateSelectionMenuContext();
        });
    }

    // File(s) delete method
    $("#btn-confirm-delete").click(function () {
        var resID = $("#hs-file-browser").attr("data-res-id");
        var deleteList = $("#fb-files-container li.ui-selected");
        var currentPath = $("#hs-file-browser").attr("data-current-path");
        if (deleteList.length) {
            var calls = [];
            for (var i = 0; i < deleteList.length; i++) {
                var pk = $(deleteList[i]).attr("data-pk");
                if (pk) {
                    calls.push(delete_file_ajax_submit(resID, pk));
                }
                else {  // item is a folder
                    var folderName = $(deleteList[i]).children(".fb-file-name").text();
                    var folder_path = currentPath + "/" + folderName;
                    calls.push(delete_folder_ajax_submit(resID, folder_path));
                }
            }

            $(".selection-menu").hide();

            // Wait for the asynchronous calls to finish to get new folder structure
            $.when.apply($, calls).done(function () {
                refreshFileBrowser();
            });
        }
    });

    $(".selection-menu li[data-menu-name='rename'], #fb-rename").click(function(){
        $('.selection-menu').hide();
        var name = $("#fb-files-container li.ui-selected").children(".fb-file-name").text();
        $("#txtName").val(name);
    });

    // Rename method
    $("#btn-rename").click(function () {
        var resID = $("#hs-file-browser").attr("data-res-id");
        var currentPath = $("#hs-file-browser").attr("data-current-path");
        var oldName = $("#fb-files-container li.ui-selected").children(".fb-file-name").text();
        var newName = $("#txtName").val();

        var calls = [];
        calls.push(move_or_rename_irods_file_or_folder_ajax_submit(resID, currentPath + "/" + oldName, currentPath + "/" + newName));

        // Wait for the asynchronous calls to finish to get new folder structure
        $.when.apply($, calls).done(function () {
            refreshFileBrowser();
        });
    });

     // Download method
    $("#btn-download, #fb-download").click(function () {
        var downloadList = $("#fb-files-container li.ui-selected");
        if (downloadList.length) {
            for (var i = 0; i < downloadList.length; i++) {
                var url = $(downloadList[i]).attr("data-url");
                var fileName = $(downloadList[i]).children(".fb-file-name").text();
                downloadURI(url, fileName);
            }
        }
        $(".selection-menu").hide();
    });

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
        link.remove();
    }

    // Zip method
    $("#btn-confirm-zip").click(function () {
        if ($("#txtZipName").val().trim() != "") {
            var resID = $("#hs-file-browser").attr("data-res-id");
            var currentPath = $("#hs-file-browser").attr("data-current-path");
            var folderName = $("#fb-files-container li.ui-selected").children(".fb-file-name").text();
            var fileName = $("#txtZipName").val() + ".zip";

            var calls = [];
            calls.push(zip_irods_folder_ajax_submit(resID, currentPath + "/" + folderName, fileName));

            // Wait for the asynchronous calls to finish to get new folder structure
            $.when.apply($, calls).done(function () {
                refreshFileBrowser();
            });
        }
    });

    $("#btn-zip").click(function() {
        var folderName =$("#fb-files-container li.ui-selected").children(".fb-file-name").text();
        $("#txtZipName").val(folderName);
    });

    // Unzip method
    $("#btn-unzip").click(function () {
        var resID = $("#hs-file-browser").attr("data-res-id");
        var currentPath = $("#hs-file-browser").attr("data-current-path");
        var files = $("#fb-files-container li.ui-selected");

        var calls = [];
        for (var i = 0; i < files.length; i++) {
            var fileName = $(files[i]).children(".fb-file-name").text()
            calls.push(unzip_irods_file_ajax_submit(resID, currentPath + "/" + fileName));
        }

        // Wait for the asynchronous calls to finish to get new folder structure
        $.when.apply($, calls).done(function () {
            refreshFileBrowser();
        });
    });

    $(".selection-menu li[data-menu-name='refresh'], #fb-refresh").click(function () {
        refreshFileBrowser();
        $(".selection-menu").hide();
    });

    $(".selection-menu li[data-menu-name='select-all'], #fb-select-all").click(function () {
        $("#fb-files-container > li").removeClass("ui-selected");
        $("#fb-files-container > li:not(.hidden)").addClass("ui-selected");
        $(".selection-menu").hide();
        updateSelectionMenuContext();
    });

    $(".modal input.modal-only-required").keyup(function() {
        $(this).closest(".modal-content").find(".btn-primary").toggleClass("disabled", $(this).val().trim() == "")
    });
});