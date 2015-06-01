 $.ajaxSetup({ cache: false });
//Open popup if website URL hit from iOS device
if ((navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) {
    $('#btnDownloadApp').trigger('click');
}

$(window).bind('beforeunload', function(event){
    //Detect user redirect to other page, click on close, back button then
    // user should be display warning message if upload process is in progress
    var isInProgressFlag    = $('#isUploadInProgress').val();
    var unloadCount         = readCookie('unloadCount');

    if(isInProgressFlag == 1 && unloadCount > 1){
        return "Are you Sure?";
    }else if(unloadCount == 1){
        unloadCount ++;
        createCookie('unloadCount', unloadCount, 2);
    }
});

$(document).ready(function() {
    //Code to allow 'indexOf' functions work in IE browser
    if(!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(obj, start) {
            for (var i = (start || 0), j = this.length; i < j; i++) {
                if (this[i] === obj) { return i; }
            }
            return -1;
        }
    }

    //Code to allow 'Object.keys' functions work in IE browser
    Object.keys = Object.keys || function(o) {
        var result = [];
        for(var name in o) {
            if (o.hasOwnProperty(name))
                result.push(name);
        }
        return result;
    };

    baseUrl = $('#base_url').val();

    //To Disabled image filter after refresh page
    $('#filterThumbnail').attr('disabled', true);

    //For reseting calendar event and update calendar result
    $("#loadCalendarViewFlag").val('');
    $('#termsOfService').attr('checked', false);

    //Get current browsers detail
    var browser = BrowserDetect.browser;
    var version = BrowserDetect.version;
    if(browser == browserCheck.name && version < browserCheck.version){
        isLtIE9 = 1;
    }

    if(isLtIE9 == 1){
        doResponsivescreenForltIE9();
    }else{
        windowWidth = $(window).innerWidth();
    }

    //To open series selection popup when user click
    $("#includeIcon").click(function() {
        $('#editFilter').css({'display': 'inline-block'});
    });

    $(".btn-create-case").click(function() {
        var description = $('#case_description').val();
        var patientName = $('#case_patient_name').val();
        if($.trim(patientName) != '' && $.trim(description) != ''){
            $( "#formCreateCase" ).submit();
            $(".btn-create-case").attr('disabled', true);
        }
    });

    //For uncheck all checkbox
    if(window.location.href.indexOf('cases') > -1) {
        $("#casesList input:checkbox").map(function () {
            $(this).attr("checked", false);
        });
    }

    //For uncheck all checkbox
    if(window.location.href.indexOf('contacts') > -1) {
        $("#contactList input:checkbox").map(function () {
            $(this).attr("checked", false);
        });
    }

        //Unselect selected patient if user click else where in document
    $(document).click(function(event){
        if(window.location.href.indexOf('patients') > -1) {
            if(event.which != 3 ) {
                selectedPatientIds.length = 0;
                $('#expList li').each(function () {
                    $(this).css({'background-color': '#f9f9f9', 'color': '#000000'});
                });
            }
        }

        if(window.location.href.indexOf('cases/view') > -1) {
            if(typeof(event.target.tagName) != 'undefined'){
                if(event.target.tagName != "LABEL" && event.target.tagName != "INPUT" && event.target.tagName != "A") {
                    $('#editFilter').css({'display': 'none'});
                }
            }
        }
    });

    //To open modal for display confirm nav
    $("#btnLeavePage").click(function() {
        window.location.href = baseUrl + 'user/logout';
    });

    //To open modal for image select options
    $("#addImageLink").click(function() {
        $("#addImageButton").trigger('click');
    });

    //To open modal for clipboard image
    $("#clipboardButton").click(function(event) {
        var htmlPrintScreenInstruction = getPasteActionHtml();

        $("html, body").animate({ scrollTop: 0 }, "slow");
        $("#addImageModel").modal('hide');
        $("#pasteDiv").show();
        $("#pasteDiv").html(htmlPrintScreenInstruction);
        $("#clipboardImage").hide();
        $("#clipboardImage").removeAttr('src');
        $("#addClipboardButton").trigger('click');
    });

    $("#pasteDiv").mouseover(function(){
        $(this).css({'color': 'red'});
        $("#pasteDiv").focus();
    });

    $("#pasteDiv").mouseleave(function(){
        $(this).css({'color': 'black'});
        $("#pasteDiv").focus();
    });

    //To upload image
    $("#btnUploadClipboardImage").click(function() {
        $("#sm-image-upload-submit").trigger('click');
    });

    //To close Clipboard modal
    $("#closeClipboardModal").click(function() {
        imageAreaSelect.cancelSelection();
        $("#addClipboardModel").modal('hide');
    });

    //To disable scroll while image cropping and to clear and reset selection values
    $("#addClipboardModel").on("show", function () {
        $("html, body").css("overflow", "hidden");
    }).on("hidden", function () {
        xAxis      = 0;
        x2Axis     = 0;
        yAxis      = 0;
        y2Axis     = 0;
        thumbWidth = 0;
        thumbHeight= 0;
        imageAreaSelect.cancelSelection();
        $("html, body").css("overflow", "auto");
    });

    //To disable body scroll when popup is open
    $(".scroll_hide").on("show", function () {
        $("body").css("overflow", "hidden");
    });

    $(".scroll_hide").on("hide", function () {
        $("body").css("overflow", "auto");
    });

    $("#addClipboardModel").on("shown", function () {
        $("#pasteDiv").focus();
    });

    //Function to store image on server and call upload image function
    $("#uploadClipboardImgage").click(function(){
        var imgSrc = $("#clipboardImage").attr("src");
        imgWidth    = $("#clipboardImage").width();
        imgHeight   = $("#clipboardImage").height();
        if(typeof(imgSrc) != 'undefined' && imgSrc != ''){
            $.ajax({
                url  : baseUrl + "files/store_image_temporary",
                type : "POST",
                data :{ image : imgSrc },
                success:function(response){
                    response = $.parseJSON(response);
                    if(typeof(response) != 'undefined' && response !=''){
                        imageAreaSelect.cancelSelection();
                        $("#addClipboardModel").modal('hide');
                        $("#localImagePath").val(response.file_location);
                        $("#btnGetSeriesNameModal").trigger('click');
                    }
                },
                error:function(e){
                    checkLogout(e.responseText);
                }
            });
        }else{
            alert("Please paste image.");
        }
    });

    /**
     * Function to upload clipboard image file
    */
    $("#uploadImageButton").click(function(){
        var caseID     = $("[name = 'case_id']").val();
        var sortOrder  = 0;
        var imagePath  = $("#localImagePath").val();
        var seriesName = $("#series_name").val();
        var isFromMeasure = 0;
        var url = String(window.location);
        if(url.match("/files/image_measure/")!=null){
            isFromMeasure = 1;
        }else if(url.match("/files/measure_view/")!=null){
            isFromMeasure = 1;
        }

        var fileDataObject = new FormData();
        fileDataObject.append('case_id', caseID);
        fileDataObject.append('sort_order', sortOrder);
        fileDataObject.append('image_path', imagePath);
        fileDataObject.append('series_name', seriesName);
        fileDataObject.append('is_from_measure', isFromMeasure);

        $('#loadingImage').css({top: '28%'});
        $('#loadingImage').show();
        $.ajax({
            type:'POST',
            url: baseUrl + "files/upload_clipboard_image",
            data:fileDataObject,
            dataType:'json',
            cache:false,
            contentType: false,
            processData: false,
            success:function(response){
                $('#loadingImage').hide();
                $("#getSeriesNameModal").modal('hide');
                location.reload();
            },
            error:function(response){
                $('#loadingImage').hide();
                checkLogout(response.responseText);
            }
        });
    });

    if(window.location.href.indexOf('cases/view') > -1 || window.location.href.indexOf('files/image_measure') > -1 || window.location.href.indexOf('files/measure_view/') > -1) {
        //Function to get sizes of selected image area

        function getSizes(im,obj){
            xAxis = obj.x1;
            x2Axis = obj.x2;
            yAxis = obj.y1;
            y2Axis = obj.y2;
            thumbWidth = obj.width;
            thumbHeight = obj.height;
        }

        //Function to crop selected image area
        $("#btnCrop").click(function(){
            var img   = $("#clipboardImage").attr("src");
            if(thumbWidth > 0){
                imgWidth  = $("#clipboardImage").width();
                imgHeight = $("#clipboardImage").height();

                $.ajax({
                    url  : baseUrl + "files/crop_image",
                    type : "POST",
                    data :{
                        image      : img,
                        width      : thumbWidth,
                        height     : thumbHeight,
                        x1         : xAxis,
                        y1         : yAxis,
                        img_width  : imgWidth,
                        img_height : imgHeight
                    },
                    success:function(response){
                        checkLogout(response);
                        response = $.parseJSON(response);
                        if(typeof(response) != 'undefined' && response !=''){
                            uploadClipboardImage(response.file_location);
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });
            }else{
                if(typeof(img) != 'undefined' && img != ''){
                    alert("Please select portion.");
                }else {
                    alert("Please paste the screenshot.");
                }
            }
        });

    //Function to select image area
    imageAreaSelect = $('#clipboardImage').imgAreaSelect({
                        instance: true ,
                        handles: true,
                        fadeSpeed: 200,
                        onSelectEnd: getSizes
                    });
    }

    //For creating patient list in tree structure
    var url=String(window.location);
    if(url.match("/patients") != null){
        prepareList();
    }

    $(document).bind('contextmenu', function(e) {
        if(url.match("/patients") != null){
            e.preventDefault();
        }
    });

    //To hide browser context menu for Windows Vista chrome browser
    $(window).contextmenu( function(e) {
        if(url.match("/patients") != null){
            e.preventDefault();
        }
    });

    //To upload image hitting by Enter Key
    $("#uploadImages").on("shown", function () {
         popupBoxOpen = 1;
    }).on("hidden", function () {
         popupBoxOpen = 0;
    });

    $("#MyUploadForm").submit(function(){
        if(popupBoxOpen == 1){
            return false;
        }
    });

    //To Upload iamge hitting by Enter Key
    $(document).keypress(function(e) {
        if(e.which == 13) {
            if(popupBoxOpen == 1){
				if(isLtIE9 == 1){
	                $('#sm-image-upload-submit-IE').trigger('click');
				}else{
            		$('#sm-image-upload-submit').trigger('click');
				}
	        }
        }
    });

    //Display only icon if the user is admin for particular screen
    var userStatus = $("#userStatus").val();
    windowWidth = $(window).innerWidth();
    if(userStatus == 3){
        if(windowWidth >= 1200)
        {
            $(".top_header").css('display', 'none');
        }
    }

    if(window.location.href.indexOf('files/image_measure') > -1 || window.location.href.indexOf('files/measure_view/') > -1
        || window.location.href.indexOf('files/file_measure') > -1 || window.location.href.indexOf('files/file_measure_view') > -1
    ) {

        if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
            $("body").css({'position': 'initial'});
        }

        //To prevent select while updating measure
        if(isLtIE9 == 1){
            document.onselectstart = function() { return false; }
        }else{
            $("body").addClass('unselectable');
        }

        isMeasurePage = 1;
    }

    if(window.location.href.indexOf('patients') > -1) {
        setTimeout(function(){
                getAndUpdatePatientDetail();
            },1000);
    }

    $("#termsOfUse").click(function() {
        $("#termsOfUseModal").trigger('click');
    });

    $("#userAgreement").click(function() {
        $("#userAgreementModal").trigger('click');
    });

    $("#businessAgreement").click(function() {
        $("#businessAgreementModal").trigger('click');
    });

    // Hide/Show contacts permissions
    $(document).on('click','#hideShow',function(){
        var imgUrl = String($("#hideShowImgPath").attr('src'));
        if(imgUrl.match("/hide")!=null){
            $("#hideShowImgPath").attr('src', '../img/show.png');
            $("#hideShowImgPath").attr('title', 'Show');
        }else{
            $("#hideShowImgPath").attr('src', '../img/hide.png');
            $("#hideShowImgPath").attr('title', 'Hide');
        }
        $(".permission_hide_show").slideToggle(200, showstate);

    });

    //To save expand/collapse permission column state
    var permission_hide_show_state = readCookie('permission_hide_show_state');
    if(window.location.href.indexOf('contacts') > -1 ) {
        if(permission_hide_show_state == 0){
            $(".permission_hide_show").slideUp(200, showstate);
        }else{
            $(".permission_hide_show").slideDown(200, showstate);
        }
    }

    function showstate(){
        if($(this).is(":visible")){
            eraseCookie('permission_hide_show_state');
            createCookie('permission_hide_show_state', 1);
        }else{
            eraseCookie('permission_hide_show_state');
            createCookie('permission_hide_show_state', 0);
        }
    }

    // Enable/Disable register and activation button
    $("#btnRegister").attr('disabled', 'disabled');
    $("span.terms-msg").show();
    $("#btnRegister").removeClass('btn-primary');
    $("#btnRegister").addClass('btn-default');
    $('#termsOfService').click(function() {
        if (!$(this).is(':checked')) {
            $("#btnRegister").attr('disabled', 'disabled');
            $("#btnRegister").removeClass('btn-primary');
            $("#btnRegister").addClass('btn-default');
            $("span.terms-msg").show();
        }else{
            $("#btnRegister").removeAttr('disabled');
            $("#btnRegister").removeClass('btn-default');
            $("#btnRegister").addClass('btn-primary');
            $("span.terms-msg").hide();
        }
    });

    /**
     * Code to generate URl dynamically for print button
     */
    var url=String(window.location);
    var temp=url;
    if(url.match("/cases/view/")!=null){
        $("#btnPrint").attr('href', temp.replace("view","print"));
    }else if(url.match("/cases/create_from_module/")!=null){
        //do nothing
    }else if(url.match("/cases")!=null){
        var urlPart = 'cases/case_list_print';
        if(url.match("page=")){
            var res = url.split("page=");
            if(typeof(res[1]) != 'undefined'){
                urlPart = urlPart + '/' + res[1];
            }
        }
        $("#btnPrint").attr('href', baseUrl + urlPart);
    }else if(url.match("/calendar")!=null){
        $("#btnPrint").attr('href', baseUrl + "calendar" + "?is_print=" + 1);
    }else if(url.match("/contacts/groups/view/")!=null){
        //do nothing
    }else if(url.match("/contacts/view/")!=null){
        $("#btnPrint").attr('href', temp + "?is_print=" + 1);
    }else if(url.match("/contacts/create")!=null){
        //do nothing
    }else if(url.match("/contacts")!=null){
        $("#btnPrint").attr('href', baseUrl + "contacts/contacts_print");
    }else if(url.match("/user/profile")!=null){
        $("#btnPrint").attr('href', baseUrl + "user/profile_print");
    }else if(url.match("/files/image_measure/")!=null){
        if(isLtIE9 == 0) {
            var len = temp.length;
            var t = temp;
            len--;
            if (t[len] == '#') {
                if (t[len - 1] == '1' && t[len - 2] == '/') {
                    t[len] = '';
                    t[len - 1] = '0';
                    $("#btnPrint").attr('href', t + "/print");
                }
            } else if (t[len] == '1' && t[len - 1] == '/') {
                t[len] = '0';
                $("#btnPrint").attr('href', t + "/print");
            } else {
                $("#btnPrint").attr('href', window.location + "/0/print");
            }
        }else{
            $("#btnPrint").hide();
        }
    }else if(url.match("/files/measure_view/")!=null){
        $("#btnPrint").hide();
        /*if(temp.indexOf('?')!=-1){
            var t=temp.substr(0,temp.indexOf('?'));
            $("#btnPrint").attr('href', t + "/true");
        }else{
            $("#btnPrint").attr('href', window.location + "/true");
        }*/
    }else if(url.match("/help")!=null){
        $("#btnPrint").attr('href', window.location + "?is_print=" + 1);
    }

    //To print page if user press Ctrl+p key
    var btnPrintUrl = $("#btnPrint").attr('href');
    $(document).bind("keyup keydown", function(e){
        if(e.ctrlKey && e.keyCode == 80){
            if ($("#btnPrint").length > 0 && $("#btnPrint").attr('href') != "" ) {
                window.location = btnPrintUrl;
            }
            return false;
        }
    });

    //Set unloadCount in cookie
    createCookie('unloadCount', 1, 2);
    var weekStart = $('#weekStartOnCalendar').val();
    /* Apply rounded corner on buttons for IE7 browser */
    if (window.PIE) {
        /*$('.rounded').each(function() {
            PIE.attach(this);
        });*/

        $('.nav-pills > li > a').each(function() {
            PIE.attach(this);
        });

        $('.well').each(function() {
            PIE.attach(this);
        });

        $('.label').each(function() {
            PIE.attach(this);
        });

        /*$('.measure_tools').each(function() {
            PIE.attach(this);
        });*/
    }

    // to set the selected thumbnail field on image measure view
    var selectedThumbnailOption = readCookie('selectedThumb');

    if(typeof(selectedThumbnailOption) != 'undefined' && selectedThumbnailOption == 0){
        $("#imageThumbnails").attr('selected','selected');
    }


    /* for timezone identification */
    var timezone = '';
    $('#tz_offset_minutes').attr('value', -(new Date()).getTimezoneOffset());
    if(typeof(jstz) != 'undefined'){
        timezone = jstz.determine();
        $('#tz_system_time_zone').attr('value', timezone.name());
    }

    /* Workaround for dropdown from Twitter Bootstrap */
    $('a.dropdown-toggle, .dropdown-menu a').on('touchstart', function(e) {
        e.stopPropagation();
    });
    /* calendar */
    var nextClickCount = 0;
    var prevClickCount = 0;
    if ($.fullCalendar) {
        $('#fc-next').click(function() {
            $('#calendar').fullCalendar('next');
            $("#loadCalendarViewFlag").val('calendarEvent');
            nextClickCount++;
            eraseCookie('nextPrevCalendarViewValue');
            createCookie('nextPrevCalendarViewValue', 2);
            createCookie('nextCalendarViewValue', nextClickCount);
        });
        $('#fc-today').click(function() {
            $('#calendar').fullCalendar('today');
            $("#loadCalendarViewFlag").val('calendarEvent');
            eraseCookie('todayCalendarViewValue');
            eraseCookie('nextPrevCalendarViewValue');
            eraseCookie('nextCalendarViewValue');
            eraseCookie('prevCalendarViewValue');
            createCookie('todayCalendarViewValue', 1);
        });
        $('#fc-prev').click(function() {
            $('#calendar').fullCalendar('prev');
            $("#loadCalendarViewFlag").val('calendarEvent');
            prevClickCount++;
            eraseCookie('nextPrevCalendarViewValue');
            createCookie('nextPrevCalendarViewValue', 1);
            createCookie('prevCalendarViewValue', prevClickCount);
        });

        $('#fc-month').click(function() {
            $("#defaultSetView").text('Month');
            $("#loadCalendarViewFlag").val('calendarEvent');
            $('#calendar').fullCalendar('changeView', 'month');
            eraseCookie('calendar_view');
            createCookie('calendar_view', 1);
        });
        $('#fc-week').click(function() {
            $("#loadCalendarViewFlag").val('calendarEvent');
            $("#defaultSetView").text('Week');
            $('#calendar').fullCalendar('changeView', 'agendaWeek');
            eraseCookie('calendar_view');
            createCookie('calendar_view', 2);
        });
        $('#fc-day').click(function() {
            $("#loadCalendarViewFlag").val('calendarEvent');
            $("#defaultSetView").text('Day');
            $('#calendar').fullCalendar('changeView', 'agendaDay');
            eraseCookie('calendar_view');
            createCookie('calendar_view', 3);
        });

        $('#calendar').fullCalendar({
            viewDisplay: function(view) {
                $('#fc-title').html(view.title);
            },
            header: {
                left: null,
                center: null,
                right: null
            },
            firstDay:weekStart,
            titleFormat: {
                month: 'MMMM yyyy',
                week: "d MMM [ yyyy]{ '&#8212;'[ MMM] d MMM ,yyyy}",
                day: 'ddd,d MMM, yyyy'
            },
            eventSources: [{
                url: 'calendar/scheduled-cases.json',
                success:function(){
                    $("#calendarOverlay").removeClass('load_calendar_view_overlay');
                    var calendarEventValue = $("#loadCalendarViewFlag").val();
                    if(calendarEventValue == '' || calendarEventValue == calendarEventValue){
                        updateCalendarPageResult();
                    }

                }
            }],
            eventClick: function (event) {
                var tempUrl=String(window.location);
                if(tempUrl.match("is_print")!=null){
                }
                else
                window.location = event.data.url;
            },
            eventMouseover: function(event) {
                $(document).trigger('calendar.details', [event.data]);
                return false;
            },
            editable: true,
            eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {

                $.getJSON('calendar/case-drop/' + event.id, {
                    day_delta: dayDelta,
                    min_delta: minuteDelta
                }).error(function() {
                        revertFunc();
                    }).success(function(result) {
                        $.getJSON('calendar/case-data/' + event.id, {
                        }).error(function() {
                                revertFunc();
                            }).success(function(result) {
                                if(result.status == 1){
                                    event.data.date = result.data.date;
                                    event.data.duration = result.data.duration;
                                }
                            });

                        result || revertFunc();
                    });
            },
            eventResize: function(event, dayDelta, minuteDelta, revertFunc) {
                $.getJSON('calendar/case-resize/' + event.id, {
                    day_delta: dayDelta,
                    min_delta: minuteDelta
                }).error(function() {
                        revertFunc();
                    }).success(function(data) {
                        $.getJSON('calendar/case-data/' + event.id, {
                        }).error(function() {
                                revertFunc();
                            }).success(function(result) {
                                if(result.status == 1){
                                    event.data.date = result.data.date;
                                    event.data.duration = result.data.duration;
                                    event.end = result.data.end;
                                    $('#calendar').fullCalendar('renderEvent', event, true);
                                }
                            });

                        return data || revertFunc();
                    });
            },
            droppable: true,
            drop: function(date, allDay) {
                var event = $(this).data('event');
                var that = this;

                if (allDay) {
                    date.setHours(7);
                    date.setMinutes(30);
                }
                if(event){
                    $.getJSON('calendar/case-schedule/' + event.id, {
                        date: date.getTime()
                    }).success(function(res) {
                            if (res) {
                                var eventCopy = $.extend({}, event);
                                $.getJSON('calendar/case-data/' + event.id, {
                                }).error(function() {
                                        revertFunc();
                                    }).success(function(result) {
                                        if(result.status == 1){
                                            event.data.date = result.data.date;
                                            event.data.duration = result.data.duration;
                                            event.data.start = result.data.start;
                                            event.data.end = result.data.end;
                                            eventCopy.start = result.data.start;
                                            eventCopy.end = result.data.end;
                                        }else{
                                            eventCopy.start = date;
                                            eventCopy.end = new Date();
                                            eventCopy.end.setTime(date.getTime() + 2 * 60 * 60 * 1000);
                                            eventCopy.allDay = false;
                                        }

                                        $('#calendar').fullCalendar('renderEvent', eventCopy, true);
                                        $(that).remove();
                                    });
                            }
                        });
                }
            }
        });

        //For printing calendar view
        var tempUrl = String(window.location);
        if(tempUrl.match("is_print") != null){
            //For printing prev/next month calendar view
            var nextPrevCalendarViewValue = readCookie('nextPrevCalendarViewValue');
            if(typeof(nextPrevCalendarViewValue) != 'undefined' && nextPrevCalendarViewValue > 0){
                var calendarViewValue = readCookie('calendar_view');
                if(typeof(calendarViewValue) != 'undefined' && calendarViewValue > 0){
                    if(calendarViewValue == 2){
                        $("#loadCalendarViewFlag").val('calendarEvent');
                        $("#defaultSetView").text('Week');
                        $('#calendar').fullCalendar('changeView', 'agendaWeek');
                    }else if(calendarViewValue == 3){
                        $("#loadCalendarViewFlag").val('calendarEvent');
                        $("#defaultSetView").text('Day');
                        $('#calendar').fullCalendar('changeView', 'agendaDay');
                    }else{
                        $("#loadCalendarViewFlag").val('calendarEvent');
                        $("#defaultSetView").text('Month');
                        $('#calendar').fullCalendar('changeView', 'month');
                    }
                }
                switch(nextPrevCalendarViewValue) {
                    case '1':
                        var nextCalendarViewValue = readCookie('nextCalendarViewValue');
                        if(typeof(nextCalendarViewValue) != 'undefined' && nextCalendarViewValue > 0){
                            for (var i = 0; i < nextCalendarViewValue; i++) {
                                $('#fc-next').trigger('click');
                            }
                        }
                        var prevCalendarViewValue = readCookie('prevCalendarViewValue');
                        if(typeof(prevCalendarViewValue) != 'undefined' && prevCalendarViewValue > 0){
                            for (var i = 0; i < prevCalendarViewValue; i++) {
                                $('#fc-prev').trigger('click');
                            }
                        }
                        break;
                    default:
                        var prevCalendarViewValue = readCookie('prevCalendarViewValue');
                        if(typeof(prevCalendarViewValue) != 'undefined' && prevCalendarViewValue > 0){
                            for (var i = 0; i < prevCalendarViewValue; i++) {
                                $('#fc-prev').trigger('click');
                            }
                        }
                        var nextCalendarViewValue = readCookie('nextCalendarViewValue');
                        if(typeof(nextCalendarViewValue) != 'undefined' && nextCalendarViewValue > 0){
                            for (var i = 0; i < nextCalendarViewValue; i++) {
                                $('#fc-next').trigger('click');
                            }
                        }
                        break;
                }
                eraseCookie('prevCalendarViewValue');
                eraseCookie('nextCalendarViewValue');
                eraseCookie('nextPrevCalendarViewValue');
            }

            //For printing today's calendar view
            var todayCalendarViewValue = readCookie('today_calendar_view');
            if(typeof(todayCalendarViewValue) != 'undefined' && todayCalendarViewValue > 0){
                if(todayCalendarViewValue == 1){
                    $('#fc-today').trigger('click');
                }
                eraseCookie('today_calendar_view');
            }

            //For printing calendar view daywise, weekwise and monthwise
            var calendarViewValue = readCookie('calendar_view');
            if(typeof(calendarViewValue) != 'undefined' && calendarViewValue > 0){
                switch(calendarViewValue){
                    case '2':
                        $('#fc-week').trigger('click');
                        break;
                    case '3':
                        $('#fc-day').trigger('click');
                        break;
                    default:
                        $('#fc-month').trigger('click');
                        break;
                }
                eraseCookie('calendar_view');
            }
        }

        $(document).bind('calendar.details', function(event, data) {
            updateCaseDetails(data);

        });
    }

    /* Unscheduled draggable events on the calendar view */
    if ($('#calendar-no-unscheduled-cases-label').length > 0) {

    }

    /* Init date pickers for the date fields */
    if ($.fn.datepicker) {
        $('.date').datepicker(
            {
                'autoclose':true
            }
        );
        $('.field-date').datepicker(
            {
                'autoclose':true,
                'format':'M dd, yyyy'
            }
        );
    }

    /* Enable `Scheduled` checkbox to control visibility of date and time selectors */
    $('.date-collapse input[type="checkbox"]')
        .each(function(e) {
            $(this).parent().siblings().toggle(this.checked);
        })
        .change(function(e) {
            $(this).parent().siblings().toggle(this.checked);
        });

    /* Files gallery */
    $('.sm-image').bind('sm-image-select-event', function(event, selected) {
        $(this).toggleClass('sm-active', selected)
            .find('input:hidden').attr('value', selected ? 1 : null);
        $(this).find('a.sm-image-select').toggleClass('active', selected);
    });

    $('.sm-image-select').click(function() {
        /* Make sure that the following code is executed AFTER click */
        var that = this;
        setTimeout(function() {
            var selected = $(that).hasClass('active');
            $(that).parents('.sm-image').trigger('sm-image-select-event', [ selected ]);
        }, 0);
    });

    $('#sm-image-select-all').click(function() {
        $('.sm-image:visible').trigger('sm-image-select-event', [ true ]);
    });

    $('#sm-image-select-none').click(function() {
        $('.sm-image').trigger('sm-image-select-event', [ false ]);
    });

    /* Image types */
    initializeSeriesOption();

    //Update surgeon email for cases
    $('#case_surgeon_name').change(function() {
        var caseSurgeonName = $('#case_surgeon_name').val();
        var allSurgeonEmail = $("input[name=all_surgeon_email]").val();
        if(allSurgeonEmail != ''){
            var allSurgeonemailData = $.parseJSON(allSurgeonEmail);
            $.each(allSurgeonemailData, function(name, email) {
                if(name == caseSurgeonName){
                    $("input[name=case_surgeon_email]").val(email);
                }
            });
        }
    });

    //Update surgeon email for cases
    $('select[name=template_surgeon_name]').change(function() {
        var caseSurgeonName = $('select[name=template_surgeon_name]').val();
        var allSurgeonEmail = $("input[name=all_surgeon_email]").val();
        if(allSurgeonEmail != ''){
            var allSurgeonemailData = $.parseJSON(allSurgeonEmail);
            $.each(allSurgeonemailData, function(name, email) {
                if(name == caseSurgeonName){
                    $("input[name=template_surgeon_email]").val(email);
                }
            });
        }
    });

    /* Confirmations */

    $("[data-confirm='attribute']").click(function(event) {
        var text = $(this).attr('data-confirm-text');
        if (!confirm(text)) {
            event.preventDefault();
            event.stopPropagation();
            var case_id = $(this).attr('id');
            var div_id = 'div_' + case_id;
            $('#' + div_id).removeClass('open');
            return false;
        } else {
            return true;
        }
    });

    /* Contacts select all/none permissions */
    $('#contacts-select-all-permissions').click(function() {
        $('.permission-option').prop('checked', true);
    });

    $('#contacts-select-none-permissions').click(function() {
        $('.permission-option').prop('checked', false);
    });

    /* User features select all/none  */
    $('#user-select-all-features').click(function(event) {
        event.preventDefault();
        $('.feature-option').prop('checked', true);
    });

    $('#user-select-none-features').click(function(event) {
        event.preventDefault();
        $('.feature-option').prop('checked', false);
    });

    //Display loading image when click on image upload button
    $('#sm-image-upload-submit').click(function(){
        var isUploadInProgress = $('#isUploadInProgress').val();

        if(isUploadInProgress == 0){
            $('#isUploadInProgress').val('1');
            createCookie('unloadCount', 1, 2);

            //Display loading image while uploading is in progress
            $('#uploadLoadingSection .loading').show();
        }
    });

    //Display loading image when click on image upload button
    $('#attachmentSubmit').click(function(){
        var isUploadInProgress = $('#isUploadInProgress').val();

        if(isUploadInProgress == 0){
            $('#isUploadInProgress').val('1');
            createCookie('unloadCount', 1, 2);

            //Display loading image while attachment uploading is in progress
            $('#attachmentLoading .loading').show();
        }
    });

    // If none option is selected then user can not able to select other option
    $('.user-feature').on('change', function() {
        if(this.value == 'none'){
            $(".user-feature").val(['none']);
        }
    });

    //Store case's images to server
    if(window.location.href.indexOf('files/measure_view/') > -1) {
        var browserUrlParts = window.location.href.split('/');
        var caseId          = browserUrlParts[browserUrlParts.length - 1];
        if($.trim(caseId) != '' && caseId > 1){
            storeFilesToDirectory(caseId);
        }
    }

    if(window.location.href.indexOf('files/image_measure/') > -1) {
        var browserUrlParts = window.location.href.split('files/image_measure/');
        if(browserUrlParts.length > 1){
            var urlParts    = browserUrlParts[1].split('/');
            var caseId      = urlParts[0];
            if($.trim(caseId) != '' && caseId > 1){
                storeFilesToDirectory(caseId);
            }
        }
    }

    //Store patient, study, series images to server
    if(window.location.href.indexOf('files/file_measure_view/') > -1) {
        var browserUrlParts = window.location.href.split('/');
        if(browserUrlParts.length > 1) {
            var groupId   = browserUrlParts[browserUrlParts.length - 2];
            var urlParts  = browserUrlParts[browserUrlParts.length - 1].split('?');
            var groupType = urlParts[0];
            if ($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != '') {
                storePatientFilesToDirectory(groupId, groupType);
                if (groupType == 0) {
                    filterThumbnailAction(0, 0, groupId);
                } else if (groupType == 1) {
                    filterThumbnailAction(0, 0, 0, groupId);
                } else if (groupType == 2) {
                    filterThumbnailAction(0, 0, 0, 0, groupId);
                }
            }
        }
    }

    if(window.location.href.indexOf('files/file_measure/') > -1) {
        var browserUrlParts = window.location.href.split('files/file_measure/');
        if(browserUrlParts.length > 1){
            var urlParts    = browserUrlParts[1].split('/');
            var groupId     = urlParts[0];
            var groupType   = urlParts[1];
            if($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != ''){
                storePatientFilesToDirectory(groupId, groupType);
                if(groupType == 0) {
                    filterThumbnailAction(0, 0, groupId);
                }else if(groupType == 1) {
                    filterThumbnailAction(0, 0, 0, groupId);
                }else if(groupType == 2) {
                    filterThumbnailAction(0, 0, 0, 0, groupId);
                }
            }
        }
    }

    //Case search on search text changes
    $('#search_text').on('change', function() {
        var searchText = $('#search_text').val();
        searchCase(searchText);
    });

    //Case search on case search button
    $('#btnCaseSearch').on('click', function() {
        var searchText = $('#search_text').val();
        searchCase(searchText);
    });


    //User search on search text changes
    $('#search_user_text').on('change', function() {
        var searchText = $('#search_user_text').val();
        searchUser(searchText);
    });

    //User search on case search button
    $('#btnUserSearch').on('click', function() {
        var searchText = $('#search_user_text').val();
        searchUser(searchText);
    });

     //Contact search on search text changes
    $('#search_contact_text').on('change', function() {
        var searchText = $('#search_contact_text').val();
        searchContact(searchText);
    });

    //Contact search on case search button
    $('#btnContactSearch').on('click', function() {
        var searchText = $('#search_contact_text').val();
        searchContact(searchText);
    });

    //Patient search on search text changes
    $('#search_patient_text').on('change', function() {
        var searchText = $('#search_patient_text').val();
        searchPatient(searchText);
    });

    //Patient search on case search button
    $('#btnPatientSearch').on('click', function() {
        var searchText = $('#search_patient_text').val();
        searchPatient(searchText);
    });

   // to set the keyup event for chrome browser as it takes two tab on change events
     if (browser == 'Chrome' || browser == 'Safari') {
        var emailEvent = 'keyup';
    }else{
        var emailEvent = 'change';
    }

        //Email field validation  keypress change
        $('#email').on(emailEvent, function (event) {
            var email = $(this).val();
            if (email != '') {
                var emailRule = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;
                if (email.match(emailRule)) {
                    inputField('#email', 'val');
                } else {
                    inputField('#email', 'inval');
                }
            } else {
                $('#email').removeAttr('style');
            }
            return true;
        });

    //Password field validation
    $('.password_field').on('keyup', function() {
        var password = $(this).val();
        if(password != ''){
            var passwordRule =  /^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*/;
            if(password.match(passwordRule)){
                inputField('.password_field','val');
            } else{
                inputField('.password_field','inval');
            }
        }else{
            $('.password_field').removeAttr('style');
        }
    });

    //Confirm Password field validation
    $('#passwordc').on('keyup', function() {
        var cpassword = $(this).val();
        var password = $('#password').val();
        if(cpassword != ''){
            if(cpassword == password){
                inputField('#passwordc','val');
            } else{
                inputField('#passwordc','inval');
            }
        }else{
            $('#passwordc').removeAttr('style');
        }
    });

    // if password field change check confirm password
    $('.password_field').change(function(){
        var password = $(this).val();
        if(password == ''){
            $('.password_field').removeAttr('style');
        }
        var cpassword = $('#passwordc').val();
        if(cpassword != '') {
            if (cpassword == password) {
                inputField('#passwordc','val');
            } else {
                inputField('#passwordc','inval');
            }
        }

    });

    $('#passwordc').change(function(){
        var cpassword = $(this).val();
        if (cpassword == ''){
           $('#passwordc').removeAttr('style');
        }
    });

    /*
    Function to provide validation styles to input fields on register and password change window.
     */
    function inputField(fieldId,check) {
        if (check == 'val') {
            $(fieldId).focus();
            $(fieldId).attr('style', 'border-color: #CCCCCC; color: #555555;');
            return true;
        }else{
            $(fieldId).attr('style', 'border-color: #E9322D; color: #B94A48;');
            return false;
        }
    }
    // share case with contact
    $("#shareSelectedCases").click(function(){
        // get list of selected contact
        var contactSelectedID = [];
        var selectedGroups = [];
        $("#shareCasesContacts input:checkbox:checked").map(function(){
            if($(this).attr('class').match("groups") != null ){
                selectedGroups.push($(this).val());
            }else{
                contactSelectedID.push($(this).val());
            }
        });
        // get list of selected cases
        var casesSelectedID = [];
        $("#casesList input:checkbox:checked").map(function(){
            casesSelectedID.push($(this).val());
        });
        casesSelectedID.shift();
        if(contactSelectedID.length == 0 && selectedGroups.length == 0){
            alert("Please select collaborator(s).");
            return false;
        }
        $.ajax({
            url: baseUrl + "cases/sharing/share_multiple_cases",
            type: "post",
            dataType: "json",
            beforeSend: function(){
                $("#shareSelectedCases").attr('disabled','disabled');
                $('#loadingImage').show();
            },
            data:{
                selected_case_ids: casesSelectedID,
                accessor_ids: contactSelectedID,
                selected_groups: selectedGroups
            },
            success:function(response){
                if(response.status == 'success'){
                    $("#shareSelectedCases").removeAttr('disabled');
                    $('#loadingImage').hide();

                    location.reload(true);
                }else{
                    //alert("There is some problem please try again.");
                    $('#loadingImage').hide();
                    $("#shareSelectedCases").removeAttr('disabled');
                    location.reload(true);
                }

            },
            error:function(e){
                checkLogout(e.responseText);
                //alert("There is some problem please try again.");
                $('#loadingImage').hide();
                $("#shareSelectedCases").removeAttr('disabled');
            }

        });
    });

    //remove contacts from selected cases
    $(document).on("click", "#removeSelectedContacts", function(){

        // get list of selected contact
        var contactSelectedID = [];
        var selectedGroups = [];
        var flag = 0;
        var isContinue = 0;
        $("#removeCasesContacts input:checkbox:checked").map(function(){
            if($(this).attr('class').match("groups") != null ){
                selectedGroups.push($(this).val());
                isContinue = 1;
            }else if($(this).attr('class').match("from_template") != null ){
               removeCollaborators();
               flag = 1;
            }else{
                contactSelectedID.push($(this).val());
                isContinue = 1;
            }
        });

        // get list of selected cases
        var casesSelectedID = [];
        $("#casesList input:checkbox:checked").map(function(){
            casesSelectedID.push($(this).val());
        });

        if(casesSelectedID.length == 0){
           var caseId = $('[name = case_id]').val();
           casesSelectedID.push(caseId);
        }else{
            casesSelectedID.shift();
        }

        if(window.location.href.indexOf('cases/view') > -1) {
            if(contactSelectedID.length == 0 && flag == 0){
                alert("Please select collaborator(s).");
                return false;
            }
        }else{
            if(contactSelectedID.length == 0 && selectedGroups.length == 0 && flag == 0){
                alert("Please select collaborator(s).");
                return false;
            }
        }

        if(isContinue == 0){
            return false;
        }

        $.ajax({
            url: baseUrl + "cases/sharing/remove_multiple_contacts",
            type: "POST",
            dataType: "json",
            beforeSend: function(){
                $("#removeSelectedContacts").attr('disabled','disabled');
                $('#loadingImage').show();
            },
            data:{
                selected_case_ids: casesSelectedID,
                accessor_ids: contactSelectedID,
                selected_groups: selectedGroups
            },
            success:function(response){
                if(response.status == 'success'){
                    $("#removeSelectedContacts").removeAttr('disabled');
                    $('#loadingImage').hide();
                    if((typeof(response.is_from) != 'undefined') && response.is_from == 'caseview'){
                        alert("Selected contact(s) has been removed from case successfully.");
                        updateCollaboratorAccordion(response);
                    }else{
                        location.reload(true);
                    }
                }else{
                    if(typeof(response.message) != 'undefined'){
                        alert(response.message);
                    }

                    $('#loadingImage').hide();
                    $("#removeSelectedContacts").removeAttr('disabled');
                }
            },
            error:function(e){
                checkLogout(e.responseText);
                // alert("There is some problem please try again.");
                $('#loadingImage').hide();
                $("#removeSelectedContacts").removeAttr('disabled');
            }

        });
    });

    // Modified permission of selected contact
    $("#modifiedGroupPermission").click(function(){
        // Get list of selected permission
        var selectedPermissionIDs = [];
        $("#contactPermission input:checkbox:checked").map(function(){
            selectedPermissionIDs.push($(this).val());
        });
        // Get list of selected contact
        var contactSelectedIDs = [];
        $("#contactList input:checkbox:checked").map(function(){
            contactSelectedIDs.push($(this).val());
        });

        if(selectedPermissionIDs.length == 0){
            alert("Please select permission(s).");
            return false;
        }

        contactSelectedIDs.shift();
        var accessLevel = $('#access_level').val();
        $.ajax({
            url: baseUrl + "contacts/save",
            type: "post",
            beforeSend: function(){
                $("#modifiedGroupPermission").attr('disabled','disabled');
                $('#loadingImage').show();
            },
            dataType: "json",
            data:{selected_contact_ids:contactSelectedIDs, permissions:selectedPermissionIDs, access_level: accessLevel, multiContact:true},
            complete:function(response){
                $("#modifiedGroupPermission").removeAttr('disabled');
                $('#loadingImage').hide();
                alert("Permission(s) modified successfully.");
                location.reload(true);

            },
            error:function(e){
                checkLogout(e.responseText);
                alert("There is some problem please try again.");
                location.reload(true);
            }

        });
    });

    /**
     * Add selected contact to group
     */
    $("#addContactsToGroup").click(function(){
        // Get selected contact list
        var contactSelectedIDs = [];
        $("#contactList input:checkbox:checked").map(function(){
            contactSelectedIDs.push($(this).val());
        });
        contactSelectedIDs.shift();
        // Get group name
        var createdGroupName = $("#group_name").val();

        if($.trim(createdGroupName) == ''){
            alert("Please enter Group Name.");
            return false;
        }

        $.ajax({
            url: baseUrl + "contacts/groups/add_contact",
            type: "post",
            dataType: "json" ,
            beforeSend: function(){
                $("#addContactsToGroup").attr('disabled','disabled');
                $('#loadingImage').show();
            },
            data:{selected_contact_ids:contactSelectedIDs,group_name:createdGroupName,multi_contacts:true},
            complete:function(response){
                $("#addContactsToGroup").removeAttr('disabled');
                $('#loadingImage').hide();
                alert("Contact(s) group created successfully.");
                location.reload(true);

            },
            error:function(e){
                checkLogout(e.responseText);
                alert("There is some problem please try again.");
                location.reload(true);
            }

        });

    });

    /**
     * Add new group
     */
    $("#addGroup").click(function(){
        // Get group name
        var createdGroupName = $("#groupName").val();

        if($.trim(createdGroupName) == ''){
            alert("Please enter Group Name.");
            return false;
        }

        $.ajax({
            url: baseUrl + "contacts/groups/add_group",
            type: "post",
            dataType: "json" ,
            beforeSend: function(){
                $("#addGroup").attr('disabled','disabled');
                $('#loadingImage').show();
            },
            data:{group_name:createdGroupName, multi_contacts:true},
            success:function(response){
                $("#addGroup").removeAttr('disabled');
                $('#loadingImage').hide();
                if(response.status == 1){
                    alert(response.message);
                    location.reload(true);
                }else{
                    alert(response.message);
                }
            },
            error:function(e){
                checkLogout(e.responseText);
                //alert("There is some problem please try again.");
                //location.reload(true);
            }
        });
    });

    // Assign contact to group
    $("#assignContactToGroup").click(function(){
        // Get all selected contact ids
        var contactSelectedIDs = [];
        $("#contactList input:checkbox:checked").map(function(){
            contactSelectedIDs.push($(this).val());
        });
        // Get list of selected group
        var groupSelectedIDs = [];
        $("#groupDescription input:checkbox:checked").map(function(){
            groupSelectedIDs.push($(this).val());
        });
        if(groupSelectedIDs.length == 0){
            alert("Please select Group(s) from list.");
            return false;
        }

        contactSelectedIDs.shift();
        $.ajax({
            url: baseUrl + "contacts/groups/assign_contact_to_group",
            type: "post",
            dataType: "json",
            beforeSend: function(){
            $("#assignContactToGroup").attr('disabled','disabled');
            $('#loadingImage').show();
            },
            data:{selected_contact_ids:contactSelectedIDs,group_ids:groupSelectedIDs,multi_contacts:true},
            complete:function(response){
                $("#addContactsToGroup").removeAttr('disabled');
                $('#loadingImage').hide();
                location.reload(true);
            },
            error:function(e){
                checkLogout(e.responseText);
                alert("There is some problem please try again.");
                location.reload(true);
            }
        });
    });

    // Open contact details
    $('#contactList tr td:not(:first-child)').click(function () {
       var ContactID = $(this).parent().attr('contactId');
       window.location.href = baseUrl + 'contacts/view/'+ContactID;
    });

    // Open case information
    $('#casesList tr td:not(:first-child)').click(function () {
       var CaseID = $(this).parent().attr('caseID');
       window.location.href = baseUrl + 'cases/view/'+CaseID;
    });

    // Edit image button
    $("#editImage").click(function(){
        $('.image_position').each(function(){
            var checkbox = $(this).find('input');
            if(checkbox.is(":checked")){
                checkbox.removeAttr('checked');
            }
        });
        $('.set_delete_button').toggleClass('sm-hide');
        $('#addImageLink').toggleClass('sm-hide');
        $('#deleteImagesButton').toggleClass('sm-hide');
        $('#editImage').toggleClass('active');
    });

    // Upload image popup
    $("#uploadImagesButton").click(function(){
        $("#addImageModel").modal('hide');
        $("#imageDescription").html('');
        if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0){
            $(".upload_image_progressbar").addClass('sm-hide');
            $("#imageInput").val('');
            $("#uploadImagePopup").click();
            $("#imageDescription").html("UploadImage");

        }else{
            $('.sm-image-upload-file').click();
        }

    });

    // to reset the image upload pop-up fields
    $('#uploadImages').on('hidden.bs.modal', function(){
         $(this).find('form')[0].reset();
    });

     // Upload image popup for IE
    $("#uploadImagesButtonIE").click(function(){
        $("#addImageModel").modal('hide');
        $("#uploadImagePopup").click();
        $("#imageDescription").html("UploadImage");
    });

    // Image description when upload image
    $("input#imageInput").on('change', function(){
        var uploadImageText = $.trim($("#imageDescription").html());
        if(uploadImageText == '' && $("#uploadImages").hasClass('in') == false){
            setTimeout(function(){ $("#uploadImagePopup").click();},500)
        }
        var uploadedImages = this.files;
        if(typeof uploadedImages != 'undefined'){
            var imageDescription = '';
            for(var count = 0; count< uploadedImages.length ; count++) {
                imageDescription += "<span>"+uploadedImages[count].name + "</span><br/>"
            }
            $("#uploadedImagesCount").val(uploadedImages.length);
            $("#imageDescription").html(imageDescription);
            $(".upload_image_progressbar").hide();
        }else{
            $("#imageDescription").html("UploadImage");
        }
    });

    // Delete image action
    $('#deleteImagesButton').click(function(){
        var fileToDelete = new Object();
        $('.image_position').each(function(){
            var checkbox = $(this).find('input');
            if(checkbox.is(":checked") && checkbox.parent().parent().attr('style') != 'display: none;'){
                var file_id = checkbox.attr('fileID');
                fileToDelete[file_id] = 1;
            }
        });
       var caseId = $('[name = case_id]').val();
        if(Object.keys(fileToDelete).length > 0){
            var deleteSeriesImages = $('#filterThumbnail').val();
            var strMessagePart = (deleteSeriesImages == 1) ? 'series ' : '';
            var result = confirm("Are you sure you want to delete " + strMessagePart + "image(s)?");
            if(result){
                $.ajax({
                    url: baseUrl + "files/remove",
                    type: "post",
                    dataType: "json",
                    data:{file_ids:fileToDelete,case_id:caseId, single_image_remove:true, delete_series_images: deleteSeriesImages},
                    success:function(response){
                        if(response.status == 'Success'){
                            location.reload(true);
                        }else{
                            //alert("An error occurred while removing these image. Please try again.");
                        }

                    },
                    error:function(e){
                        checkLogout(e.responseText);
                        //alert("An error occurred while removing these image. Please try again.");
                    }
                });
            }
        }else{
            alert("Please select image(s) to delete.");
        }
    });

    // Add more collaborators to
    $("#addMoreCollaborators").click(function() {
        $("#addMoreCollaborators").attr('disabled', true);
        var selectedCollaborators = [];
        var selectedGroups = [];
        $('#collaboratorsList input[type=checkbox]').each(function () {
            if($(this).is(":checked")){
                var accessorId = $(this).attr('value');
                //Group
                if($(this).attr('class').match("groups") != null ){
                    selectedGroups.push(accessorId);
                }else{
                    //Contact
                    selectedCollaborators.push(accessorId);
                }
            }
        });

        var caseId = $('[name = case_id]').val();
        if(selectedCollaborators.length > 0 || selectedGroups.length > 0){
            sharedCollaborators(selectedCollaborators, selectedGroups, caseId);
        }else{
            if($('#collaboratorsList').children().length < 1){
                alert("Collaborator list is empty.");
            }else{
                alert("Please select contact or group first for add to case.");
            }
            $("#addMoreCollaborators").attr('disabled', false);
        }

    });

    // Select All Images
    $("#selectAllImage").click(function(){
        if($('.set_delete_button').hasClass('sm-hide')){
            $('.set_delete_button').toggleClass('sm-hide');
            $('#addImageLink').toggleClass('sm-hide');
            $('#deleteImagesButton').toggleClass('sm-hide');
            $('#editImage').toggleClass('active');
        }
       $('.image_position').each(function(){
           var checkbox = $(this).find('input');
           if(!checkbox.is(":checked") && checkbox.parent().parent().attr('style') != 'display: none;'){
               checkbox.click();
           }
       })
    });

    // un-select all selected images
    $("#selectNoneImage").click(function(){
        $('.image_position').each(function(){
            var checkbox = $(this).find('input');
            if(checkbox.is(":checked")){
                checkbox.click();
            }
        })
    });

    // Open pop-up to add collaborators
    $("#addCollaboratorButton").click(function(){
        $("#collaboratorsName").val('');
        $('#addCollaborator').click();
    });

    // Add collaborators to case
    $("#addCollaboratorToCase").click(function(){
        var email = $('#collaboratorsName').val();
        var caseId = $('[name = case_id]').val();
        var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        var selectedGroups = [];
        if (!filter.test(email))
        {
            alert('Please provide a valid email address.');
            return false;
        }
        $('#addCollaboratorToCase').attr('disabled', true);
        $('#loadingImage').css({top: '29%'});
        $('#loadingImage').show();

        $.ajax({
            url: baseUrl + "contacts/create",
            type: "post",
            dataType: "json",
            data: {email:email,access_level:'1',permissions:{0:1,1:4},add_collaborator:true},
            success:function(response){
                $('#addCollaboratorToCase').attr('disabled', false);
                $('#loadingImage').hide();
                if(response.status == 'success'){
                    var selectedCollaborators = [response.id]
                    sharedCollaborators(selectedCollaborators, selectedGroups, caseId);
                }else{
                    alert(response.message);
                }

            },
            error:function(response){
                $('#addCollaboratorToCase').attr('disabled', false);
                $('#loadingImage').hide();
                if(response.responseText.indexOf("<!DOCTYPE") > -1){
                    form_change = false;
                    window.location = baseUrl + 'user/login';
                }else{
                    alert("An error occurred while add collaborators. Please try again.");
                }
            }
        });

    });

    // Save clinical notes
    $("#saveClinicalNotes").click(function(){
        var caseId = $(".case_id").val();
        var next = $(".next").val();
        var instrumentationPlanned = $(".clinical_notes_text").val();
        if(instrumentationPlanned == ''){
            alert("Notes field can not be blank.");
            return false;
        }
        $.ajax({
            url: baseUrl + "cases/notes/save",
            type: "post",
            dataType: "json",
            data: {case_id:caseId,next:next,instrumentation_planned:instrumentationPlanned,add_clinical_notes:true},
            success:function(response){
                if(response.status == 'Success'){
                 location.reload(true);
                 }else{
                 alert("An error occurred while saving clinical notes. Please try again.");
                 }
            },
            error:function(e){
                checkLogout(e.responseText);
                alert("An error occurred while saving clinical notes. Please try again.");
            }
        });
    });

    // Send message to collaborators
    $(document).on('click','#sendMessage',function(){
        var messageMyself = ''
        var caseId = $('[name = "case_id"]').val();
        var message_next = $('[name = "message_next"]').val();
        if(message_next == ''){
            alert("Please enter message.");
            return false;
        }
        var message_note = $('[name = "message_note"]').val();
        if(message_note == ''){
            alert("Can not send empty message.");
            return false;
        }
        if($("#message_cc_myself").is(":checked")){
            messageMyself = 'on'
        }
        $("#sendMessage").attr('disabled', 'disabled');
        $.ajax({
            url: baseUrl + "cases/message",
            type: "post",
            dataType: "json",
            data: {case_id:caseId,message_next:message_next,message_note:message_note,message_cc_myself:messageMyself,send_message:true},
            success:function(response){
                if(response.status == 'success'){
                    location.reload(true);
                }else{
                    $("#sendMessage").removeAttr('disabled');
                    alert("An error occurred while sending the message. Please try again.");
                }
            },
            error:function(e){
                $("#sendMessage").removeAttr('disabled');
                checkLogout(e.responseText);
                alert("An error occurred while sending the message. Please try again.");
            }
        });
    });

    //Filter thumbnail by series or images
    $('#filterThumbnail').change(function(){
        filterThumbnailAction(1);
    });

    $('#filterThumbnailBy').change(function(){
        // Create cookie to store thumbnail options selected
        var selectedThumbnail = $('#filterThumbnailBy').val();
        createCookie('selectedThumb', selectedThumbnail);

        if(window.location.href.indexOf('files/file_measure/') > -1) {
            var browserUrlParts = window.location.href.split('files/file_measure/');
            if(browserUrlParts.length > 1){
                var urlParts    = browserUrlParts[1].split('/');
                var groupId     = urlParts[0];
                var groupType   = urlParts[1];
                if($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != ''){
                    if(groupType == 0) {
                        filterThumbnailAction(0, 0, groupId, 0, 0, 0);
                    }else if(groupType == 1) {
                        filterThumbnailAction(0, 0, 0, groupId, 0, 0);
                    }else if(groupType == 2) {
                        filterThumbnailAction(0, 0, 0, 0, groupId, 0);
                    }
                }
            }
        }else if(window.location.href.indexOf('files/file_measure_view/') > -1) {
            var browserUrlParts = window.location.href.split('/');
            if(browserUrlParts.length > 1) {
                var groupId   = browserUrlParts[browserUrlParts.length - 2];
                var urlParts  = browserUrlParts[browserUrlParts.length - 1].split('?');
                var groupType = urlParts[0];
                if ($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != '') {
                    storePatientFilesToDirectory(groupId, groupType);
                    if (groupType == 0) {
                        filterThumbnailAction(0, 0, groupId, 0, 0, 0);
                    } else if (groupType == 1) {
                        filterThumbnailAction(0, 0, 0, groupId, 0 , 0);
                    } else if (groupType == 2) {
                        filterThumbnailAction(0, 0, 0, 0, groupId, 0);
                    }
                }
            }
        }else {
            filterThumbnailAction(0, 0, 0, 0, 0, 0);
        }
    });

    $('#imageInput').on('change', prepareUpload);
    $("#sm-image-upload-submit").click(function(){
        var UploadedImageLength = files.length;
        if(typeof(UploadedImageLength) == 'undefined' || UploadedImageLength < 1){
            alert("Please select file(s).");
            return false;
        }

        $('.upload_image_btn').hide();
        $("#imageInput").attr('disabled','disabled');
        $('.upload_image_progressbar').show();
        $('#tag').attr('readonly', true);
        $('#tag').css('cursor', 'not-allowed');

        var progressbox     = $('#progressbox');
        var progressbar     = $('#progressbar');
        var statustxt       = $('#statustxt');
        var completeImageCount = $("#countUploadedFile");

        for(var i=0;i < files.length;i++) {
            var fileType = (typeof(files[i].type) != 'undefined') ? files[i].type : '';
            var inValidInputFormat = 0;

           if(fileType != '' && fileType.indexOf("executable") >= 0){
                inValidInputFormat = 1;
           }else{
               var fileName = (typeof(files[i].name) != 'undefined') ? files[i].name : '';
               if (fileName.indexOf(".exe") >= 0 ){
                   inValidInputFormat = 1;
               }
           }

            if(inValidInputFormat == 1){
                alert("Please select valid image file format to upload.");
                $('.upload_image_btn').show();
                $('.upload_image_progressbar').hide();
                $('#tag').attr('readonly', false);
                $('#tag').css('cursor', 'text');
                return false;
            }
        }

        var caseID = $("[name = 'case_id']").val();
        var next = $("[name = 'next']").val();
        var tag = $(".sm-image-tags").val();
        statustxt.html("Uploaded files ("+0+"/"+UploadedImageLength+")");
        var count =0;
        var sortOrder =0;
        var callback = function(count){
            if(count < UploadedImageLength){
                UploadImageFile(callback,count);
            }else{
                location.reload(true);
            }
        };
        UploadImageFile(callback,count);
        function UploadImageFile(callback, count){
            var isFromMeasure = 0;
            var url = String(window.location);
            if(url.match("/files/image_measure/")!=null){
                isFromMeasure = 1;
            }else if(url.match("/files/measure_view/")!=null){
                isFromMeasure = 1;
            }

            sortOrder ++;
            var fileDataObject = new FormData();
            fileDataObject.append('0', files[count]);
            fileDataObject.append('case_id', caseID);
            fileDataObject.append('next', next);
            fileDataObject.append('tag', tag);
            fileDataObject.append('sort_order', sortOrder);
            fileDataObject.append('is_from_measure', isFromMeasure);

            $.ajax({
                type:'POST',
                url: baseUrl + "files/upload",
                data:fileDataObject,
                dataType:'json',
                cache:false,
                contentType: false,
                processData: false,
                success:function(response){
                    count = count+1;
                    var percentComplete = parseInt((count*100)/UploadedImageLength);
                    progressbar.width(percentComplete + '%'); //update progressbar percent complete
                    statustxt.html("Uploaded files ("+count+"/"+UploadedImageLength+")");
                    callback(count);
                },
                error:function(response){
                    checkLogout(response.responseText);
                }
            });
        }
    });

    if(window.location.href.indexOf('measure_view') > -1 || window.location.href.indexOf('image_measure') > -1) {
        filterThumbnailAction(0);
    }

    if(window.location.href.indexOf('cases/view') > -1 ) {
        showHideAddToCaseButton();

        getCaseSeriesIds();
        $('#createTemplateView').attr('disabled', true);
    }

    //Redirect to user on Surgimap App Url for download iOS app
    $('#btnDownloadSubmit').click(function(){
        setTimeout(function() {
            window.location = appLocation;
            //this is a callback if the app is not installed. Could direct to an app store or a website telling user how to get app
        },500);
        window.location.href = appLaunchUrl + 0;
    });

    //Close popup
    $('#btnDownloadContinue').click(function(){
        $('#downLoadModel .close').trigger('click');
    });

    //deselect the select all check box
    $("input[name=cases]").on('change', function(){
        if($("input[name=cases]:checked").length == 0 )
            $('.selectAll').attr('checked', false);
    });

    //deselect the select all check box
    $("input[name=contact]").on('change', function(){
        if($("input[name=contact]:checked").length == 0 )
            $('.selectAll').attr('checked', false);
    });

    if(isMeasurePage == 1){
        getImageList(1);
    }

    getUserFeatureList();

    $(".complete_action").on('change', function(){
        var elementId = $(this).attr('id');
        var firstIndex = elementId.indexOf('[');
        var lastIndex  = elementId.indexOf(']');
        var finalString = elementId.substr(firstIndex+1,lastIndex-1);
        var stringValPart = finalString.split('__');
        var vendorStringPart = stringValPart[1].split('_');
        var vendorName = (vendorStringPart.length >= 2) ? vendorStringPart[0] : '';

        if(vendorName != ''){
            var elementCompleteId = vendorName + 'Complete';
            if ($(this).is(':checked')) {
                $('#' + elementCompleteId).css('display', 'inline-block');
            }else{
                $('#' + elementCompleteId).css('display', 'none');
            }
        }
    });
    // return false when user click on disabled button
    $(".next_previous_button").click(function(){
        var redirectUrl = $(this).attr('href');
        if(redirectUrl == '#'){
            return false;
        }
    });

    //check if the case form is changed
    $('#form-case :input, #form-contacts :input, #form-profile :input').change(function(){
        form_change = true;
    });

    $('#form-case, #form-contacts, #form-profile').submit(function(){
       form_change = false;
    });

    $('#addImageLink, #attachmentSubmit, #deleteImagesButton, .del_attachment, #addMoreCollaborators, .removeCollaborator, ' +
        '#removeSelectedContacts, #sendMessage, #createTemplateView').on('click',function(){
        form_change = false;
    });

    $(window).bind('beforeunload', function() {
        var form = 'case';
        var url = $(location).attr('href');
        if((url.indexOf('contacts') > -1))form = 'contact';
        if((url.indexOf('profile') > -1))form = 'profile';

        if(form_change){
            return  'There are some unsaved changes in your current '+ form +'. Would you like to save those changes before leaving this page ?';
        }

    });

    //Enable/disable create template button
    $('#create_template_description').keyup(function(){
       var templateName = $('#create_template_description').val();
       if($.trim(templateName) != ''){
           $('#createTemplateView').attr('disabled', false);
       }else{
           $('#createTemplateView').attr('disabled', true);
       }
    });

    /**
    * Description  : Function to update patient details
    */
    $("#savePatientDetails").click(function(){
        var patientId        = $("#currentPatientId").val();
        var patientVersion   = $("#currentPatientVersion").val();
        var patientName      = $("#patientName").val();
        var patientPatientId = $("#patientPatientId").val();
        var patientEmail     = $("#patientEmail").val();
        var patientDicomId   = $("#currentPatientDicomId").val();
        var patientAgerange  = $("#currentPatientAgerange").val();
        var patientDiagnosis = $("#currentPatientDiagnosis").val();
        var patientComment   = $("#currentPatientComment").val();
        var patientImportdate= $("#currentPatientImportdate").val();
        var patientIsremoved = $("#currentPatientIsremoved").val();
        var patientOtherDicomId = $("#currentPatientOtherDicomId").val();
        var patientSex       = $('input[name=patientGender]:radio:checked').val();
        var patientdob       = $("#patientBirthDate").val();
        if($.trim(patientName) == ''){
            alert("Please enter patient name");
            $("#patientName").focus();
            return false;
        }
        if($.trim(patientPatientId) == ''){
            alert("Please enter patient Id");
            $("#patientPatientId").focus();
            return false;
        }
        //Email validation
        var emailFilter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if($.trim(patientEmail) != '' && !emailFilter.test(patientEmail)){
            alert("The email format is invalid.");
            $("#patientEmail").focus();
            return false;
        }

        $("#loadingImage").show();
        $.ajax({
            url: baseUrl + 'patients/update',
            type: "post",
            dataType: "json",
            data:{ id           : patientId,
                   version      : patientVersion,
                   name         : patientName,
                   patientId    : patientPatientId,
                   dateOfBirth  : patientdob,
                   dicomId      : patientDicomId,
                   ageRange     : patientAgerange,
                   diagnosis    : patientDiagnosis,
                   comment      : patientComment,
                   importedDate : patientImportdate,
                   is_removed   : patientIsremoved,
                   sex          : patientSex,
                   email        : patientEmail,
                   other_dicom_ids : patientOtherDicomId
                },
            success:function(response){
                $("#loadingImage").hide();
                location.reload(true);
            },
            error:function(e){
                checkLogout(e.responseText);
                $("#loadingImage").hide();
                /*alert("An error occurred while updating patient.Please try again.");*/
            }
        });
    });

    /**
    * Description  : Function to update study details
    */
    $("#saveStudyDetails").click(function(){
        //Patient Fields
        var patientId        = $("#currentPatientId").val();
        var patientVersion   = $("#currentPatientVersion").val();
        var patientName      = $("#studyPatientName").val();
        var patientPatientId = $("#studtPatientId").val();
        var patientEmail     = $("#studyPatientEmail").val();
        var patientDicomId   = $("#currentPatientDicomId").val();
        var patientAgerange  = $("#currentPatientAgerange").val();
        var patientDiagnosis = $("#currentPatientDiagnosis").val();
        var patientComment   = $("#currentPatientComment").val();
        var patientImportdate= $("#currentPatientImportdate").val();
        var patientIsremoved = $("#currentPatientIsremoved").val();
        var patientOtherDicomId = $("#currentPatientOtherDicomId").val();
        var patientSex       = $('input[name=studyPatientGender]:radio:checked').val();
        var patientdob       = $("#studyPatientBirthDate").val();

        //Study Fields
        var studyId          = $("#currentStudyId").val();
        var studyName        = $("#studyName").val();
        var studyInstanceId  = $("#studyInstanceId").val();
        var studyDate        = $("#studyDate").val();
        var studyComment     = $("#studyComment").val();
        var studyDiagnosis   = $("#studyDiagnosis").val();

        var currentStudyCaseId      = $("#currentStudyCaseId").val();
        var currentStudyStudyId     = $("#currentStudyStudyId").val();
        var currentStudyDicomId     = $("#currentStudyDicomId").val();
        var currentStudyPatientId   = $("#currentStudyPatientId").val();
        var currentStudyPhysician   = $("#currentStudyPhysician").val();
        var currentStudyOrientation = $("#currentStudyOrientation").val();
        var currentStudyImportdate  = $("#currentStudyImportdate").val();
        var currentStudyIsremoved   = $("#currentStudyIsremoved").val();
        var currentStudyVersion   = $("#currentStudyVersion").val();


        if($.trim(patientName) == ''){
            alert("Please enter patient name");
            $("#patientName").focus();
            return false;
        }

        //Email validation
        var emailFilter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if($.trim(patientEmail) != '' && !emailFilter.test(patientEmail)){
            alert("The email format is invalid.");
            $("#studyPatientEmail").focus();
            return false;
        }

        $("#loadingImage").show();
        $.ajax({
            url: baseUrl + 'patients/update_study',
            type: "post",
            dataType: "json",
            data:{ id           : patientId,         version      : patientVersion, name : patientName,
                   patientId    : patientPatientId,  dateOfBirth  : patientdob,
                   dicomId      : patientDicomId,    ageRange     : patientAgerange,
                   diagnosis    : patientDiagnosis,  comment      : patientComment,
                   importedDate : patientImportdate, is_removed   : patientIsremoved,
                   sex          : patientSex,        email        : patientEmail,
                   studyId      : studyId,           studyName    : studyName,
                   studyInstanceId : studyInstanceId, studyDate : studyDate,currentStudyVersion: currentStudyVersion,
                   studyComment : studyComment, studyDiagnosis : studyDiagnosis,
                   currentStudyCaseId :currentStudyCaseId, currentStudyStudyId : currentStudyStudyId,
                   currentStudyDicomId  :currentStudyDicomId, currentStudyPatientId : currentStudyPatientId,
                   currentStudyPhysician:currentStudyPhysician, currentStudyOrientation : currentStudyOrientation,
                   currentStudyImportdate  :currentStudyImportdate, currentStudyIsremoved : currentStudyIsremoved,
                   other_dicom_ids : patientOtherDicomId
               },
            success:function(response){
                $("#loadingImage").hide();
                location.reload(true);
            },
            error:function(e){
                checkLogout(e.responseText);
                $("#loadingImage").hide();
                /*alert("An error occurred while updating patient.Please try again.");*/
            }
        });
    });

    /**
    * Description  : Function to update series details
    */
    $("#saveSeriesDetails").click(function(){
        //Patient Fields
        var patientId        = $("#currentPatientId").val();
        var patientVersion   = $("#currentPatientVersion").val();
        var patientName      = $("#seriesPatientName").val();
        var patientPatientId = $("#seriesPatientId").val();
        var patientEmail     = $("#seriesPatientEmail").val();
        var patientDicomId   = $("#currentPatientDicomId").val();
        var patientAgerange  = $("#currentPatientAgerange").val();
        var patientDiagnosis = $("#currentPatientDiagnosis").val();
        var patientComment   = $("#currentPatientComment").val();
        var patientImportdate= $("#currentPatientImportdate").val();
        var patientIsremoved = $("#currentPatientIsremoved").val();
        var patientOtherDicomId = $("#currentPatientOtherDicomId").val();
        var patientSex       = $('input[name=seriesPatientGender]:radio:checked').val();
        var patientdob       = $("#seriesPatientBirthDate").val();

        //Study Fields
        var studyId          = $("#currentStudyId").val();
        var studyName        = $("#seriesStudyName").val();
        var studyInstanceId  = $("#seriesStudyInstanceId").val();
        var studyDate        = $("#seriesStudyDate").val();
        var studyComment     = $("#seriesStudyComment").val();
        var studyDiagnosis   = $("#seriesStudyDiagnosis").val();

        var currentStudyCaseId      = $("#currentStudyCaseId").val();
        var currentStudyStudyId     = $("#currentStudyStudyId").val();
        var currentStudyDicomId     = $("#currentStudyDicomId").val();
        var currentStudyPatientId   = $("#currentStudyPatientId").val();
        var currentStudyPhysician   = $("#currentStudyPhysician").val();
        var currentStudyOrientation = $("#currentStudyOrientation").val();
        var currentStudyImportdate  = $("#currentStudyImportdate").val();
        var currentStudyIsremoved   = $("#currentStudyIsremoved").val();
        var currentStudyVersion     = $("#currentStudyVersion").val();

        //Series Fields
        var seriesId          = $("#currentSeriesId").val();
        var seriesName        = $("#seriesName").val();
        var seriesInstanceId  = $("#seriesInstanceId").val();
        var modality          = $("select[name=modality] option:selected" ).val();

        var currentSeriesDate        = $("#currentSeriesDate").val();
        var currentSeriesComment     = $("#currentSeriesComment").val();
        var currentSeriesSortorder   = $("#currentSeriesSortorder").val();
        var currentSeriesDicomId     = $("#currentSeriesDicomId").val();
        var currentSeriesImportdate  = $("#currentSeriesImportdate").val();
        var currentSeriesIsremoved   = $("#currentSeriesIsremoved").val();

        if($.trim(patientName) == ''){
            alert("Please enter patient name");
            $("#patientName").focus();
            return false;
        }

        //Email validation
        var emailFilter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        if($.trim(patientEmail) != '' && !emailFilter.test(patientEmail)){
            alert("The email format is invalid.");
            $("#seriesPatientEmail").focus();
            return false;
        }

        $("#loadingImage").show();
        $.ajax({
            url: baseUrl + 'patients/update_series',
            type: "post",
            dataType: "json",
            data:{ id           : patientId,         version      : patientVersion, name : patientName,
                   patientId    : patientPatientId,  dateOfBirth  : patientdob,
                   dicomId      : patientDicomId,    ageRange     : patientAgerange,
                   diagnosis    : patientDiagnosis,  comment      : patientComment,
                   importedDate : patientImportdate, is_removed   : patientIsremoved,
                   sex          : patientSex,        email        : patientEmail,
                   studyId      : studyId,           studyName    : studyName,
                   studyInstanceId : studyInstanceId, studyDate : studyDate,currentStudyVersion: currentStudyVersion,
                   studyComment : studyComment, studyDiagnosis : studyDiagnosis,
                   currentStudyCaseId :currentStudyCaseId, currentStudyStudyId : currentStudyStudyId,
                   currentStudyDicomId  :currentStudyDicomId, currentStudyPatientId : currentStudyPatientId,
                   currentStudyPhysician:currentStudyPhysician, currentStudyOrientation : currentStudyOrientation,
                   currentStudyImportdate  :currentStudyImportdate, currentStudyIsremoved : currentStudyIsremoved,
                   other_dicom_ids : patientOtherDicomId, seriesId : seriesId, seriesName : seriesName,
                   seriesInstanceId : seriesInstanceId, currentSeriesDate : currentSeriesDate,
                   currentSeriesComment : currentSeriesComment, modality : modality,
                   currentSeriesSortorder : currentSeriesSortorder, currentSeriesDicomId : currentSeriesDicomId,
                   currentSeriesImportdate : currentSeriesImportdate, currentSeriesIsremoved : currentSeriesIsremoved
               },
            success:function(response){
                $("#loadingImage").hide();
                location.reload(true);
            },
            error:function(e){
                checkLogout(e.responseText);
                $("#loadingImage").hide();
                /*alert("An error occurred while updating patient.Please try again.");*/
            }
        });
    });

    /**
    * Description  : Function to delete patient
    */
    $("#deletePatient").click(function(){
        var patientId = $("#currentPatientId").val();
        var patientVersion = $("#currentPatientVersion").val();
        $("#deletePatient").attr('disabled', 'disabled');
        if((typeof(patientId) != 'undefined') && patientId > 0 && (typeof(patientVersion) != 'undefined') && patientVersion > 0){
            $("#loadingImage").show();
            $.ajax({
                url: baseUrl + 'patients/delete',
                type: "post",
                dataType: "json",
                data:{ selected_id : patientId,
                       version     : patientVersion
                    },
                success:function(response){
                    $("#loadingImage").hide();
                    location.reload(true);
                },
                error:function(e){
                    checkLogout(e.responseText);
                    $("#loadingImage").hide();
                    /*alert("An error occurred while deleteing patient.Please try again.");*/
                }
            });
        }
    });

    /**
    * Description  : Function to delete study
    */
    $("#deleteStudy").click(function(){
        var studyId   = $("#currentStudyId").val();
        var patientId = $("#study_" + studyId).parents().attr('class');
        if(typeof(patientId) != 'undefined' && patientId != ''){
            var length = patientId.length;
            var indexOf = patientId.indexOf('_');
            patientId = patientId.substr(indexOf + 1, length - (indexOf + 1));
        }
        $("#deleteStudy").attr('disabled', 'disabled');
        $("#loadingImage").show();
        $.ajax({
            type     : "post",
            url      : baseUrl + "patients/delete_study",
            data     : { selected_id : studyId, patient_id : patientId },
            dataType : 'json',
            success:function(response){
                $("#loadingImage").hide();
                $("#deleteStudy").removeAttr('disabled');
                location.reload(true);
            },
            error:function(e){
                $("#loadingImage").hide();
                $("#deleteStudy").removeAttr('disabled');
                checkLogout(e.responseText);
            }
        });
    });

    /**
    * Description  : Function to delete series
    */
    $("#deleteSeries").click(function(){
        var seriesId   = $("#currentSeriesId").val();
        $("#deleteSeries").attr('disabled', 'disabled');
        $("#loadingImage").show();
        $.ajax({
            type     : "post",
            url      : baseUrl + "patients/delete_series",
            data     : { selected_id : seriesId },
            dataType : 'json',
            success:function(response){
                $("#loadingImage").hide();
                $("#deleteSeries").removeAttr('disabled');
                location.reload(true);
            },
            error:function(e){
                $("#loadingImage").hide();
                $("#deleteSeries").removeAttr('disabled');
                checkLogout(e.responseText);
            }
        });
    });

    /**
    * Description  : Function to delete case
    */
    $("#deleteCase").click(function(){
        var casesSelectedID = [];
        var casesId= $("#currentCaseId").val();
        var patientId = $("#case_" + casesId).parents().attr('class');
        if(typeof(patientId) != 'undefined' && patientId != ''){
            var length = patientId.length;
            var indexOf = patientId.indexOf('_');
            patientId = patientId.substr(indexOf + 1, length - (indexOf + 1));
        }
        casesSelectedID.push(casesId);
        $("#deleteCase").attr('disabled', 'disabled');
        $("#loadingImage").show();
        $.ajax({
            url: baseUrl + "cases/remove",
            type: "get",
            dataType: "json",
            data:{selected_ids: casesSelectedID, is_from_patient_list: 1, patient_id : patientId},
            success:function(response){
                $("#loadingImage").hide();
                $("#deleteCase").removeAttr('disabled');
                location.reload(true);
            },
            error:function(e){
                $("#loadingImage").hide();
                $("#deleteCase").removeAttr('disabled');
                checkLogout(e.responseText);
            }
        });
    });

    /**
    * Description  : Function to disable select existing case button and open the create new case modal body
    */
    $("#createNewCase").click(function(){
        $("#createPatientCase").text("Create");
        $("#createNewCase").attr('disabled', 'disabled');
        $("#selectExistingCase").removeAttr('disabled');
        $("#selectExistingCaseModal").hide();
        $("#createNewCaseModal").show();
    });

    /**
    * Description  : Function to disable create new case button and open the select existing cases modal body
    */
    $("#selectExistingCase").click(function(){
        $('#selectedCase').val(0);
        $('#selectedCase').trigger('change');
        $("#createPatientCase").text("Select");
        $("#selectExistingCase").attr('disabled', 'disabled');
        $("#createNewCase").removeAttr('disabled');
        $("#createNewCaseModal").hide();
        $("#selectExistingCaseModal").show();
    });

    /**
    * Description  : Function to enable/disable date, time and duration on create case modal body
    */
    $("#caseScheduled").click(function(){
        if($("#caseScheduled").is(':checked')){
            $("#caseScheduled").val(1);
            $(".date_time_duration").show();
        }else{
            $("#caseScheduled").val(0);
            $(".date_time_duration").hide();
        }
    });

    /**
     * Description  : Function to update patient case data according to template on create case modal body
     */
    $( "#templateName" ).change(function () {
        var templateId = "";
        templateId = $("#templateName option:selected" ).val();
        if(templateId > 0){
            if(typeof(templateDetails) != 'undefined' && templateDetails !== ''){
                $.each( templateDetails, function( key, obj ) {
                    if(obj.id == templateId){
                        var surgeonName = obj.surgeon;
                        $("#caseHospital").val(obj.hospital);
                        if(typeof(allSurgeonEmail) != 'undefined' && allSurgeonEmail !== ''){
                            $.each( allSurgeonEmail, function( name, email) {
                                if(name == surgeonName){
                                    $("#surgeonList").val(email);

                                    //Store current selected surgeon name into cookie
                                    createCookie('selectedSurgeonName', email, 1);
                                }
                            });
                        }
                    }
                });
            }
        }
    });

    /**
     * Description  : Function to maintain state of previously selected surgeon name
     */
    $( "#surgeonList" ).change(function () {
        var surgeonName =  $("#surgeonList option:selected" ).val();
        if(typeof(surgeonName) != 'undefined' && surgeonName != '') {
            createCookie('selectedSurgeonName', surgeonName, 1);
        }
    });

    /**
     * Description  : Function to get case list on select existing case modal
     */
    $("#selectedCase").change(function () {
        var selectedId = "";
        var patientId = $("#currentPatientId").val();
        selectedId = $("#selectedCase option:selected" ).val();
        if(selectedId > 0 && selectedId == 1){
            $("#selectedExistingCaseId").val('');
            $("#LinkedPatientList").html('');
            $("#loadingImage").show();
            $.ajax({
                url: baseUrl + "patients/patient_case_list_html",
                type: "get",
                dataType: "json",
                data:{patient_id : patientId},
                success:function(response){
                    $("#loadingImage").hide();
                    if(response != ''){
                        $("#existingCasesListBody").html(response);
                    }
                    if($("#existingCasesList").html() == ''){
                        $("#existingCasesList").html("<tr><td colspan='8'>Case(s) not found.</td></tr>");
                    }
                },
                error:function(e){
                    $("#loadingImage").hide();
                    //checkLogout(e.responseText);
                }
            });
        }else if(selectedId > 0 && selectedId == 2){
            $("#selectedExistingCaseId").val('');
            $("#existingCasesListBody").html('');
            $("#loadingImage").show();
            $.ajax({
                url: baseUrl + "patients/linked_patient_ids",
                type: "get",
                dataType: "json",
                data:{patient_id : patientId},
                success:function(response){
                    $("#loadingImage").hide();
                    $('#LinkedPatientList').html(response.data);
                    prepareList(1);
                    getAndUpdatePatientDetail(1);
                },
                error:function(e){
                    $("#loadingImage").hide();
                    //checkLogout(e.responseText);
                }
            });
        }else{
            $("#selectedExistingCaseId").val('');
            $("#existingCasesListBody").html('');
            $("#LinkedPatientList").html('');
        }
    });

    /**
    * Description  : Function to create case on patient context menu
    */
    $( "#createPatientCase" ).click(function () {
        if($("#createPatientCase").text() == "Select"){
            var caseId = $("#selectedExistingCaseId").val();
            if(typeof(caseId) != 'undefined' && caseId > 0){
                var patientId = $("#linkedPatient_" + caseId).parent().attr('class');
                if(typeof(patientId) != 'undefined' && patientId > 0){
                    var length = patientId.length;
                    var index = patientId.indexOf('_');
                    patientId = patientId.substr(index+1, length-1);
                    $("#currentPatientId").val(patientId);
                }
                createCaseFromSelectedExistingCase(caseId);
            }else{
                alert("Please select a case.");
            }
            return false;
        }
        var templateId = $("#templateName option:selected" ).val();
        var caseDescription = $("#caseDescription").val();
        var patientName = $("#casepatientName").val();
        var surgeonName = $("#surgeonList option:selected" ).text();
        var surgeonEmail= $("#surgeonList option:selected" ).val();
        var hospital = $("#caseHospital").val();
        var caseduration = $("#caseDuration option:selected" ).val();
        var casedate = $("#caseDate").val();
        var caseScheduled = $("#caseScheduled").val();
        var casedatetime = $("#caseTime option:selected" ).val();
        var patientId = $("#currentPatientId").val();
        var studyId = $("#currentStudyId").val();
        var seriesId = $("#currentSeriesId").val();
        if(typeof(studyId) == 'undefined' || studyId == '' || studyId < 1){
            studyId = 0;
        }

        if(typeof(seriesId) == 'undefined' || seriesId == '' || seriesId < 1){
            seriesId = 0;
        }

        if($.trim(caseDescription) == ''){
            alert("Please enter case description.");
            $("#caseDescription").focus();
            return false;
        }

        $("#createPatientCase").attr('disabled', 'disabled');
        $("#loadingImage").show();
        $.ajax({
            url: baseUrl + "patients/create_case",
            type: "post",
            dataType: "json",
            data:{case_template_id: templateId,
                case_description: caseDescription,
                case_patient_name: patientName,
                case_surgeon_name: surgeonName,
                case_surgeon_email: surgeonEmail,
                case_hospital: hospital,
                case_duration_seconds: caseduration,
                case_date_date: casedate,
                case_date_time: casedatetime,
                case_scheduled: caseScheduled,
                patient_id: patientId,
                study_id: studyId,
                series_id : seriesId
            },
            success:function(response){
                $("#loadingImage").hide();
                $("#createPatientCase").removeAttr('disabled');
                if(response.status == 'Success'){
                    window.location.href = baseUrl + "cases/view/" + response.caseid;
                }else{
                    if(typeof(response.message) != 'undefined' && response.message != ''){
                        alert(response.message);
                    }
                }
            },
            error:function(e){
                $("#loadingImage").hide();
                $("#createPatientCase").removeAttr('disabled');
                checkLogout(e.responseText);
            }
        });
    });

    /**
     * Description  : Function to apply product settings
     */
    $("#applyProductSettings" ).click(function () {
        var userId      = $("input[name=user_id]").val();
        var productName = $("#user_products").val();
        userId          = (typeof(userId) != 'undefined' && userId > 0) ? userId : 0;
        productName     = (typeof(productName) != 'undefined' && productName != '') ? productName : '';

        if(productName == ''){
            alert("Please select Product.");
            return false;
        }

        ajaxCallForProductSettings('user/apply_product_settings', productName, userId);

    });

    /**
     * Description  : Function to create product settings
     */
    $("#createProduct" ).click(function () {
        var settingsData      = $("#settingsData").val();
        var productColumnName = $("select[name=productColumnName]").val();
        settingsData          = (typeof(settingsData) != 'undefined' && settingsData != '') ? $.trim(settingsData) : '';
        productColumnName     = (typeof(productColumnName) != 'undefined' && productColumnName != '') ? productColumnName : '';

        if(productColumnName == ''){
            alert("Please select Product Name.");
            return false;
        }

        if(settingsData == ''){
            alert("Please enter Setting Data.");
            return false;
        }

        ajaxCallForProductSettings('user/create_product_settings', productColumnName, '', settingsData);

    });

    /**
     * Description  : Function to modify product settings
     */
    $("#modifyProduct" ).click(function () {
        var settingsData      = $("#updateSettingsData").val();
        var productColumnName = $("select[name=updateProductColumnName]").val();
        settingsData          = (typeof(settingsData) != 'undefined' && settingsData != '') ? $.trim(settingsData) : '';
        productColumnName     = (typeof(productColumnName) != 'undefined' && productColumnName != '') ? productColumnName : '';
		previousSettingsData  = (typeof(previousSettingsData) != 'undefined' && previousSettingsData != '') ? previousSettingsData : '';

        if(productColumnName == ''){
            alert("Please select Product Name.");
            return false;
        }

        if(settingsData == ''){
            alert("Please enter Setting Data.");
            return false;
        }

        if(previousSettingsData == settingsData){
            alert('Product Setting was not changed.');
            return false;
        }

        ajaxCallForProductSettings('user/modify_product_settings', productColumnName, '', settingsData);

    });

    /**
     * Description  : Function to delete product settings
     */
    $("#deleteProduct" ).click(function () {
        var productColumnName = $("#currentProductName").val();
        productColumnName     = (typeof(productColumnName) != 'undefined' && productColumnName != '') ? productColumnName : '';

        if(productColumnName == ''){
            alert("Please select Product.");
            return false;
        }

        ajaxCallForProductSettings('user/remove_product_settings', productColumnName, '', '');

    });

    // To set k2m cage dimensions, medicrea Rod generator and values pop-up dragable
    $(function() {
        $("#k2mDimensions").draggable({
            containment: $('body')
        });

        $("#medicreaRodConfirmModal").draggable({
            containment: $('body')
        });

        $("#medicreaRodModal").draggable({
            containment: $('body')
        });

    });

    /**
     * Description  : To show the k2m cage posterior family dimensions
     */
    $("#posteriorFamily").change(function(){
        var posteriorFamily = typeof($(this).val()) != 'undefined' ? $(this).val() : '';

        //For tabs
        $("#ANTabs").hide();
        $("#ANObliqueTabs").hide();
        $("#TLIFIITabs").hide();
        $("#ANLordoticTabs").hide();
        $("#ANLordotic-ObliqueTabs").hide();

        //For images
        $("#ANImages").hide();
        $("#ANObliqueImages").hide();
        $("#TLIFIIImages").hide();
        $("#ANLordoticImages").hide();
        $("#ANLordotic-ObliqueImages").hide();

        switch (posteriorFamily){
            case 'AN' :{
                //For tabs
                $("#ANTabs").show();

                //For images
                $("#ANImages").show();

                $("#ANTabButton").trigger('click');
            }
                break;
            case 'AN Oblique':{
                //For tabs
                $("#ANObliqueTabs").show();

                //For images
                $("#ANObliqueImages").show();

                $("#ANObliqueButton").trigger('click');
            }
                break;
            case 'TLIF II' :{
                //For tabs
                $("#TLIFIITabs").show();

                //For images
                $("#TLIFIIImages").show();

                $("#TLIFIIButton").trigger('click');
            }
                break;
            case 'AN Lordotic' :{
                //For tabs
                $("#ANLordoticTabs").show();

                //For images
                $("#ANLordoticImages").show();

                $("#ANLordoticButton").trigger('click');
            }
                break;
            case 'AN Lordotic-Oblique' :{
                //For tabs
                $("#ANLordotic-ObliqueTabs").show();

                //For images
                $("#ANLordotic-ObliqueImages").show();

                $("#ANLordotic-ObliqueTabButton").trigger('click');
            }
                break;
            default :
                //For tabs
                $("#ANTabs").show();

                //For images
                $("#ANImages").show();

                $("#ANTabButton").trigger('click');
                break;
        }
    });

    /**
     * Description  : To show the k2m cage anterior family dimensions
     */
    $("#anteriorFamily").change(function(){
        var anteriorFamily = typeof($(this).val()) != 'undefined' ? $(this).val() : '';

        //For tabs
        $("#ALEUTIANCervicalTabs").hide();
        $("#ALEUTIANALIFTabs").hide();
        $("#CHESAPEAKECervical-TiTabs").hide();
        $("#CHESAPEAKEAnterior-LumbarTabs").hide();
        $("#VIKOSTabs").hide();

        //For images
        $("#ALEUTIANCervicalImages").hide();
        $("#ALEUTIANALIFImages").hide();
        $("#CHESAPEAKECervical-TiImages").hide();
        $("#CHESAPEAKEAnterior-LumbarImages").hide();
        $("#VIKOSImages").hide();

        switch (anteriorFamily){
            case 'ALEUTIAN Cervical' :{
                //For tabs
                $("#ALEUTIANCervicalTabs").show();

                //For images
                $("#ALEUTIANCervicalImages").show();

                $("#ALEUTIANCervicalTabButton").trigger('click');
            }
                break;
            case 'ALEUTIAN ALIF':{
                //For tabs
                $("#ALEUTIANALIFTabs").show();

                //For images
                $("#ALEUTIANALIFImages").show();

                $("#ALEUTIANALIFTabButton").trigger('click');
            }
                break;
            case 'CHESAPEAKE Cervical-Ti' :{
                //For tabs
                $("#CHESAPEAKECervical-TiTabs").show();

                //For images
                $("#CHESAPEAKECervical-TiImages").show();

                $("#CHESAPEAKECervical-TiTabButton").trigger('click');
            }
                break;
            case 'CHESAPEAKE Anterior-Lumbar' :{
                //For tabs
                $("#CHESAPEAKEAnterior-LumbarTabs").show();

                //For images
                $("#CHESAPEAKEAnterior-LumbarImages").show();

                $("#CHESAPEAKEAnterior-LumbarTabButton").trigger('click');
            }
                break;
            case 'VIKOS' :{
                //For tabs
                $("#VIKOSTabs").show();

                //For images
                $("#VIKOSImages").show();

                $("#VIKOSTabButton").trigger('click');
            }
                break;
            default :
                //For tabs
                $("#ALEUTIANCervicalTabs").show();

                //For images
                $("#ALEUTIANCervicalImages").show();

                $("#ALEUTIANCervicalTabButton").trigger('click');
                break;
        }
    });

    /**
     * Description  : To show the k2m cage lateral family dimensions
     */
    $("#lateralFamily").change(function(){
        var lateralFamily = typeof($(this).val()) != 'undefined' ? $(this).val() : '';
        switch (lateralFamily){
            case 'Lateral' :{
                $("#LateralTabs").show();
                $("#LateralTabButton").trigger('click');
            }
                break;
            default :
                $("#LateralTabs").show();
                $("#LateralTabButton").trigger('click');
                break;
        }
    });

});

/**
* Description  : Function to update case details
*/
function updateCaseDetails(data){
    $('#calendar-details-description').text(data.description);
    $('#calendar-details-patient-name').text(data.patient_name);
    $('#calendar-details-surgeon-name').text(data.surgeon_name);
    $('#calendar-details-hospital').text(data.hospital);
    $('#calendar-details-date').text(data.date);
    $('#calendar-details-duration').text(data.duration);
    var module_text = data.module;
}

/**
* Description  : Function to prepare upload files
*/
function prepareUpload(event){
    files = event.target.files;
}

/**
 * Created by   : Aloha Technology
 * Created on   : 24 April, 2014
 * Description  : Function to create a cookie
 * @param name  : Name of cookie
 * @param value : Cookie value
 * @param days  : Expire day(s)
 */
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

/**
 * Created by   : Aloha Technology
 * Created on   : 24 April, 2014
 * Description  : Function to read a cookie by name
 * @param name  : Name of cookie
 */
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/**
 * Created by   : Aloha Technology
 * Created on   : 24 April, 2014
 * Description  : Function to erase cookie by name
 * @param name  : Name of cookie
 */
function eraseCookie(name) {
    createCookie(name,"",-1);
}

/**
 * Created by   : Aloha Technology
 * Created on   : 5 May, 2014
 * Description  : Function to search case
 * @param searchText  : search string
 */
function searchCase(searchText){
    $('.alert').hide();
    var casesCount = $(".casesCount").val();
    $('#caseListLoading').show();
    $.ajax({
        type    : "GET",
        url     : baseUrl + 'cases',
        cache   : true,
        data    : {
            search_text         : searchText,
            isRequestFromAjax   : 1
        }
    }).done(function( response ) {
            checkLogout(response);
            $('#caseListLoading').hide();
            $('#caseListSection').html(response);
            initializeCheckboxMenu();
            $(".checkbox_button").removeClass('hide');
            openCaseView();
      }).fail(function() {
           log('Error in searchCase');
        });
}

/**
* Description  : Function to open case view
*/
function openCaseView(){
    $('#casesList tr td:not(:first-child)').click(function () {
        var CaseID = $(this).parent().attr('caseID');
        window.location.href = baseUrl + 'cases/view/'+CaseID;
    });
}

/**
 * Created by   : Aloha Technology
 * Created on   : 10 July, 2014
 * Description  : Function to search user
 * @param searchUserText  : search string
 */
function searchUser(searchText){
    var casesCount = $(".casesCount").val();
    if(casesCount == 0){
        alert("Case List is empty.");
        return false;
    }
    $('#userListLoading').removeClass('loading');
    $.ajax({
        type    : "GET",
        url     : baseUrl + 'admin/user',
        cache   : true,
        data    : {
            search_text         : searchText,
            isRequestFromAjax   : 1
        }
    }).done(function( response ) {
            checkLogout(response);
            $('#userListLoading').addClass('loading');;
            $('#userListSection').html(response);
            $(".checkbox_button").removeClass('hide');
      }).fail(function() {
            log('Error in searchUser');
        });
}

/**
 * Created by   : Aloha Technology
 * Created on   : 27 Aug, 2014
 * Description  : Function to search contact
 * @param searchContactText  : search string
 */
function searchContact(searchText){
    $('.alert').hide();
    $('#contactListLoading').removeClass('loading');
    $.ajax({
        type    : "GET",
        url     : baseUrl + 'contacts',
        cache   : false,
        data    : {
            search_text         : searchText,
            isRequestFromAjax   : 1
        }
    }).done(function( response ) {
            checkLogout(response);
            $('#contactListLoading').addClass('loading');;
            $('#contactListSection').html(response);
            implementCheckBoxWithContact();
            $(".checkbox_button").removeClass('hide');
    }).fail(function() {
            log('Error in searchContact');
    });
}

/**
 * Created by   : Aloha Technology
 * Created on   : 16 Sept, 2014
 * Description  : Function to search patient
 * @param searchText  : search string
 */
function searchPatient(searchText){
    $('.alert').hide();
    $('#patientListLoading').show();
    $.ajax({
        type    : "GET",
        url     : baseUrl + 'patients',
        cache   : false,
        data    : {
            search_text         : searchText,
            isRequestFromAjax   : 1
        }
    }).done(function( response ) {
            checkLogout(response);
            $('#patientListLoading').hide();
            $('#patientList').html(response);
            prepareList();

            getAndUpdatePatientDetail();

            $('#caseThumbnail').html('');
            $('#selectedItemName').html('');
            $('#filterThumbnail').attr('disabled', true);

		    if(isLtIE9 == 1){
		        doResponsivescreenForltIE9();
		    }

    }).fail(function() {
            log('Error in searchPatient');
    });
}

/**
 * Function to initialize multi-select row with cases
 *
 * User can remove cases
 * User can share cases
 */
function initializeCheckboxMenu(){
    $('div.menuSelectAll').checkboxMenu({
        menuItemClick: function(text, count) {
            var casesAvailable = [];
            $("#casesList input:checkbox").map(function(){
                casesAvailable.push($(this).val());
            });

            if(casesAvailable.length == 1){
                alert('Case List is empty.');
                return false;
            }

            if(count > 0){
                var casesSelectedID = [];
                $("#casesList input:checkbox:checked").map(function(){
                    casesSelectedID.push($(this).val());
                });

                if(casesSelectedID.length == 0){
                    alert('Please select to '+text+'.');
                    return false;
                }

                switch(text){
                    case 'Remove Cases':
                        $('body').click();

                        var confirmMessagePart = (casesSelectedID.length > 2) ? 'these cases' : 'this Case';
                        var userAction =  confirm('Are you sure you want to remove '+ confirmMessagePart +'?');
                        if(userAction){
                            casesSelectedID.shift();
                            jQuery.ajax({
                                url: baseUrl + "cases/remove",
                                type: "get",
                                dataType: "json",
                                data:{selected_ids:casesSelectedID},
                                success:function(response){
                                if(response.status == 'Success'){
                                    location.reload(true);
                                }else{
                                    alert("An error occurred while removing these cases. Please try again.");
                                }

                                },
                                error:function(){
                                    alert("An error occurred while removing these cases. Please try again.");
                                }
                             });

                        }
                        break;
                    case 'Share Cases':
                        var shareContactList = $(".shareContactList").val();
                        if(shareContactList == 0){
                            alert('Contact list is empty.');
                            $('body').click();
                            return false;
                        }
                        $('#shareCasesContacts').find('input[type=checkbox]:checked').removeAttr('checked');
                        $('#shareCases').click();
                        break;
                    case 'Remove Collaborators':
                        var shareContactList = $(".shareContactList").val();
                        if(shareContactList == 0){
                            alert('Contact list is empty.');
                            $('body').click();
                            return false;
                        }
                        $('#shareCasesContacts').find('input[type=checkbox]:checked').removeAttr('checked');
                        $('#removeCollaborators').click();
                        break;
                }
            }else {
                alert('Please select to '+text + '.');
            }
        }
    });
}

/**
* Description  : Function to update calendar page result details
*/
function updateCalendarPageResult(){
    var noCache = Date();
    $.getJSON('calendar/unscheduled-cases.json', { "noCache": noCache },function(ret) {
        var i = 0;
        $('#calendar-unscheduled-cases').html('');
        $('#calendar-no-unscheduled-cases-label').toggle(ret.length === 0);
        var disabled = false;
        var cursor = 'pointer';
        for (i = 0; i < ret.length; i++) {
            var event   = ret[i],
            data        = event.data;
            disabled    = (typeof(event.editable) != 'undefined' && event.editable) ? false : true;
            cursor      = (typeof(event.editable) != 'undefined' && event.editable) ? 'pointer' : 'text';

            var linkText = data.description + ': ' + data.surgeon_name + " - " + data.patient_name;
            var tempUrl=String(window.location);
            if(tempUrl.match("is_print")!=null){

                var link = $('<a style="cursor: default;" class="label label-info unscheduled_case_text"></a>')
                .text(linkText)
                .appendTo('#calendar-unscheduled-cases');

            }else{
            var link = $('<a style="cursor: '+ cursor +';" title="'+ linkText +'" class="label label-info unscheduled_case_text"></a>')
                .attr('href', data.url)
                .text(linkText)
                .data('event', event)
                .draggable({
                    revert          : true,
                    revertDuration  : 0,
                    zIndex          : 999,
                    disabled        : disabled,
                    containment     : "window"
                })
                .mouseover(function (mouseOverEvent) {
                    var data = $(this).data('event').data;
                    $(document).trigger('calendar.details', [data]);
                    return false;
                })
                .appendTo('#calendar-unscheduled-cases');
            }
        }
    });

    $.ajax({
        url: baseUrl + "calendar/update_calendar_views",
        type: "GET",
        dataType:'json',
        cache:false,
        success:function(response){
            checkLogout(response);

            $("#calenderFormResult").html(response.add_case_button);
            updateCaseDetails(response.case_data_value);
        },
        error:function(){
            /*  alert("There is some problem please try again.");*/
        }

    });

    $.ajax({
        url: baseUrl + "calendar/update_calendar_summary_result",
        type: "GET",
        cache:false,
        success:function(response){
            checkLogout(response);

            $("#updateCaseSummary").removeClass('row');
            $("#updateCaseSummary").html('').html(response);
            if(loadCalendarAPI){
                loadCalendarApiResult()
            }
        },
        error:function(){
            /*alert("There is some problem please try again.");*/
        }

    });
    $("#loadCalendarViewFlag").val('');
}

/**
 * Load calendar result with api result
 */
function loadCalendarApiResult(){
    loadCalendarAPI = false;
    $.ajax({
        url: baseUrl + 'calendar/update-calendar-result.json',
        type: "get",
        dataType: "json",
        success:function(response){
            $('#calendar').fullCalendar( 'refetchEvents' );
             updateCalendarPageResult();
        },
        error:function(){
            /*alert("An error occurred while adding collaborators . Please try again.");*/
        }
    });
}

/**
 * Implement contact with check box functionality
 *
 *  User can remove the selected contact
 *  User can create a new Group
 *  User can modified permission
 *  user can add contact to existing group
 */
function implementCheckBoxWithContact(){
    $('div.menuSelectAll').checkboxMenu({
        menuItemClick: function(text, count) {
            var contactAvailable = [];
            $("#contactList input:checkbox").map(function(){
                contactAvailable.push($(this).val());
            });

            if(contactAvailable.length == 1){
                alert('Contact List is empty.');
                return false;
            }

            if(count > 0){
                $('body').click();

                var contactSelectedIDs = [];
                $("#contactList input:checkbox:checked").map(function(){
                    contactSelectedIDs.push($(this).val());
                });
                contactSelectedIDs.shift();
                if(contactSelectedIDs.length == 0){
                    text = (text == 'Remove Contact') ? 'Remove' : text;

                    // Alert with message
                    alert('Please Select Contact(s) to '+ text + '.');
                    return false;
                }

                switch(text){
                    case 'Remove Contact':
                        var confirmMessagePart = (contactSelectedIDs.length >= 2) ? 'these contacts' : 'this contact';
                        var userAction =  confirm('Are you sure you want to remove '+ confirmMessagePart +'?');

                        if(userAction){
                            jQuery.ajax({
                                url: baseUrl + "contacts/remove",
                                type: "get",
                                dataType: "json",
                                data:{selected_ids:contactSelectedIDs,multi_contacts:true},
                                success:function(response){
                                    if(response.status == 'Success'){
                                        // Reload page with success status
                                        location.reload(true);
                                    }else{
                                        alert("An error occurred while removing these contacts. Please try again.");
                                    }

                                },
                                error:function(){
                                    alert("An error occurred while removing these contacts. Please try again.");
                                }
                            });

                        }
                        break;
                    case 'Create Group':
                            $("#group_name").val('');
                            $('#createGroup').click();
                            break;
                    case 'Modify Permissions':
                            $('#contactPermission').find('input[type=checkbox]:checked').removeAttr('checked');
                            $('#addGroupPermission').click();
                            break;
                    case 'Add To Group':
                            $('#groupDescription').find('input[type=checkbox]:checked').removeAttr('checked');
                            if($('#groupDescription').children().length == 0){
                                $("#assignContactToGroup").attr('disabled', 'disabled');
                            }
                            $('#addToGroup').click();
                            break;
                }
            }else {
                text = (text == 'Remove Contact') ? 'Remove' : text;

                // Alert with message
                alert('Please Select Contact(s) to '+ text + '.');
            }
        }
    });
}

/**
 * Apply template form case view
 */
function applyTemplateViewData(parameters){
    var canEditImage = $('#can_edit_image').val();
    var templateField = $("#templateViewField").val();
    if(typeof templateField != 'undefined' && templateField != ''){
        templateField =   templateField.split(',');
    }else{
        templateField = '';
    }

    var assignFieldCount = {};
    var totalFieldCount = {};
    for(var count = 0; count<templateField.length-1;count++ ){
        assignFieldCount[templateField[count]] = 0;
        totalFieldCount[templateField[count]] = 0;
    }
    var case_id = 0;
    var templateId = 0;
    var collaboratorListCount = 0;
    if(typeof (parameters) != 'undefined') {
        case_id = parameters['case_id'];
    }else{
        templateId = $('select#selectedTemplateID option:selected').val();
        if(templateId == 0){
            alert('Please select Template to apply.');
            return false;
        }else{
            $('#applyTemplateView').attr('disabled', true);
            $('#loadingImage').css({top: '45%'});
            $('#loadingImage').show();
        }
    }

    jQuery.ajax({
        url: baseUrl + "cases/case_template_data",
        type: "get",
        dataType: "json",
        cache:false,
        async:false,
        data:{template_id:templateId,case_id:case_id},
        success:function(response){

            if(response.status == 'Success'){
                if(typeof (response.module.acessible_fields) != 'undefined' && typeof (response.module.module_field_data) != 'undefined' ){
                    if(typeof (response.template.collaborators) != 'undefined' && response.template.collaborators!= ''){
                        collaboratorListCount = response.template.collaborators.split(',').length;
                        var collaboratorList = response.template.collaborators.split(',');
                    }

                    var moduleData = response.module.acessible_fields;

                    if(isIE() && isIE() <= 8){
                        for(var moduleFieldsData in moduleData){
                            var count = 0;
                            var fields = moduleData[moduleFieldsData];
                            for(var data = 0;data < fields.length/2;data++){
                                if(typeof fields[data] != 'undefined'){
                                    var myString = fields[data].name;
                                    var firstIndex = myString.indexOf('[');
                                    var lastIndex  = myString.indexOf(']');
                                    var finalString = myString.substr(firstIndex+1,lastIndex-1);
                                    if(fields[data].type == 'checkbox' && response.module.module_field_data[fields[data].name] == 1){
                                        $("[name = '__module__values["+fields[data].column_name+"]']").attr('checked', true);
                                    }else{
                                        $("[name = '__module__values["+fields[data].column_name+"]']").val(response.module.module_field_data[fields[data].name]);
                                    }
                                    finalString = (finalString == 'Nuvasive') ? 'NuVasive' : finalString;

                                    if(typeof(response.module.module_field_data[fields[data].name]) !='undefined' && response.module.module_field_data[fields[data].name] != 0 && response.module.module_field_data[fields[data].name] != ''){
                                        if(typeof (assignFieldCount[finalString]) == 'undefined'){
                                            assignFieldCount['CaseDetails'] = assignFieldCount['CaseDetails'] +1;
                                        }else{
                                            assignFieldCount[finalString] = assignFieldCount[finalString] +1;
                                        }
                                    }

                                    if(typeof (totalFieldCount[finalString]) == 'undefined'){
                                        totalFieldCount['CaseDetails'] = totalFieldCount['CaseDetails'] +1;
                                    }else{
                                        totalFieldCount[finalString] = totalFieldCount[finalString] +1;
                                    }
                                    window.onunload = null;
                                }
                            }
                            setTimeout(function(){
                                for(var data = Math.round(fields.length/2) ;data < fields.length;data++){
                                    if(typeof fields[data] != 'undefined'){
                                        var myString = fields[data].name;
                                        var firstIndex = myString.indexOf('[');
                                        var lastIndex  = myString.indexOf(']');
                                        var finalString = myString.substr(firstIndex+1,lastIndex-1);
                                        if(fields[data].type == 'checkbox' && response.module.module_field_data[fields[data].name] == 1){
                                            $("[name = '__module__values["+fields[data].column_name+"]']").attr('checked', true);
                                        }else{
                                            if(typeof(response.module.module_field_data[fields[data].name]) !='undefined' && response.module.module_field_data[fields[data].name] != 0 && response.module.module_field_data[fields[data].name] != ''){
                                                $("[name = '__module__values["+fields[data].column_name+"]']").val(response.module.module_field_data[fields[data].name]);
                                            }
                                        }
                                        finalString = (finalString == 'Nuvasive') ? 'NuVasive' : finalString;

                                        if(typeof(response.module.module_field_data[fields[data].name]) !='undefined' && response.module.module_field_data[fields[data].name] != 0 && response.module.module_field_data[fields[data].name] != ''){
                                            if(typeof (assignFieldCount[finalString]) == 'undefined'){
                                                assignFieldCount['CaseDetails'] = assignFieldCount['CaseDetails'] +1;
                                            }else{
                                                assignFieldCount[finalString] = assignFieldCount[finalString] +1;
                                            }
                                        }

                                        if(typeof (totalFieldCount[finalString]) == 'undefined'){
                                            totalFieldCount['CaseDetails'] = totalFieldCount['CaseDetails'] +1;
                                        }else{
                                            totalFieldCount[finalString] = totalFieldCount[finalString] +1;
                                        }
                                    }
                                }
                            },100)
                        }
                    }else{
                        for(var moduleFieldsData in moduleData){
                            var count = 0;
                            var fields = moduleData[moduleFieldsData];
                            for(var data = 0;data < fields.length;data++){
                                if(typeof fields[data] != 'undefined'){
                                    var myString = fields[data].name;
                                    var firstIndex = myString.indexOf('[');
                                    var lastIndex  = myString.indexOf(']');
                                    var finalString = myString.substr(firstIndex+1,lastIndex-1);
                                    if(fields[data].type == 'checkbox' && response.module.module_field_data[fields[data].name] == 1){
                                        $("[name = '__module__values["+fields[data].column_name+"]']").attr('checked', true);
                                    }else{
                                        if(typeof(response.module.module_field_data[fields[data].name]) !='undefined' && response.module.module_field_data[fields[data].name] != 0 && response.module.module_field_data[fields[data].name] != ''){
                                            $("[name = '__module__values["+fields[data].column_name+"]']").val(response.module.module_field_data[fields[data].name]);
                                        }
                                    }
                                    finalString = (finalString == 'Nuvasive') ? 'NuVasive' : finalString;

                                    if(typeof(response.module.module_field_data[fields[data].name]) !='undefined' && response.module.module_field_data[fields[data].name] != 0 && response.module.module_field_data[fields[data].name] != ''){
                                        if(typeof (assignFieldCount[finalString]) == 'undefined'){
                                            assignFieldCount['CaseDetails'] = assignFieldCount['CaseDetails'] +1;
                                        }else{
                                            assignFieldCount[finalString] = assignFieldCount[finalString] +1;
                                        }
                                    }

                                    if(typeof (totalFieldCount[finalString]) == 'undefined'){
                                        totalFieldCount['CaseDetails'] = totalFieldCount['CaseDetails'] +1;
                                    }else{
                                        totalFieldCount[finalString] = totalFieldCount[finalString] +1;
                                    }
                                }
                            }
                        }
                    }
                    if(typeof (parameters) == 'undefined') {

                        var oldCollaborators = $('#defaultCaseCollaborators').val();
                        var templateCollaborators = $('#templateAssignCollaborators').val();

                        var allDisplayedCollaboratorEmail = '';

                        $( "#accessorsList p" ).each( function( index, element ){
                            var emailText = $( this ).attr('email');
                            if (typeof emailText !== typeof undefined && emailText !== false) {
                                allDisplayedCollaboratorEmail += emailText + ",";
                            }
                        });

                        var isFlag = 0;
                        $( "#removeCasesContacts input[type=checkbox]" ).each( function( index, element ){
                            isFlag = 1;
                        });

                        if(typeof(oldCollaborators) == 'undefined'){
                            alert("Template applied successfully.");
                        }

                        if(typeof(oldCollaborators) != 'undefined'){
                            var DefaultCollaborators = oldCollaborators.split(",");
                            var assignCollaborators = '';
                            var count = 0;
                            var displayCount = DefaultCollaborators.toString();

                            //remove older html
                            if(isFlag == 0){
                                $("#removeCasesContacts").find('p').first().remove();
                                $("#removeSelectedContacts").show();
                                var len = $("#removeCasesContacts").children().length;
                                if(len == 0){
                                    $("#removeCasesContacts").html("<div id='accessorsList'></div><hr><button id='removeSelectedContacts' type='button' class='btn btn-inverse pull-right general_template_view'>Remove Collaborators</button></div>");
                                }
                            }

                            if(typeof collaboratorList != 'undefined' ){
                                var contactsEmail = $('#contact_emails').val();
                                contactsEmail = $.parseJSON(contactsEmail);
                                $.each(collaboratorList, function(key ,value){
                                    if(allDisplayedCollaboratorEmail.match(value) == null){
                                        $.each(contactsEmail, function(keyId, emailValue){
                                            if(emailValue == value){
                                                var elementId = '#lblcol_' + keyId;
                                                $(elementId).remove();
                                            }
                                        });

                                        $("#accessorsList").append("<p email="+value+" class='templateCollaboratotList'><input type='checkbox' value="+value+" class='pull-left from_template'>&nbsp;"+value+"</p>");
                                        assignCollaborators = value+","+assignCollaborators;
                                        count ++;
                                    }
                                });
                            }

                            $("#templateAssignCollaborators").val(allDisplayedCollaboratorEmail);

                            var tempEmailList = '';
                            $( ".templateCollaboratotList" ).each( function( index, element ){
                                var emailText = $( this ).attr('email');
                                if (typeof emailText !== typeof undefined && emailText !== false) {
                                    tempEmailList += emailText + ",";
                                }
                            });

                            $("#templateColList").val(tempEmailList);

                            var applyCollaboratorsLength =  count;
                            if(displayCount !=''){
                                applyCollaboratorsLength = DefaultCollaborators.length + applyCollaboratorsLength;
                            }

                            var numCollaborators = $('#removeCasesContacts p').length;
                            count = numCollaborators;
                            $("#AssignCollaborators").html("("+numCollaborators+")");

                            if(count <= 0 && oldCollaborators == ''){
                                $("#removeCasesContacts").html("<p>There are no Collaborators on this case</p>");
                                $("#removeSelectedContacts").hide();
                            }
                            alert("Template applied successfully.");
                        }
                    }else{
                        $('#defaultCaseCollaborators').val(response.template.collaborators);

                        var numCollaborators = $('#removeCasesContacts p').length;
                        if(numCollaborators == 1){
                            $( "#removeCasesContacts p" ).each( function( index, element ){
                                var text = $( this ).text();
                                var count = text.search("There are");
                                if(count != -1){
                                    numCollaborators = 0;
                                }
                            });
                        }
                        $("#AssignCollaborators").html("("+numCollaborators+")");
                    }
                }
                setTimeout(function(){
                    for(var count = 0; count<templateField.length-1;count++ ){
                        var cnt = 0;
                        //For checking checkbox and textbox
                        $("#accordionGroup"+templateField[count]+" input").each( function( index, element ){
                            var elementType = $(this).attr('type');
                            var elementValue = $(this).attr('value');
                            if (elementType !== 'hidden') {
                                if(elementType == 'checkbox'){
                                    if($(this).attr('checked')) {
                                        //if (typeof(elementValue) != 'undefined' && elementValue !== 0 && elementValue != '') {
                                            cnt++;
                                        //}
                                    }
                                }
                                if(elementType == 'text'){
                                    elementValue = $(this).val();
                                    if (typeof(elementValue) != 'undefined' && elementValue != 0 && elementValue != '') {
                                        cnt++;
                                    }
                                }
                            }
                        });

                        //For checking selectbox
                        $("#accordionGroup"+templateField[count]+" select").each( function( index, element ) {
                            var elementType = $(this).attr('type');
                            var elementValue = $(this).val();
                            if (elementType !== 'hidden') {
                                if($(this).is('select')) {
                                     if (typeof(elementValue) != 'undefined' && elementValue != 0 && elementValue != '') {
                                         cnt++;
                                     }
                                }
                            }
                        });

                        //For checking textarea
                        $("#accordionGroup"+templateField[count]+" textarea").each( function( index, element ){
                            var elementType = $(this).attr('type');
                            var elementValue = $(this).val();
                            if (elementType !== 'hidden') {
                                if($(this).is('textarea')) {
                                    if (typeof(elementValue) != 'undefined' && elementValue != 0 && elementValue != '') {
                                        cnt++;
                                    }
                                }
                            }
                        });

                        if(typeof(templateField[count]) != 'undefined' && templateField[count] == "CaseDetails"){
                            if(cnt > 0){
                                $("#CaseDetailsCount").html("");
                                $("#CaseDetailsCount").attr("class", 'clinical_notes_icon case_header display_inline');
                            }else{
                                $("#CaseDetailsCount").html("(none)");
                            }
                        }

                        $("#"+templateField[count]).html('');
                        $("#"+templateField[count]).html('('+cnt+'/'+totalFieldCount[templateField[count]]+')');
                        //$("#"+templateField[count]).html('('+assignFieldCount[templateField[count]]+'/'+totalFieldCount[templateField[count]]+')');
                    }
                },1000);

            }else{
                //alert("An error occurred while applying template. Please try again.");
            }

            $('#loadingImage').hide();
            if(canEditImage != 0){
                $('#applyTemplateView').attr('disabled', false);
            }
        },
        error:function(){
            $('#loadingImage').hide();
            if(canEditImage != 0){
                $('#applyTemplateView').attr('disabled', false);
            }
           // alert("An error occurred while applying template. Please try again.");
        }
    });
}

/**
 * Function to apply case module data
 */
function applyCaseModuleData(){
    var data = $("#caseData").val();
    var parseData = $.parseJSON(data);
}

/**
 * Create template from case view
 */
function createTemplateViewData(){
    $('#createTemplateView').attr('disabled', true);

    // Get selected template ID
    var caseId = $("[name = create_template_case_id]").val();
    var $next = $("[name = next]").val();
    var $description = $("[name = create_template_description]").val();
    if($description != ''){
        jQuery.ajax({
            url     : baseUrl + "cases/save_as_template",
            type    : "post",
            dataType: "json",
            data    :{create_template_case_id:caseId,next:$next,create_template_description:$description,create_template:true},
            success :function(response){
                checkLogout(response);
                if(response.status == 'Success'){
                    location.reload(true);
                }else{
                    alert("An error occurred while creating template. Please try again.");
                }
            },
            error:function(event){
                checkLogout(event.responseText);
            }
        });
    }
}
/**
 * Check deleted images
 */
function checkDeleteImage(event){
   var status =  $('.set_delete_button').hasClass('sm-hide');
    if(status == false){
        event.next().click();
    }
    return status;
}

/**
 *
 * @param selectedCollaborators
 * @param caseId
 */
function sharedCollaborators(selectedCollaborators, selectedGroups, caseId){
    //get template collaborators
    var templateCollaboratorsEmails = $("#templateColList").val();
    $('#loadingImage').show();
    $.ajax({
        url: baseUrl + "cases/sharing/add_user",
        type: "post",
        dataType: "json",
        data:{
            accessor_ids        : selectedCollaborators,
            selected_groups     : selectedGroups,
            case_id             : caseId,
            add_collaborators   : true,
            template_collaborators_emails:templateCollaboratorsEmails
        },
        success:function(response){
            //hide add email pop-up
            $("#addCollaboratorModel").modal('hide');
            $('#loadingImage').hide();
            if(response.status == 'success'){
                if(typeof(response.message) != 'undefined' && $.trim(response.message) == ''){
                    alert("Selected contact(s) added to the collaborators list successfully.");
                }

                updateCollaboratorAccordion(response);
            }

            if(typeof(response.message) != 'undefined' && $.trim(response.message) != ''){
                alert(response.message);
            }
            $("#addMoreCollaborators").attr('disabled', false);
        },
        error:function(e){
            checkLogout(e.responseText);
            //hide add email pop-up
            $("#addCollaboratorModel").modal('hide');
            $('#loadingImage').hide();
            //alert("An error occurred while adding collaborators. Please try again.");
            $("#addMoreCollaborators").attr('disabled', false);
        }
    });
}

function removeCollaborators(){
    var selectedTemplateEmail = [];
    $('.templateCollaboratotList input[type=checkbox]').each(function () {
            if($(this).is(":checked")){
                selectedTemplateEmail.push($(this).attr('value'));
                var removeItem = $(this).attr('value');
                $(this).parent().remove();

                var assignCollaborators = $("#templateAssignCollaborators").val().split(',');

                var index = $.inArray(removeItem, assignCollaborators);
                assignCollaborators.splice(index, 1);
                $("#templateAssignCollaborators").val(assignCollaborators.toString());

                var tempCollaborators = $("#templateColList").val().split(',');
                var index = $.inArray(removeItem, tempCollaborators);
                tempCollaborators.splice(index, 1);
                $("#templateColList").val(tempCollaborators.toString());

                // update collaborator count
                var numCollaborators = $('#removeCasesContacts p').length;
                if(numCollaborators == 1){
                    $( "#removeCasesContacts p" ).each( function( index, element ){
                        var text = $( this ).text();
                        var count = text.search("There are");
                        if(count != -1){
                            numCollaborators = 0;
                        }
                    });
                }
                $("#AssignCollaborators").html("("+numCollaborators+")");
            }
    });

    var len = $("#accessorsList").children().length;
        if(len == 0){
            $("#removeCasesContacts").html("<p>There are no Collaborators on this case</p>");
            $("#removeSelectedContacts").hide();
    }
}

/**
 * Function to filter image thumbnail by series/images
 * @param isFilterForGallery : 1 = function called for case gallery page otherwise from measure screen
 */
function filterThumbnailAction(isFilterForGallery, isDataFromApi, patientId, studyId, seriesId, isFromCasePatientScreen){
    var isFilterForGallery      = (typeof(isFilterForGallery) != 'undefined') ? isFilterForGallery : 0;
    var isDataFromApi           = (typeof(isDataFromApi) != 'undefined') ? isDataFromApi : 0;
    var patientId               = (typeof(patientId) != 'undefined') ? patientId : 0;
    var studyId                 = (typeof(studyId) != 'undefined') ? studyId : 0;
    var seriesId                = (typeof(seriesId) != 'undefined') ? seriesId : 0;
    var isFromCasePatientScreen = (typeof(isFromCasePatientScreen) != 'undefined') ? isFromCasePatientScreen : 1;
    if(isFilterForGallery == 1){
        $('.loadingGallery .loading').show();
    }

    var seriesFilterChecked = '';
    var seriesFilterAll = '';
    var caseId  = 0;
    var selectedFilterVal = 0;

    if(isFilterForGallery == 1){
        $('#addImageLink').removeClass('sm-hide');
        $('#deleteImagesButton').addClass('sm-hide');
        $('#editImage').removeClass('active');

        $('#editFilter li').each(function() {
            var checkbox = $(this).find('input.sm-image-tag');
            var checkboxId = checkbox.attr('id');
            if(checkbox.is(":checked")){
                if(checkboxId != ''){
                    seriesFilterChecked += checkboxId + ',';
                }
            }

            if(typeof(checkboxId) != 'undefined'){
                seriesFilterAll += checkboxId + ',';
            }
        });

        if(seriesFilterChecked != ''){
            seriesFilterChecked = seriesFilterChecked.slice(0,-1);
        }

        if(seriesFilterAll != ''){
            seriesFilterAll = seriesFilterAll.slice(0,-1);
        }

        var browserUrlParts = window.location.href.split('/');
        caseId = browserUrlParts[browserUrlParts.length - 1];
        selectedFilterVal = $('#filterThumbnail').val();
    }else{
        caseId            = $('#case_id').val();
        selectedFilterVal = $('#filterThumbnailBy').val();
    }

    if(caseId === 'patients'){
        caseId = 0;
    }
    //For filter image thumbnails by series/image
    if(caseId <= 0){
        if($("#currentPatientId").val() > 0){
            patientId = $("#currentPatientId").val();
        }else if($("#currentStudyId").val() > 0){
            studyId = $("#currentStudyId").val();
        }else if($("#currentSeriesId").val() > 0){
            seriesId = $("#currentSeriesId").val();
        }
    }

    if(window.location.href.indexOf('files/file_measure_view/') > -1) {
        var browserUrlParts = window.location.href.split('/');
        if(browserUrlParts.length > 1) {
            var groupId   = browserUrlParts[browserUrlParts.length - 2];
            var urlParts  = browserUrlParts[browserUrlParts.length - 1].split('?');
            var groupType = urlParts[0];
            if ($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != '') {
                if (groupType == 0) {
                    patientId = groupId;
                } else if (groupType == 1) {
                    studyId = groupId;
                } else if (groupType == 2) {
                    seriesId = groupId;
                }
            }
        }
    }

    if(window.location.href.indexOf('files/file_measure/') > -1) {
        var browserUrlParts = window.location.href.split('files/file_measure/');
        if(browserUrlParts.length > 1){
            var urlParts    = browserUrlParts[1].split('/');
            var groupId     = urlParts[0];
            var groupType   = urlParts[1];
            if($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != ''){
                if (groupType == 0) {
                    patientId = groupId;
                } else if (groupType == 1) {
                    studyId = groupId;
                } else if (groupType == 2) {
                    seriesId = groupId;
                }
            }
        }
    }
    var selectedImageIds = $('#selected_images').val();
    $('#loadingImageLink').show();
    selectedImageIds = (typeof(selectedImageIds) == 'undefined') ? '' : selectedImageIds;
    isPendingAJAXRequest = 1;
    //Ajax request to get HTML as per filter value selected
    isPendingAJAXRequestForPatient = $.ajax({
        url     : baseUrl + "files/thumbnail_html",
        type    : "get",
        cache   : false,
        data    : {
            case_id             : caseId,
            patient_id          : patientId,
            study_id            : studyId,
            series_id           : seriesId,
            filter_by           : selectedFilterVal,
            tag_checked         : seriesFilterChecked,
            all_tags            : seriesFilterAll,
            is_gallery_page     : isFilterForGallery,
            selected_image_ids  : selectedImageIds,
            data_from_api       : isDataFromApi
        },
        success:function(response){
            if(response != ''){
                checkLogout(response);

                if(isFilterForGallery == 1){
                    if(response != ''){
                        $('#caseThumbnail').html(response);
                        $('#caseThumbnail').show();
                        $('.no_images_text').hide();
                        $('#filterThumbnail').attr('disabled', false);
                        $('#editImage').attr('disabled', false);
                        $('#filterThumbnail').attr('disabled', false);
                        $('#includeIcon').attr('disabled', false);

                        var numberOfListItem = $("#caseThumbnail li").length;
                        if(numberOfListItem > 1){
                            $('#btnCompareImages').show();
                        }else{
                            $('#btnCompareImages').hide();
                        }

                        if(isDataFromApi == 1){
                            //To filter by images if patient having only one series
                            if(typeof(numberOfListItem) != 'undefined' && numberOfListItem == 1) {
                                $("#filterThumbnail").val('0');
                                filterThumbnailAction(1);
                            }

                            var callBack = function(){
                                initializeSeriesOption();
                            };

                            if(caseId > 0){
                                getSeriesOptionHtml(caseId, patientId, studyId, seriesId, callBack);
                                storeFilesToDirectory(caseId);
                            }else{
                                storePatientFilesToDirectory(patientId, studyId, seriesId);
                            }
                        }
                    }else{
                        $('.no_images_text').hide();
                        $('#btnCompareImages').hide();
                    }
                    $('.loadingGallery .loading').hide();
                }else{
                    $('#thumbnailList').html(response);
                    var numberOfListItem = $("#thumbnailList li").length;
                    if(isFromCasePatientScreen == 1 && isFirstTime == 0){
                        //To filter by images if patient having only one series
                        if(typeof(numberOfListItem) != 'undefined' && numberOfListItem == 1) {
                            isFirstTime++;
                            $("#filterThumbnailBy").val('0');
                            filterThumbnailAction(0);
                        }
                    }

                    if(isFirstTimeFilter == 1) {
                        isFirstTimeFilter++;
                        if (isLtIE9 == 1) {
                            windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
                        } else {
                            windowWidth = $(window).innerWidth();
                        }

                        var isOriginal = $('#is_original').val();
                        if (isOriginal == 0 && windowWidth > 1000) {
                            var updatedToggleParentHeight = $("#measureContainer").height();
                            $('#toggleParent').css('height', updatedToggleParentHeight + 'px');
                        }
                    }
                }
                $( '.draggable' ).draggable({ helper: 'clone' });
            }else{
                $('#btnCompareImages').hide();

                if(isFilterForGallery == 1){
                    $('.loadingGallery .loading').hide();
                }

                if(caseId <= 0){
                    $('#caseThumbnail').html('');
                    $('.no_images_text').show();
                }
            }
            //To display image count on create case modal
            var imageCount = $("#imageCount").val();
            if(typeof(imageCount) != 'undefined' && imageCount > 0){
                $("#patientImageCount").html('');
                $("#patientImageCount").html(imageCount);
                $('#createPatientCase').attr('disabled', false);
                $('#loadingImageLink').hide();
            }else{
                $("#patientImageCount").html('0');
                $('#createPatientCase').attr('disabled', true);
                $('#loadingImageLink').hide();
            }
            isPendingAJAXRequest = 0;
        },
        error:function(e){
            isPendingAJAXRequest = 0;
            checkLogout(e.responseText);
            //alert("An error occurred. Please try again.");
        }
    });
}

/**
 * Function for redirect to login page if Laravel session expired
 * @param responseHtml
 */
function checkLogout(responseHtml){
    responseHtml = String(responseHtml);
    if(responseHtml != ''){
        if(responseHtml.indexOf("<!DOCTYPE") > -1){
            window.location = baseUrl + 'user/login';
        }
    }
}

/**
 * Function to fetch image list
 */
function getImageList(isDataFromApi){
    var caseId    = $('#case_id').val();
    var patientId = 0;
    var studyId   = 0;
    var seriesId  = 0;

    if(window.location.href.indexOf('files/file_measure_view/') > -1) {
        var browserUrlParts = window.location.href.split('/');
        if(browserUrlParts.length > 1) {
            var groupId   = browserUrlParts[browserUrlParts.length - 2];
            var urlParts  = browserUrlParts[browserUrlParts.length - 1].split('?');
            var groupType = urlParts[0];
            if ($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != '') {
                if (groupType == 0) {
                    patientId = groupId;
                } else if (groupType == 1) {
                    studyId = groupId;
                } else if (groupType == 2) {
                    seriesId = groupId;
                }
            }
        }
    }

    if(window.location.href.indexOf('files/file_measure/') > -1) {
        var browserUrlParts = window.location.href.split('files/file_measure/');
        if(browserUrlParts.length > 1){
            var urlParts    = browserUrlParts[1].split('/');
            var groupId     = urlParts[0];
            var groupType   = urlParts[1];
            if($.trim(groupId) != '' && groupId > 1 && $.trim(groupType) != ''){
                if (groupType == 0) {
                    patientId = groupId;
                } else if (groupType == 1) {
                    studyId = groupId;
                } else if (groupType == 2) {
                    seriesId = groupId;
                }
            }
        }
    }

    $.ajax({
        url     : baseUrl + "files/image_list",
        type    : "get",
        data    : {
            case_id         : caseId,
            patient_id      : patientId,
            study_id        : studyId,
            series_id       : seriesId,
            data_from_api   : (typeof(isDataFromApi) != 'undefined') ? isDataFromApi : 0
        },
        success:function(response){
            if(response != ''){
                response = $.parseJSON(response);
                if(typeof(response.status) != 'undefined' && response.status == 1){
                    filesList = (typeof(response.data) != 'undefined') ? response.data : [];
                }
            }
        },
        error:function(e){
            checkLogout(e.responseText);
            //alert("An error occurred. Please try again.");
        }
    });
}

function isIE () {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

/**
 * Ajax call to store case files to measure_images directory
 * @param caseId
 */
function storeFilesToDirectory(caseId, seriesId){
    var seriesId = (typeof(seriesId) != 'undefined') ? seriesId : 0;
    $.ajax({
        type    : "GET",
        url     : baseUrl + 'cases/store_file_to_server',
        cache   : true,
        data    : {
            case_id: caseId,
            series_id : seriesId
        }
    }).done(function( response ) {
     }).fail(function() {
            log('Error in storeFilesToDirectory');
        });
}

/**
 * Ajax call to get image series option HTML
 * @param caseId
 */
function getSeriesOptionHtml(caseId, patientId, studyId, seriesId, callback){
    $.ajax({
        type    : "GET",
        url     : baseUrl + 'files/series_option_html',
        cache   : true,
        data    : {
            case_id     : caseId,
            patient_id  : patientId,
            study_id    : studyId,
            series_id   : seriesId
        }
    }).done(function( response ) {
            if(response != ''){
                $('#editFilter').append(response);
                callback();
            }
        }).fail(function() {
            log('Error in getSeriesOptionHtml');
        });
}

//Function to initialize series option
function initializeSeriesOption(){
    $('input.sm-image-tag').change(function() {
        var tag = $(this).data('tag');
        var vis = this.checked;
        $('li.edit_images').each(function(idx, li) {
            if ($(li).data('tag') == tag) {
                $(li).toggle(vis);
                /* Also uncheck buttons that are being hid */
                if (!vis) {
                    $(li).trigger('sm-image-select-event', [ false ]);
                }
            }
        });
        $('#editFilter').css({'display' : 'inline-block'});
    });
}

//Function to create new group
function createNewGroup() {
    $("#groupName").val('');
    $('#createNewGroup').click();
}

//Function to perform expand collapse functionality on patient
function prepareList(isFromLinkedPatient)
{
    var id = '#expList';
    if(typeof(isFromLinkedPatient) != 'undefined' && isFromLinkedPatient == 1){
        id = '#expListLinkedPatient';
    }

    $(id).find('li')
    .click( function(event) {
        if (this == event.target) {
            $(this).toggleClass('expanded');
            $(this).children('ul').toggle('medium');
        }
        return false;
    })
    .addClass('collapsed')
    .children('ul').hide();
}

//Function to perform expand collapse functionality on study list
function prepareListForStudy(rowId, isFromLinkedPatient, isFromStudy)
{
    var id = "#patient_" + rowId;
    if(typeof(isFromLinkedPatient) != 'undefined' && isFromLinkedPatient == 1){
        id = '#linkedPatient_' + rowId;
    }
    if(typeof(isFromStudy) != 'undefined' && isFromStudy == 1){
        id = '#study_' + rowId;
    }
    $(id).find('ul :has(li)')
    .click( function(event) {
        if (this == event.target) {
            $(this).toggleClass('expanded');
            $(this).children('ul').toggle('medium');
        }
        return false;
    })
    .addClass('collapsed')
    .children('ul').hide();
}

//Function to get case, study and series list of particular patient
function getCaseStudySeriesList(event, Id, targetUrl)
{
    if(typeof(isPendingAJAXRequestForStudyCasePatient) != 'undefined' && isPendingAJAXRequestForStudyCasePatient == 1){
        isPendingAJAXRequestForStudtCase.abort();
    }

    var patientIdVal = 0;
    var rowId;
    var commonClass;
    var isFromStudy = 0;
    var accessLevel = 3;
    if(typeof(targetUrl) != 'undefined'){
        rowId  = '#patient_' + Id;
    }else{
        rowId  = '#study_' + Id;
        isFromStudy = 1;
    }
    if(isFromStudy == 1){
        commonClass = "study_" + Id;
    }else{
        commonClass = "patient_" + Id;
    }
    var className   = $(rowId).attr('class');
    $('.iw-contextMenu').css('display', 'none');
    if(className.match("collapsed expanded") ==null){
        var rowDetails = $("." + commonClass).html();
        if(typeof(targetUrl) == 'undefined' ){
            targetUrl  = 'patients/study_series';
            rowDetails = $("." + commonClass + " ul li").html();
            patientIdVal = $("#study_" + Id).parents().attr('class');
            if(typeof(patientIdVal) != 'undefined' && patientIdVal != ''){
                var length = patientIdVal.length;
                var indexOf = patientIdVal.indexOf('_');
                patientIdVal = patientIdVal.substr(indexOf + 1, length - (indexOf + 1));

                if(typeof(patientCaseData) != 'undefined' && patientCaseData !== ''){
                    $.each( patientCaseData, function( indexKey, patientDetail ) {
                        if(patientIdVal == indexKey){
                          accessLevel = (typeof(patientDetail.access_level) != 'undefined') ? patientDetail.access_level : 3;
                          return false;
                        }
                    });
                }
            }

        }else{
            targetUrl  = 'patients/patient_study_cases';
        }
        if(typeof(rowDetails) != 'undefined' || $("." + commonClass).text() == "No details")
        {
            return true;
        }
        $("." + commonClass).remove();
        $("#loadingImageForPatient").show();
        $('#loadingImageForPatient').css({width: '30px', position:'absolute', 'left':event.clientX + 63, 'top':event.clientY - 12});
        isPendingAJAXRequestForStudyCasePatient = 1;
        isPendingAJAXRequestForStudtCase = $.ajax({
            type    : "get",
            url     : baseUrl + targetUrl,
            data    : {
                id  : Id,
                access_level : accessLevel
            },
            success:function(response){
                checkLogout(response);
                $("#loadingImageForPatient").hide();
                if(response != '' && response != '<ul></ul>'){
                    $(rowId).append('<ul class='+commonClass+'>'+response+'</ul>');
                    prepareListForStudy(Id, 0, isFromStudy);
                }else{
                    $(rowId).append('<ul class='+commonClass+'><li><i>No details</i></li></ul>');
                }
                isPendingAJAXRequestForStudyCasePatient = 0;
            },
            error:function(e){
                isPendingAJAXRequestForStudyCasePatient = 0;
                checkLogout(e.responseText);
                $("#loadingImageForPatient").hide();
                //alert("An error occurred. Please try again.");
            }
        });
    }
}

/**
* Description  : Function to open case details
*/
function openCaseDetail(caseId){
    $('.iw-contextMenu').css('display', 'none');
    location.href= baseUrl + 'cases/view/' + caseId;
}

/**
* Description  : Function to get patient images
*/
function getPatientImageList(event, patientId){
    $("#filterThumbnail").val(1);
    if(isPreviousClickID != "patient_" + patientId) {
        $('#caseThumbnail').html('');
        $('#btnCompareImages').hide();
    }

    isPreviousClickID = "patient_" + patientId;
    $('.iw-contextMenu').css('display', 'none');

    // For adding attributes href to the compare image button on patient list
    var compareImageURL = baseUrl + 'files/file_measure_view/' + patientId + '/' + '0';
    $("#btnCompareImages").attr('href', compareImageURL);

    var ctrlDown = event.ctrlKey||event.metaKey; // Mac support
    if(ctrlDown){
        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
            event.returnValue  = false;
        }

        //if user does not have merge patient permission then block user to select multiple patient
        if(typeof(userFeatureList.patient_merge) != 'undefined' && userFeatureList.patient_merge == '0'){
            selectedPatientIds    = [];
            selectedPatientIds[0] = patientId;
            setSelectionColorForPatient(patientId, 'patient_');
            return false;
        }

        if ($.inArray(patientId, selectedPatientIds) != -1) {
            selectedPatientIds = $.grep(selectedPatientIds, function (value) {
                return value != patientId;
            });
            $("#patient_" + patientId).css({'background-color': '#f9f9f9'});
            return false;
        }

        //For IE
        if(navigator.userAgent.indexOf("MSIE 7.0") != -1 ) {
            setTimeout(function(){
                selectedPatientIds.push(patientId);
                $("#patient_" + patientId).css({'background-color': '#d9edf7'});
                $.unique(selectedPatientIds);
            }, 200);
        }else{
            selectedPatientIds.push(patientId);
            $("#patient_" + patientId).css({'background-color': '#d9edf7'});
        }
        return false;
    }else{
        selectedPatientIds    = [];
        selectedPatientIds[0] = patientId;
    }

    setSelectionColorForPatient(patientId, 'patient_');

    if(typeof(isPendingAJAXRequest) != 'undefined' && isPendingAJAXRequest == 1){
        isPendingAJAXRequestForPatient.abort();
    }

    if(navigator.userAgent.indexOf("MSIE 7.0") == -1 ){
        event.stopPropagation();
    }
    var patientName = $("#label_" + patientId).text();
    var imageUrl    = "../img/patient.png";
    var titleTextForPatient = patientName;
    if(patientName == ''){
        patientName = "<i class='blank_name'>BLANK NAME</i>";
        titleTextForPatient = "BLANK NAME";
    }

    if(patientName === "DEIDENTIFIED"){
        patientName = "<i class='blank_name'>DEIDENTIFIED</i>";
        titleTextForPatient = "DEIDENTIFIED";
    }

    var patientNameLimit = 30;
    var patientLimit = (patientName.length > patientNameLimit) ? (patientName.substr(0,(patientNameLimit)) + "...")  : patientName;
    $("#selectedItemName").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + patientLimit);

    $("#selectedItemName").mouseover(function(){
    	$("#selectedItemName").attr('title', titleTextForPatient);
    });

    $("#selectedItemName").css('background-image', 'url("' + imageUrl + '")');
    $("#currentPatientId").val(patientId);
    $("#currentStudyId").val('');
    $("#currentSeriesId").val('');
    $('#createPatientCase').attr('disabled', true);
    filterThumbnailAction(1, 1, patientId, 0, 0);
}

