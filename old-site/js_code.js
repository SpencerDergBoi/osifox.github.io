var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");


	var popupWindow = null;
	var popupMapWindow = null;
	var emailWindow = null;



	function gotoUrl(url, target)
	{
		if(url.length > 0)
		{
			if(target == "new")
			{
				window.open(url);
			}
			
			else if(target == "top")
			{
				top.location.href = url;	
			}			
			else if (target == "frame")
			{
				parent.location.href = url;
			}
			else
			{
				window.location.href = url;
			}
		}
	}	

	function openWindow(url,width,height)
	{
		var leftPos = (screen.availWidth-width) / 2
		var topPos = (screen.availHeight-height) / 2

		popupWindow = window.open(url,'popupWindow','width=' + width + ',height=' + height + ',resizable=yes,toolbar=no,status=no,scrollbars=yes,location=no,menubar=no,directories=no,top=' + topPos + ',left=' + leftPos)

		if(popupWindow != null && popupWindow.opener == null)
		{
			popupWindow.opener = window;
		}

		popupWindow.focus();
	}

	function openMapWindow(url,width,height,scrollbars)
	{
		var leftPos = (screen.availWidth-width) / 2
		var topPos = (screen.availHeight-height) / 2

		popupMapWindow = window.open(url,'popupMapWindow','width=' + width + ',height=' + height + ',scrollbars=' + scrollbars + ',resizable=yes,toolbar=no,status=no,location=no,menubar=no,directories=no,top=' + topPos + ',left=' + leftPos)

		if(popupMapWindow != null && popupMapWindow.opener == null)
		{
			popupMapWindow.opener = window;
		}

		popupMapWindow.focus();
	}

	function checkQuickSearchForm()
	{
		if (!document.quickSearchForm.TRAVEL_BY_TRAIN.checked &&
			!document.quickSearchForm.TRAVEL_BY_TRAM.checked &&
			!document.quickSearchForm.TRAVEL_BY_BUS.checked &&
			!document.quickSearchForm.TRAVEL_BY_VLINE.checked)
		{
			alert('Please complete Step 1');
			return false;
		}

		var findByChecked = false;
		for(i=0; i < document.quickSearchForm.FIND_BY.length; i++)
		{
			if(document.quickSearchForm.FIND_BY[i].checked)
			{
				findByChecked = true;
				i = document.quickSearchForm.FIND_BY.Length;
			}
		}

		if (!findByChecked)
		{
			alert('Please complete Step 2');
			return false;
		}

		if(document.quickSearchForm.KEYWORD.value =='')
		{
			alert('Please complete Step 3');
			return false;
		}

		document.quickSearchForm.submit();
	}
	
	function checkSuburbSearchForm()
	{	

		if(document.suburbSearchForm.KEYWORD.options[document.suburbSearchForm.KEYWORD.selectedIndex].value =='')
		{
			alert('Please select a suburb');
			return false;
		}

		//document.quickSearchForm.submit();
	}	


/**
 * This array is used to remember mark status of rows in browse mode
 */
var marked_row = new Array;
var original_row = new Array;

/**
 * Sets/unsets the pointer and marker in browse mode
 *
 * @param   object    the table row
 * @param   interger  the row number
 * @param   string    the action calling this script (over, out or click)
 * @param   string    the color to use for mouseover
 * @param   string    the color to use for marking a row
 *
 * @return  boolean  whether pointer is set or not
 */	
function setPointer(theRow, theRowNum, theAction, thePointerColor, theMarkColor)
{
    var theCells = null;

    // 1. Pointer and mark feature are disabled or the browser can't get the
    //    row -> exits
    if ((thePointerColor == '' && theMarkColor == '')
        || typeof(theRow.style) == 'undefined') {
        return false;
    }

    // 2. Gets the current row and exits if the browser can't get it
    if (typeof(document.getElementsByTagName) != 'undefined') {
        theCells = theRow.getElementsByTagName('td');
    }
    else if (typeof(theRow.cells) != 'undefined') {
        theCells = theRow.cells;
    }
    else {
        return false;
    }

    // 3. Gets the current color...
    var rowCellsCnt  = theCells.length;
    var domDetect    = null;
    var currentColor = null;
    var newColor     = null;
    // 3.1 ... with DOM compatible browsers except Opera that does not return
    //         valid values with "getAttribute"
    if (typeof(window.opera) == 'undefined'
        && typeof(theCells[0].getAttribute) != 'undefined') {
        currentColor = theCells[0].getAttribute('bgcolor');
        domDetect    = true;
    }
    // 3.2 ... with other browsers
    else {
        currentColor = theCells[0].style.backgroundColor;
        domDetect    = false;
    } // end 3

    // 4. Defines the new color
    // 4.1 Current color is the pointer one
    if (currentColor.toLowerCase() == thePointerColor.toLowerCase()
             && (typeof(marked_row[theRowNum]) == 'undefined' || !marked_row[theRowNum])) {
        if (theAction == 'out') {
            newColor              = "default";
        }
        else if (theAction == 'click' && theMarkColor != '') {
            newColor              = theMarkColor;
            marked_row[theRowNum] = true;
        }
    }
    // 4.1.2 Current color is the marker one
    else if (currentColor.toLowerCase() == theMarkColor.toLowerCase() && theAction == 'click') {
        newColor              = (thePointerColor != '')
                              ? thePointerColor
                              : "default";
        marked_row[theRowNum] = (typeof(marked_row[theRowNum]) == 'undefined' || !marked_row[theRowNum])
                              ? true
                              : null;
    }
    // 4.1.3 Current color is the default one
    else {
        if (theAction == 'over' && thePointerColor != '' && !marked_row[theRowNum]) {
            newColor              = thePointerColor;
            original_row[theRowNum] = new Array();
        }
        else if (theAction == 'click' && theMarkColor != '') {
            newColor              = theMarkColor;
            marked_row[theRowNum] = true;
        }
    } // end 4

    // 5. Sets the new color...
    if (newColor) {
        var c = null;
		var newColColor = newColor;
		for (c = 0; c < rowCellsCnt; c++) {
			if (newColor == "default") {
				newColColor = original_row[theRowNum][c];
			} else {
				if (typeof(window.opera) == 'undefined'
					&& typeof(theCells[0].getAttribute) != 'undefined') {
					currentColor = theCells[c].getAttribute('bgcolor');
				}
				else {
					currentColor = theCells[c].style.backgroundColor;
				}
	
				if (theAction != "click") original_row[theRowNum][c] = currentColor;
			}

	        // 5.1 ... with DOM compatible browsers except Opera
	        if (domDetect) {
	                theCells[c].setAttribute('bgcolor', newColColor, 0);
	        }
	        // 5.2 ... with other browsers
	        else {
	                theCells[c].style.backgroundColor = newColColor;
	        }
		}
    } // end 5

    return true;
} // end of the 'setPointer()' function



}
/*
     FILE ARCHIVED ON 02:07:44 Jun 24, 2005 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 09:28:39 Jan 17, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 510.475
  exclusion.robots: 0.068
  exclusion.robots.policy: 0.058
  cdx.remote: 0.07
  esindex: 0.013
  LoadShardBlock: 79.553 (3)
  PetaboxLoader3.datanode: 156.136 (4)
  PetaboxLoader3.resolve: 319.611 (2)
  load_resource: 400.964
*/