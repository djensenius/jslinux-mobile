
/* ---------------------------------------------------------
    JSLinux by Fabrice Bellard https://bellard.org
    Mobile version by Jaromaz https://jm.iq.pl/jslinux-mobile
   --------------------------------------------------------- */

  var dynamicHeight = 30;
  if (Cookies.get("dynamicHeight")) {
    dynamicHeight = Cookies.get("dynamicHeight");
  }

    var activated = false;
    var reloadTimer;
var defaultPreset = { "topmargin": 3, "columns": 92, "rows": dynamicHeight, "font": 4, "fontcolor": 3, "fontsize": 18, "bgcolor": 2, "spacing": 2, "ram": 1, "options": 0 };
    var cookiePreset = Cookies.getJSON("preset");
    var paramsPreset = {}; location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){paramsPreset[k]=v});

    var selectableOptions = {
        "font": [ undefined, "Panic Sans", "Iosevka Term", "Iosevka Term Bold", "Source Code Pro", "Courier", "Courier-Bold", "Menlo", "Menlo-Bold" ],
        "fontcolor": [ undefined, "#B8B8B8", "#FCFCFC", "#00F000", "#708183", "#FEFFD3"],
        "bgcolor": [ undefined, "#141414", "#000", "#111C2A", "#272822", "#001E26" ],
        "ram" : [ undefined, 16, 32, 64 ]
    };

    if (cookiePreset != null) { defaultPreset = cookiePreset;  }
    if (! $.isEmptyObject(paramsPreset)) { defaultPreset = paramsPreset; }

    var fill = new Object();
    for (var key in defaultPreset) {
        var defaultVar = defaultPreset[key];
        fill[key] = new Array();
        fill[key][defaultVar] = "selected";
    }

    var appSupport = Cookies.get("appsupport");
    var appStart = Cookies.get("appstart");
    if (appStart == undefined) {
	    var date = new Date();
	    date.setTime(date.getTime() + 420000);
	    Cookies.set("appstart", true, { expires: 365 });
	    Cookies.set("appsupport", true, { expires: date });
	    appStart = true;
	    appSupport = true;
    }

    var infoLong = `
            This is a PC emulator with a running, fully functional Linux system.
            You can change the appearance of the application:

            columns:
            <input type="text" id="columns" value="${defaultPreset['columns']}" size="3">,

            rows:
            <input type="text" id="rows" value="${defaultPreset['rows']}" size="2">,

            font:
            <select id="font">
                <option value="1" ${fill["font"][1]}>Panic Sans</option>
                <option value="2" ${fill["font"][2]}>Iosevka Term</option>
                <option value="3" ${fill["font"][3]}>Iosevka Term Bold</option>
                <option value="4" ${fill["font"][4]}>Source Code Pro</option>
                <option value="5" ${fill["font"][5]}>Courier</option>
                <option value="6" ${fill["font"][6]}>Courier Bold</option>
                <option value="7" ${fill["font"][7]}>Menlo</option>
                <option value="8" ${fill["font"][8]}>Menlo Bold</option>
            </select>,

            font size:
            <input type="text" id="fontsize" size="2" value="${defaultPreset['fontsize']}">, 

            font color:
            <select id="fontcolor">
                <option value="1" ${fill["fontcolor"][1]}>gray</option>
                <option value="2" ${fill["fontcolor"][2]}>white</option>
                <option value="3" ${fill["fontcolor"][3]}>green</option>
                <option value="4" ${fill["fontcolor"][4]}>light blue</option>
                <option value="5" ${fill["fontcolor"][5]}>light yellow</option>
            </select>,

            background color
            <select id="bgcolor">
                <option value="1" ${fill["bgcolor"][1]}>dark grey</option>
                <option value="2" ${fill["bgcolor"][2]}>black</option>
                <option value="3" ${fill["bgcolor"][3]}>dark blue</option>
                <option value="4" ${fill["bgcolor"][4]}>gray</option>
                <option value="5" ${fill["bgcolor"][5]}>dark green</option>
            </select>,

            spacing:
            <input type="text" id="spacing" value="${defaultPreset['spacing']}" size="2"> px,
            top margin:
            <input type="text" id="topmargin" value="${defaultPreset['topmargin']}" size="2"> px, 

            RAM:
            <select id="ram">
                <option value="1" ${fill["ram"][1]}>16</option>
                <option value="2" ${fill["ram"][2]}>32</option>
                <option value="3" ${fill["ram"][3]}>64</option>
            </select> Mb.

            &copy; <a href="http://bellard.org">Fabrice Bellard</a> / Mobile version by <a href="http://jm.iq.pl">Jaromaz</a>. `;

    var info = infoLong;

   if (window.location.hostname == 'localhost' || (appStart && !appSupport)) {
	info += `Please 
	    <select id="support">
		<option value="1">support</option>
		<option value="5">5 $</option>
		<option value="10">10 $</option>
		<option value="15">15 $</option>
		<option value="20">20 $</option>
		<option value="30">30 $</option>
		<option value="50">50 $</option>
		<option value="70">70 $</option>
		<option value="100">100 $</option>
		<option value="300">300 $</option>
		<option value="500">500 $</option>
		<option value="700">700 $</option>
		<option value="1000">1K $</option>
		<option value="5000">5K $</option>
		<option value="10000">10K $</option>
	    </select> my projects via PayPal if you like this mobile version.
   	 `;
    }

    if (defaultPreset["options"] == 1) {
        info = `The user option was used. You can change the options by pressing the upper right corner of the screen. For full support for the VI editor you need a bluetooth keyboard (CTRL+h or CTRL+c will leave the VI edition mode), and after running Linux enter the command: <i><strong>stty -F /dev/ttyS0 rows ${defaultPreset["rows"]} cols ${defaultPreset["columns"]}</strong></i> . &copy; <a href="http://bellard.org">Fabrice Bellard</a> / Mobile version by <a href="https://jm.iq.pl">Jaromaz</a>. `;
    }

    $( document ).ready(function() {

        $(".term").css("font-family", selectableOptions["font"][defaultPreset["font"]]);
        $(".term").css("font-size", (defaultPreset["fontsize"]+"px"));
        $("#consotab").css("padding-top", (defaultPreset["topmargin"] + "px"));
        $(".cover").css("padding-top", (defaultPreset["topmargin"] + "px"));
        $(".term").css("padding-bottom", (defaultPreset["spacing"] + "px"));
        $(".term, .tapinfo span").css("color", (selectableOptions["fontcolor"][defaultPreset["fontcolor"]]));
      	$(".termReverse").css("color", (selectableOptions["bgcolor"][defaultPreset["bgcolor"]]));
        $(".term").css("border-color", (selectableOptions["bgcolor"][defaultPreset["bgcolor"]]));
        $(".tapinfo").css("border-color", (selectableOptions["fontcolor"][defaultPreset["fontcolor"]]));
        $(".tapinfo").css("margin-top", ((parseInt(defaultPreset["topmargin"], 10) + 10) + "px"));
      	$("html, body, .cover, .tapinfo span").css("background-color", (selectableOptions["bgcolor"][defaultPreset["bgcolor"]]));
        $("body").onresize = function() {
          console.log("resized?");
        }

        if ($("#support").length > 0) {
	        $("#support").on("change", function() {
	          if ($(this).val() > 1) {
		          $("#consotab").hide();
		          location.href="https://www.paypal.me/jaromaz/"+ $(this).val() + "usd";
	          }
	        });
        }
    });

    function reload_binaries() {
      if (reloadTimer) {
        console.log("Cancelling old timer");
        clearTimeout(reloadTimer);
      }

      reloadTimer = setTimeout(function() {
        console.log("Resizing...");
        var resizedHeight = Math.floor(window.innerHeight / 25)
        Cookies.set("dynamicHeight", resizedHeight);
        location.reload();
      }, 700);
    }

    var options = function () {
      if (defaultPreset["options"] != 1) {
        var presetNew = {};
        for (var key in defaultPreset) {
            presetNew[key] = $("#" + key).val();
        }

	      Cookies.remove("preset");
	      Cookies.set("preset", presetNew, { expires: 365 });

        for (var key in defaultPreset) {
          if (key != "options") {
            if (defaultPreset[key] != $("#" + key).val()) {
              presetNew["options"] = 1;
              window.location.href = "./index.html?" + $.param(presetNew);
            }
          }
        }
      }

      defaultPreset["options"] = 0;
      info = infoLong;
      $("#holder").focus();
      activated = true;
      $(".tapinfo").fadeIn(2000).delay(4000).fadeOut(3000);
    };

    $(".taparea").on('click', function (e) {
	    activated = false;
      $.alert(info, "JSLinux Mobile", function () {
          options();
       });
    });

/*
    $.alert(info, "JSLinux Mobile", function () {
        options();
    });
*/
activated = true;