/**
* Description  : Function to get study images
*/
function getStudyImageList(event, studyId){
    $("#filterThumbnail").val(1);
    if(isPreviousClickID != "study_" + studyId) {
        $('#caseThumbnail').html('');
        $('#btnCompareImages').hide();
    }

    isPreviousClickID = "study_" + studyId;

    setSelectionColorForPatient(studyId, 'study_');

    // For adding attributes href to the compare image button on patient list
    var compareImageURL = baseUrl + 'files/file_measure_view/' + studyId + '/' + '1';
    $("#btnCompareImages").attr('href', compareImageURL);

    if(typeof(isPendingAJAXRequest) != 'undefined' && isPendingAJAXRequest == 1){
        isPendingAJAXRequestForPatient.abort();
    }
    $('.iw-contextMenu').css('display', 'none');

    if(navigator.userAgent.indexOf("MSIE 7.0") == -1){
        event.stopPropagation();
    }
    var studyNameLimit = 30;
    var studyName = $("#study_" + studyId +" span").first().text();
    var studyLimit = (studyName.length > studyNameLimit) ? (studyName.substr(0,(studyNameLimit)) + "...")  : studyName;
    $("#selectedItemName").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + studyLimit);

    $("#selectedItemName").mouseover(function(){
        $("#selectedItemName").attr('title', studyName);
    });

    var imageUrl  = "../img/study.png";
    if(studyName === "BLANK NAME"){
        studyName = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='blank_name'>BLANK NAME</i>";
    }
    $("#selectedItemName").html(studyLimit);
    $("#selectedItemName").css('background-image', 'url("' + imageUrl + '")');
    $("#currentStudyId").val(studyId);
    $("#currentPatientId").val('');
    $("#currentSeriesId").val('');
    $('#createPatientCase').attr('disabled', true);
    filterThumbnailAction(1, 1, 0, studyId, 0);
}

/**
* Description  : Function to get series images
*/
function getSeriesImageList(event, seriesId){
    $("#filterThumbnail").val(1);
    if(isPreviousClickID != "series_" + seriesId) {
        $('#caseThumbnail').html('');
        $('#btnCompareImages').hide();
    }

    isPreviousClickID = "series_" + seriesId;

    setSelectionColorForPatient(seriesId, '');

    // For adding attributes href to the compare image button on patient list
    var compareImageURL = baseUrl + 'files/file_measure_view/' + seriesId + '/' + '2';
    $("#btnCompareImages").attr('href', compareImageURL);

    if(typeof(isPendingAJAXRequest) != 'undefined' && isPendingAJAXRequest == 1){
        isPendingAJAXRequestForPatient.abort();
    };
    $('.iw-contextMenu').css('display', 'none');

    if(navigator.userAgent.indexOf("MSIE 7.0") == -1){
        event.stopPropagation();
    }
    var seriesNameLimit = 30;
    var seriesName = $("#" + seriesId +" span").first().text();
    var seriesLimit = (seriesName.length > seriesNameLimit ) ? (seriesNameLimit.substr(0,(seriesNameLimit)) + "...") : seriesName;

    $("#selectedItemName").mouseover(function(){
        $("#selectedItemName").attr('title',seriesName);
    });

    var imageUrl   = "../img/series-icon.png";
    if(seriesName === "BLANK NAME"){
        seriesName = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='blank_name'>BLANK NAME</i>";
    }

    if(seriesName === "DEIDENTIFIED"){
        seriesName = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i class='blank_name'>DEIDENTIFIED</i>";
    }

    $("#selectedItemName").html(seriesLimit);
    $("#selectedItemName").css('background-image', 'url("' + imageUrl + '")');
    $("#currentSeriesId").val(seriesId);
    $("#currentPatientId").val('');
    $("#currentStudyId").val('');
    $('#createPatientCase').attr('disabled', true);
    filterThumbnailAction(1, 1, 0, 0, seriesId);
}

/**
 * Description: Function to display patient images and context menu option for patient list
 */
function getPatientContextMenu(event, patientId){
    if((event.which) == 3 || typeof(event.which) == 'undefined'){
        if ($.inArray(patientId, selectedPatientIds) != -1) {
            if (selectedPatientIds.length > 1) {
                getContextMenuForSelectedPatient(event, patientId);
                return false;
            }
        }

        if(navigator.userAgent.indexOf("MSIE 7.0") == -1 ) {
            selectedPatientIds.length = 0;
            $('#expList li').each(function () {
                $(this).css({'background-color': '#f9f9f9'});
            });
        }

        //For getting patient image list
        getPatientImageList(event, patientId);

        //To check this patient is linked to another or not
        var isLinkPatient = 0;
        if(typeof(patientCaseData) != 'undefined' && patientCaseData !== ''){
            $.each( patientCaseData, function( indexKey, patientDetail ) {
                if(patientId == indexKey){
                  isLinkPatient = (typeof(patientDetail.is_link_patient) != 'undefined') ? patientDetail.is_link_patient : 0;
                  return false;
                }
            });
        }

        var classNameValue = (typeof(isLinkPatient) != 'undefined' && isLinkPatient == 1) ? '': 'disable_cursor';
        isLinkPatient = (typeof(isLinkPatient) != 'undefined' && isLinkPatient == 1) ? 'false': 'true';

        //Context menu option for patient list
        var menu = [/*{
            name: 'Open',
            img: '../img/patient.png',
            title: 'Open patient',
            fun: function () {
                //alert('In progress');
            }
        },*/ {
            name: 'Details',
            img: '../img/edit_Item.png',
            title: 'Patient details',
            fun: function () {
                $.ajax({
                    type     : "get",
                    url      : baseUrl + "patients/patient_detail",
                    data     : { patientId : patientId },
                    dataType : 'json',
                    success:function(patient){
                        $("#currentPatientId").val(patient.id);
                        var flag = 0;
                        if(typeof(patientCaseData) != 'undefined' && patientCaseData !== ''){
                            $.each( patientCaseData, function( Id, patientDetail ) {
                                if(patientId == Id){
                                    if(typeof(patientDetail.access_level) != 'undefined' && patientDetail.access_level < 3){
                                        $("#patientName").val("DEIDENTIFIED");
                                        flag = 1;
                                        return false;
                                    }
                                }
                            });
                        }
                        if(typeof(patient.name) != 'undefined' && flag !== 1){
                            $("#patientName").val(patient.name);
                        }

                        if(typeof(patient.patientId) != 'undefined'){
                            $("#patientPatientId").val(patient.patientId);
                            $("#patientPatientId").attr('title', patient.patientId);
                        }

                        if(typeof(patient.email) != 'undefined'){
                            $("#patientEmail").val(patient.email);
                        }

                        if(typeof(patient.version) != 'undefined'){
                            $("#currentPatientVersion").val(patient.version);
                        }

                        if(typeof(patient.dicomId) != 'undefined'){
                            $("#currentPatientDicomId").val(patient.dicomId);
                        }

                        if(typeof(patient.ageRange) != 'undefined'){
                            $("#currentPatientAgerange").val(patient.ageRange);
                        }

                        if(typeof(patient.diagnosis) != 'undefined'){
                            $("#currentPatientDiagnosis").val(patient.diagnosis);
                        }

                        if(typeof(patient.comment) != 'undefined'){
                            $("#currentPatientComment").val(patient.comment);
                        }

                        if(typeof(patient.importedDate) != 'undefined'){
                            var dateString   = patient.importedDate;
                            var importedDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            $("#currentPatientImportdate").val(importedDate);
                        }

                        if(typeof(patient.is_removed) != 'undefined'){
                            $("#currentPatientIsremoved").val(patient.is_removed);
                        }

                        if(typeof(patient.other_dicom_ids) != 'undefined'){
                            $("#currentPatientOtherDicomId").val(patient.other_dicom_ids);
                        }

                        if(typeof(patient.dateOfBirth) != 'undefined'){
                            var dateString = patient.dateOfBirth;
                            var dob = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            var mm = dob.getMonth() + 1;
                            var dd = dob.getDate();
                            if(mm < 10){
                                mm = "0" + mm;
                            }
                            if(dd < 10){
                                dd ="0" + dd;
                            }
                            dob = mm + "/" + dd + "/" + dob.getFullYear();
                            $("#patientBirthDate").val(dob);
                        }

                        if(typeof(patient.sex) != 'undefined'){
                            var sex = patient.sex;
                            if(sex == 0){
                                $("#patientMale").attr('checked', 'checked');
                            }else if(sex == 1){
                                $("#patientFemale").attr('checked', 'checked');
                            }
                            else if(sex == 2){
                                $("#patientUnknown").attr('checked', 'checked');
                            }
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });
                $("#btnPatientDetailModal").trigger('click');
            }
        }, {
            name: 'Delete',
            img: '../img/delete_Item.png',
            title: 'Delete patient',
            fun: function () {
                $.ajax({
                    type     : "get",
                    url      : baseUrl + "patients/patient_detail",
                    data     : { patientId : patientId },
                    dataType : 'json',
                    success:function(patient){
                        if(typeof(patient.version) != 'undefined'){
                            $("#currentPatientVersion").val(patient.version);
                            $("#currentPatientId").val(patient.id);
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });
                $("#btnPatientDeleteModal").trigger('click');
            }
        }, {
            name: 'Plan/Schedule a Case',
            img: '../img/add_Item.png',
            title: 'Schedule a Case',
            fun: function () {
                $("#createNewCase").trigger('click');

                //get template list
                getTemplateList();

                //get surgeon list
                getSurgeonList();

                //For getting patient details
                $.ajax({
                    type: "get",
                    url: baseUrl + "patients/patient_detail",
                    data: {patientId: patientId},
                    dataType: 'json',
                    success: function (patient) {
                        $("#currentPatientId").val(patient.id);
                        var flag = 0;
                        if (typeof(patientCaseData) != 'undefined' && patientCaseData !== '') {
                            $.each(patientCaseData, function (Id, patientDetail) {
                                if (patientId == Id) {
                                    if (typeof(patientDetail.access_level) != 'undefined' && patientDetail.access_level < 3) {
                                        $("#casepatientName").val("DEIDENTIFIED");
                                        flag = 1;
                                        return false;
                                    }
                                }
                            });
                        }

                        if (typeof(patient.name) != 'undefined' && flag !== 1) {
                            $("#casepatientName").val(patient.name);
                        }
                        //for resetting existing modal data
                        resetCreateCaseFields();
                    },
                    error: function (e) {
                        checkLogout(e.responseText);
                    }
                });
                $("#existingCasesListBody").html('');
                $("#LinkedPatientList").html('');
                $("#btnPatientCaseScheduleModal").trigger('click');
            }
        },{
            name: 'View Link Patients',
            img: '../img/patient.png',
            title: 'View Link Patients',
            disable : isLinkPatient,
            className: classNameValue,
            fun: function () {
                $.ajax({
                    url: baseUrl + "patients/linked_patient_ids",
                    type: "get",
                    dataType: "json",
                    cache   : false,
                    data:{patient_id : patientId, is_from_view_linked_patient : 1},
                    success:function(response){
                        linkedPatientIds = response.linked_patient_ids;
                        $('#ViewlinkedPatientList').html(response.data);
                        prepareList(1);
                        getAndUpdatePatientDetail(1);
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });
                $("#btnViewLinkPatientModal").trigger('click');
            }
        }];

        //prevent default browser context menu from opening
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        //Calling context menu for patient list
        if(navigator.userAgent.indexOf("MSIE 7.0") > -1 ){
            $(".name_" + patientId).contextMenu(menu, {triggerOn : 'contextmenu'});
        }else{
            $(".name_" + patientId).contextMenu(menu, {triggerOn : 'mouseup'});
        }
    }
}

/**
 * Description: Function to display linked patient contextmenu option for patient list
 */
function getLinkedPatientContextMenu(event, patientId){
    if((event.which) == 3 || typeof(event.which) == 'undefined'){
        setSelectionColorForLinkedPatient(patientId);

        if(typeof(userFeatureList.patient_merge) != 'undefined' && userFeatureList.patient_merge == '0'){
            return false;
        }

        //To get all linked patient ids
        var patientIds    = [];
        if(typeof(linkedPatientIds) != 'undefined' && linkedPatientIds !== ''){
            $.each(linkedPatientIds, function( indexKey, id ) {
                if(patientId != id) {
                    patientIds.push(id);
                }
            });
        }

        //To push selected patient id and reverse array
        patientIds.push(patientId);
        patientIds.reverse();

        //Context menu option for linked patient list
        var menu = [{
            name    : 'Unlink Patient',
            img     : '../img/unlink_patient.png',
            title   : 'Unlink Patient',
            fun: function () {
                $('#loadingImage').show();
                $.ajax({
                    url: baseUrl + "patients/unlink_patients",
                    type: "post",
                    dataType: "json",
                    cache   : false,
                    data:{patient_id : patientId, patient_ids : patientIds},
                    success:function(response){
                        $('#loadingImage').hide();
                        $("#viewLinkPatientModal").modal('hide');
                        location.reload();
                    },
                    error:function(e){
                        $('#loadingImage').hide();
                        $("#viewLinkPatientModal").modal('hide');
                        checkLogout(e.responseText);
                    }
                });
            }
        }];

        //prevent default browser context menu from opening
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        //Calling context menu for patient list
        if(navigator.userAgent.indexOf("MSIE 7.0") > -1 ){
            $(".link_patient_name_" + patientId).contextMenu(menu, {triggerOn : 'contextmenu'});
        }else{
            $(".link_patient_name_" + patientId).contextMenu(menu, {triggerOn : 'mouseup'});
        }
    }
}

/**
 * Description: Function to display study images and contextmenu option for study list
 */
function getStudyContextMenu(event, studyId, patientId){
    if((event.which) == 3 || typeof(event.which) == 'undefined'){
        $("#currentStudyId").val(studyId);
        $("#currentPatientId").val(patientId);

        //For getting study image list
        getStudyImageList(event, studyId);

        //Context menu option for study list
        var menu = [/*{
            name: 'Open',
            img: '../img/patient.png',
            title: 'Open study',
            fun: function () {
                //alert('In progress');
            }
        },*/ {
            name: 'Details',
            img: '../img/edit_Item.png',
            title: 'Study details',
            fun: function () {
                //For getting patient details
                $.ajax({
                    type     : "get",
                    url      : baseUrl + "patients/patient_detail",
                    data     : { patientId : patientId },
                    dataType : 'json',
                    success:function(patient){
                        $("#currentPatientId").val(patient.id);
                        var flag = 0;
                        if(typeof(patientCaseData) != 'undefined' && patientCaseData !== ''){
                            $.each( patientCaseData, function( Id, patientDetail ) {
                                if(patientId == Id){
                                    if(typeof(patientDetail.access_level) != 'undefined' && patientDetail.access_level < 3){
                                        $("#studyPatientName").val("DEIDENTIFIED");
                                        flag = 1;
                                        return false;
                                    }
                                }
                            });
                        }
                        if(typeof(patient.name) != 'undefined' && flag !== 1){
                            $("#studyPatientName").val(patient.name);
                        }

                        if(typeof(patient.patientId) != 'undefined'){
                            $("#studtPatientId").val(patient.patientId);
                            $("#studtPatientId").attr('title', patient.patientId);
                        }

                        if(typeof(patient.email) != 'undefined'){
                            $("#studyPatientEmail").val(patient.email);
                        }

                        if(typeof(patient.version) != 'undefined'){
                            $("#currentPatientVersion").val(patient.version);
                        }

                        if(typeof(patient.dicomId) != 'undefined'){
                            $("#currentPatientDicomId").val(patient.dicomId);
                        }

                        if(typeof(patient.ageRange) != 'undefined'){
                            $("#currentPatientAgerange").val(patient.ageRange);
                        }

                        if(typeof(patient.diagnosis) != 'undefined'){
                            $("#currentPatientDiagnosis").val(patient.diagnosis);
                        }

                        if(typeof(patient.comment) != 'undefined'){
                            $("#currentPatientComment").val(patient.comment);
                        }

                        if(typeof(patient.importedDate) != 'undefined'){
                            var dateString   = patient.importedDate;
                            var importedDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            $("#currentPatientImportdate").val(importedDate);
                        }

                        if(typeof(patient.is_removed) != 'undefined'){
                            $("#currentPatientIsremoved").val(patient.is_removed);
                        }

                        if(typeof(patient.other_dicom_ids) != 'undefined'){
                            $("#currentPatientOtherDicomId").val(patient.other_dicom_ids);
                        }

                        if(typeof(patient.dateOfBirth) != 'undefined'){
                            var dateString = patient.dateOfBirth;
                            var dob = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            var mm = dob.getMonth() + 1;
                            var dd = dob.getDate();
                            if(mm < 10){
                                mm = "0" + mm;
                            }
                            if(dd < 10){
                                dd ="0" + dd;
                            }
                            dob = mm + "/" + dd + "/" + dob.getFullYear();
                            $("#studyPatientBirthDate").val(dob);
                        }

                        if(typeof(patient.sex) != 'undefined'){
                            var sex = patient.sex;
                            if(sex == 0){
                                $("#studyPatientMale").attr('checked', 'checked');
                            }else if(sex == 1){
                                $("#studyPatientFemale").attr('checked', 'checked');
                            }
                            else if(sex == 2){
                                $("#studyPatientUnknown").attr('checked', 'checked');
                            }
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });

                //For getting study details
                $.ajax({
                    type     : "get",
                    url      : baseUrl + "patients/study_detail",
                    data     : { studyId : studyId, patientId : patientId },
                    dataType : 'json',
                    success:function(study){
                        $("#currentStudyId").val(study.id);

                        if(typeof(study.name) != 'undefined'){
                            $("#studyName").val(study.name);
                        }

                        if(typeof(study.studyInstanceUID) != 'undefined'){
                            $("#studyInstanceId").val(study.studyInstanceUID);
                            $("#studyInstanceId").attr('title', study.studyInstanceUID);
                        }

                        if(typeof(study.comment) != 'undefined'){
                            $("#studyComment").val(study.comment);
                        }

                        if(typeof(study.diagnosis) != 'undefined'){
                            $("#studyDiagnosis").val(study.diagnosis);
                        }

                        if(typeof(study.date) != 'undefined'){
                            var dateString = study.date;
                            var studyDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            var mm = studyDate.getMonth() + 1;
                            var dd = studyDate.getDate();
                            if(mm < 10){
                                mm = "0" + mm;
                            }
                            if(dd < 10){
                                dd ="0" + dd;
                            }
                            studyDate = mm + "/" + dd + "/" + studyDate.getFullYear();
                            $("#studyDate").val(studyDate);
                        }

                        if(typeof(study.dicomId) != 'undefined'){
                            $("#currentStudyDicomId").val(study.dicomId);
                        }

                        if(typeof(study.studyId) != 'undefined'){
                            $("#currentStudyStudyId").val(study.studyId);
                        }

                        if(typeof(study.patientId) != 'undefined'){
                            $("#currentStudyPatientId").val(study.patientId);
                        }

                        if(typeof(study.caseId) != 'undefined'){
                            $("#currentStudyCaseId").val(study.caseId);
                        }

                        if(typeof(study.physician) != 'undefined'){
                            $("#currentStudyPhysician").val(study.physician);
                        }

                        if(typeof(study.importedDate) != 'undefined'){
                            var dateString   = study.importedDate;
                            var importedDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            $("#currentStudyImportdate").val(importedDate);
                        }

                        if(typeof(study.is_removed) != 'undefined'){
                            $("#currentStudyIsremoved").val(study.is_removed);
                        }

                        if(typeof(study.orientation) != 'undefined'){
                            $("#currentStudyOrientation").val(study.orientation);
                        }

                        if(typeof(study.version) != 'undefined'){
                            $("#currentStudyVersion").val(study.version);
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });
                $("#btnStudyDetailModal").trigger('click');
            }
        }, {
            name: 'Delete',
            img: '../img/delete_Item.png',
            title: 'Delete study',
            fun: function () {
                $("#btnStudyDeleteModal").trigger('click');
            }
        }, {
            name: 'Plan/Schedule a Case',
            img: '../img/add_Item.png',
            title: 'Schedule a Case',
            fun: function () {
                $("#createNewCase").trigger('click');

                //get template list
                getTemplateList();

                //get surgeon list
                getSurgeonList();

                //For getting patient details
                $.ajax({
                    type: "get",
                    url: baseUrl + "patients/patient_detail",
                    data: {patientId: patientId},
                    dataType: 'json',
                    success: function (patient) {
                        $("#currentPatientId").val(patientId);
                        var flag = 0;
                        if (typeof(patientCaseData) != 'undefined' && patientCaseData !== '') {
                            $.each(patientCaseData, function (Id, patientDetail) {
                                if (patientId == Id) {
                                    if (typeof(patientDetail.access_level) != 'undefined' && patientDetail.access_level < 3) {
                                        $("#casepatientName").val("DEIDENTIFIED");
                                        flag = 1;
                                        return false;
                                    }
                                }
                            });
                        }

                        if (typeof(patient.name) != 'undefined' && flag !== 1) {
                            $("#casepatientName").val(patient.name);
                        }
                        //for resetting existing modal data
                        resetCreateCaseFields();
                    },
                    error: function (e) {
                        checkLogout(e.responseText);
                    }
                });
                $("#existingCasesListBody").html('');
                $("#LinkedPatientList").html('');
                $("#btnPatientCaseScheduleModal").trigger('click');
            }
        }];

        //prevent default browser context menu from opening
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        //Calling context menu for study list
        if(navigator.userAgent.indexOf("MSIE 7.0") > -1 ){
            $(".studyname_" + studyId).contextMenu(menu, {triggerOn : 'contextmenu'});
        }else{
            $(".studyname_" + studyId).contextMenu(menu, {triggerOn : 'mouseup'});
        }
    }
}

/**
 * Description: Function to display series images and contextmenu option for series list
 */
function getSeriesContextMenu(event, seriesId, studyId){
    if((event.which) == 3 || typeof(event.which) == 'undefined'){
        $("#currentSeriesId").val(seriesId);
        $("#currentStudyId").val(studyId);

        var patientId = $("#study_" + studyId).parents().attr('class');
        if(typeof(patientId) != 'undefined' && patientId != ''){
            var length = patientId.length;
            var indexOf = patientId.indexOf('_');
            patientId = patientId.substr(indexOf + 1, length - (indexOf + 1));
            $("#currentPatientId").val(patientId);
        }

        //For getting series image list
        getSeriesImageList(event, seriesId);

        //Context menu option for series list
        var menu = [/*{
            name: 'Open',
            img: '../img/patient.png',
            title: 'Open series',
            fun: function () {
                //alert('In progress');
            }
        },*/ {
            name: 'Details',
            img: '../img/edit_Item.png',
            title: 'Series details',
            fun: function () {
                //For getting patient details
                $.ajax({
                    type     : "get",
                    url      : baseUrl + "patients/patient_detail",
                    data     : { patientId : patientId },
                    dataType : 'json',
                    success:function(patient){
                        $("#currentPatientId").val(patient.id);
                        var flag = 0;
                        if(typeof(patientCaseData) != 'undefined' && patientCaseData !== ''){
                            $.each( patientCaseData, function( Id, patientDetail ) {
                                if(patientId == Id){
                                    if(typeof(patientDetail.access_level) != 'undefined' && patientDetail.access_level < 3){
                                        $("#seriesPatientName").val("DEIDENTIFIED");
                                        flag = 1;
                                        return false;
                                    }
                                }
                            });
                        }
                        if(typeof(patient.name) != 'undefined' && flag !== 1){
                            $("#seriesPatientName").val(patient.name);
                        }

                        if(typeof(patient.patientId) != 'undefined'){
                            $("#seriesPatientId").val(patient.patientId);
                            $("#seriesPatientId").attr('title', patient.patientId);
                        }

                        if(typeof(patient.email) != 'undefined'){
                            $("#seriesPatientEmail").val(patient.email);
                        }

                        if(typeof(patient.version) != 'undefined'){
                            $("#currentPatientVersion").val(patient.version);
                        }

                        if(typeof(patient.dicomId) != 'undefined'){
                            $("#currentPatientDicomId").val(patient.dicomId);
                        }

                        if(typeof(patient.ageRange) != 'undefined'){
                            $("#currentPatientAgerange").val(patient.ageRange);
                        }

                        if(typeof(patient.diagnosis) != 'undefined'){
                            $("#currentPatientDiagnosis").val(patient.diagnosis);
                        }

                        if(typeof(patient.comment) != 'undefined'){
                            $("#currentPatientComment").val(patient.comment);
                        }

                        if(typeof(patient.importedDate) != 'undefined'){
                            var dateString   = patient.importedDate;
                            var importedDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            $("#currentPatientImportdate").val(importedDate);
                        }

                        if(typeof(patient.is_removed) != 'undefined'){
                            $("#currentPatientIsremoved").val(patient.is_removed);
                        }

                        if(typeof(patient.other_dicom_ids) != 'undefined'){
                            $("#currentPatientOtherDicomId").val(patient.other_dicom_ids);
                        }

                        if(typeof(patient.dateOfBirth) != 'undefined'){
                            var dateString = patient.dateOfBirth;
                            var dob = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            var mm = dob.getMonth() + 1;
                            var dd = dob.getDate();
                            if(mm < 10){
                                mm = "0" + mm;
                            }
                            if(dd < 10){
                                dd ="0" + dd;
                            }
                            dob = mm + "/" + dd + "/" + dob.getFullYear();
                            $("#seriesPatientBirthDate").val(dob);
                        }

                        if(typeof(patient.sex) != 'undefined'){
                            var sex = patient.sex;
                            if(sex == 0){
                                $("#seriesPatientMale").attr('checked', 'checked');
                            }else if(sex == 1){
                                $("#seriesPatientFemale").attr('checked', 'checked');
                            }
                            else if(sex == 2){
                                $("#seriesPatientUnknown").attr('checked', 'checked');
                            }
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });

                //For getting study details
                $.ajax({
                    type     : "get",
                    url      : baseUrl + "patients/study_detail",
                    data     : { studyId : studyId, patientId : patientId },
                    dataType : 'json',
                    success:function(study){
                        $("#currentStudyId").val(study.id);

                        if(typeof(study.name) != 'undefined'){
                            $("#seriesStudyName").val(study.name);
                        }

                        if(typeof(study.studyInstanceUID) != 'undefined'){
                            $("#seriesStudyInstanceId").val(study.studyInstanceUID);
                            $("#seriesStudyInstanceId").attr('title', study.studyInstanceUID);
                        }

                        if(typeof(study.comment) != 'undefined'){
                            $("#seriesStudyComment").val(study.comment);
                        }

                        if(typeof(study.diagnosis) != 'undefined'){
                            $("#seriesStudyDiagnosis").val(study.diagnosis);
                        }

                        if(typeof(study.date) != 'undefined'){
                            var dateString = study.date;
                            var studyDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            var mm = studyDate.getMonth() + 1;
                            var dd = studyDate.getDate();
                            if(mm < 10){
                                mm = "0" + mm;
                            }
                            if(dd < 10){
                                dd ="0" + dd;
                            }
                            studyDate = mm + "/" + dd + "/" + studyDate.getFullYear();
                            $("#seriesStudyDate").val(studyDate);
                        }

                        if(typeof(study.dicomId) != 'undefined'){
                            $("#currentStudyDicomId").val(study.dicomId);
                        }

                        if(typeof(study.studyId) != 'undefined'){
                            $("#currentStudyStudyId").val(study.studyId);
                        }

                        if(typeof(study.patientId) != 'undefined'){
                            $("#currentStudyPatientId").val(study.patientId);
                        }

                        if(typeof(study.caseId) != 'undefined'){
                            $("#currentStudyCaseId").val(study.caseId);
                        }

                        if(typeof(study.physician) != 'undefined'){
                            $("#currentStudyPhysician").val(study.physician);
                        }

                        if(typeof(study.importedDate) != 'undefined'){
                            var dateString   = study.importedDate;
                            var importedDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            $("#currentStudyImportdate").val(importedDate);
                        }

                        if(typeof(study.is_removed) != 'undefined'){
                            $("#currentStudyIsremoved").val(study.is_removed);
                        }

                        if(typeof(study.orientation) != 'undefined'){
                            $("#currentStudyOrientation").val(study.orientation);
                        }

                        if(typeof(study.version) != 'undefined'){
                            $("#currentStudyVersion").val(study.version);
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });

                //For getting series details
                $.ajax({
                    type     : "get",
                    url      : baseUrl + "patients/series_detail",
                    data     : { studyId : studyId, seriesId : seriesId },
                    dataType : 'json',
                    success:function(series){
                        $("#currentSeriesId").val(series.id);

                        if(typeof(series.name) != 'undefined'){
                            $("#seriesName").val(series.name);
                        }

                        if(typeof(series.seriesInstanceUID) != 'undefined'){
                            $("#seriesInstanceId").val(series.seriesInstanceUID);
                            $("#seriesInstanceId").attr('title', series.seriesInstanceUID);
                        }

                        if(typeof(series.comment) != 'undefined'){
                            $("#currentSeriesComment").val(series.comment);
                        }

                        if(typeof(series.diagnosis) != 'undefined'){
                            $("#seriesStudyDiagnosis").val(series.diagnosis);
                        }

                        if(typeof(series.date) != 'undefined'){
                            var dateString = series.date;
                            var seriesDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            var mm = seriesDate.getMonth() + 1;
                            var dd = seriesDate.getDate();
                            if(mm < 10){
                                mm = "0" + mm;
                            }
                            if(dd < 10){
                                dd ="0" + dd;
                            }
                            seriesDate = mm + "/" + dd + "/" + seriesDate.getFullYear();
                            $("#currentSeriesDate").val(seriesDate);
                        }

                        if(typeof(series.dicomId) != 'undefined'){
                            $("#currentSeriesDicomId").val(series.dicomId);
                        }

                        if(typeof(series.sortOrder) != 'undefined'){
                            $("#currentSeriesSortorder").val(series.sortOrder);
                        }

                        if(typeof(series.importedDate) != 'undefined'){
                            var dateString   = series.importedDate;
                            var importedDate = new Date(dateString.split(".")[0].replace(/-/g,"/"));
                            $("#currentSeriesImportdate").val(importedDate);
                        }

                        if(typeof(series.is_removed) != 'undefined'){
                            $("#currentSeriesIsremoved").val(series.is_removed);
                        }

                        if(typeof(series.modality) != 'undefined'){
                            $("select[name=modality]" ).val(series.modality);
                        }
                    },
                    error:function(e){
                        checkLogout(e.responseText);
                    }
                });
                $("#btnSeriesDetailModal").trigger('click');
            }
        }, {
            name: 'Delete',
            img: '../img/delete_Item.png',
            title: 'Delete series',
            fun: function () {
                $("#btnSeriesDeleteModal").trigger('click');
            }
        }, {
            name: 'Plan/Schedule a Case',
            img: '../img/add_Item.png',
            title: 'Schedule a Case',
            fun: function () {
                $("#createNewCase").trigger('click');

                //get template list
                getTemplateList();

                //get surgeon list
                getSurgeonList();

                //For getting patient details
                $.ajax({
                    type: "get",
                    url: baseUrl + "patients/patient_detail",
                    data: {patientId: patientId},
                    dataType: 'json',
                    success: function (patient) {
                        $("#currentPatientId").val(patientId);
                        var flag = 0;
                        if (typeof(patientCaseData) != 'undefined' && patientCaseData !== '') {
                            $.each(patientCaseData, function (Id, patientDetail) {
                                if (patientId == Id) {
                                    if (typeof(patientDetail.access_level) != 'undefined' && patientDetail.access_level < 3) {
                                        $("#casepatientName").val("DEIDENTIFIED");
                                        flag = 1;
                                        return false;
                                    }
                                }
                            });
                        }

                        if (typeof(patient.name) != 'undefined' && flag !== 1) {
                            $("#casepatientName").val(patient.name);
                        }
                        //for resetting existing modal data
                        resetCreateCaseFields();
                    },
                    error: function (e) {
                        checkLogout(e.responseText);
                    }
                });
                $("#existingCasesListBody").html('');
                $("#LinkedPatientList").html('');
                $("#btnPatientCaseScheduleModal").trigger('click');
            }
        }];

        //prevent default browser context menu from opening
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        //Calling context menu for patient list
        if(navigator.userAgent.indexOf("MSIE 7.0") > -1 ){
            $(".seriesname_" + seriesId).contextMenu(menu, {triggerOn : 'contextmenu'});
        }else{
            $(".seriesname_" + seriesId).contextMenu(menu, {triggerOn : 'mouseup'});
        }
    }
}

/**
 * Description: Function to display case contextmenu option for patient list
 */
function getCaseContextMenu(event, caseId){
    setSelectionColorForPatient(caseId, 'case_');
    if((event.which) == 3 || typeof(event.which) == 'undefined'){
        //Context menu option for case list
        var menu = [{
            name: 'Open',
            img: '../img/patient.png',
            title: 'Open case',
            fun: function () {
               openCaseDetail(caseId);
            }
        },  {
            name: 'Delete',
            img: '../img/delete_Item.png',
            title: 'Delete case',
            fun: function () {
                $("#currentCaseId").val(caseId);
                $("#btnCaseDeleteModal").trigger('click');
            }
        }];

        //prevent default browser context menu from opening
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        //Calling context menu for case list
        if(navigator.userAgent.indexOf("MSIE 7.0") > -1 ){
            $("#caseName_" + caseId).contextMenu(menu, {triggerOn : 'contextmenu'});
        }else{
            $("#caseName_" + caseId).contextMenu(menu, {triggerOn : 'mouseup'});
        }
    }
}

/**
 * Description  : Function to get one patient details at a time
 */
function getPatientDetails(patientId) {
    $.ajax({
        type: "get",
        url: baseUrl + "patients/patient_detail",
        data: {patientId: patientId},
        dataType: 'json',
        success: function (patient) {
            return patient;
        },
        error: function (e) {
            checkLogout(e.responseText);
        }
    });
}

/**
  * Description  : Function to get surgeon name on create case modal
*/
function getSurgeonList(){
    $.ajax({
        url: baseUrl + 'patients/surgeon_list',
        dataType: "json",
        success:function(response){
            if(response.status == 'Success'){
                $("#surgeonList").html('');
                allSurgeonEmail = response.all_surgeon_email;
                $.each(response.all_surgeon_email, function(name, email) {
                    $("#surgeonList").append("<option value="+ email +">"+ name +"</option>");
                });

                //To check previously selected surgeon name, If selected then set it as bydefault
                var surgeonName = readCookie('selectedSurgeonName');

                if(typeof(surgeonName) != 'undefined' && surgeonName != null && surgeonName != '') {
                    $("#surgeonList").val(surgeonName);
                }
            }else{
                alert("An error occurred while getting surgeon name.");
            }
        },
        error:function(e){
            checkLogout(e.responseText);
            /*alert("An error occurred while deleteing patient.Please try again.");*/
        }
    });
}

/**
  * Description  : Function to get template list on create case modal
*/
function getTemplateList(){
    $.ajax({
        url: baseUrl + 'patients/template_list',
        dataType: "json",
        success:function(response){
            if(response.status == 'Success'){
                templateDetails = response.templates;
                $("#templateName").html('');
                $("#templateName").append("<option value='0'>(Choose Template)</option>");
                $.each(response.templates, function(key, obj) {
                    $("#templateName").append("<option value="+ obj.id +">"+ obj.description +"</option>");
                });
            }else{
                //alert("An error occurred while getting template name.");
            }
        },
        error:function(e){
            checkLogout(e.responseText);
            /*alert("An error occurred while deleteing patient.Please try again.");*/
        }
    });
}

/**
  * Description  : Function to select existing case for current patient
*/
function selectCurrentPatientExistingCase(caseId){
    $("#selectedExistingCaseId").val(caseId);
    $('#existingCasesList tr td').each(function () {
        $(this).css({'background-color': '#f9f9f9'});
    });

    $("#caseRow_" + caseId + " td").each(function () {
        $(this).css({'background-color': '#d9edf7'});
    });
}

/**
  * Description  : Function to select existing case for current patient
*/
function selectLinkedPatientExistingCase(caseId){
    $("#selectedExistingCaseId").val(caseId);
    $('#expListLinkedPatient li').each(function () {
        $(this).css({'background-color': '#f9f9f9'});
    });
    $("#linkedPatient_" + caseId).css({'background-color': '#d9edf7'});
}

/**
  * Description  : Function to create case from existing case
*/
function createCaseFromSelectedExistingCase(caseId){
    var patientId = $("#currentPatientId").val();
    var studyId   = $("#currentStudyId").val();
    var seriesId  = $("#currentSeriesId").val();
    if(typeof(patientId) == 'undefined' || patientId == '' || patientId < 1){
        patientId = 0;
    }
    if(typeof(studyId) == 'undefined' || studyId == '' || studyId < 1){
        studyId = 0;
    }
    if(typeof(seriesId) == 'undefined' || seriesId == '' || seriesId < 1){
        seriesId = 0;
    }
    $("#createPatientCase").attr('disabled', 'disabled');
    $("#loadingImage").show();
    $.ajax({
        url: baseUrl + "patients/create_case_from_existing_case",
        type: "post",
        dataType: "json",
        data:{case_id: caseId,
            patient_id: patientId,
            study_id: studyId,
            series_id: seriesId
        },
        success:function(response){
            $("#loadingImage").hide();
            $("#createPatientCase").removeAttr('disabled');
            if(response.status == 'Success'){
                location.href = baseUrl + "cases/view/" + caseId;
            }else{
                alert(response.message);
            }
        },
        error:function(e){
            $("#loadingImage").hide();
            $("#createPatientCase").removeAttr('disabled');
            checkLogout(e.responseText);
        }
    });
}

//Function to get linked patient case, study and series list
function getLinkedPatientCaseStudySeriesList(event, Id, targetUrl, isFromViewLinkedPatient)
{
    if(typeof(isPendingAJAXRequestForStudyCasePatient) != 'undefined' && isPendingAJAXRequestForStudyCasePatient == 1){
        isPendingAJAXRequestForStudtCase.abort();
    }
    $("#currentPatientId").val(Id);
    var patientIdVal = Id;
    var accessLevel = 3;

    var rowId               = '#linkedPatient_' + Id;
    var className           = $(rowId).attr('class');
    isFromViewLinkedPatient = (typeof(isFromViewLinkedPatient) != 'undefined' && isFromViewLinkedPatient != '') ? isFromViewLinkedPatient : 0;
    $('.iw-contextMenu').css('display', 'none');
    if(className.match("collapsed expanded") == null){
        var rowDetails = $(".linkedPatient_"+Id).html();
        if(typeof(targetUrl) == 'undefined' ){
            targetUrl  = 'patients/study_series';
            rowDetails = $(".linkedPatient_"+Id+" ul li").html();

            if(typeof(patientIdVal) != 'undefined' && patientIdVal != ''){
                if(typeof(patientCaseData) != 'undefined' && patientCaseData !== ''){
                    $.each( patientCaseData, function( indexKey, patientDetail ) {
                        if(patientIdVal == indexKey){
                            accessLevel = (typeof(patientDetail.access_level) != 'undefined') ? patientDetail.access_level : 3;
                            return false;
                        }
                    });
                }
            }

        }else{
            targetUrl  = 'patients/patient_study_cases';
        }

        $("#expListLinkedPatient li").each(function () {
            $(this).css({'background-color': '#f9f9f9'});
        });

        if(typeof(rowDetails) != 'undefined' || $(".linkedPatient_"+Id).text() == "No details")
        {
            return true;
        }
        $(".linkedPatient_" + Id).remove();
        $("#loadingImageForPatient").show();
        $('#loadingImageForPatient').css({width: '30px', position:'absolute', 'left':event.clientX + 63, 'top':event.clientY - 12});
        isPendingAJAXRequestForStudyCasePatient = 1;
        isPendingAJAXRequestForStudtCase = $.ajax({
            type    : "get",
            url     : baseUrl + targetUrl,
            data    : {
                id  : Id,
                is_from_linked_patient : 1,
                is_from_view_linked_patient : isFromViewLinkedPatient,
                access_level : accessLevel
            },
            success:function(response){
                checkLogout(response);
                $("#loadingImageForPatient").hide();
                if(response != '' && response != '<ul></ul>'){
                    $(rowId).append('<ul class="linkedPatient_'+ Id + '">'+response+'</ul>');
                    prepareListForStudy(Id, 1);
                }else{
                    $(rowId).append('<ul class="linkedPatient_'+ Id + '"><li><i>No details</i></li></ul>');
                }
                isPendingAJAXRequestForStudyCasePatient = 0;
            },
            error:function(e){
                isPendingAJAXRequestForStudyCasePatient = 0;
                checkLogout(e.responseText);
                $("#loadingImageForPatient").hide();
                //alert("An error occurred. Please try again.");
            }
        });
    }
}

/**
 * Function to get and update updated patient details like patient name etc.
 */
function getAndUpdatePatientDetail(isFromModal){
    $('#loadingImageForPatient').css({width: '60px', position:'absolute', 'left':'35%', 'top':'120px'});
    $.ajax({
        type    : "get",
        url     : baseUrl + "patients/updated_patient_detail",
        success:function(response){
            var patientsAccessLevelDetail = $.parseJSON(response);
            patientCaseData = patientsAccessLevelDetail;

            $.each( patientsAccessLevelDetail, function( patientId, patientDetail ) {
                if(typeof(patientDetail.access_level) != 'undefined' && patientDetail.access_level > 2){
                    var elementId = "#label_" + patientId;
                    if(typeof(isFromModal) != 'undefined' && isFromModal == 1){
                        elementId = "#from_modal_label_" + patientId;
                    }
                    var patientName = (typeof(patientDetail.name) != 'undefined') ? patientDetail.name : '';
                    $(elementId).html(patientName);
                    $(elementId).removeClass('deidentified_name');
                    $(elementId).addClass('all_access_name');
                }
            });
        },
        error:function(){
            log("Error while reloading patient name");
        }
    });
}

/**
* Description  : Function to update collaborator accordion
*/
function updateCollaboratorAccordion(response){
    //remove older html
    $("#accessorsList").html('');
    $("#collaboratorsList").html('');
    $("#removeCasesContacts").find('p').first().remove();
    $("#removeSelectedContacts").show();
    var rodOrderCollaboratorList = $('#rodOrderCollaboratorList').val();
    if(rodOrderCollaboratorList != ''){
        rodOrderCollaboratorList = $.parseJSON(rodOrderCollaboratorList);
    }
    var len = $("#removeCasesContacts").children().length;
    if(len == 0){
        $("#removeCasesContacts").html("<div id='accessorsList'></div><hr><button id='removeSelectedContacts' type='button' class='btn btn-inverse pull-right general_template_view'>Remove Collaborators</button></div>");
    }

    // for accessor list
    var cnt = 0;
    var isAccessorEmpty   = 1;
    if((typeof(response.accessors) != 'undefined')){
        var currentUserEmail    = typeof(response.current_user_email) != 'undefined' ? response.current_user_email.toLowerCase() : '';
        var caseOwnerEmail      = typeof(response.owner_email)!= 'undefined' ? response.owner_email.toLowerCase() : '';

        var isNotRemovedFromCase = 0;

        $.each(response.accessors, function(key, obj) {
            if(typeof(obj.email) != 'undefined' && typeof(response.current_user_email) != 'undefined' && obj.email.toLowerCase() == response.current_user_email.toLowerCase()){
                isNotRemovedFromCase = 1;
            }

            var accessor_id = 0;
            var name = '';
            var email = '';
            var case_user_id = 0;
            var first_name = '';
            var last_name = '';

            $.each(obj, function(key, val) {
                if(key == "email"){
                    email = (typeof(val) != 'undefined') ? val : '';
                }

                if(key == "first_name"){
                    first_name = (typeof(val) != 'undefined') ? val : '';
                }

                if(key == "last_name"){
                    last_name = (typeof(val) != 'undefined') ? val : '';
                }

                if(key == "id"){
                    case_user_id = (typeof(val) != 'undefined') ? val : 0;
                }
            });


            //check for case owner email from collaborator list
            if(email !== response.owner_email){
                cnt++;
                name = (typeof(first_name) != 'undefined') && (typeof(last_name) != 'undefined') && (first_name != '') && (last_name != '') ? first_name+" "+last_name : email;
                email = email.replace('--at--','@');
                email = $.trim(email);
                accessor_id = (typeof(case_user_id) != 'undefined') && (case_user_id != 0) ? case_user_id: email;
                var htmlCollaborator = '';
                var isFound =$.inArray(email, rodOrderCollaboratorList);
                var isDisableAttribute = "";
                if(isFound > -1){
                    isDisableAttribute = "disabled='disabled'";
                }

                htmlCollaborator += "<input " + isDisableAttribute +" type='checkbox' value="+accessor_id+" class='pull-left'>&nbsp;";

                if(typeof(case_user_id) != 'undefined' && case_user_id > 0){
                    htmlCollaborator += "<a href="+baseUrl+"contacts/view/"+case_user_id+">"+name+"</a>";
                    var defaultCaseCollaborators = $("#defaultCaseCollaborators").val();
                    if(defaultCaseCollaborators == ''){
                        $("#defaultCaseCollaborators").val(email);
                        isAccessorEmpty++;
                    }else{
                        if(isAccessorEmpty != 1){
                            $("#defaultCaseCollaborators").val(defaultCaseCollaborators +"," + email);
                        }
                        else{
                         $("#defaultCaseCollaborators").val(email);
                        }
                        isAccessorEmpty++;
                    }
                    $("#accessorsList").append("<p email="+email+">"+htmlCollaborator+"</p>");
                }else{
                    $("#accessorsList").append("<p email="+email+">" + htmlCollaborator + name);
                }

                //$("#accessorsList").append("<p email="+email+">"+htmlCollaborator+"</p>");
            }
        });

        var allDisplayedCollaboratorEmailList = '';
        $( "#accessorsList p" ).each( function( index, element ){
            var emailText = $( this ).attr('email');
            if (typeof emailText !== typeof undefined && emailText !== false) {
                allDisplayedCollaboratorEmailList += emailText + ",";
            }
        });

        var tempEmailList = $("#templateColList").val();
        if(tempEmailList != ''){
            tempEmailList = tempEmailList.split(',');
            if(tempEmailList.length > 0){
                if(tempEmailList.length > 1){
                    tempEmailList.splice(-1,1)
                }

                for(var indexKey=0; indexKey < (tempEmailList.length); indexKey++){
                    if(allDisplayedCollaboratorEmailList.match(tempEmailList[indexKey]) == null){
                        $("#accessorsList").append("<p email="+tempEmailList[indexKey]+" class='templateCollaboratotList'><input type='checkbox' value="+tempEmailList[indexKey]+" class='pull-left from_template'>&nbsp;"+tempEmailList[indexKey]+"</p>");
                        cnt ++;
                    }
                }
            }
        }

        //If not a case owner and user remove itself from case then redirect to case list page
        if(caseOwnerEmail != currentUserEmail && isNotRemovedFromCase == 0 ){
            location.href=baseUrl + "cases";
        }
    }
    //If accessors are empty then remove all defaultCaseCollaborators value
    if(response.accessors == ''){
         $("#defaultCaseCollaborators").val('');
    }
    if(cnt <= 0){
        $("#removeCasesContacts").html("<p>There are no Collaborators on this case</p>");
        $("#removeSelectedContacts").hide();
    }

    // for contact and group list
    if(response.can_share && ((typeof(response.contacts_select) != 'undefined') || (typeof(response.users_group) != 'undefined'))){
        var name = '';
        var id   = '';
        var cnt  = 0;
        // for adding contact
        $.each(response.contacts_select, function(key, val) {
            key = $.trim(key);
            cnt++;
            $("#collaboratorsList").append("<label id='lblcol_"+key +"' for='collaborators' class='checkbox'><input type='checkbox' value="+key+" name='permissions' class='pull-right'>"+val+"</label>");
        });

        // for adding group
        $.each(response.users_group, function(key, obj){
            $.each(obj, function(key, val) {
                if(key == "id"){
                    id = (typeof(val) != 'undefined') ? val : '';
                }
                if(key == "name"){
                    name = (typeof(val) != 'undefined') ? val : '';
                }
            });
            $("#collaboratorsList").append("<label for='groups' class='checkbox'><input type='checkbox' class='groups' value="+id+" name='permissions' class='pull-right'>"+name+"&nbsp;<img id='groupImage' src="+response.base_path+"img/groups.png></label>");
        });
    }
    // update collaborator count
    var numCollaborators = $('#removeCasesContacts p').length;
    if(numCollaborators == 1){
        $( "#removeCasesContacts p" ).each( function( index, element ){
            var text = $( this ).text();
            var count = text.search("There are");
            if(count != -1){
                numCollaborators = 0;
            }
        });
    }

    var templateCollaboratorCount = 0;
    $( "#accessorsList p" ).each( function( index, element ){
        if ($( this ).hasClass( "templateCollaboratotList" ) ) {
            templateCollaboratorCount ++;
        }
    });

    var actualAddedCollaboratorCount = numCollaborators - templateCollaboratorCount;

    if(actualAddedCollaboratorCount == 0){
        renderSendMessageHTML(0);
    }else{
        renderSendMessageHTML(1);
    }

    $("#AssignCollaborators").html("("+numCollaborators+")");

    showHideAddToCaseButton();
}

/**
 * Function to filter image thumbnail by series/images
 * @param isFilterForGallery : 1 = function called for case gallery page otherwise from measure screen
 */
function filterThumbnailActionAjax(isFilterForGallery, isDataFromApi, patientId, studyId, seriesId, whichSeries, lastSeries){
    var isFilterForGallery      = (typeof(isFilterForGallery) != 'undefined') ? isFilterForGallery : 0;
    var isDataFromApi           = (typeof(isDataFromApi) != 'undefined') ? isDataFromApi : 0;
    var patientId               = (typeof(patientId) != 'undefined') ? patientId : 0;
    var studyId                 = (typeof(studyId) != 'undefined') ? studyId : 0;
    var seriesId                = (typeof(seriesId) != 'undefined') ? seriesId : 0;
    var whichSeries             = (typeof(whichSeries) != 'undefined') ? whichSeries : 0;
    var lastSeries              = (typeof(lastSeries) != 'undefined') ? lastSeries : 0;

    if(isFilterForGallery == 1){
        $('.loadingGallery .loading').show();
    }

    var seriesFilterChecked = '';
    var seriesFilterAll = '';
    var caseId  = 0;
    var selectedFilterVal = 0;

    if(isFilterForGallery == 1){
        $('#uploadImagesButton').removeClass('sm-hide');
        $('#uploadImagesButtonIE').removeClass('sm-hide');
        $('#deleteImagesButton').addClass('sm-hide');
        $('#editImage').removeClass('active');

        $('#editFilter li').each(function() {
            var checkbox = $(this).find('input.sm-image-tag');
            var checkboxId = checkbox.attr('id');
            if(checkbox.is(":checked")){
                if(checkboxId != ''){
                    seriesFilterChecked += checkboxId + ',';
                }
            }

            if(typeof(checkboxId) != 'undefined'){
                seriesFilterAll += checkboxId + ',';
            }
        });

        if(seriesFilterChecked != ''){
            seriesFilterChecked = seriesFilterChecked.slice(0,-1);
        }

        if(seriesFilterAll != ''){
            seriesFilterAll = seriesFilterAll.slice(0,-1);
        }

        var browserUrlParts = window.location.href.split('/');
        caseId = browserUrlParts[browserUrlParts.length - 1];
        selectedFilterVal = $('#filterThumbnail').val();
    }else{
        caseId            = $('#case_id').val();
        selectedFilterVal = $('#filterThumbnailBy').val();
    }

    if(caseId === 'patients'){
        caseId = 0;
    }
    //For filter image thumbnails by series/image
    if(caseId <= 0){
        if($("#currentPatientId").val() > 0){
            patientId = $("#currentPatientId").val();
        }else if($("#currentStudyId").val() > 0){
            studyId = $("#currentStudyId").val();
        }else{
            seriesId = $("#currentSeriesId").val();
        }
    }

    var selectedImageIds = $('#selected_images').val();
    selectedImageIds = (typeof(selectedImageIds) == 'undefined') ? '' : selectedImageIds;

    var seriesIds = $("#getCaseSeriesIds").val();
    seriesIds     = seriesIds.split(',');
    seriesId      = seriesIds[0];

    var count =0;
    var callback = function(count){
        if(count < lastSeries){
            getCaseSeriesImages(callback,count);
        }
    };
    getCaseSeriesImages(callback,count);
    //Ajax request to get HTML as per filter value selected
    function getCaseSeriesImages(callback, count){
        $.ajax({
            url     : baseUrl + "files/thumbnail_html",
            type    : "get",
            cache   : false,
            async   : true,
            data    : {
                case_id             : caseId,
                patient_id          : patientId,
                study_id            : studyId,
                series_id           : seriesId,
                filter_by           : selectedFilterVal,
                tag_checked         : seriesFilterChecked,
                all_tags            : seriesFilterAll,
                is_gallery_page     : isFilterForGallery,
                selected_image_ids  : selectedImageIds,
                data_from_api       : isDataFromApi,
                which_series        : whichSeries,
                last_series         : lastSeries
            },
            success:function(response){
                if(response != ''){
                    checkLogout(response);
                    if(isFilterForGallery == 1){
                        if(response != ''){
                            $('#caseThumbnail').append(response);
                            $('#caseThumbnail').show();
                            $('.no_images_text').hide();

                            var numberOfListItem = $("#caseThumbnail li").length;
                            if(numberOfListItem > 1){
                                $('#btnCompareImages').show();
                            }else{
                                $('#btnCompareImages').hide();
                            }
                        }else{
                            $('.no_images_text').hide();
                            $('#btnCompareImages').hide();
                        }
                    }else{
                        $('#thumbnailList').html(response);
                    }
                    $( '.draggable' ).draggable({ helper: 'clone' });
                }else{
                    if(caseId <= 0){
                        $('#caseThumbnail').html('');
                        $('.no_images_text').show();
                    }
                }
                //To display image count on create case modal
                var imageCount = $("#imageCount").val();
                if(typeof(imageCount) != 'undefined' && imageCount > 0){
                    $("#patientImageCount").html('');
                    $("#patientImageCount").html(imageCount);
                    $('#createPatientCase').attr('disabled', false);
                }else{
                    $('#createPatientCase').attr('disabled', true);
                }

                if(isDataFromApi == 1){
                    var callBack = function(){
                        initializeSeriesOption();
                    };

                    if(caseId > 0){
                        if(lastSeries == whichSeries){
                            //To filter by images if case having only one series
                            var numberOfListItem = $("#caseThumbnail li").length;
                            if(typeof(numberOfListItem) != 'undefined' && numberOfListItem == 1) {
                                $("#filterThumbnail").val('0');
                                filterThumbnailAction(1);
                            }
                            $('.loadingGallery .loading').hide();
                            if($('#caseThumbnail').children().length > 0){
                                $('#filterThumbnail').attr('disabled', false);
                                $('#editImage').attr('disabled', false);
                                $('#includeIcon').attr('disabled', false);
                            }
                            getSeriesOptionHtml(caseId, patientId, studyId, seriesId, callBack);
                            storeFilesToDirectory(caseId, seriesId);
                        }
                    }
                }
                count       = count + 1;
                whichSeries = whichSeries + 1;
                seriesId    = seriesIds[count];
                callback(count);
            },
            error:function(e){
                checkLogout(e.responseText);
            }
        });
    }
}

/**
 * Function to get all series ids of case
 */
function getCaseSeriesIds(){
    var caseId = 0;
    var seriesIds = [];
    var whichSeries = 0;
    var lastSeries = 0;
    var browserUrlParts = window.location.href.split('/');
    caseId = browserUrlParts[browserUrlParts.length - 1];
    if(caseId < 1){
        caseId = $('#case_id').val();
    }
    $('.loadingGallery .loading').show();
    $.ajax({
        url     : baseUrl + "files/case_series_ids",
        type    : "get",
        cache   : false,
        dataType: "json",
        data    :{case_id: caseId},
        success:function(response){
            if(response.status == 'Success'){
                lastSeries = response.seriesIds.length;
                $.each(response.seriesIds, function(key, seriesId) {
                    var ids = $("#getCaseSeriesIds").val();
                    ids = ids + seriesId + ',';
                    $("#getCaseSeriesIds").val(ids);
                });
            }else{
                $('.loadingGallery .loading').hide();
            }
            if(lastSeries == 0){
                $('.loadingGallery .loading').hide();
            }else{
                whichSeries = 1;
                filterThumbnailActionAjax(1, 1, 0, 0, 0, whichSeries, lastSeries);
            }
        },
        error:function(event){
            checkLogout(event.responseText);
            $('.loadingGallery .loading').hide();
            //alert("An error occurred. Please try again.");
        }
    });
}

/**
 * Function to reset all fields of the patient and study
 */
function resetCreateCaseFields(){

    $("#caseDescription").val("New Case");
    $("#caseHospital").val("");
    $('#caseScheduled').attr('checked', false);
    $("#templateName").val("0");
    $("#caseScheduled").val("0");
    var caseDate = new Date();
    var mm = caseDate.getMonth() + 1;
    var dd = caseDate.getDate();
    if(mm < 10){
        mm = "0" + mm;
    }
    if(dd < 10){
        dd ="0" + dd;
    }
    caseDate = mm + "/" + dd + "/" + caseDate.getFullYear();
    $("#caseDate").val(caseDate);
    $("#caseTime").val("07:00 am");
    $("#caseDuration").val("7200");
    $(".date_time_duration").hide();
}

/**
 * Function to get send message HTML
 */
function renderSendMessageHTML(isCollaboratorExist){
    var caseId = $('[name="case_id"]').val();
    var sendMessageHTML = '';

    if(isCollaboratorExist == 1){
        sendMessageHTML += '<div class="span7 set_left_margin"><div class="well">'+
            '<input type="hidden" value="'+ caseId +'" name="case_id"><input type="hidden" value="cases/view/'+ caseId +'"'+
            ' name="message_next"><label for="message_cc_myself" class="checkbox">'+
            '<input type="checkbox" name="message_cc_myself" id="message_cc_myself">Send Myself a Copy'+
            '</label><textarea class="span6" name="message_note" rows="4"></textarea>'+
            '<button class="btn btn-inverse case_accordion_margin" id="sendMessage" type="button">'+
            '<i class="icon-comment icon-white"></i>Send</button></div></div>';
    }else{
        sendMessageHTML += '<div class="span7 set_left_margin"><div class="well">'+
            '<p>This case has not been shared. Must add collaborators before you can send messages.</p>'+
            '</div></div>';
    }

    $('#sendMessageSection').html(sendMessageHTML);
}

/**
 * Function to validate add to group
 */
function validateAddToGroup(){
    var isContinue = true;
    var groupName = $('#group_name').val();
    var existGroupName = $('#group_id').val();
    if(($.trim(groupName) == '' && (typeof(existGroupName) != 'undefined' && existGroupName == '')) ||
        (typeof(existGroupName) == 'undefined' && $.trim(groupName) == '')){
        alert("Please enter group name.");
        return false;
    }

    $( "#associatedGroupList .assigned_group" ).each( function( index, element ){
        var linkText = $( this ).text();
        if($.trim(groupName) == $.trim(linkText)){
            alert("This contact group has been already assigned.");
            isContinue = false;
            return false;
        }
    });

    return isContinue;
}

/**
 * Function to fetch image from clipboard
 */
function handlepaste (elem, e) {
    var isImgSrc = $("#clipboardImage").attr('src');
    if(typeof(isImgSrc) != 'undefined' && isImgSrc != ''){
        return true;
    }
    //For IE browser
    var browser = BrowserDetect.browser;
    if(browser == 'Explorer' || browser == 'Mozilla'){
        return handlepasteforIE(elem, e);
    }else{
        var savedcontent = elem.innerHTML;
        var imgWidth, imgHeight, x2, y2;

        if (e && e.clipboardData || e.clipboardData.getData) {// Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
            var items = e.clipboardData.items || e.clipboardData.getData;
            if(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) == false ){
                setTimeout(function(){
                    var imgSrc = $("#pasteDiv img").attr('src');
                    if(typeof(imgSrc) != 'undefined' && imgSrc != ''){
                        $("#clipboardImage").attr('src', imgSrc);
                        $("#pasteDiv").hide();
                        $("#pasteDiv").html('');
                        $("#clipboardImage").show();
                        imgWidth    = $("#clipboardImage").width();
                        imgHeight   = $("#clipboardImage").height();
                        x2          = imgWidth;
                        y2          = imgHeight;
                        xAxis      = 0;
                        yAxis      = 0;
                        thumbWidth = imgWidth;
                        thumbHeight= imgHeight;
                        setTimeout(function(){
                            $('#clipboardImage').imgAreaSelect({ x1: xAxis, y1: yAxis, x2: x2, y2: y2 });
                        }, 1000);
                    }else{
                        var htmlPrintScreenInstruction = getPasteActionHtml();
                        $("#pasteDiv").show();
                        $("#pasteDiv").html(htmlPrintScreenInstruction);
                        $("#clipboardImage").hide();
                    }
                }, 100);
            }

            if (items) {
                // Loop through all items, looking for any kind of image
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image/png") !== -1) {
                        // We need to represent the image as a file,
                        var blob = items[i].getAsFile();
                        var reader = new FileReader();
                        reader.onload = function(event) {
                            $("#clipboardImage").attr('src', event.target.result);
                            $("#clipboardImage").show();
                            imgWidth    = $("#clipboardImage").width();
                            imgHeight   = $("#clipboardImage").height();
                            x2          = imgWidth;
                            y2          = imgHeight;
                            xAxis      = 0;
                            yAxis      = 0;
                            thumbWidth = imgWidth;
                            thumbHeight= imgHeight;
                            setTimeout(function(){
                                $('#clipboardImage').imgAreaSelect({ x1: xAxis, y1: yAxis, x2: x2, y2: y2 });
                            }, 1000);
                        };
                        reader.readAsDataURL(blob);
                        $("#pasteDiv").hide();
                    }
                }
            }else {
                elem.innerHTML = "";
            }

            waitforpastedata(elem, savedcontent);
            if (e.preventDefault) {
                e.stopPropagation();
                e.preventDefault();
            }
            return false;
        }else {
            // Everything else - empty editdiv and allow browser to paste content into it, then cleanup
            elem.innerHTML = "";
            waitforpastedata(elem, savedcontent);
            return true;
        }
    }
}

/**
 * Function to fetch image from clipboard for IE browser
 */
function handlepasteforIE(elem, e) {
    var savedcontent = elem.innerHTML;
    if (e) {// Webkit - get data from clipboard, put into editdiv, cleanup, then cancel event
        var items = 'true';
        var imgWidth, imgHeight, x2, y2;
        setTimeout(function(){
            var imgSrc = $("#pasteDiv img").attr('src');
            if(typeof(imgSrc) != 'undefined' && imgSrc != ''){
                $("#clipboardImage").attr('src', imgSrc);
                $("#pasteDiv").hide();
                $("#pasteDiv").html('');
                $("#clipboardImage").show();
                imgWidth    = $("#clipboardImage").width();
                imgHeight   = $("#clipboardImage").height();
                x2          = imgWidth;
                y2          = imgHeight;
                xAxis      = 0;
                yAxis      = 0;
                thumbWidth = imgWidth;
                thumbHeight= imgHeight;
                setTimeout(function(){
                    $('#clipboardImage').imgAreaSelect({ x1: xAxis, y1: yAxis, x2: x2, y2: y2 });
                }, 1000);
            }else{
                var htmlPrintScreenInstruction = getPasteActionHtml();
                $("#pasteDiv").show();
                $("#pasteDiv").html(htmlPrintScreenInstruction);
                $("#clipboardImage").hide();
            }
        }, 100);

        if (items) {
            // Loop through all items, looking for any kind of image
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image/png") !== -1) {
                    // We need to represent the image as a file,
                    var blob = items[i].getAsFile();
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        $("#clipboardImage").attr('src', event.target.result);
                        $("#clipboardImage").show();
                        imgWidth    = $("#clipboardImage").width();
                        imgHeight   = $("#clipboardImage").height();
                        x2          = imgWidth;
                        y2          = imgHeight;
                        xAxis      = 0;
                        yAxis      = 0;
                        thumbWidth = imgWidth;
                        thumbHeight= imgHeight;
                        setTimeout(function(){
                            $('#clipboardImage').imgAreaSelect({ x1: xAxis, y1: yAxis, x2: x2, y2: y2 });
                        }, 1000);
                    };
                    reader.readAsDataURL(blob);
                    $("#pasteDiv").hide();
                }
            }
        }else {
            elem.innerHTML = "";
        }

        waitforpastedata(elem, savedcontent);
        if (e.preventDefault) {
            e.stopPropagation();
            e.preventDefault();
        }
        return false;
    }else {
        // Everything else - empty editdiv and allow browser to paste content into it, then cleanup
        elem.innerHTML = "";
        waitforpastedata(elem, savedcontent);
        return true;
    }
}


/**
 * Function to wait till image will paste
 */
function waitforpastedata (elem, savedcontent) {
    if (elem.childNodes && elem.childNodes.length > 0) {
        processpaste(elem, savedcontent);
    }else {
        that = {
            e: elem,
            s: savedcontent
        }
        that.callself = function () {
            waitforpastedata(that.e, that.s)
        }
        setTimeout(that.callself,20);
    }
}

/**
 * Function to do process on pasted image
 */
function processpaste (elem, savedcontent) {
    pasteddata = elem.innerHTML;
    //Alternatively loop through dom (elem.childNodes or elem.getElementsByTagName) here

    elem.innerHTML = savedcontent;
}

/**
 * Function to open modal for getting series name
 */
function uploadClipboardImage(imagePath){
    imageAreaSelect.cancelSelection();
    $("#addClipboardModel").modal('hide');
    $("#localImagePath").val(imagePath);
    $("#btnGetSeriesNameModal").trigger('click');
}

/**
 * Function to prevent drag and drop on clipboard modal
 */
function preventdragdrop (event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

/**
 * Function to prevent drag and drop on clipboard modal
 */
function preventfromedit (event) {
    var keyCode  = event.keyCode;//For IE
    var ctrlDown = event.ctrlKey||event.metaKey // Mac support
    if(keyCode == 86 && ctrlDown){
        return true;
    }else{
        event.returnValue = false;
        return false;
    }
}

/**
 * Function to display link patient context menu option and call link patient API
 */
function getContextMenuForSelectedPatient(event, patientId){
    //Context menu option for linked patient list
    var menu = [{
        name    : 'Link Patients',
        img     : '../img/linked_patient.png',
        title   : 'Link Patients',
        fun: function () {

            if(typeof(patientCaseData) != 'undefined' && patientCaseData !== ''){
                var isContinue = true;
                $.each( patientCaseData, function( indexKey, patientDetail ) {
                    if(selectedPatientIds.indexOf(parseInt(indexKey)) != -1){
                        if(typeof(patientDetail.is_own_patient) != 'undefined' && patientDetail.is_own_patient == 0){
                            alert("You do not have permission to link these patients.");
                            isContinue = false;
                            return false;
                        }
                    }
                });

                if(isContinue == false){
                    return;
                }
            }

            var patinetsNameHtml = "WARNING: The following patients are about to be linked:\n";
            if(typeof(selectedPatientIds) != 'undefined' && selectedPatientIds !== '') {
                $.each(selectedPatientIds, function (indexKey, id) {
                    patinetsNameHtml += "- " + $("#label_" + id).html() + "\n";
                });
            }
            patinetsNameHtml += "\nContinue?";
            var r = confirm(patinetsNameHtml);
            if (r != true) {
                return false;
            }

            $('#loadingImage').show();
            $.ajax({
                url: baseUrl + "patients/link_patients",
                type: "POST",
                dataType: "json",
                data:{ selected_patient_ids: selectedPatientIds },
                success:function(response){
                    $('#loadingImage').hide();
                    location.reload();
                },
                error:function(e){
                    checkLogout(e.responseText);
                    $('#loadingImage').hide();
                }
            });
        }
    }];

    //prevent default browser context menu from opening
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }

    //Calling context menu for patient list
    if(navigator.userAgent.indexOf("MSIE 7.0") > -1 ){
        $(".name_" + patientId).contextMenu(menu, {triggerOn : 'contextmenu'});
    }else{
        $(".name_" + patientId).contextMenu(menu, {triggerOn : 'mouseup'});
    }
}

/**
 * Function to show/hide Add to case button
 */
function showHideAddToCaseButton(){
    if($('#collaboratorsList').children().length < 1){
        $('#addMoreCollaborators').hide();
    }else{
        $('#addMoreCollaborators').show();
    }
}

/**
 * Get Paste Action html
 * @return {String}
 */
function getPasteActionHtml(){
    var htmlPasteInstruction = '';
    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
        var fnKeyHtml       = getKeyBoardKeyHtml('fn');
        var shiftKeyHtml    = getKeyBoardKeyHtml('shift');
        var f11KeyHtml      = getKeyBoardKeyHtml('F11');
        var cmdKeyHtml      = getKeyBoardKeyHtml('Cmd');
        var vKeyHtml        = getKeyBoardKeyHtml('V');

        htmlPasteInstruction += 'Press ' + fnKeyHtml + ' + ' + shiftKeyHtml + ' + ' + f11KeyHtml +
            ' to take a screenshot. <br/> <br/>After taking the screenshot,<br/><br/>press '+ cmdKeyHtml + ' + ' + vKeyHtml + ' to paste the screenshot here.';
    } else {
        var ctrlKeyHtml         = getKeyBoardKeyHtml('Ctrl');
        var vKeyHtml            = getKeyBoardKeyHtml('V');
        var printScreenKeyHtml  = getKeyBoardKeyHtml('Print Screen');

        htmlPasteInstruction    += 'Press ' + printScreenKeyHtml + ' to take a screenshot. <br/> <br/>After taking the screenshot,<br/> <br/> press '+ ctrlKeyHtml +
            ' + ' + vKeyHtml + ' to paste the screenshot here.';
    }

    return htmlPasteInstruction;
}

/**
 * Function to get key html
 * @param keyText
 * @return {String}
 */
function getKeyBoardKeyHtml(keyText){
    var htmlKeyboardKey = '<kbd style="border: 1px solid #aaa; -moz-border-radius: 0.2em; -webkit-border-radius: 0.2em; ' +
        'border-radius: 0.2em; -moz-box-shadow: 0.1em 0.2em 0.2em #ddd; -webkit-box-shadow: 0.1em 0.2em 0.2em #ddd; ' +
        'box-shadow: 0.1em 0.2em 0.2em #ddd; background-color: #f9f9f9; background-image: -moz-linear-gradient(top, #eee, #f9f9f9, #eee); ' +
        'background-image: -o-linear-gradient(top, #eee, #f9f9f9, #eee); background-image: -webkit-linear-gradient(top, #eee, #f9f9f9, #eee); ' +
        'background-image: linear-gradient(to bottom, #eee, #f9f9f9, #eee); padding: 0.1em 0.3em; font-family: inherit; font-size: 0.85em;" ' +
        'class="keyboard-key nowrap">' + keyText +'</kbd>';
    return htmlKeyboardKey;
}

/**
 * Function for report log
 * @param errorMessage  : Message to log
 * @return {Boolean}
 */
function log(errorMessage){
    //Get current browsers detail
    var browser = BrowserDetect.browser;

    //Print log in console for all browser except IE
    if(browser != browserCheck.name){
        if(typeof(errorMessage)!= 'undefined' && errorMessage != ''){
            console.log(errorMessage);
        }
    }else{
        //alert(errorMessage);
    }

    return true;
}

/**
 * Ajax call to store patient, study, series files to measure_images directory
 */
function storePatientFilesToDirectory(groupId, groupType, isFromPatient){
    if(typeof(isFromPatient) != 'undefined' && isFromPatient !== '') {
        if(groupId > 0){
            groupType = 0;
        }else if(groupType > 0) {
            groupId = groupType;
            groupType = 1;
        }else if(isFromPatient > 0) {
            groupId = isFromPatient;
            groupType = 2;
        }
    }
    $.ajax({
        type    : "GET",
        url     : baseUrl + 'patients/store_file_to_server',
        cache   : true,
        data    : {
                group_id   : groupId,
                group_type : groupType
        }
    }).done(function( response ) {
    }).fail(function() {
        log('Error in storeFilesToDirectory');
    });
}

/**
 * Function to check whether statsv3 downloading is in progree or not at the time of logout
 */
function checkForStatsv3Download(){
    var isDownloadStatsv3 = readCookie('isDownloadStatsv3');
    if(typeof(isDownloadStatsv3) != 'undefined' && isDownloadStatsv3 == 1) {
        $('#btnPageLeaveModal').trigger('click');
    }else{
        window.location.href = baseUrl + 'user/logout';
    }
}

/**
 * Function to disable remove contatct button
 */
function removeContacts(){
    $("#removeContact").attr('disabled', 'disabled');
    return true;
}

/**
 * Function to highlight Selected item (Patient/ Case/ Study/ Series)
 */
function setSelectionColorForPatient(groupId, groupType){
    //For removing background
    $("#expList li").each(function () {
        $(this).css({'background-color': '#f9f9f9'});
    });

    //For setting background
    groupId   = (typeof(groupId) != 'undefined') ? groupId : '';
    groupType = (typeof(groupType) != 'undefined') ? groupType : '';
    var id = "#" + groupType + groupId;
    $(id).css({'background-color': '#d9edf7'});
}

/**
 * Function to highlight Selected item (Patient/ Case/ Study/ Series)
 */
function setSelectionColorForLinkedPatient(groupId){
    //For removing background
    $("#expListLinkedPatient li").each(function () {
        $(this).css({'background-color': '#f9f9f9'});
    });

    //For setting background
    var id = "#linkedPatient_" + groupId;
    $(id).css({'background-color': '#d9edf7'});
}

/**
 * Function to restrict user to enter value
 */
function restrictForEnterValue(elementId) {
    var id = typeof(elementId) != 'undefined' ? "#" + elementId : '';
    if(id != '') {
        $(id).val('');
    }
    return true;
}

/**
 * Function to trigger product modal event
 */
function showCreateProductModal() {
    $("#settingsData").val('');
    $("select[name=productColumnName]").val('spine');
    $("#btnCreateProductModal").trigger('click');
}

/**
 * Function to trigger update settings modal event
 */
function showUpdateProductModal(productId) {
    var productData = $.parseJSON($("#productSettingsData").val());
    productData     = (typeof(productData) != 'undefined' && productData != '') ? productData : '';

    $.each(productData, function(index, obj) {
        if(obj.id == productId){
            $("select[name=updateProductColumnName]").val(obj.productColumnName);
            $("#updateSettingsData").val(obj.settingData);
            $("select[name=updateProductColumnName]").attr("disabled", "disabled");
            return false;
        }
    });

    previousSettingsData = $("#updateSettingsData").val();

    $("#btnUpdateProductModal").trigger('click');
}

/**
 * Function to trigger delete product modal event
 */
function showDeleteProductModal(productName) {
    $("#currentProductName").val(productName);
    $("#btnProductDeleteModal").trigger('click');
}

/**
 * Function to make patient screen responsive if browser is less than IE9
 */
function doResponsivescreenForltIE9(){
    windowWidth = document.documentElement.clientWidth || document.body.clientWidth;
    //Display patient list and image list as per screen height
        if(window.location.href.indexOf('patients') > -1) {
        var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            if(windowHeight >= 0 && windowHeight <= 791){
                $("#patientLists").css({'margin-left': '-25px', 'max-height': '475px', 'overflow': 'auto', 'position': 'relative'});
                $(".patient_image_gallery_view").css({'max-height': '390px', 'overflow': 'auto', 'position': 'relative'});
            }else if(windowHeight >= 792 && windowHeight <= 1191){
                $("#patientLists").css({'margin-left': '-25px', 'max-height': '750px', 'overflow': 'auto', 'position': 'relative'});
                $(".patient_image_gallery_view").css({'max-height': '670px', 'overflow': 'auto', 'position': 'relative'});
            }else{
                $("#patientLists").css({'margin-left': '-25px', 'max-height': '1150px', 'overflow': 'auto', 'position': 'relative'});
                $(".patient_image_gallery_view").css({'max-height': '1070px', 'overflow': 'auto', 'position': 'relative'});
            }
        }
    }

/*Function description: To set default table for ALIF cage when cageDimensions Button is triggered
                        (clicked) ie. pop-up modal is shown
* */
$('#cage_dimensions').on('shown.bs.modal', function (e) {
    //if browser less than IE 9 then hide simulate option
    if(isLtIE9 == 1){
        $('#simulateSection').hide();
    }

    //Set default checked width
    $('#alifCage24').prop('checked', true);
    $('#plifCage23').prop('checked', true);
    $('#lcCage25').prop('checked', true);
    $('#xlifCage16').prop('checked', true);

    $("#alifCage").click();
    $('#simulateMeasure').prop('checked', false);
    if(isApplyMeasure == 1){
        var measureId = $('#selected_measures').val();
        for (var indexKey = 0; indexKey < allAppliedMeasureId.length; indexKey ++) {
            $('#apply_'+allAppliedMeasureId[indexKey]).attr('checked', false);
        }

        isApplyMeasure = 0;
        applyMeasureAction(measureId);
    }
});

// To set cage dimensions pop-up dragable
$(function() {
    $( "#cage_dimensions" ).draggable();
});

// To set cage dimensions pop-up dragable
$("#cage_dimensions").resizable();
$("#cage_dimensions").on("resize", function(event, ui) {
    ui.element.css("margin-left", -ui.size.width/2);
    ui.element.css("margin-top", -ui.size.height/2);
    ui.element.css("top", "50%");
    ui.element.css("left", "20%");
    ui.element.css("height", ui.size.height + $('.modal-footer').outerHeight() );

    $(ui.element).find(".modal-body").each(function() {
        $(this).css("max-height", ui.size.height - $('.modal-header').outerHeight() - $('.modal-footer').outerHeight() );
    });
});

/**
 * Description  : To show the nuVasive cage dimensions
 */
$("#alifCage").click(function(){
    $("#alifCage").attr('disabled', 'disabled');
    $("#plifCage").removeAttr('disabled');
    $("#tlifCage").removeAttr('disabled');
    $("#xlifCage").removeAttr('disabled');
    $("#plifCageModal").hide();
    $("#tlifCageModal").hide();
    $("#xlifCageModal").hide();
    $("#alifCageModal").show();
    cageSelection('alifCage');
});

$("#plifCage").click(function(){

    $("#plifCage").attr('disabled', 'disabled');
    $("#alifCage").removeAttr('disabled');
    $("#tlifCage").removeAttr('disabled');
    $("#xlifCage").removeAttr('disabled');
    $("#alifCageModal").hide();
    $("#tlifCageModal").hide();
    $("#xlifCageModal").hide();
    $("#plifCageModal").show();
    cageSelection('plifCage');
});

$("#tlifCage").click(function(){
    $("#tlifCage").attr('disabled', 'disabled');
    $("#alifCage").removeAttr('disabled');
    $("#plifCage").removeAttr('disabled');
    $("#xlifCage").removeAttr('disabled');
    $("#alifCageModal").hide();
    $("#plifCageModal").hide();
    $("#xlifCageModal").hide();
    $("#tlifCageModal").show();
    cageSelection('tlifCage');
});

$("#xlifCage").click(function(){
    $("#xlifCage").attr('disabled', 'disabled');
    $("#alifCage").removeAttr('disabled');
    $("#plifCage").removeAttr('disabled');
    $("#tlifCage").removeAttr('disabled');
    $("#alifCageModal").hide();
    $("#plifCageModal").hide();
    $("#tlifCageModal").hide();
    $("#xlifCageModal").show();
    cageSelection('xlifCage');
});

 /**
  * Function to get user features list
  */
function getUserFeatureList(){
     $.ajax({
         url     : baseUrl + "user/user_features",
         type    : "get",
         success:function(response){
             if(response != 'null'){
                 userFeatureList = $.parseJSON(response);
                 if(typeof(userFeatureList.nuvasivecage) != 'undefined' && userFeatureList.nuvasivecage == '0'){
                     $('#nuVasive').hide();
                 }else{
                     $('#nuVasive').show();
                 }

                 if(typeof(userFeatureList.k2m_cage) != 'undefined' && userFeatureList.k2m_cage == '0'){
                     $('#k2m').hide();
                 }else{
                     $('#k2m').show();
                 }
             }
         },
         error:function(e){
             console.log(e.responseText);
         }
     });
}

 /**
  * Function to prevent onclick action on patinet screen
  */
 function preventParentNodeEvent(event){
       //event.stopPropagation();
 }

 /**
  * Function For to reset isInRotateAngleClickBox value
  */
 function isOutOfAngleBox(){
     isInRotateAngleClickBox = 0;
 }

 /**
  * Function to call ajax request for create, modify, delete and apply product settings API's
  */
 function ajaxCallForProductSettings(url, productName, userId, settingsData){
     productName  = (typeof(productName) != 'undefined' && productName != '') ? productName : '';
     userId       = (typeof(userId) != 'undefined' && userId != '') ? userId : '';
     settingsData = (typeof(settingsData) != 'undefined' && settingsData != '') ? settingsData : '';

     $('.ajax_loading_icon').show();
     $.ajax({
         type    : "POST",
         dataType: "json",
         url     : baseUrl + url,
         data    : {
             productColumnName : productName,
             targetId          : userId,
             settingsData      : settingsData
         }
     }).done(function( response ) {
         checkLogout(response);
         location.reload();
     }).fail(function() {
         location.reload();
     });
 }

